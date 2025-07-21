const JavaScriptExecutor = require('./JavaScriptExecutor');
const PythonExecutor = require('./PythonExecutor');
const JavaExecutor = require('./JavaExecutor');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ExecutionEngine {
  constructor() {
    this.executors = new Map();
    this.initializeExecutors();
  }

  initializeExecutors() {
    // Register language executors
    this.executors.set('javascript', new JavaScriptExecutor());
    this.executors.set('python', new PythonExecutor());
    this.executors.set('java', new JavaExecutor());
    // this.executors.set('cpp', new CppExecutor());
  }

  async execute({ executionId, code, language, testCases, timeLimit, problemId }) {
    const executor = this.executors.get(language.toLowerCase());
    
    if (!executor) {
      return {
        success: false,
        error: `Language '${language}' is not supported`,
        supportedLanguages: Array.from(this.executors.keys())
      };
    }

    try {
      // Execute code with the appropriate executor
      const result = await executor.execute({
        executionId,
        code,
        testCases,
        timeLimit,
        problemId
      });

      return {
        success: true,
        executionId,
        language,
        ...result
      };

    } catch (error) {
      console.error(`[${executionId}] Execution failed:`, error);
      
      return {
        success: false,
        executionId,
        language,
        error: error.message || 'Code execution failed',
        details: {
          type: error.name || 'ExecutionError',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      };
    }
  }

  getSupportedLanguages() {
    return Array.from(this.executors.keys());
  }

  isLanguageSupported(language) {
    return this.executors.has(language.toLowerCase());
  }
}

module.exports = ExecutionEngine;
