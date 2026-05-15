# Minimalist AI Engineer Portfolio

A sleek, responsive, and modern personal portfolio built with Vue.js and Vite. It features a premium dark theme, glassmorphism UI components, subtle CSS animations, and a fully functional contact form powered by Google Sheets.

## Features
- **Modern Tech Stack**: Built with Vue 3 and Vite for blazing fast performance.
- **Premium Design**: Dark mode default, frosted glass cards, and a minimalist glowing aura effect.
- **Responsive**: Fully optimized for mobile, tablet, and desktop displays.
- **Serverless Contact Form**: Sends messages directly to a Google Sheet using Google Apps Script (no paid backend required).

## Setup & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## How to Customize for Yourself

If you'd like to use this template for your own portfolio, follow these steps to make it yours:

### 1. Update Personal Information
Open `src/App.vue`. At the bottom of the file in the `<script setup>` section, you will find several arrays that control the content. Simply update the text to match your own:
- `metrics`: Your high-level stats (e.g., "4+ AI Projects")
- `services`: The services or skills you offer
- `skills`: Your technical skills and proficiency percentages
- `projects`: Your portfolio projects (includes title, description, language, and links)
- `certifications`: Your credentials

Also, be sure to scroll through the HTML template in `App.vue` to replace "Muhammad Abdul Rehman" with your own name, and update the social links in the `<footer>`.

### 2. Swap the Images & Resume
- Replace the profile image (`Everypost.jpg`) in the `public` directory with your own picture. Update the image paths in `App.vue` if you change the filename.
- Replace the resume PDF file with your own and update the import path at the top of the `<script setup>` block.

### 3. Connect Your Own Contact Form
To receive messages from the contact form, you need to connect it to your own Google Sheet:
1. Create a new Google Sheet with the headers: `timestamp`, `name`, `email`, `phone`, `service`, `message`.
2. Go to **Extensions > Apps Script** and paste a standard Google Sheets POST script.
3. Deploy the script as a Web App (Execute as: **Me**, Access: **Anyone**).
4. Copy the generated Web App URL and paste it into `src/App.vue` on this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = "YOUR_NEW_URL_HERE";
   ```

## Deployment
This project is optimized for deployment on **Vercel**. 
Simply create an account on [Vercel](https://vercel.com/), connect your GitHub repository, and click Deploy. Vercel will automatically detect the Vite/Vue setup and build the site for you.
