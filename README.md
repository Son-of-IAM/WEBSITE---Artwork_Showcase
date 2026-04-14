# Son_of_IAM_ | Digital Portfolio & Commercial Hub

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20|%20CSS3%20|%20Vanilla%20JS-orange)

A high-performance, custom-coded portfolio and e-commerce landing page built for Christian digital artist Promise Adebayo (Son_of_IAM_). 

**Developed by:** [Ayoleyi Marvelous from Marvelous Ascent]

##  Project Overview
The goal of this project was to translate a highly specific brand identity and wireframe into a lightning-fast, serverless web experience. Rather than relying on heavy frameworks or bloated CMS platforms, this site was engineered from the ground up using **Vanilla web technologies**. This approach ensures zero monthly maintenance costs for the client, instantaneous load times, and pixel-perfect adherence to the brand's 60-30-10 color rule.

##  Key Features & Technical Highlights

* ** Custom CSS Architecture:** Built entirely without CSS frameworks (like Bootstrap or Tailwind). Utilizes native CSS Variables (`:root`) for global theming, making brand color updates instantaneous.
* ** Native Light/Dark Mode:** Engineered a custom dark mode toggle using JavaScript and CSS data-attributes. User preferences are saved locally via `localStorage` to persist across sessions.
* ** Dynamic DOM Gallery Modal:** Instead of loading a separate HTML page or heavy modal library for every artwork, the portfolio utilizes a single, dynamic JavaScript modal. It extracts data attributes from clicked grid items and injects them into the DOM, keeping the codebase incredibly DRY (Don't Repeat Yourself).
* ** Fluid Responsiveness:** Utilizes CSS Grid, Flexbox, and `clamp()` typography to ensure the layout elegantly adapts from massive desktop monitors down to mobile devices without layout shift.
* ** Serverless E-commerce:** Designed to operate without a heavy backend. The shop integrates directly with direct-to-checkout payment links (e.g., Paystack/Stripe), eliminating database overhead and minimizing security liabilities.
* ** Headless Form Integration:** The "Commercial Hub" securely captures and routes lead data using Formspree endpoints, completely eliminating the need for a PHP/Node server.

## 🛠️ Tech Stack
* **Markup:** Semantic HTML5
* **Styling:** CSS3 (Flexbox, Grid, Custom Properties, Media Queries)
* **Interactivity:** Vanilla JavaScript (ES6+)
* **Data Routing:** Formspree (Serverless Contact Forms)
* **Analytics/Tracking:** Prepared for Meta Pixel, TikTok Pixel, and GA4 integration.

## Project Structure
```text
/
├── index.html          # Main application file (Structure & Logic)
├── Images/             # Directory for all optimized visual assets
│   └── LOGO.PNG        # Brand Logo / Favicon
└── fonts/              # Directory for custom `.ttf` / `.otf` typography


Setup & Installation
Because this project is built with vanilla web technologies, no build steps, compilers, or package managers (like npm or Webpack) are required.

Clone the repository:

Bash
git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
Open index.html in any modern web browser to view the site locally.

To deploy, simply host the directory on any static hosting provider (GitHub Pages, Netlify, Vercel).

Future Roadmap
CMS Integration: Potential future migration of the Articles section to a headless CMS (like Sanity or Contentful) for easier client publishing.

Data Dashboards: Implementation of a custom Power BI or Looker Studio dashboard connected to the site's analytics to track limited-drop conversion rates.

If you are looking for a developer who prioritizes clean code, performance, and custom architecture, feel free to reach out to me.
