# LunchCode

A local, LeetCode-like application for focused coding practice. Test your solutions in multiple languages, track your progress with an interactive dashboard, and pick up right where you left off. All your data stays on your machine.

## ✨ Features

- **Multi-Language Playground**: Write and execute code in JavaScript, Python, and Java, with a secure local backend providing instant feedback.
- **Advanced Code Editor**: Powered by Monaco (the engine behind VS Code), featuring syntax highlighting and optional Vim/Emacs keybindings.
- **Progress Dashboard**: Get a clear view of your progress with stats on solved problems and a breakdown by difficulty.
- **Success Rate by Tag**: Identify your strengths and weaknesses with a sortable and paginated view of your success rates per tag.
- **Persistent Sessions**: Your last code attempt for each problem and language is automatically saved. The app also remembers your last-used language globally.
- **100% Local**: All problems, submissions, and progress data are stored in your browser's local storage. No internet connection required after setup.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Redux Toolkit
- **Backend**: Node.js, Express
- **Code Editor**: Monaco Editor
- **Local Storage**: Data persisted via Browser LocalStorage API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- Java Development Kit (JDK) (for Java code execution)

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naubull2/LunchCode.git
   cd LunchCode
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Run the development servers:**
   - In one terminal, start the frontend (React app):
     ```bash
     npm run dev
     ```
   - In another terminal, start the backend (code execution engine):
     ```bash
     npm run server
     ```

5. **Open the app:**
   Navigate to `http://localhost:3000` in your browser.
