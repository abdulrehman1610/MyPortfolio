import { ref, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

// ============================================================================
// Easy-to-edit Swarm Intro Configuration
// ============================================================================
export const NAMES = ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4', 'Agent 5', 'Agent 6']

export const COLORS = [
  '#ff6a00', // Agent 1 - Orange
  '#3b82f6', // Agent 2 - Blue
  '#10b981', // Agent 3 - Emerald
  '#ec4899', // Agent 4 - Pink
  '#a855f7', // Agent 5 - Purple
  '#eab308', // Agent 6 - Amber
]

export const TARGET_SELECTOR = '[data-swarm]'
export const PLAY_ONCE_PER_SESSION = false

const SESSION_STORAGE_KEY = 'sw_intro_played'

export function useSwarmIntro() {
  const isPlaying = ref(false)
  const isFinished = ref(false)
  const currentPortionLabel = ref('')
  const currentPortionIndex = ref(0)
  const totalPortions = ref(0)

  // Internal state kept in closure (SSR-safe: no window/document access at setup time)
  let activeRunId = 0
  let overlayEl = null
  const timers = new Set()
  const originalTargetStyles = new Map()
  let savedHtmlOverflow = null
  let resizeHandler = null

  const wait = (ms) =>
    new Promise((resolve) => {
      const id = setTimeout(() => {
        timers.delete(id)
        resolve()
      }, ms)
      timers.add(id)
    })

  const clearAllTimers = () => {
    timers.forEach((id) => clearTimeout(id))
    timers.clear()
  }

  const restoreScrollLock = () => {
    if (typeof document === 'undefined') return
    if (savedHtmlOverflow !== null) {
      document.documentElement.style.overflow = savedHtmlOverflow
      savedHtmlOverflow = null
    }
  }

  const lockScroll = () => {
    if (typeof document === 'undefined') return
    if (savedHtmlOverflow === null) {
      savedHtmlOverflow = document.documentElement.style.overflow
    }
    document.documentElement.style.overflow = 'hidden'
  }

  const restoreTargetStyles = (revealImmediately = false) => {
    originalTargetStyles.forEach((saved, el) => {
      if (!el || !el.style) return
      if (revealImmediately) {
        el.style.transition = saved.transition
        el.style.opacity = saved.opacity
      } else {
        el.style.opacity = saved.opacity
        el.style.transition = saved.transition
      }
    })
    originalTargetStyles.clear()
  }

  const removeOverlay = () => {
    if (typeof window !== 'undefined' && resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }
    if (overlayEl && overlayEl.parentNode) {
      overlayEl.parentNode.removeChild(overlayEl)
    }
    overlayEl = null
  }

  const fullCleanup = (revealImmediately = true) => {
    activeRunId++
    clearAllTimers()
    removeOverlay()
    restoreTargetStyles(revealImmediately)
    restoreScrollLock()
    isPlaying.value = false
    isFinished.value = true
    currentPortionLabel.value = ''
  }

  const getDocumentHeight = () => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return 0
    return Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0,
      document.body?.offsetHeight || 0,
      document.documentElement?.offsetHeight || 0,
      window.innerHeight || 0
    )
  }

  const createOverlay = () => {
    removeOverlay()
    const el = document.createElement('div')
    el.className = 'sw-overlay'
    el.setAttribute('aria-hidden', 'true')
    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100%'
    el.style.height = `${getDocumentHeight()}px`
    el.style.pointerEvents = 'none'
    el.style.zIndex = '99998'
    el.style.overflow = 'hidden'
    document.body.appendChild(el)

    resizeHandler = () => {
      if (overlayEl) {
        overlayEl.style.height = `${getDocumentHeight()}px`
      }
    }
    window.addEventListener('resize', resizeHandler, { passive: true })

    overlayEl = el
    return el
  }

  const createCursorElement = (name, color, startX, startY) => {
    const cursor = document.createElement('div')
    cursor.className = 'sw-cursor'
    cursor.style.position = 'absolute'
    cursor.style.top = '0'
    cursor.style.left = '0'
    cursor.style.pointerEvents = 'none'
    cursor.style.zIndex = '99999'
    cursor.style.willChange = 'transform, opacity'
    cursor.style.transform = `translate(${Math.round(startX)}px, ${Math.round(startY)}px)`
    cursor.style.transition =
      'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease'

    cursor.innerHTML = `
      <svg class="sw-cursor-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.65));">
        <path d="M3 2L10.5 21L13.8 13.8L21 10.5L3 2Z" fill="${color}" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
      <div class="sw-cursor-pill" style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 12px;
        margin-top: -2px;
        padding: 3px 9px;
        border-radius: 999px;
        background: ${color};
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: 0.3px;
        white-space: nowrap;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.28);
      ">
        <span class="sw-cursor-name">${name}</span>
        <span class="sw-cursor-task" style="
          font-size: 9.5px;
          font-weight: 600;
          opacity: 0.92;
          padding-left: 5px;
          border-left: 1px solid rgba(255,255,255,0.35);
          font-family: monospace;
        ">ready</span>
      </div>
    `

    const taskEl = cursor.querySelector('.sw-cursor-task')
    const setTask = (text) => {
      if (taskEl) taskEl.textContent = text
    }

    return { el: cursor, setTask }
  }

  const getElementTagLabel = (el) => {
    if (!el) return 'BOX'
    const tag = (el.tagName || 'DIV').toUpperCase()
    if (el.classList?.contains('project-card')) return 'CARD'
    if (el.classList?.contains('skill-tag')) return 'SKILL'
    if (el.classList?.contains('process-item')) return 'STEP'
    if (el.classList?.contains('stat-item')) return 'METRIC'
    if (el.classList?.contains('contact-info-card')) return 'CONTACT'
    if (el.classList?.contains('form-group-minimal')) return 'INPUT'
    if (el.classList?.contains('quote-card')) return 'QUOTE'
    if (el.classList?.contains('hero-portrait-wrapper')) return 'PORTRAIT'
    return tag
  }

  const createBoxElement = (x, y, w, h, color, tagLabel) => {
    const box = document.createElement('div')
    box.className = 'sw-box'
    box.style.position = 'absolute'
    box.style.left = `${Math.round(x)}px`
    box.style.top = `${Math.round(y)}px`
    box.style.width = '0px'
    box.style.height = '0px'
    box.style.border = `1.5px dashed ${color}`
    box.style.backgroundColor = `${color}12`
    box.style.backgroundImage = `
      linear-gradient(to right, ${color}14 1px, transparent 1px),
      linear-gradient(to bottom, ${color}14 1px, transparent 1px)
    `
    box.style.backgroundSize = '16px 16px'
    box.style.borderRadius = '6px'
    box.style.pointerEvents = 'none'
    box.style.boxSizing = 'border-box'
    box.style.transition =
      'width 0.32s cubic-bezier(0.22, 1, 0.36, 1), height 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, border-color 0.2s ease, box-shadow 0.2s ease'

    // 4 CAD corner handles
    const corners = [
      'top:-3px;left:-3px;',
      'top:-3px;right:-3px;',
      'bottom:-3px;left:-3px;',
      'bottom:-3px;right:-3px;',
    ]
    corners.forEach((pos) => {
      const handle = document.createElement('span')
      handle.className = 'sw-box-handle'
      handle.style.cssText = `
        position:absolute;${pos}
        width:5px;height:5px;
        background:#ffffff;
        border:1.5px solid ${color};
        border-radius:1px;
      `
      box.appendChild(handle)
    })

    // Size & tag badge
    const badge = document.createElement('span')
    badge.className = 'sw-box-badge'
    badge.textContent = `${tagLabel} · ${Math.round(w)} × ${Math.round(h)}`
    badge.style.position = 'absolute'
    badge.style.top = '-21px'
    badge.style.left = '0'
    badge.style.padding = '1px 6px'
    badge.style.borderRadius = '4px'
    badge.style.background = color
    badge.style.color = '#ffffff'
    badge.style.fontSize = '10px'
    badge.style.fontFamily = 'monospace'
    badge.style.fontWeight = '700'
    badge.style.lineHeight = '1.4'
    badge.style.whiteSpace = 'nowrap'
    badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)'

    box.appendChild(badge)
    return { box, badge }
  }

  const createSubDetailBox = (x, y, w, h, color) => {
    const sub = document.createElement('div')
    sub.className = 'sw-sub-box'
    sub.style.position = 'absolute'
    sub.style.left = `${Math.round(x)}px`
    sub.style.top = `${Math.round(y)}px`
    sub.style.width = '0px'
    sub.style.height = '0px'
    sub.style.border = `1px dotted ${color}`
    sub.style.backgroundColor = `${color}18`
    sub.style.borderRadius = '4px'
    sub.style.pointerEvents = 'none'
    sub.style.boxSizing = 'border-box'
    sub.style.transition =
      'width 0.2s ease-out, height 0.2s ease-out, opacity 0.18s ease'
    return sub
  }

  const measureElementInDoc = (el) => {
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    const isFixed =
      style.position === 'fixed' || Boolean(el.closest('header.site-header'))
    const x = isFixed ? rect.left + window.scrollX : rect.left + window.scrollX
    const y = isFixed ? rect.top + window.scrollY : rect.top + window.scrollY
    const width = Math.max(20, rect.width)
    const height = Math.max(16, rect.height)
    return { x, y, width, height, rect, isFixed }
  }

  /**
   * Groups all [data-swarm] elements into sequential Portions so the agents
   * completely finish constructing one portion in detail before moving to the next.
   */
  const groupTargetsIntoPortions = (targets) => {
    const portionDefs = [
      {
        id: 'nav',
        label: 'Navigation Bar',
        match: (el) => Boolean(el.closest('header.site-header, nav')),
      },
      {
        id: 'hero-main',
        label: 'Hero Identity & Copy',
        match: (el) =>
          Boolean(el.closest('#home')) && !Boolean(el.closest('.hero-sidebar')),
      },
      {
        id: 'hero-metrics',
        label: 'Hero Metrics & Workflow',
        match: (el) => Boolean(el.closest('.hero-sidebar')),
      },
      {
        id: 'projects',
        label: 'Selected Projects',
        match: (el) => Boolean(el.closest('#portfolio')),
      },
      {
        id: 'about-edu',
        label: 'Education & Skills',
        match: (el) => {
          const col = el.closest('#about .info-column')
          if (!col) return false
          const cols = Array.from(document.querySelectorAll('#about .info-column'))
          return cols.indexOf(col) === 0
        },
      },
      {
        id: 'about-process',
        label: 'Work Process & Philosophy',
        match: (el) => {
          const col = el.closest('#about .info-column')
          if (!col) return false
          const cols = Array.from(document.querySelectorAll('#about .info-column'))
          return cols.indexOf(col) >= 1
        },
      },
      {
        id: 'contact',
        label: 'Contact & Footer',
        match: (el) => Boolean(el.closest('footer, #contact')),
      },
    ]

    const buckets = portionDefs.map((def) => ({
      id: def.id,
      label: def.label,
      elements: [],
    }))
    const fallbackBucket = {
      id: 'other',
      label: 'Page Elements',
      elements: [],
    }

    targets.forEach((el) => {
      const foundIdx = portionDefs.findIndex((def) => def.match(el))
      if (foundIdx !== -1) {
        buckets[foundIdx].elements.push(el)
      } else {
        fallbackBucket.elements.push(el)
      }
    })

    const result = buckets.filter((b) => b.elements.length > 0)
    if (fallbackBucket.elements.length > 0) {
      result.push(fallbackBucket)
    }
    return result
  }

  const scrollPortionIntoView = async (portionElements, runId) => {
    if (!portionElements.length || typeof window === 'undefined') return
    const firstEl = portionElements[0]
    if (firstEl.closest('header.site-header')) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const rects = portionElements.map((el) => el.getBoundingClientRect())
    const minTop = Math.min(...rects.map((r) => r.top + window.scrollY))
    const maxBottom = Math.max(...rects.map((r) => r.bottom + window.scrollY))
    const vh = window.innerHeight || 800

    const curScroll = window.scrollY || 0
    const isAlreadyVisible =
      minTop >= curScroll + 50 && maxBottom <= curScroll + vh - 40

    if (!isAlreadyVisible) {
      const maxScroll = Math.max(0, getDocumentHeight() - vh)
      const desiredY = Math.max(0, Math.min(maxScroll, minTop - 95))
      if (Math.abs(desiredY - curScroll) > 35) {
        window.scrollTo({ top: desiredY, behavior: 'smooth' })
        await wait(380)
        if (runId !== activeRunId) return
      }
    }
  }

  /**
   * Finds 1-2 meaningful child elements inside a target card/block so the agent
   * can trace inner sub-details before revealing the element.
   */
  const getDetailSubElements = (targetEl) => {
    if (!targetEl || !targetEl.children || targetEl.children.length === 0) {
      return []
    }
    const candidates = Array.from(
      targetEl.querySelectorAll(
        'h3, h4, p, input, select, textarea, .project-mockup-inner, .project-details, .contact-card-icon, .contact-card-details, .process-icon-box, .process-info, .stat-num, .quote-text'
      )
    )
    return candidates.slice(0, 2)
  }

  const runIntro = async ({ isReplay = false } = {}) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const runId = ++activeRunId
    clearAllTimers()
    removeOverlay()
    restoreTargetStyles(true)
    restoreScrollLock()

    try {
      // Respect prefers-reduced-motion
      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        fullCleanup(true)
        return
      }

      // Check sessionStorage if PLAY_ONCE_PER_SESSION is enabled and not a manual replay
      if (PLAY_ONCE_PER_SESSION && !isReplay) {
        try {
          if (window.sessionStorage.getItem(SESSION_STORAGE_KEY) === '1') {
            fullCleanup(true)
            return
          }
        } catch (_) {
          // Ignore storage errors
        }
      }

      const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR))
      if (!targets.length) {
        fullCleanup(true)
        return
      }

      if (PLAY_ONCE_PER_SESSION) {
        try {
          window.sessionStorage.setItem(SESSION_STORAGE_KEY, '1')
        } catch (_) {
          // Ignore storage errors
        }
      }

      isPlaying.value = true
      isFinished.value = false

      // Scroll to top before starting so coordinates & viewport begin cleanly at top
      window.scrollTo({ top: 0, behavior: 'auto' })
      lockScroll()

      // Save original inline styles and hide targets immediately, then enable .5s fade-in transition
      targets.forEach((el) => {
        originalTargetStyles.set(el, {
          opacity: el.style.opacity,
          transition: el.style.transition,
        })
        el.style.transition = 'none'
        el.style.opacity = '0'
      })

      // Force reflow so opacity: 0 is committed before setting transition
      void document.body.offsetHeight

      targets.forEach((el) => {
        el.style.transition = 'opacity .5s'
      })

      const overlay = createOverlay()
      const vw = window.innerWidth || 1200
      const vh = window.innerHeight || 800

      // Create Agent 1 .. Agent 6 cursors
      const cursors = NAMES.map((name, index) => {
        const color = COLORS[index % COLORS.length]
        const startX = Math.round((vw * (index + 1)) / (NAMES.length + 1))
        const startY = Math.round(70 + (index % 2) * (vh * 0.16))
        const { el, setTask } = createCursorElement(name, color, startX, startY)
        overlay.appendChild(el)
        return { name, color, el, setTask, index }
      })

      // Group targets into sequential portions
      const portions = groupTargetsIntoPortions(targets)
      totalPortions.value = portions.length

      await wait(100)
      if (runId !== activeRunId) return

      // Build portion by portion sequentially!
      for (let pIdx = 0; pIdx < portions.length; pIdx++) {
        if (runId !== activeRunId) return
        const portion = portions[pIdx]
        currentPortionIndex.value = pIdx + 1
        currentPortionLabel.value = portion.label

        // 1. Scroll the entire swarm's attention to this portion first
        await scrollPortionIntoView(portion.elements, runId)
        if (runId !== activeRunId) return

        // Update overlay height in case layout expanded
        overlay.style.height = `${getDocumentHeight()}px`

        // Shared queue for ONLY this portion
        const portionQueue = [...portion.elements]

        // Worker for each agent within this portion
        const buildElementInDetail = async (cursor, targetEl) => {
          const tagLabel = getElementTagLabel(targetEl)
          const initial = measureElementInDoc(targetEl)

          // Ensure individual element is inside current viewport if portion is tall
          if (!initial.isFixed) {
            const vhNow = window.innerHeight || 800
            const curTop = window.scrollY || 0
            if (initial.y + Math.min(initial.height, 220) > curTop + vhNow - 40) {
              const nextY = Math.max(0, initial.y - vhNow * 0.3)
              window.scrollTo({ top: nextY, behavior: 'smooth' })
              await wait(220)
              if (runId !== activeRunId) return
            }
          }

          // Step A: Fly to top-left corner anchor
          const m1 = measureElementInDoc(targetEl)
          cursor.setTask(`anchor ${tagLabel}`)
          cursor.el.style.transform = `translate(${Math.round(m1.x)}px, ${Math.round(m1.y)}px)`
          await wait(240)
          if (runId !== activeRunId) return

          // Step B: Create wireframe box and drag diagonally to bottom-right
          const m2 = measureElementInDoc(targetEl)
          const { box, badge } = createBoxElement(
            m2.x,
            m2.y,
            m2.width,
            m2.height,
            cursor.color,
            tagLabel
          )
          overlay.appendChild(box)
          void box.offsetWidth

          cursor.setTask(`${Math.round(m2.width)}×${Math.round(m2.height)}`)
          box.style.width = `${Math.round(m2.width)}px`
          box.style.height = `${Math.round(m2.height)}px`
          cursor.el.style.transform = `translate(${Math.round(
            m2.x + m2.width
          )}px, ${Math.round(m2.y + m2.height)}px)`

          await wait(300)
          if (runId !== activeRunId) return

          // Step C: Inner sub-element detailing pass (if card/block has internal parts)
          const subEls = getDetailSubElements(targetEl)
          const createdSubBoxes = []
          for (const subEl of subEls) {
            if (runId !== activeRunId) return
            const subM = measureElementInDoc(subEl)
            if (subM.width > 10 && subM.height > 8) {
              cursor.setTask('detailing')
              cursor.el.style.transform = `translate(${Math.round(subM.x)}px, ${Math.round(subM.y)}px)`
              const subBox = createSubDetailBox(
                subM.x,
                subM.y,
                subM.width,
                subM.height,
                cursor.color
              )
              overlay.appendChild(subBox)
              createdSubBoxes.push(subBox)
              void subBox.offsetWidth
              subBox.style.width = `${Math.round(subM.width)}px`
              subBox.style.height = `${Math.round(subM.height)}px`
              cursor.el.style.transform = `translate(${Math.round(
                subM.x + subM.width * 0.85
              )}px, ${Math.round(subM.y + subM.height * 0.85)}px)`
              await wait(160)
            }
          }

          if (runId !== activeRunId) return

          // Step D: Final polish pass & reveal real element
          cursor.setTask('styling ✓')
          badge.textContent = `${tagLabel} · ✓`
          box.style.borderStyle = 'solid'
          box.style.boxShadow = `0 0 16px ${cursor.color}44`
          targetEl.style.opacity = '1'

          await wait(140)
          if (runId !== activeRunId) return

          box.style.opacity = '0'
          createdSubBoxes.forEach((sb) => {
            sb.style.opacity = '0'
          })
          wait(220).then(() => {
            if (box.parentNode) box.parentNode.removeChild(box)
            createdSubBoxes.forEach((sb) => {
              if (sb.parentNode) sb.parentNode.removeChild(sb)
            })
          })

          // Small random delay before next element in this portion
          await wait(55 + Math.floor(Math.random() * 80))
        }

        // Assist choreography when a portion has fewer elements than agents
        const assistOnPortion = async (cursor) => {
          const refEl =
            portion.elements[cursor.index % portion.elements.length]
          if (!refEl) return
          const m = measureElementInDoc(refEl)
          cursor.setTask('inspecting')
          const offsetX = m.x + ((cursor.index * 37) % Math.max(30, m.width))
          const offsetY = m.y + ((cursor.index * 19) % Math.max(20, m.height))
          cursor.el.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px)`
          await wait(260)
          if (runId !== activeRunId) return
          cursor.setTask('verifying ✓')
          await wait(180)
        }

        const portionWorkers = cursors.map(async (cursor, idx) => {
          await wait(idx * 45)
          if (runId !== activeRunId) return

          let builtCount = 0
          while (portionQueue.length > 0 && runId === activeRunId) {
            const nextTarget = portionQueue.shift()
            if (!nextTarget) break
            builtCount++
            await buildElementInDetail(cursor, nextTarget)
          }

          if (builtCount === 0 && runId === activeRunId) {
            await assistOnPortion(cursor)
          }
        })

        // Wait until ALL agents finish this portion before moving to the next portion
        await Promise.all(portionWorkers)
        if (runId !== activeRunId) return

        // Brief pause to admire the finished portion before moving on
        await wait(160)
      }

      if (runId !== activeRunId) return

      // Fade out all agent cursors
      cursors.forEach((c) => {
        c.setTask('done ✓')
        c.el.style.opacity = '0'
      })

      await wait(450)
      if (runId !== activeRunId) return

      // Smoothly return to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' })

      removeOverlay()
      restoreTargetStyles(false)
      restoreScrollLock()
      isPlaying.value = false
      isFinished.value = true
      currentPortionLabel.value = ''
    } catch (err) {
      // Never block the app: if anything fails, reveal the page normally
      fullCleanup(true)
    }
  }

  const skipIntro = () => {
    try {
      fullCleanup(true)
    } catch (_) {
      isPlaying.value = false
      isFinished.value = true
    }
  }

  const replayIntro = () => {
    runIntro({ isReplay: true })
  }

  onMounted(async () => {
    try {
      const instance = getCurrentInstance()
      const router = instance?.appContext?.config?.globalProperties?.$router
      if (router && typeof router.isReady === 'function') {
        await router.isReady()
      }
      await nextTick()
      await runIntro({ isReplay: false })
    } catch (_) {
      fullCleanup(true)
    }
  })

  onBeforeUnmount(() => {
    fullCleanup(true)
  })

  return {
    isPlaying,
    isFinished,
    currentPortionLabel,
    currentPortionIndex,
    totalPortions,
    skipIntro,
    replayIntro,
  }
}
