# SafeKeep 

> **A high-end, premium digital curation and newsletter triage application.**

SafeKeep is an elegant, highly interactive web application designed to help users quickly and beautifully triage their email newsletters. Built with **Next.js 15**, **React**, and **Framer Motion**, it focuses on a premium "Vault Archive" design aesthetic, utilizing complex motion-driven interactions to make inbox zero feel satisfying and effortless.

## ✨ Features

- **Fluid Motion Architecture:** Comprehensive micro-interactions, optimistic UI updates, and smooth physics-based animations via Framer Motion.
- **Robust State Machine:** All interactions (e.g., Unsubscribe, Bulk Actions) are powered by a custom asynchronous state machine hook (`useCTAStateMachine`), seamlessly handling idle, loading, success, and error paths.
- **Premium Aesthetics:** Follows a strict "Vault Archive" design system with a refined monochrome palette, "Ghost Border" components, and sleek glassmorphism.
- **Optimistic UI:** Lightning-fast triage with zero-latency perceived actions; the app silently handles network requests in the background and rolls back gracefully on error.
- **Inbox Zero:** Satisfying empty states with slow-floating micro-animations.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS (Custom Vault Archive configurations)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Language:** TypeScript

## 📂 Project Structure

- `src/app/page.tsx`: The primary Newsletter Manager and triage interface.
- `src/app/RootClient.tsx`: The global state orchestrator handling Splash, Authentication, and Syncing phases.
- `src/hooks/useCTAStateMachine.ts`: The core logic managing resilient, optimistic asynchronous actions.
- `src/app/globals.css`: Contains the foundational design tokens.

## 📝 License

This project is licensed under the MIT License.
