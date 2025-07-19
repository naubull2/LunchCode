# LunchCode

A locally-hosted LeetCode-like application for practicing coding problems with custom problem sets.

## Features

- **Custom Problem Sets**: Create and manage your own problems with test cases and evaluation logic
- **Multiple Language Support**: 
  - Python 3
  - JavaScript
  - Java
  - C/C++
- **Code Editor**:
  - Syntax highlighting
  - Light and dark themes
  - Code execution and testing
  - Real-time feedback
- **Problem Management**:
  - Tagging system for organizing problems by topic, difficulty, etc.
  - Bookmark favorite problems
  - Track solved/unsolved status
- **Progress Tracking**:
  - Checklist functionality
  - Save and load progress locally
  - Reset/restart options for practice
- **Fully Local**: No cloud dependencies, everything runs in your browser and stores data locally

## Technology Stack

### Frontend
- **React**: For building the user interface components
- **TypeScript**: For type-safe code
- **Monaco Editor**: The code editor that powers VS Code, for a professional IDE experience
- **TailwindCSS**: For styling and theme support
- **Redux**: For state management

### Backend (Local)
- **Node.js with Express**: Lightweight server to run code execution
- **Docker** (optional): For secure code execution in isolated containers

### Storage
- **IndexedDB/LocalStorage**: For client-side storage of problems and progress
- **JSON files**: For storing problem sets and test cases

### Code Execution
- **Compiler/Interpreter Integration**:
  - Python: via pyodide (WebAssembly) or local Node.js child process
  - JavaScript: Direct evaluation or Node.js
  - Java: Using either a local JDK or potentially WebAssembly solutions
  - C/C++: Using either local compilers or WebAssembly options

## Getting Started

### Prerequisites
- Node.js and npm
- Modern web browser
- (Optional) Docker for secure code execution

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Start the development server with `npm start`

## Project Roadmap

### Phase 1: Basic Setup
- [ ] Project scaffolding with React and TypeScript
- [ ] Basic UI layout resembling LeetCode
- [ ] Problem display component
- [ ] Code editor integration (Monaco)
- [ ] Light/dark theme implementation

### Phase 2: Core Functionality
- [ ] Problem set data structure design
- [ ] Local storage implementation
- [ ] Code execution for JavaScript
- [ ] Test case evaluation
- [ ] Problem submission and validation

### Phase 3: Additional Languages
- [ ] Python integration
- [ ] Java integration
- [ ] C/C++ integration

### Phase 4: Advanced Features
- [ ] Tagging and bookmarking system
- [ ] Progress tracking
- [ ] Checklist functionality
- [ ] Performance metrics
- [ ] Difficulty ratings

### Phase 5: Polishing
- [ ] UI/UX improvements
- [ ] Performance optimizations
- [ ] Offline support
- [ ] Export/import functionality for problem sets

## Problem Format

Problems will be stored in a structured format, including:

```json
{
  "id": "unique-problem-id",
  "title": "Two Sum",
  "difficulty": "Easy",
  "tags": ["Array", "Hash Table"],
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "examples": [
    {
      "input": "[2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "constraints": [
    "2 <= nums.length <= 104",
    "-109 <= nums[i] <= 109",
    "-109 <= target <= 109",
    "Only one valid answer exists."
  ],
  "testCases": [
    {
      "input": {"nums": [2,7,11,15], "target": 9},
      "expected": [0,1]
    },
    {
      "input": {"nums": [3,2,4], "target": 6},
      "expected": [1,2]
    }
  ],
  "solutions": {
    "python3": "def twoSum(nums, target):\n    # Solution code here\n    pass",
    "javascript": "function twoSum(nums, target) {\n    // Solution code here\n}",
    "java": "public int[] twoSum(int[] nums, int target) {\n    // Solution code here\n    return null;\n}",
    "cpp": "vector<int> twoSum(vector<int>& nums, int target) {\n    // Solution code here\n    return {};\n}"
  }
}
```

## Contributing

Guidelines for contributing to the project will be added soon.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
