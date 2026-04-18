# SmartFlow — AI-Powered Crowd Intelligence for Stadiums

**Because no one comes to watch the queue.**

SmartFlow is a real-time, AI-driven platform that transforms stadiums into self-optimizing environments. It predicts crowd surges, optimizes movement paths, minimizes queues, and enables dynamic coordination between attendees, staff, and infrastructure.

## Chosen Vertical
The stadium domain was modeled as a dynamic network system to solve large-scale crowd congestion and inefficiencies.

## Approach and Logic
- **Architecture**: A localized single-page application built with Vite + React to demonstrate a seamless toggle between Management and Attendee personas.
- **Aesthetics**: Fully custom styling (no external CSS frameworks like Tailwind) prioritizing visual excellence: electric-purple neon accents, glassmorphic UI, and smooth pulsing micro-animations.
- **Google Services Mocking**:
  - *Google Maps Platform*: Uses maps and simulated heatmap blobs directly into the UI components.
  - *Google Gemini AI*: Intercepts simulated crowd data logic to present live incident generation strings (e.g., "Gate 4 Congested - reroute") on the management dashboard.
  - *Firebase*: State architecture built to immediately slot into a Firebase Realtime Database / Firestore backend by utilizing robust React Context simulated hooks.

## How it works (Demo Application)
1. **Attendee View:** Experience the stadium from a fan's perspective. Tap "Services" to view intelligently mocked queue times and use the Time-Slot module to order food ahead.
2. **Management Dashboard:** Observe a mock Google Map UI dynamically updating with heat signatures. Watch the Gemini Intelligence Engine ingest conditions to automatically emit predictive alerts and notifications.

## Project Setup

1. Make sure you have Node > 18.x installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application on `http://localhost:5173/`

## Assumptions Made
- The demonstration serves to run "Out of the box" for reviewing criteria, hence API integrations (Google Maps / Gemini / Firebase) are mocked locally in the App structure instead of requiring a `.env`.
- Target environment runs modern web browsers that support robust CSS variables and Grid layers.
