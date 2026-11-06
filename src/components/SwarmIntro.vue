<template>
  <div class="sw-controls" aria-live="polite">
    <div v-if="isPlaying && currentPortionLabel" class="sw-status-pill">
      <span class="sw-btn-dot sw-btn-dot-live"></span>
      <span class="sw-status-step">{{ currentPortionIndex }}/{{ totalPortions }}</span>
      <span class="sw-status-label">{{ currentPortionLabel }}</span>
    </div>

    <button
      v-if="isPlaying"
      type="button"
      class="sw-btn sw-btn-skip"
      @click="skipIntro"
    >
      Skip intro
    </button>

    <button
      v-else-if="isFinished"
      type="button"
      class="sw-btn sw-btn-replay"
      @click="replayIntro"
    >
      <svg
        class="sw-btn-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      Replay
    </button>
  </div>
</template>

<script setup>
import { useSwarmIntro } from '../composables/useSwarmIntro'

const {
  isPlaying,
  isFinished,
  currentPortionLabel,
  currentPortionIndex,
  totalPortions,
  skipIntro,
  replayIntro,
} = useSwarmIntro()
</script>

<style scoped>
.sw-controls {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.sw-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(14, 14, 17, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.sw-status-step {
  font-family: monospace;
  font-size: 0.7rem;
  color: #ff6a00;
  font-weight: 700;
}

.sw-status-label {
  color: #e4e4e7;
}

.sw-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(14, 14, 17, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 106, 0, 0.35);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.sw-btn:hover {
  transform: translateY(-2px);
  border-color: #ff6a00;
  background: rgba(24, 24, 29, 0.95);
}

.sw-btn:active {
  transform: translateY(0);
}

.sw-btn-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff6a00;
}

.sw-btn-dot-live {
  box-shadow: 0 0 8px #ff6a00;
}

.sw-btn-icon {
  width: 14px;
  height: 14px;
  color: #ff6a00;
}
</style>
