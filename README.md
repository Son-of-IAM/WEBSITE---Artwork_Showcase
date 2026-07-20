# 🎨 Son_of_IAM_ | Digital Art Portfolio

A premium, cinematic web portfolio built for Nigerian digital artist and illustrator, Promise Adebayo (Son_of_IAM_). Designed to showcase high-fidelity digital illustrations, 3D renders, and graffiti art with immersive animations and lightning-fast load times.

![Version](https://img.shields.io/badge/version-2.1-blue.svg)
![Status](https://img.shields.io/badge/status-Live-brightgreen.svg)
![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JS-orange.svg)

## 🚀 Key Features

*   **Cinematic 3D Showroom:** An immersive landing page featuring a CSS-driven 3D rotating carousel and atmospheric spotlighting.
*   **Headless JSON CMS:** The gallery dynamically fetches and renders artworks directly from a structured `index.json` file, completely automating the HTML generation for the grid and detail pages.
*   **Progressive Image Loading Engine:** Implements a custom `IntersectionObserver` that automatically fetches tiny, blurred thumbnails via Cloudinary API and gracefully cross-fades them into full HD resolution once loaded, eliminating layout shifts and caching race conditions.
*   **Hardware-Accelerated Animations:** Custom scroll-reveal transitions optimized specifically to prevent stuttering on iOS Safari devices.
*   **X-Axis Scroll Architecture:** Custom-built horizontal swiping navigation for gallery sub-categories with hidden scrollbars for mobile and premium thumb-tracks for PC.
*   **Persistent Theme Engine:** Seamless Light/Dark mode toggling that saves user preference locally without causing flash-bangs on page reload.

## 🛠️ Architecture & Tech Stack

This project strictly utilizes vanilla web technologies to maintain maximum performance without the overhead of heavy JavaScript frameworks.

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Data Management:** Local JSON Fetch API (`/data/artworks/index.json`)
*   **Media Hosting:** Cloudinary API

## 🔄 Recent Updates (v2.1)
*   **Cache Busting:** Implemented versioning (`?v=2.1`) across stylesheets and scripts to prevent stale CDN/browser caching during major deployments.
*   **iOS Safari Patch:** Stripped conflicting `background-attachment: fixed` attributes specifically for WebKit mobile browsers to prevent image disappearance.
*   **Viewport Fixes:** Transitioned cinematic landing height to `100dvh` and constrained max-widths to resolve Windows PC scrollbar white-gaps.
*   **External Media Integrations:** Wired the artwork detail page to conditionally render external video process links based on the CMS data payload.

---

## 👨‍💻 About the Developer

**Developed, optimized, and patched by Ayoleyi Gbenga-Ayodeji Marvelous.**

I am a highly adaptable technical professional bridging the gap between web development, data analysis, and life sciences. Currently pursuing computational biology, chemoinformatics, and pharmaceutical data analysis, I specialize in building robust, template-driven workflows and extracting high-performance results from both code and data.

Whether it is patching WebKit glitches, writing Python and R scripts for genomic data, building predictive machine learning models, or configuring high-performance pipelines in a WSL Ubuntu environment, I thrive on solving complex problems and optimizing systems. 

**My Core Stack Includes:**
*   **Web Development:** HTML5, CSS3, Vanilla JavaScript, Git/Version Control
*   **Data Analysis & Modeling:** Python, R, SQL, Microsoft Excel, Power BI
*   **Environment & Hardware:** WSL Ubuntu, Bash/Zsh scripting, HP ProBook architectures

### 🔗 Let's Connect

Looking for a developer who brings technical rigor, analytical thinking, and a sharp eye for optimization to your next project? Check out my work and let's build something incredible.

*   **Portfolio:** [Visit My Website](https://ayoleyi-portfolio.vercel.app/)
*   **Open to Work:** Commissions, Collaborations, and Analytics Roles.

---
*© 2026 Promise Adebayo & Ayoleyi Gbenga-Ayodeji Marvelous. All rights reserved.*
