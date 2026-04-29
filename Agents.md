# Agents

This project utilizes a **Distributed Agentic Workflow**. Agents are authorized to use external libraries (Vite, Tailwind, TanStack) to ensure the final product meets "Expert Developer" standards.

## 1. The System Architect (Lead)
* **Role**: Oversees the integration of the three primary APIs and ensures code modularity.
* **Directives**:
    * Maintain a strict **Single Source of Truth** for member data in the Zustand store.
    * Ensure all components from **shadcn/ui** are extended correctly with Tailwind.
    * Review financial calculations for accuracy, ensuring price-at-trade data is cached to minimize API credit consumption.

## 2. The Data Ingestion Agent (API Specialist)
* **Role**: Manages the `/src/api` and `/bin` directories.
* **Directives**:
    * Implement rate-limiting logic for Alpha Vantage and Polygon to avoid key suspension.
    * Construct the "Election Date" filter—ensuring the system only processes trades relevant to the current term.
    * Create a "Ticker Resolver" service that maps messy disclosure names (e.g., "APPLE INC COM") to clean tickers (AAPL).

## 3. The UI/UX Engineer (Tailwind Master)
* **Role**: Builds the dashboard using **Tailwind CSS** and **shadcn/ui**.
* **Directives**:
    * Create a "Portfolio Heatmap" using **Tailwind's grid system** to show sector exposure (Tech, Defense, Energy).
    * Implement **TanStack Table** for the main trade log, including multi-column sorting (By Date, By Member, By Value).
    * Ensure a "FinTech Dark" aesthetic—deep grays, high-contrast text, and semantic color coding (Green for Buys, Red for Sells).

## 4. The Correlation Analyst (Logic Agent)
* **Role**: The "Brain" behind the Sentinel Alerts and Trade Signaling.
* **Directives**:
    * **Cluster Detection**: Identify "Hot Zones" where 3+ members trade the same ticker within a 14-day window.
    * **Signal Scoring**: Assign a "Signal Confidence Score" based on member committee overlap and trade volume consistency.
    * **Insider Mapping**: Scan `bill_text` from Congress.gov for ticker mentions or industry keywords to validate trade signals.
    * **Alerts Feed**: Generate the "High-Conviction Signals" feed for the dashboard, prioritizing clusters over individual trades.


## Operational Constraints
- **Library Choice**: Agents must prioritize libraries that are ESM-compatible and Vite-optimized.
- **State Management**: Do not use "Prop Drilling." Use custom hooks and Zustand for any data shared by more than two components.
- **Reporting**: If the Congress.gov API returns an empty set for a specific member, the Data Agent must check the "Manual Scraper" fallback logic in the `/bin` directory.
