const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PythonExecutor {
  async execute({ executionId, code, testCases, timeLimit, problemId }) {
    const tempDir = path.join(__dirname, '..', 'temp', executionId);
    const codeFilePath = path.join(tempDir, 'solution.py');
    const runnerFilePath = path.join(tempDir, 'runner.py');

    try {
      // 1. Create a temporary directory for the execution
      await fs.mkdir(tempDir, { recursive: true });

      // 2. Write the user's code to a file
      await fs.writeFile(codeFilePath, code);

      // 3. Create the Python runner script
      const runnerCode = this.generateRunnerCode(problemId);
      await fs.writeFile(runnerFilePath, runnerCode);

      // 4. Execute the runner script in a child process
      const output = await this.runScript(runnerFilePath, testCases, timeLimit);
      
      // 5. Parse and return the results
      return JSON.parse(output);

    } catch (error) {
      console.error(`[${executionId}] Python execution failed:`, error);
      return {
        success: false,
        error: 'Python execution failed.',
        details: error.message,
      };
    } finally {
      // 6. Clean up the temporary files
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  generateRunnerCode(problemId) {
    // Convert problem ID from kebab-case to snake_case for Python function name
    const funcName = problemId.replace(/-/g, '_');

    return `
import sys
import json
import traceback
from solution import ${funcName}

def run():
    test_cases = json.load(sys.stdin)
    results = []

    for case in test_cases:
        input_data = case.get('input')
        expected_output = case.get('expected')
        
        try:
            # Handle different input structures
            if isinstance(input_data, dict):
                # For keyword arguments, e.g., {'nums': [...], 'target': ...}
                actual_output = ${funcName}(**input_data)
            elif isinstance(input_data, list):
                # For positional arguments, e.g., [arg1, arg2]
                actual_output = ${funcName}(*input_data)
            else:
                # For a single argument, e.g., 121
                actual_output = ${funcName}(input_data)
            
            passed = (actual_output == expected_output)
            results.append({
                'input': input_data,
                'expected': expected_output,
                'actual': actual_output,
                'passed': passed
            })
        except Exception as e:
            results.append({
                'input': input_data,
                'expected': expected_output,
                'error': {
                    'name': type(e).__name__,
                    'message': str(e),
                    'traceback': traceback.format_exc()
                },
                'passed': False
            })

    all_passed = all(r.get('passed', False) for r in results)
    print(json.dumps({'success': all_passed, 'results': results}))

if __name__ == "__main__":
    run()
`;
  }

  runScript(scriptPath, testCases, timeLimit) {
    return new Promise((resolve, reject) => {
      const py = spawn('python3', [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });
      let output = '';
      let error = '';

      const timer = setTimeout(() => {
        py.kill('SIGKILL');
        reject(new Error('Execution timed out'));
      }, timeLimit);

      py.stdout.on('data', (data) => {
        output += data.toString();
      });

      py.stderr.on('data', (data) => {
        error += data.toString();
      });

      py.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Python script exited with code ${code}: ${error}`));
        }
      });

      py.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });

      // Pass test cases to the script via stdin
      py.stdin.write(JSON.stringify(testCases));
      py.stdin.end();
    });
  }
}

module.exports = PythonExecutor;
