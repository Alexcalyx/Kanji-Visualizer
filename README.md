# ✨ Kanji Visualizer ✨

Hey there! 👋 As someone learning Japanese myself (currently wrestling with Kanji for the JLPT!), I know how challenging remembering all those characters can be. I often found myself wishing for a more visual, less intimidating way to study them, especially the stroke orders and nuances.

So, I decided to build Kanji Visualizer! It started as a **personal project** primarily to **practice and deepen my React skills** (like using Hooks, Context, Framer Motion, and integrating external libraries), but the goal was always to create something genuinely useful for my own learning. As it grew, I focused on making it an engaging tool to explore Kanji by grade level, see detailed info, visualize stroke orders with animations, and even track progress.

My hope is that this tool makes the Kanji learning journey a little less daunting and maybe even a bit more fun for others too!

## 🚀 Live Demo

**[Check out the live version here!](https://kanji-visualizer.vercel.app/)** 

## Features

* **Browse by Grade:** Easily navigate Kanji based on the official Japanese school grades (G1 to G6).
* **Detailed Kanji Info:** Click on a Kanji to see its meanings, On'yomi and Kun'yomi readings, radical information, stroke count, example words, and sometimes a helpful hint.
* **Stroke Order Animations:** See exactly how each Kanji is written with cool video animations (or SVG diagrams).
* **Visually Appealing Grid:** A dynamic grid layout for Browse Kanji within a grade. Features interactive tiles with hover effects (like a neat tilt effect on desktop!).
* **Smooth Animations:** Fluid page transitions and animations throughout the app, thanks to Framer Motion.
* **Mobile Friendly:** Designed to look and work great on phones, tablets, and desktops. Includes a slick overlay menu for mobile navigation.
* **Pagination:** Handles large sets of Kanji efficiently with pagination controls.

## 🤔 How to Use

1.  **Visit the site:** Click the Live Demo link above.
2.  **Select a Grade:**
    * On **Desktop/Tablet:** Click one of the `G1` - `G6` links in the header.
    * On **Mobile:** Tap the hamburger menu icon (☰) in the header, then tap the desired grade link in the overlay menu.
3.  **Browse the Grid:** Scroll through the Kanji for that grade. Notice the checkmarks for ones marked as learned!
4.  **View Details:** Click/tap on any Kanji tile in the grid to navigate to its detailed information page.
5.  **Learn!** Explore the details, watch the stroke animation (click the video/image to play/pause), and hopefully learn some Kanji!

## 🛠️ Tech Stack

This project brings together some modern web technologies:

* **React:** The core library for building the user interface components.
* **Tailwind CSS:** Used extensively for styling. Makes responsive design and theming (like dark mode and those neon highlights) much more manageable with utility classes.
* **React Router:** Handles all the client-side routing, letting you navigate between the homepage, grade grids, and Kanji detail pages without full page reloads.
* **Framer Motion:** Provides the power behind all the slick animations – page transitions, grid item staggering, mobile menu slide-in, etc.
* **React Context API:** Used for managing global state, specifically the light/dark `ThemeContext` and the `ProgressContext` for tracking learned Kanji.
* **Vanilla Tilt:** Adds the cool 3D tilt effect on the Kanji grid items when you hover over them on desktop.
* **Lottie React:** Renders the smooth, scalable checkmark animation (`checkmark.json`) for learned Kanji.
* **Lucide React:** Used for clean and simple SVG icons (like the Search icon).
* **Custom React Hooks:** (`useKanjiList`, `useKanjiDetails`) Data fetching logic to talk to Kanji Alive API.

## Deployment

This project is deployed and hosted on **[Vercel](https://vercel.com/)**. Builds and deployments are automatically handled when changes are pushed to the main GitHub branch.

## 🙏 Credits & License

 **"Learn to read and write Japanese kanji"**
* by **Kanji Alive**
* Sourced from: `https://rapidapi.com/KanjiAlive/api/learn-to-read-and-write-japanese-kanji`
* Licensed under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.
