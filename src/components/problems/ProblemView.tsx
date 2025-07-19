import React from 'react';
import { useTheme } from '../../utils/ThemeContext';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  examples: Example[];
  constraints: string[];
}

interface ProblemViewProps {
  problem: Problem;
}

const ProblemView: React.FC<ProblemViewProps> = ({ problem }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-4 overflow-y-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{problem.title}</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          problem.difficulty === 'Easy' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : problem.difficulty === 'Medium'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {problem.difficulty}
        </div>
      </div>
      
      <div className="mb-4">
        {problem.tags.map((tag) => (
          <span key={tag} className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${
            theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
          }`}>
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mb-6">
        <p className="whitespace-pre-line">{problem.description}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Examples:</h3>
        {problem.examples.map((example, index) => (
          <div key={index} className={`mb-4 p-3 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="mb-2">
              <span className="font-medium">Input: </span>
              <code className="font-mono">{example.input}</code>
            </div>
            <div className="mb-2">
              <span className="font-medium">Output: </span>
              <code className="font-mono">{example.output}</code>
            </div>
            {example.explanation && (
              <div>
                <span className="font-medium">Explanation: </span>
                <span>{example.explanation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Constraints:</h3>
        <ul className="list-disc pl-5">
          {problem.constraints.map((constraint, index) => (
            <li key={index} className="mb-1">
              <code className="font-mono">{constraint}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemView;
