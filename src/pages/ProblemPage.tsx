import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useKeyMapping } from '../utils/KeyMappingContext';
import MainLayout from '../components/layout/MainLayout';
import ProblemView from '../components/problems/ProblemView';
import CodeEditor from '../components/editor/CodeEditor';
import { getProblemById, saveSubmission, markProblemAsSolved, saveLastCode, getLastCode, saveLastLanguage, getLastLanguage } from '../data/problemsData';
import { executeCode } from '../services/codeExecutionService';

const ProblemPage: React.FC = () => {
  const { theme } = useTheme();
  const { keyMapping, setKeyMapping } = useKeyMapping();
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState<any>(null);
  const [language, setLanguage] = useState(() => getLastLanguage() || 'javascript');
  const [code, setCode] = useState('');

  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  


  // Fetch problem data based on URL param
  useEffect(() => {
    if (problemId) {
      const problemData = getProblemById(problemId);
      if (problemData) {
        setProblem(problemData);
        // Initialize with default code for the selected language
        if (problemData.starterCode && problemData.starterCode[language]) {
          setCode(problemData.starterCode[language]);
        }
      } else {
        // Problem not found, redirect to problems list
        navigate('/');
      }
    }
  }, [problemId, navigate, language]);
  
  useEffect(() => {
    if (problemId) {
      const lastCode = getLastCode(problemId, language);
      setCode(lastCode || problem?.starterCode[language] || '');
    }
  }, [language, problemId, problem]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    saveLastLanguage(newLanguage);
    if (problem?.starterCode && problem.starterCode[newLanguage]) {
      const lastCode = getLastCode(problem.id, newLanguage);
      setCode(lastCode || problem.starterCode[newLanguage]);
    }
  };
  
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };


  
  const handleRun = async () => {
    if (!problem) return;

    setIsRunning(true);
    setOutput({ type: 'info', message: 'Running your code...' });

    try {
      const testCasesFromExamples = problem.examples.map((ex: any) => {
        // This is a hacky parser for the 'two-sum' problem's string examples.
        // A more robust solution would be to have structured examples in problemsData.ts
        if (problem.id === 'two-sum') {
          const [numsStr, targetStr] = ex.input.split(', target = ');
          const nums = JSON.parse(numsStr.split(' = ')[1]);
          const target = parseInt(targetStr, 10);
          return { input: { nums, target }, expected: JSON.parse(ex.output) };
        } else if (problem.id === 'is-palindrome') {
          const x = parseInt(ex.input.split(' = ')[1], 10);
          return { input: x, expected: ex.output === 'true' };
        }
        // Fallback for other problems - assumes examples are already structured
        return ex;
      });

      saveLastCode(problem.id, language, code);
      saveLastLanguage(language);
      const result = await executeCode({
        language,
        code,
        testCases: testCasesFromExamples,
        problemId: problem.id,
      });
      setOutput({ type: 'run', data: result });
    } catch (error: any) {
      setOutput({ type: 'error', message: error.message || 'Failed to execute code.' });
    }

    setIsRunning(false);
  };
  
  const handleSubmit = async () => {
    if (!problem) return;

    setIsSubmitting(true);
    setOutput({ type: 'info', message: 'Evaluating your solution...' });

    try {
      saveLastCode(problem.id, language, code);
      saveLastLanguage(language);
      const result = await executeCode({
        language,
        code,
        testCases: problem.testCases,
        problemId: problem.id,
      });

      setOutput({ type: 'submit', data: result });

      if (result.success) {
        markProblemAsSolved(problem.id);
      }
      saveSubmission(problem.id, language, code, result.success);
    } catch (error: any) {
      setOutput({ type: 'error', message: error.message || 'Failed to submit code.' });
    }

    setIsSubmitting(false);
  };
  
  // Loading state while fetching problem
  if (!problem) {
    return <MainLayout><div className="p-8">Loading problem...</div></MainLayout>;
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-13rem)] overflow-hidden">
        {/* Problem description panel */}
        <div className={`w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <ProblemView problem={problem} />
        </div>
        
        {/* Code editor panel */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col">
          <div className="h-2/3 border-b">
            <CodeEditor
              language={language}
              value={code}
              keyMapping={keyMapping}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          
          {/* Console/output panel */}
          <div className={`h-1/3 flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-3 flex justify-between items-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className={`px-4 py-1 rounded text-white ${isRunning ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className={`px-4 py-1 rounded text-white ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <div>
                <label htmlFor="key-mapping-select" className="sr-only">Key Mapping</label>
                <select 
                  id="key-mapping-select"
                  value={keyMapping}
                  onChange={(e) => setKeyMapping(e.target.value as 'default' | 'vim' | 'emacs')}
                  className={`px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}
                >
                  <option value="default">Default Keys</option>
                  <option value="vim">Vim</option>
                  <option value="emacs">Emacs</option>
                </select>
              </div>
            </div>
            <div className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
              <OutputDisplay output={output} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const OutputDisplay = ({ output }: { output: any }) => {
  if (!output) {
    return <div>Run your code to see the output here.</div>;
  }

  switch (output.type) {
    case 'info':
      return <div>{output.message}</div>;
    case 'error':
      return <div className="text-red-500">Error: {output.message}</div>;
    case 'run':
    case 'submit':
      if (!output.data || !output.data.results) {
        return <div className="text-red-500">Invalid response from server.</div>;
      }
      const { data } = output;
      return (
        <div>
          <h3 className={`font-bold text-lg mb-2 ${data.success ? 'text-green-500' : 'text-red-500'}`}>
            {output.type === 'submit' ? (data.success ? 'Accepted' : 'Wrong Answer') : 'Run Finished'}
          </h3>
          {data.results.map((res: any, index: number) => (
            <div key={index} className="mb-4 p-2 border-l-4 bg-opacity-20 rounded-r-md bg-gray-500 border-gray-400">
              <p className="font-semibold">Test Case {index + 1}</p>
              <p>Input: <span className="font-mono">{JSON.stringify(res.input)}</span></p>
              {res.error ? (
                <p className="text-red-400">Error: {res.error.name} - {res.error.message}</p>
              ) : (
                <>
                  <p>Expected: <span className="font-mono">{JSON.stringify(res.expected)}</span></p>
                  <p>Your Output: <span className="font-mono">{JSON.stringify(res.actual)}</span></p>
                  <p>Result: {res.passed ? <span className="text-green-400">✓ Passed</span> : <span className="text-red-400">✗ Failed</span>}</p>
                </>
              )}
            </div>
          ))}
        </div>
      );
    default:
      return <div>{JSON.stringify(output, null, 2)}</div>;
  }
};

export default ProblemPage;
