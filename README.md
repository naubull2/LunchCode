# LunchCode
Your offline coding interview prep companion

LunchCode is a lightweight, self-hosted platform for practicing coding interview problems offline. Inspired by NeetCode and LeetCode, it focuses on providing a clean, distraction-free environment to help you master core problem-solving patterns.

## 🚀 Why LunchCode?
*   📦 **Self-contained & Offline**: Clone, install, and run locally. All your progress and submissions are saved in your browser.
*   🧑‍💻 **Multi-language Support**: A user interface that supports practicing in JavaScript, Python, Java, and C++.
*   📊 **Interactive Dashboard**: Track your progress with an overview of solved problems, success rates by tag, and a GitHub-style submission heatmap.
*   🌐 **Modern Browser-based UI**: A clean and responsive interface built with React and TailwindCSS.
*   🔁 **Focused Practice**: A curated set of problems to help you focus on key patterns.

## ✨ Features
*   **Problem Sets**: A collection of classic interview problems with descriptions, examples, and starter code.
*   **Advanced Code Editor**: Powered by Monaco (the engine behind VS Code), featuring syntax highlighting and optional Vim/Emacs keybindings.
*   **Progress Tracking**:
    *   View solved problems by difficulty.
    *   Analyze success rates by tag to find your strengths and weaknesses.
    *   Visualize your coding consistency with a daily submission heatmap.
*   **Persistent Sessions**: Your last code attempt for each problem and language is automatically saved.
*   **100% Local**: All data is stored in your browser's local storage.
*   **Light/Dark Mode**: Switch themes for comfortable viewing.

> *Note: Code execution currently only supported in Javascript, Java, Python. C++ support maybe in the future*

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/naubull2/LunchCode.git
    cd LunchCode
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    cd server
    npm install
    cd ..
    ```
    
3.  **Generate starter code (required):**
    ```bash
    node scripts/generateStarterCode.js
    ```
    *This step reads all starter code files from the problems directories and generates the embedded TypeScript content needed for the React app.*
    
4.  **Run the main server:**
    ```bash
    npm start
    ```
    In another shell, you should also start the backend server for code execution.
    ```bash
    cd server
    npm start
    ```

4.  **Open the app:**
    Access LunchCode in your browser at the URL provided (usually `http://localhost:3000`).

## 📁 Managing Local Problem Files

LunchCode stores problems as organized file structures in `src/data/problems/`. Understanding this structure helps you edit and maintain problems after creation.

### Problem Directory Structure

Each problem follows this organized structure:
```
src/data/problems/
├── problem-name/
│   ├── metadata.json          # Problem info, examples, constraints
│   ├── dev-tests.json         # Test cases visible to users ("Run" button)
│   ├── submit-tests.json      # Hidden evaluation tests ("Submit" button)
│   ├── starter/               # Starter code for each language
│   │   ├── javascript.js
│   │   ├── python.py
│   │   ├── java.java
│   │   └── cpp.cpp
│   └── solutions/             # Reference solutions (for future features)
│       ├── javascript.js
│       ├── python.py
│       ├── java.java
│       └── cpp.cpp
```

### Editing Problems Post-Creation

**Method 1: Direct File Editing (Recommended)**
1. Navigate to `src/data/problems/[problem-id]/`
2. Edit any file directly:
   - `metadata.json` - Update title, description, examples, constraints
   - `dev-tests.json` / `submit-tests.json` - Modify test cases
   - `starter/*.ext` - Update starter code for any language
   - `solutions/*.ext` - Update reference solutions
3. **Regenerate starter code data:**
   ```bash
   node scripts/generateStarterCode.js
   ```
4. **Restart the app** - Changes will be reflected immediately

**Method 2: Delete and Recreate via UI**
1. Delete the problem directory: `rm -rf src/data/problems/[problem-id]`
2. Regenerate starter code: `node scripts/generateStarterCode.js`
3. Use the "Create Problem" UI to recreate with new content

### Adding New Languages

To add support for a new programming language:
1. Add starter code file in `starter/` directory (e.g., `go.go`, `rust.rs`)
2. Add corresponding solution file in `solutions/` directory
3. Update the backend language support in `server/routes/problems.js`
4. Regenerate starter code: `node scripts/generateStarterCode.js`

### Troubleshooting

**Problem not appearing in app:**
- Ensure the problem directory structure is complete
- Run `node scripts/generateStarterCode.js`
- Restart both frontend and backend servers

**Changes not reflecting:**
- Always run `node scripts/generateStarterCode.js` after file edits
- Clear browser cache if needed
- Check browser console for errors

**Invalid JSON files:**
- Validate JSON syntax in `metadata.json`, `dev-tests.json`, `submit-tests.json`
- Use a JSON validator or your IDE's JSON validation features

### Best Practices

- **Backup before editing:** Copy problem directories before major changes
- **Test thoroughly:** Use both "Run" and "Submit" after modifications
- **Consistent naming:** Use kebab-case for problem IDs (e.g., `two-sum`, `valid-parentheses`)
- **Version control:** Commit changes to track problem evolution
- **Test case coverage:** Include edge cases in both dev and submit test sets

## 💡 Vision
You don’t need to solve 500+ problems to succeed in interviews. Master the key patterns, and you’ll adapt to any variation thrown at you.

LunchCode helps you do just that — efficiently, offline, and at your own pace.

## 📜 License
MIT License.

## 🙌 Contributing
Contributions are welcome! See `CONTRIBUTING.md` (to be added).

## 📫 Contact
For ideas or feedback, open an issue or reach out via GitHub Discussions.

Prep smarter. Practice offline. Ace your interviews. 🥗🍜
