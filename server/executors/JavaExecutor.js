const { spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'Runner.java');
const JSON_JAR_PATH = path.join(__dirname, '..', 'lib', 'json-20231013.jar');

class JavaExecutor {
  async execute({ executionId, code, testCases, timeLimit, problemId }) {
    const executionDir = path.join(TEMP_DIR, executionId);
    const solutionPath = path.join(executionDir, 'Solution.java');
    const runnerPath = path.join(executionDir, 'Main.java');

    try {
      await fs.mkdir(executionDir, { recursive: true });

      const runnerTemplate = await fs.readFile(TEMPLATE_PATH, 'utf-8');
      const funcName = problemId.replace(/-(\w)/g, (_, c) => c.toUpperCase());
      const runnerCode = runnerTemplate.replace('%%FUNCNAME%%', funcName);

      await fs.writeFile(solutionPath, code);
      await fs.writeFile(runnerPath, runnerCode);

      await this.compile(runnerPath, solutionPath, executionDir);

      const output = await this.run(executionDir, testCases, timeLimit);

      return JSON.parse(output);

    } catch (error) {
      console.error(`[${executionId}] Java execution failed:`, error);
      return {
        success: false,
        error: 'Java execution failed.',
        details: error.message,
      };
    } finally {
      await fs.rm(executionDir, { recursive: true, force: true });
    }
  }

  compile(runnerPath, solutionPath, cwd) {
    return new Promise((resolve, reject) => {
      const javac = spawn('javac', ['-cp', JSON_JAR_PATH, '-Xlint:none', runnerPath, solutionPath], { cwd });
      let error = '';

      javac.stderr.on('data', (data) => {
        error += data.toString();
      });

      javac.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Compilation failed with code ${code}:\n${error}`));
        }
      });
    });
  }

  run(cwd, testCases, timeLimit) {
    return new Promise((resolve, reject) => {
      const java = spawn('java', ['-cp', `.${path.delimiter}${JSON_JAR_PATH}`, 'Main'], { cwd });
      let output = '';
      let error = '';

      const timer = setTimeout(() => {
        java.kill();
        reject(new Error(`Execution timed out after ${timeLimit}ms`));
      }, timeLimit);

      java.stdout.on('data', (data) => {
        output += data.toString();
      });

      java.stderr.on('data', (data) => {
        error += data.toString();
      });

      java.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Execution failed with code ${code}:\n${error}`));
        }
      });

      const testCasesString = testCases.map(JSON.stringify).join('\n');
      java.stdin.write(testCasesString);
      java.stdin.end();
    });
  }
}

module.exports = JavaExecutor;
