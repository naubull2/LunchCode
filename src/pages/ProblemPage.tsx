import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import MainLayout from '../components/layout/MainLayout';
import ProblemView from '../components/problems/ProblemView';
import CodeEditor from '../components/editor/CodeEditor';
import { getProblemById, saveSubmission, markProblemAsSolved } from '../data/problemsData';

const ProblemPage: React.FC = () => {
  const { theme } = useTheme();
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState<any>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [keyMapping, setKeyMapping] = useState('default');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load saved user preferences from localStorage
  useEffect(() => {
    const savedKeyMapping = localStorage.getItem('lunchcode_keyMapping');
    if (savedKeyMapping) {
      setKeyMapping(savedKeyMapping);
    }
  }, []);

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
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (problem?.starterCode && problem.starterCode[newLanguage]) {
      setCode(problem.starterCode[newLanguage]);
    }
  };
  
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleKeyMappingChange = (newKeyMapping: string) => {
    setKeyMapping(newKeyMapping);
    // Save the keymapping preference to localStorage
    localStorage.setItem('lunchcode_keyMapping', newKeyMapping);
  };
  
  const handleRunCode = () => {
    if (!problem) return;
    
    setIsRunning(true);
    setOutput('Running code...');
    
    // For demonstration, we're simulating code execution
    // In a real app, this would call your Node.js backend to execute the code
    setTimeout(() => {
      let resultOutput = '';
      problem.testCases.forEach((testCase: any, index: number) => {
        resultOutput += `Test Case ${index + 1}: \n`;
        resultOutput += `Input: ${JSON.stringify(testCase.input)}\n`;
        resultOutput += `Your Output: [Simulated]\n`;
        resultOutput += `Expected: ${JSON.stringify(testCase.expected)}\n`;
        resultOutput += `Result: ${Math.random() > 0.2 ? '✓' : '✗'}\n\n`;
      });
      
      setOutput(resultOutput);
      setIsRunning(false);
    }, 1500);
  };
  
  const handleSubmit = () => {
    if (!problem || !problemId) return;
    
    setIsSubmitting(true);
    setOutput('Submitting solution...');
    
    // Simulate submission evaluation
    setTimeout(() => {
      // Simulate a successful submission
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setOutput('All test cases passed!\n\nRuntime: 65 ms\nMemory Usage: 42.1 MB');
        // Save the submission and mark as solved
        saveSubmission(problemId, language, code);
        markProblemAsSolved(problemId);
      } else {
        setOutput('Failed test cases!\n\nTest Case 3: Input: {...}\nYour Output: [1,3]\nExpected: [1,2]\nResult: ✗');
      }
      
      setIsSubmitting(false);
    }, 2000);
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
              keyMapping={keyMapping as 'default' | 'vim' | 'emacs'}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              onKeyMappingChange={handleKeyMappingChange}
            />
          </div>
          
          {/* Console/output panel */}
          <div className={`h-1/3 flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-3 flex justify-between items-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <button
                  onClick={handleRunCode}
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
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
              {output || 'Run your code to see the output here.'}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProblemPage;
