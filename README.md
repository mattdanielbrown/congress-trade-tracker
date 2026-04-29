# CongressTrade Sentinel (CTS)
A professional-grade monitoring suite for Congressional financial activity, designed to leverage "Cluster Intelligence" as a high-confidence trade indicator for retail investors.

## Core Objective
Aggregate Congressional trade data to identify high-conviction signals where multiple legislators are trading the same assets simultaneously, potentially indicating non-public legislative influence.

- **Vite/React**: High-performance frontend.
- **Agentic Ingestion**: Bash and Node scripts designed to poll for new disclosures automatically.
- **Normalized Schema**: Resolves discrepancies between varied filing formats into a unified transaction log.

## Tech Stack
* **Build Tool**: Vite.js (React/JS template)
* **Styling**: Tailwind CSS + Typography & Forms plugins
* **Components**: shadcn/ui (Radix UI primitives)
* **Data Management**: TanStack Query & TanStack Table
* **State**: Zustand

## Deployment
Optimize for Vercel/Netlify deployment with scheduled GitHub Actions for data refreshes.
