<template>
  <div class="site-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="nav">
      <a class="brand" href="#home" aria-label="Muhammad Abdul Rehman home">MAR</a>
      <nav aria-label="Primary navigation">
        <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>
      <a class="nav-cta" :href="resumeUrl" download>Resume</a>
    </header>

    <main>
      <section id="home" class="hero section">
        <div class="hero-copy">
          <p class="eyebrow">Hi, I am</p>
          <h1>Muhammad Abdul Rehman</h1>
          <h2>AI Engineer</h2>
          <p class="intro">
            I build intelligent systems, AI-powered products, and automation workflows that turn ideas
            into functional, scalable solutions.
          </p>
          <div class="hero-actions">
            <a class="btn primary" href="#contact">Hire Me</a>
            <a class="btn secondary" :href="resumeUrl" download>Download CV</a>
          </div>
          <div class="metrics" aria-label="Professional highlights">
            <div v-for="metric in metrics" :key="metric.label">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-portrait" aria-label="Profile portrait">
          <div class="portrait-ring"></div>
          <img src="/Everypost.jpg" alt="Muhammad Abdul Rehman" />
        </div>
      </section>

      <section id="services" class="section">
        <div class="section-heading">
          <h2>Services</h2>
          <p>Focused AI engineering services for practical, production-minded solutions.</p>
        </div>
        <div class="service-grid">
          <article v-for="service in services" :key="service.title" class="service-card">
            <span class="service-icon">{{ service.icon }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </article>
        </div>
      </section>

      <section id="about" class="about section">
        <div class="about-image">
          <img src="/Everypost.jpg" alt="Muhammad Abdul Rehman portrait" />
        </div>
        <div class="about-copy">
          <div class="section-heading align-left">
            <h2>About Me</h2>
            <p>AI engineer in progress with a software engineering foundation.</p>
          </div>
          <p>
            I am an aspiring AI Engineer, passionate about building intelligent systems and leveraging
            emerging AI technologies to create impactful solutions. With a strong foundation in software
            engineering and a hands-on approach, I focus on turning ideas into functional, scalable products.
          </p>
          <p>
            Curious, proactive, and always learning, I thrive on exploring innovative opportunities in AI
            and software development.
          </p>
          <a class="btn primary compact" :href="resumeUrl" download>Download CV</a>
        </div>
      </section>

      <section id="skills" class="section">
        <div class="skill-strip">
          <div v-for="skill in skills" :key="skill.name" class="skill">
            <div class="skill-circle" :style="{ '--degrees': skill.degrees }">
              <span>{{ skill.value }}</span>
            </div>
            <strong>{{ skill.name }}</strong>
          </div>
        </div>
      </section>

      <section id="portfolio" class="section">
        <div class="section-heading">
          <h2>Projects</h2>
          <p>Selected GitHub projects from my current AI and software engineering work.</p>
        </div>
        <div class="project-grid">
          <article v-for="project in projects" :key="project.name" class="project-card">
            <div class="project-topline">
              <span>{{ project.type }}</span>
              <a :href="project.url" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-meta">
              <span>{{ project.language }}</span>
              <span>{{ project.updated }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="credentials" class="section split-section">
        <div>
          <div class="section-heading align-left">
            <h2>Certifications</h2>
            <p>AI, GitHub, Python, SQL, and professional learning credentials.</p>
          </div>
          <div class="credential-list">
            <div v-for="cert in certifications" :key="cert.title" class="credential">
              <strong>{{ cert.title }}</strong>
              <span>{{ cert.issuer }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="section-heading align-left">
            <h2>Education</h2>
            <p>Computer Science foundation.</p>
          </div>
          <div class="education-card">
            <strong>The Superior University</strong>
            <span>Bachelors, Computer Science</span>
            <small>2024 - 2028</small>
          </div>
        </div>
      </section>

      <section id="contact" class="section contact">
        <div class="section-heading">
          <h2>Contact Me</h2>
          <p>Let’s discuss AI products, automation, RAG systems, or model workflows.</p>
        </div>
        <form class="contact-form" @submit.prevent="submitForm">
          <input type="text" v-model="formData.name" placeholder="Name" aria-label="Name" required />
          <input type="email" v-model="formData.email" placeholder="Email" aria-label="Email" required />
          <input type="tel" v-model="formData.phone" placeholder="Phone Number" aria-label="Phone Number" />
          <select v-model="formData.service" aria-label="Service" required>
            <option value="" disabled>Select a Service</option>
            <option>RAG Application Development</option>
            <option>Model Training</option>
            <option>AI Applications</option>
            <option>Gen AI</option>
          </select>
          <textarea v-model="formData.message" placeholder="Project Details..." aria-label="Project Details" required></textarea>
          
          <div v-if="submitStatus === 'success'" class="form-status success">
            Message sent successfully!
          </div>
          <div v-if="submitStatus === 'error'" class="form-status error">
            Oops! Something went wrong.
          </div>

          <button class="btn secondary submit" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </section>
    </main>

    <footer>
      <a class="brand" href="#home">MAR</a>
      <div class="footer-links">
        <a href="https://github.com/abdulrehman1610" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/muhammad-abdul-rehman-69b23b380/" target="_blank"
          rel="noreferrer">LinkedIn</a>
        <a :href="resumeUrl" download>CV</a>
      </div>
      <small>Designed and developed by Muhammad Abdul Rehman.</small> 
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import resumeUrl from '../Muhammad_Abdul_Rehman_ATS_Resume.pdf'

const formData = ref({
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
})
const isSubmitting = ref(false)
const submitStatus = ref(null)

// IMPORTANT: Paste your Google Apps Script Web App URL here
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxABBJJBVgte8ueVynr1VjdxSWnFgPgrAy-azCI-iQBP0UBq3FHUUk2vmmei5V5IugO/exec";

const submitForm = async () => {
  if (!GOOGLE_SCRIPT_URL) {
    alert("Please configure the VITE_GOOGLE_SCRIPT_URL in your .env file!");
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = null;

  try {
    const data = new FormData();
    for (const key in formData.value) {
      data.append(key, formData.value[key]);
    }

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    });

    submitStatus.value = 'success';
    formData.value = { name: '', email: '', phone: '', service: '', message: '' };
  } catch (error) {
    submitStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
    setTimeout(() => { submitStatus.value = null; }, 5000);
  }
}

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Contact' },
]

const metrics = [
  { value: '4+', label: 'AI Projects' },
  { value: '6+', label: 'GitHub Repos' },
  { value: '5+', label: 'Certifications' },
]

const services = [
  {
    title: 'RAG Application Development',
    icon: 'RAG',
    description: 'Retrieval-augmented systems with document search, vector workflows, and reliable answers.',
  },
  {
    title: 'Model Training',
    icon: 'ML',
    description: 'Training, tuning, and evaluation workflows for focused machine learning use cases.',
  },
  {
    title: 'AI Applications',
    icon: 'AI',
    description: 'Full-stack AI tools that combine interfaces, APIs, automation, and intelligent features.',
  },
  {
    title: 'Gen AI',
    icon: 'GEN',
    description: 'Generative AI experiences using LLMs, prompt systems, agents, and content pipelines.',
  },
]

const skills = [
  { name: 'Python', value: '90%', degrees: '324deg' },
  { name: 'AI/ML', value: '85%', degrees: '306deg' },
  { name: 'RAG', value: '80%', degrees: '288deg' },
  { name: 'Vue / Frontend', value: '75%', degrees: '270deg' },
  { name: 'SQL', value: '70%', degrees: '252deg' },
]

const repoBase = 'https://github.com/abdulrehman1610'
const projects = [
  {
    name: 'AI-Meeting-Summarizer',
    type: 'AI Pipeline',
    description:
      'Conversational AI pipeline that transforms raw meeting recordings into structured documentation using ASR and generative AI.',
    language: 'Python',
    updated: 'Updated recently',
    url: `${repoBase}/AI-Meeting-Summarizer`,
  },
  {
    name: 'WIFI-Attendance-System-CN',
    type: 'Automation',
    description:
      'Wi-Fi hotspot based student attendance system with dark dashboard, device monitoring, and admin override tools.',
    language: 'HTML',
    updated: 'Updated recently',
    url: `${repoBase}/WIFI-Attendance-System-CN`,
  },
  {
    name: 'FridayAI-Intelligent-Agent',
    type: 'AI Agent',
    description:
      'Full-stack assistant using Python and Next.js, supporting real-time interaction and intelligent task execution.',
    language: 'TypeScript',
    updated: 'Updated 3 weeks ago',
    url: `${repoBase}/FridayAI-Intelligent-Agent`,
  },
  {
    name: 'spotify-clone',
    type: 'Frontend',
    description:
      'Responsive Spotify-inspired web app with dynamic music player interface and modern card-based layout.',
    language: 'CSS',
    updated: 'Updated Apr 3',
    url: `${repoBase}/spotify-clone`,
  },
  {
    name: 'student-performance-analysis',
    type: 'Data Analysis',
    description: 'Beginner analysis project using Python, Pandas, NumPy, and Matplotlib.',
    language: 'Jupyter Notebook',
    updated: 'Updated Feb 9',
    url: `${repoBase}/student-performance-analysis`,
  },
  {
    name: 'whatsapp-auto-reply-bot',
    type: 'Automation',
    description: 'WhatsApp messaging automation that reads chat context and replies using Google Gemini AI.',
    language: 'Python',
    updated: 'Updated Jan 11',
    url: `${repoBase}/whatsapp-auto-reply-bot`,
  },
]

const certifications = [
  { title: 'Career Essentials in GitHub Professional Certificate', issuer: 'GitHub' },
  { title: 'A B C of Coding to Building AI Agents', issuer: 'Analytics Vidhya' },
  { title: 'Artificial Intelligence Beginners Guide', issuer: 'Simplilearn' },
  { title: 'Introduction to SQL', issuer: 'Sololearn' },
  { title: 'Career Essentials in Generative AI', issuer: 'Microsoft and LinkedIn' },
]
</script>
