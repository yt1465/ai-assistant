# StudyGemini 🚀
### AI-Powered Topic Explainer, Interactive Quiz & 3D Flashcards

**StudyGemini** is a modern, responsive web application that turns any topic into a complete interactive study kit powered by the **Google Gemini API** (`gemini-3.8-flash`).

* **GitHub Repository:** [https://github.com/yt1465/ai-assistant](https://github.com/yt1465/ai-assistant)
* **Live Website (GitHub Pages):** [https://yt1465.github.io/ai-assistant/](https://yt1465.github.io/ai-assistant/)

---

## ✨ Features

1. **📖 Rich Concept Explanation**
   * **Structured Markdown Guide**: Comprehensive breakdowns, headings, bold key concepts, and real-world mechanisms.
   * **Intuitive Real-World Analogy**: Makes abstract concepts click immediately.
   * **Numbered Key Takeaways**: Core insights for quick review.
   * **Key Vocabulary & Definitions**: Expandable glossary terms.
   * **Audio Player (Text-to-Speech)**: Listen to the explanation hands-free.
   * **1-Click Copy & Print / PDF Export**: Formatted for clean note-taking and printing.

2. **🎯 Interactive Knowledge Quiz**
   * Multiple-choice questions with 4 options each.
   * **Instant Feedback**: Green for correct answers, red for mistakes.
   * **"💡 Reveal Answer" Button**: Instantly view the correct answer and detailed explanation anytime.
   * **Score Tracker & Results Summary**: Mastery percentage, achievement badges, and celebratory confetti.
   * **Retake & Practice Mode**: Re-test anytime.

3. **🗂️ Interactive 3D Flashcards**
   * Realistic 3D flip card animations (click or press `Space`).
   * Keyboard shortcuts: `Space` to flip, `←` / `→` arrow keys to navigate.
   * **Category Tags & Hints**: Memory cues when you're stuck.
   * **Mastery Tracker**: Mark cards as mastered with a live progress bar.
   * **Shuffle Deck**: Re-order cards for spaced repetition.
   * **Deck Mode & Grid Mode**: Switch between focused single-card study and a birds-eye grid view.

4. **⚡ Seamless Experience & Gemini API**
   * Powered by **Gemini 3.8 Flash** (`gemini-3.8-flash`), with support for `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, and `gemini-1.5-pro`.
   * **Smart Knowledge Fallback**: If offline or without an API key, it generates a comprehensive study kit for any topic instantly.
   * **Saved History**: Revisit previously generated topics from the slide-out history drawer without re-calling the API.
   * **Dark / Light Mode**: Beautiful modern aesthetic with Tailwind CSS and glassmorphism.
   * **Zero Dependencies**: Pure HTML5, CSS, and modern JavaScript—runs right in any browser!

---

## 🚀 How to Run Locally

### Method 1: Double-Click
Double-click `run.bat` or open `index.html` directly in your browser (Google Chrome, Microsoft Edge, Brave, Firefox, etc.).

### Method 2: Local Web Server (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
Starts a local server at `http://localhost:5050` and automatically opens your default browser.

---

## 🌐 Deploy to GitHub Pages (Live in 30 Seconds)

1. Open your repository: [https://github.com/yt1465/ai-assistant](https://github.com/yt1465/ai-assistant)
2. Click **"uploading an existing file"** (or **Add file** -> **Upload files**).
3. Drag and drop all project files (`index.html`, `app.js`, `style.css`, `sample-data.js`, `README.md`, `.gitignore`, `.github`).
4. Click **"Commit changes"**.
5. Go to **Settings** -> **Pages** -> under *Branch*, select `main` and folder `/ (root)` -> click **Save**.
6. Your site is live at: **[https://yt1465.github.io/ai-assistant/](https://yt1465.github.io/ai-assistant/)**

---

## 🔑 Getting a Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google Account and click **"Create API key"**.
3. In StudyGemini, click **"Set Gemini Key"** in the top navbar, paste your key, and click **"Save Settings"**.
*(Note: Your API key is stored securely in your browser's `localStorage` and is never sent to any third-party server.)*
