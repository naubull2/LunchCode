const { VM } = require('vm2');
const { v4: uuidv4 } = require('uuid');

class JavaScriptExecutor {
  async execute({ executionId, code, testCases, timeLimit, problemId }) {
    const results = [];
    let allTestsPassed = true;

    for (const testCase of testCases) {
      const vm = new VM({
        timeout: timeLimit,
        sandbox: {
          console: {
            log: (...args) => {
              // Capture console.log output if needed
            },
          },
        },
      });

      try {
        // Prepare the arguments for the function call
        const args = Array.isArray(testCase.input) 
          ? testCase.input.map(arg => JSON.stringify(arg)).join(',') 
          : JSON.stringify(testCase.input);

        // Convert problem ID from kebab-case to camelCase for the function name
        const funcName = problemId.replace(/-(\w)/g, (_, c) => c.toUpperCase());

        // Create the script to run
        const script = `
          ${code}

          if (typeof ${funcName} !== 'function') {
            throw new Error('Could not find the function ${funcName}. Make sure your solution has the correct function name.');
          }

          ${funcName}(${args});
        `;

        const result = vm.run(script);

        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
        if (!passed) {
          allTestsPassed = false;
        }

        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          passed,
        });

      } catch (error) {
        allTestsPassed = false;
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          },
          passed: false,
        });
      }
    }

    return {
      results,
      success: allTestsPassed,
    };
  }
}

module.exports = JavaScriptExecutor;
