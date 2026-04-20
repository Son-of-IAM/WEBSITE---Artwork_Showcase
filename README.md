
```html
<div align="center">

# Son_of_IAM_ | Premium Portfolio & Commercial Hub

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Project Status" />
  <img src="https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Tech-Vanilla_JS_|_CSS3-orange?style=for-the-badge" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/CMS-Decap_Headless-7205cd?style=for-the-badge" alt="CMS" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge" alt="CI/CD" />
</p>

A high-performance, serverless digital gallery and e-commerce landing page built for Christian digital artist Promise Adebayo (Son_of_IAM_).

**Architected & Developed by:** Ayoleyi Marvelous

</div>

---

## 🚀 Project Overview
The objective was to build a premium, highly-editorial gallery experience without the bloat, slow load times, or recurring monthly server costs of traditional platforms like WordPress or Shopify. 

This project utilizes a **Serverless Architecture**, leveraging pure Vanilla web technologies connected to a **Headless CMS**. It provides the client with a secure, user-friendly admin dashboard to upload art, while maintaining instantaneous load times, zero monthly hosting fees, and a dynamic 3-2-3-2 asymmetrical gallery layout.

---

## ✅ Client Requirements Delivered
This project was meticulously fine-tuned to meet the client's exact visual and functional specifications:

* **Mobile-Optimized Typography:** Engineered custom CSS media queries to force strict typographic rules on mobile devices (e.g., ensuring the main Hero text perfectly wraps to two lines, while the logo tagline remains constrained to a single line).
* **Scalable E-Commerce Strategy:** Removed hardcoded prices and dimensions. Implemented a "Check Live Pricing" routing system that directs users to live Paystack checkout portals or dedicated landing pages (`limited.html`), ensuring the site never displays outdated pricing.
* **Immersive "Double Exposure" Visuals:** Fulfilled the client request for animated backgrounds over static art. Utilized advanced CSS `mix-blend-mode: screen` to render dynamic, rotating purple/blue light animations that visually interact with the background artwork without hiding it.
* **"Scream Art" Gallery Layout:** Replaced standard grid layouts with a custom CSS Grid calculating a highly editorial **3-2-3-2 asymmetric pattern**, prioritizing large artwork displays while maintaining responsive integrity across all screen sizes.
* **Unified Brand Identity:** Integrated requested brand fonts (*Optima* for headers, *Georgia* for body, *Caveat* for handwriting accents) and programmed the interactive "fire" logo to pulse using the brand's exact dominant hex codes.

---

## 🧠 Technical Highlights & Architecture

* **Headless CMS Integration (Decap CMS):** A secure `/admin` portal connected directly to the GitHub API. Client uploads are automatically serialized into a JSON database (`data/artworks/index.json`) without requiring a backend Node/PHP server.
* **Automated CI/CD Image Pipeline:** Engineered a GitHub Actions workflow (`optimize-images.yml`) that intercepts high-resolution artwork uploads, losslessly compresses them, and auto-generates pull requests to keep the repository lightweight.
* **Dynamic Vanilla JS Renderer:** The gallery is drawn dynamically to the DOM using asynchronous `fetch()` requests. This allows the client to upload new art via the CMS, which instantly populates on the live site without touching the HTML.
* **Progressive Loading:** Pre-configured directory structures (`Images/tiny` and `Images/full`) to support progressive blur-up image loading for massive resolution artwork.

## 📁 Repository Structure
```text
/
├── index.html              # Main Application View
├── about.html              # Dedicated Artist Biography
├── style.css               # Global Styling & Media Queries
├── script.js               # Global Logic, CMS Fetching, & Modals
├── limited.html            # Product Dummy Landing Page
├── .github/workflows/      # CI/CD Automation Scripts
│   └── optimize-images.yml 
├── admin/                  # Decap Headless CMS Configuration
│   ├── index.html
│   └── config.yml          # Maps CMS inputs to JSON schema
├── data/artworks/          # The JSON Database
│   └── index.json          
└── Images/                 # Optimized Visual Assets
```

## 🛠️ Setup & Installation
Because this project utilizes a serverless Jamstack architecture, no build steps, compilers, or package managers are required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Son-of-IAM/WEBSITE---Artwork_Showcase.git](https://github.com/Son-of-IAM/WEBSITE---Artwork_Showcase.git)
   ```
2. **Local Development:** Open `index.html` in any modern web browser or use VS Code Live Server. *(Note: CMS fetching requires a local server environment due to CORS restrictions, Live Server handles this perfectly).*
3. **Deployment:** Hosted natively on GitHub Pages for zero-latency CDN delivery.

---

## 🏷️ Tags
`Vanilla JavaScript` `CSS3 Grid` `Serverless` `Jamstack` `Decap CMS` `Headless CMS` `GitHub Actions` `CI/CD` `E-Commerce` `Digital Art Portfolio` `Responsive Design`
```
