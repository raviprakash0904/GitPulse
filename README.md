# GitPulse ⚡️

> ### 🌐 **Live Demo:** [https://git-pulse-wenn.vercel.app/](https://git-pulse-wenn.vercel.app/) 🚀

GitPulse is a premium, startup-grade **GitHub Developer Analytics & Repository Comparison Workbench** built for technical recruiters, open-source maintainers, and developer advocates. It provides visual insights into repository trajectories, developer footprints, and side-by-side repository comparisons, wrapped in a high-fidelity glassmorphic user interface.

---

## 🌟 Key Features

*   **🔍 Intelligent Search Hub (with Debounce)**: Instantly lookup repositories or developers using an elastic search bar that runs debounced API requests to conserve rate limits.
*   **📌 Workspace Pins (Saved Workspaces)**: Keep your active projects front and center. Pin repositories and developers directly to your dashboard workspace—fully persisted via `localStorage`.
*   **📊 Deep Repository Analytics**:
    *   📈 **Weekly Commit Speed**: 52-week activity curves rendered using beautiful interactive Area Charts.
    *   🍕 **Language Distribution**: Breakdown of codebases by programming language, colored dynamically by file sizes.
    *   👥 **Top Contributors**: Bar charts analyzing commit distributions and workload shares of core team members.
*   **⚔️ VS Mode (Comparison Workbench)**:
    *   Compare any two developers or repositories side-by-side.
    *   Dual-axis visualization overlays comparing commit histories.
    *   Dynamic win/loss metrics engine showing statistical advantages (stars, fork rates, issues density, code volume, age, and push velocity).
*   **👤 Comprehensive Developer Profiles**: Visualize public activity, language composition, follower dynamics, and a timeline of recent public developer events.
*   **🌓 Floating Theme Switcher**: Instantly toggle between a neon sunset dark mode (Stone Charcoal Black) and a clean pastel light mode (Warm Cream Orange). Features micro-animated sun/moon rotation transitions.
*   **🔑 API Health Rate & PAT Tracker**: Real-time GitHub API rate limit health bar that alerts you when close to the limit, allowing developers to inject their own Personal Access Token (PAT) securely on the client to unlock 5,000 requests/hour.

---

## 🛠️ Premium Tech Stack

*   **Framework**: [Next.js 15.5.18 (App Router)](https://nextjs.org/) ⚡️
*   **Language**: [TypeScript](https://www.typescriptlang.org/) 🛡️
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS variables 🎨
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with LocalStorage sync) 📦
*   **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/) (includes automatic retries, cache invalidation, and request deduplication) 📡
*   **Visualizations**: [Recharts](https://recharts.org/) 📈
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) ✨
*   **Icons**: [Lucide React](https://lucide.dev/) 🔮

---

## 📂 Project Structure

```bash
├── postcss.config.mjs     # Tailwind CSS v4 compiler settings
├── next.config.ts         # Next.js 15 config
├── tsconfig.json          # TypeScript config
├── package.json           # Scripts and dependencies
└── src
    ├── app
    │   ├── layout.tsx     # Global HTML shell (wraps navigation, alerts, theme provider)
    │   ├── page.tsx       # Search dashboard hub
    │   ├── globals.css    # Global CSS definitions & theme variables
    │   ├── compare        # Repository and developer comparison module
    │   ├── repo           # Repository analysis and statistics page
    │   └── user           # Developer footprint and timeline events
    ├── components
    │   ├── charts         # Interactive Recharts components (Area, Pie, Bar charts)
    │   ├── Header.tsx     # Glassmorphic responsive navigation
    │   ├── Providers.tsx  # React Query client & Hydration wrapper
    │   ├── ThemeToggle.tsx# Floating theme switch element
    │   └── ...            # Reuseable layout cards
    ├── hooks              # Custom hooks (debounce, api selectors)
    ├── services           # Axios configuration & GitHub endpoints
    ├── store              # Zustand state store
    └── utils              # Formatting helpers (bytes, numbers, dates)
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/raviprakash0904/GitPulse.git
cd GitPulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GITHUB_TOKEN=your_optional_github_token
```
*Note: A GitHub Personal Access Token (PAT) is optional but recommended to avoid getting rate-limited during heavy testing.*

### 4. Start local development server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🛡️ Production Build & Verification

To verify standard typechecking and generate an optimized production bundle:
```bash
npm run build
```

To run the production build locally:
```bash
npm run start
```

---

## 🚀 Vercel Deployment

This project is fully compatible with Vercel and deploys automatically on every push. You can deploy it yourself by linking your fork to Vercel:

1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Select the `GitPulse` repository.
3. Keep the build command as `npm run build` and output directory as `.next`.
4. (Optional) Provide `NEXT_PUBLIC_GITHUB_TOKEN` under Environment Variables.
5. Click **Deploy**.