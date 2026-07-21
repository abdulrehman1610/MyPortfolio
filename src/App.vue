<template>
  <div class="site-wrapper">
    <!-- Top Header Bar (Exact Match) -->
    <header class="site-header">
      <div class="header-logo">
        <strong>AI Engineer</strong>
        <span>Automation Creator</span>
      </div>
      <div class="header-status">
        Available for Freelance
        <svg class="cross-star" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
        </svg>
      </div>
    </header>

    <!-- Hero Section (Absolute Center Portrait & 2-Column Content Grid) -->
    <section id="home" class="hero-section">
      <!-- Big Outlined Background Text -->
      <div class="hero-bg-text" aria-hidden="true">PORTFOLIO</div>

      <!-- Center Portrait cutout with fade linear gradient mask -->
      <div class="hero-portrait-wrapper">
        <picture>
          <source media="(max-width: 768px)" srcset="/Everypost.jpg" />
          <img src="/01-Everypost-removebg-preview (1).png" alt="Muhammad Abdul Rehman Portrait" class="hero-portrait-img" />
        </picture>
      </div>

      <!-- Content grid overlapping the portrait -->
      <div class="hero-grid">
        <!-- Hero Left Copy -->
        <div class="hero-copy">
          <span class="hero-hello-cursive">Hello, I'm</span>
          <h1>Abdul<br>Rehman</h1>
          
          <div class="hero-title-highlight">
            AI Engineer &amp; Software Automator
          </div>
          
          <p class="bio">
            I design and build stylish, user-focused intelligence pipelines and automation workflows that combine data structure with agentic systems. Passionate about local LLMs, retrieval search architectures, and details that make a difference.
          </p>

          <div class="hero-actions">
            <a class="btn-solid" href="#contact">Hire Me</a>
            <a class="btn-outline" :href="resumeUrl" download="Abdul_Rehman_CV.docx">Download CV</a>
          </div>

          <div class="hero-badge-tag">
            <span class="hero-badge-tag-icon">
              <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </span>
            Available Worldwide
          </div>
        </div>

        <!-- Hero Right Stats & Badges -->
        <div class="hero-sidebar">
          <div class="circle-workflow-badge">
            <div class="circle-badge-icon">
              <svg class="cross-star" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
              </svg>
            </div>
            <span class="circle-badge-text">Turning ideas into powerful digital experiences.</span>
          </div>

          <div class="hero-stats" aria-label="Professional metrics">
            <div v-for="metric in metrics" :key="metric.value" class="stat-item">
              <strong class="stat-num">{{ metric.value }}</strong>
              <div class="stat-label-wrap">
                <span class="stat-label-line1">{{ metric.label1 }}</span>
                <span class="stat-label-line2">{{ metric.label2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Selected Projects Section -->
    <section id="portfolio" class="projects-section">
      <div class="section-header">
        <h2>Selected Projects</h2>
        <div class="section-header-line"></div>
        <a href="https://github.com/abdulrehman1610" target="_blank" rel="noreferrer" class="section-header-link">
          View All Projects ⟶
        </a>
      </div>

      <div class="projects-grid">
        <article 
          v-for="(project, index) in projects" 
          :key="project.name" 
          class="project-card"
          @click="openProject(project.url)"
        >
          <div class="project-mockup">
            <div class="project-mockup-inner">
              <span class="project-mockup-tag">{{ project.language }}</span>
              <h3>{{ project.name }}</h3>
              <p>{{ truncateDesc(project.description) }}</p>
            </div>
            <div class="project-mockup-overlay">
              <span>Visit Repository ⟶</span>
            </div>
          </div>

          <div class="project-details">
            <span class="project-num">{{ formatIndex(index) }}</span>
            <div class="project-info">
              <h4>{{ formatProjectTitle(project.name) }}</h4>
              <span>{{ project.type }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Three-Column Education, Workflow, and Quote panels -->
    <section id="about" class="info-section">
      <!-- Column 1: Education & Skills -->
      <div class="info-column">
        <h3 class="info-column-title">
          <svg class="cross-star" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
          </svg>
          Education &amp; Skills
        </h3>

        <!-- Education timeline -->
        <div class="edu-block">
          <span class="edu-title">Education</span>
          <div class="edu-card">
            <h4>B.Sc. in Computer Science</h4>
            <p>The Superior University, Lahore</p>
            <span class="edu-year">2024 - 2028</span>
          </div>
        </div>

        <!-- Skills list -->
        <div>
          <span class="skills-title">Skills</span>
          <div class="skills-tags-wrap">
            <span v-for="skill in skills" :key="skill.name" class="skill-tag">
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Column 2: Work Process (Exact Match) -->
      <div class="info-column">
        <h3 class="info-column-title">
          <svg class="cross-star" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
          </svg>
          Work Process
        </h3>

        <div class="process-list">
          <div v-for="step in steps" :key="step.num" class="process-item">
            <span class="process-num">{{ step.num }}</span>
            <div class="process-icon-box">{{ step.icon }}</div>
            <div class="process-info">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 3: Orange Quote Card (Exact Match) -->
      <div class="info-column">
        <div class="quote-card">
          <div class="quote-icon">“</div>
          <p class="quote-text">
            Good design is not just how it looks, but how it works.
          </p>
          <div class="quote-signature-wrap">
            <div class="quote-signature">Muhammad Abdul Rehman</div>
            <div class="quote-footer-cta">
              <span>Let's Create Something Great Together.</span>
              <svg class="cross-star" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer / Contact Section -->
    <footer id="contact" class="footer-section">
      <div class="footer-grid">
        <!-- Left Side: Form Inquiries -->
        <div class="footer-left">
          <h3 class="footer-title">
            Let's Work Together
            <svg class="cross-star large" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
            </svg>
          </h3>
          <p class="desc">
            I'm currently open for new projects and collaborations. Let's create something amazing that drives results.
          </p>

          <form class="footer-contact-form" @submit.prevent="submitForm">
            <!-- Name Input -->
            <div class="form-group-minimal">
              <label class="form-label-minimal" for="client-name">Your Name</label>
              <input 
                id="client-name"
                type="text" 
                v-model="formData.name" 
                class="form-input-minimal" 
                placeholder="Muhammad Abdul Rehman" 
                required 
              />
            </div>

            <!-- Email Input -->
            <div class="form-group-minimal">
              <label class="form-label-minimal" for="client-email">Email Address</label>
              <input 
                id="client-email"
                type="email" 
                v-model="formData.email" 
                class="form-input-minimal" 
                placeholder="hello@abdulrehman.com" 
                required 
              />
            </div>

            <!-- Service Select Dropdown -->
            <div class="form-group-minimal full-width">
              <label class="form-label-minimal" for="service-select">Workspace Project Type</label>
              <select 
                id="service-select"
                v-model="formData.service" 
                class="form-select-minimal" 
                required
              >
                <option value="" disabled selected>Select service workspace...</option>
                <option value="RAG Application Development">RAG Application Development</option>
                <option value="Model Training">Model Training &amp; Tuning</option>
                <option value="AI Applications">AI Application Integration</option>
                <option value="Gen AI">Gen AI Automation &amp; Agents</option>
              </select>
            </div>

            <!-- Message Detail -->
            <div class="form-group-minimal full-width">
              <label class="form-label-minimal" for="project-message">Project Goals &amp; Target Outputs</label>
              <textarea 
                id="project-message"
                v-model="formData.message" 
                class="form-textarea-minimal" 
                placeholder="Briefly describe the requirements, pipeline structures or goals..." 
                required
              ></textarea>
            </div>

            <!-- Status Alert Notifications -->
            <div v-if="submitStatus === 'success'" class="form-alert success">
              ✓ Workspace message sent successfully to Google Sheets.
            </div>
            <div v-if="submitStatus === 'error'" class="form-alert error">
              ⚠ System error: message delivery failed. Please retry.
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn-solid form-submit-btn-minimal"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Sending Request...' : 'Send Message' }}
            </button>
          </form>
        </div>

        <!-- Right Side: Contact info Cards -->
        <div class="footer-right">
          <div class="contact-info-list" aria-label="Contact information details">
            <a href="mailto:abdulrehman1610.cs@gmail.com" class="contact-info-card">
              <div class="contact-card-icon">✉</div>
              <div class="contact-card-details">
                <span>Send Email</span>
                <strong>abdulrehman1610.cs@gmail.com</strong>
              </div>
            </a>

            <a href="https://github.com/abdulrehman1610" target="_blank" rel="noreferrer" class="contact-info-card">
              <div class="contact-card-icon">⚡</div>
              <div class="contact-card-details">
                <span>Open Repositories</span>
                <strong>github.com/abdulrehman1610</strong>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/muhammad-abdul-rehman-69b23b380/" target="_blank" rel="noreferrer" class="contact-info-card">
              <div class="contact-card-icon">⚓</div>
              <div class="contact-card-details">
                <span>Professional Profile</span>
                <strong>linkedin.com/in/muhammad-abdul-rehman</strong>
              </div>
            </a>

            <div class="contact-info-card">
              <div class="contact-card-icon">⚲</div>
              <div class="contact-card-details">
                <span>Primary Location</span>
                <strong>Lahore, Pakistan</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom trademark footer -->
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Muhammad Abdul Rehman. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="https://github.com/abdulrehman1610" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/muhammad-abdul-rehman-69b23b380/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a :href="resumeUrl" download="Abdul_Rehman_CV.docx">Resume</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import resumeUrl from '../CV.docx'

// Contact form reactive bindings
const formData = ref({
  name: '',
  email: '',
  phone: 'N/A', // Set default to satisfy spreadsheet model
  service: '',
  message: ''
})
const isSubmitting = ref(false)
const submitStatus = ref(null)

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxABBJJBVgte8ueVynr1VjdxSWnFgPgrAy-azCI-iQBP0UBq3FHUUk2vmmei5V5IugO/exec";

// Dynamic Data Sets (Matched Exactly to reference Layout numbers)
const metrics = [
  { value: '3+', label1: 'Years', label2: 'Experience' },
  { value: '40+', label1: 'Projects', label2: 'Completed' },
  { value: '20+', label1: 'Happy', label2: 'Clients' },
]

const skills = [
  { name: 'Python' },
  { name: 'AI/ML' },
  { name: 'RAG' },
  { name: 'Vue / Frontend' },
  { name: 'SQL' },
  { name: 'Git' },
]

const steps = [
  { num: '01', icon: '🔍', title: 'Discover', description: 'Understanding goals, audience, and project requirements.' },
  { num: '02', icon: '💡', title: 'Ideate', description: 'Planning, wireframing, and creating the right concept.' },
  { num: '03', icon: '✍', title: 'Design', description: 'Crafting visual design with a focus on user experience.' },
  { num: '04', icon: '⚙', title: 'Develop', description: 'Building fast, responsive, and high-performing websites.' },
  { num: '05', icon: '🚀', title: 'Deliver', description: 'Testing, optimizing, and launching with perfection.' },
]

const projects = [
  {
    name: 'AI-Meeting-Summarizer',
    type: 'AI Pipeline & ASR',
    description: 'Conversational AI pipeline that transforms raw meeting recordings into structured documentation using ASR and generative AI.',
    language: 'Python',
    url: 'https://github.com/abdulrehman1610/AI-Meeting-Summarizer',
  },
  {
    name: 'WIFI-Attendance-System-CN',
    type: 'Automation & Dashboard',
    description: 'Wi-Fi hotspot based student attendance system with dark dashboard, device monitoring, and admin override tools.',
    language: 'HTML & CSS',
    url: 'https://github.com/abdulrehman1610/WIFI-Attendance-System-CN',
  },
  {
    name: 'FridayAI-Intelligent-Agent',
    type: 'Intelligent Agent UI',
    description: 'Full-stack assistant using Python and Next.js, supporting real-time interaction and intelligent task execution.',
    language: 'TypeScript',
    url: 'https://github.com/abdulrehman1610/FridayAI-Intelligent-Agent',
  },
  {
    name: 'spotify-clone',
    type: 'Music Interface',
    description: 'Responsive Spotify-inspired web app with dynamic music player interface and modern card-based layout.',
    language: 'CSS / Vue',
    url: 'https://github.com/abdulrehman1610/spotify-clone',
  },
  {
    name: 'student-performance-analysis',
    type: 'Data Analysis',
    description: 'Beginner analysis project using Python, Pandas, NumPy, and Matplotlib.',
    language: 'Jupyter Notebook',
    url: 'https://github.com/abdulrehman1610/student-performance-analysis',
  },
  {
    name: 'whatsapp-auto-reply-bot',
    type: 'API Automation',
    description: 'WhatsApp messaging automation that reads chat context and replies using Google Gemini AI.',
    language: 'Python',
    url: 'https://github.com/abdulrehman1610/whatsapp-auto-reply-bot',
  },
]

// Formatting Helpers
const formatIndex = (index) => {
  return String(index + 1).padStart(2, '0')
}

const truncateDesc = (desc) => {
  if (desc.length > 96) {
    return desc.slice(0, 93) + '...'
  }
  return desc
}

const formatProjectTitle = (name) => {
  return name.replace(/-/g, ' ')
}

const openProject = (url) => {
  window.open(url, '_blank')
}

// Form Submission via Google Sheets
const submitForm = async () => {
  isSubmitting.value = true
  submitStatus.value = null

  try {
    const data = new FormData()
    data.append('name', formData.value.name)
    data.append('email', formData.value.email)
    data.append('phone', formData.value.phone)
    data.append('service', formData.value.service)
    data.append('message', formData.value.message)

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    })

    submitStatus.value = 'success'
    formData.value = {
      name: '',
      email: '',
      phone: 'N/A',
      service: '',
      message: ''
    }
  } catch (error) {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
    setTimeout(() => { submitStatus.value = null }, 5000)
  }
}
</script>
