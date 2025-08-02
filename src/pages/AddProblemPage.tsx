import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';

interface ProblemMetadata {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
}

interface StarterCode {
  javascript: string;
  python: string;
  java: string;
  cpp: string;
}

interface TestCase {
  input: any;
  expected: any;
}

const AddProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'metadata' | 'starter' | 'tests'>('metadata');
  const [activeLanguage, setActiveLanguage] = useState<keyof StarterCode>('javascript');

  // Form state
  const [metadata, setMetadata] = useState<ProblemMetadata>({
    id: '',
    title: '',
    difficulty: 'Easy',
    tags: [],
    description: '',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: ['']
  });

  const [starterCode, setStarterCode] = useState<StarterCode>({
    javascript: `/**
 * @param {type} param
 * @return {type}
 */
function problemName(param) {
    // Write your code here
    
}`,
    python: `def problem_name(param):\n    # Write your code here\n    pass`,
    java: `class Solution {\n    public ReturnType problemName(ParamType param) {\n        // Write your code here\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    ReturnType problemName(ParamType param) {\n        // Write your code here\n        \n    }\n};`
  });

  // Store test cases as plain text strings for better UX
  const [devTestsText, setDevTestsText] = useState<string[]>([
    '{ "nums": [2, 7, 11, 15], "target": 9 }', // input
    '[0, 1]' // expected
  ]);

  const [submitTestsText, setSubmitTestsText] = useState<string[]>([
    '{ "nums": [3, 2, 4], "target": 6 }', // input  
    '[1, 2]' // expected
  ]);

  const [newTag, setNewTag] = useState('');

  // Generate problem ID from title
  const generateId = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change and auto-generate ID
  const handleTitleChange = (title: string) => {
    setMetadata(prev => ({
      ...prev,
      title,
      id: generateId(title)
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add example
  const addExample = () => {
    setMetadata(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  // Add constraint
  const addConstraint = () => {
    setMetadata(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  // Add test case (adds two strings: input and expected)
  const addTestCase = (type: 'dev' | 'submit') => {
    if (type === 'dev') {
      setDevTestsText(prev => [...prev, '{}', 'null']);
    } else {
      setSubmitTestsText(prev => [...prev, '{}', 'null']);
    }
  };

  // Submit problem
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Parse plain text strings into TestCase objects
      const devTests: TestCase[] = [];
      const submitTests: TestCase[] = [];
      
      // Parse dev tests (pairs of input/expected strings)
      for (let i = 0; i < devTestsText.length; i += 2) {
        if (i + 1 < devTestsText.length) {
          try {
            const input = JSON.parse(devTestsText[i]);
            const expected = JSON.parse(devTestsText[i + 1]);
            devTests.push({ input, expected });
          } catch (error) {
            alert(`Error parsing dev test case ${Math.floor(i/2) + 1}: ${error}`);
            return;
          }
        }
      }
      
      // Parse submit tests (pairs of input/expected strings)
      for (let i = 0; i < submitTestsText.length; i += 2) {
        if (i + 1 < submitTestsText.length) {
          try {
            const input = JSON.parse(submitTestsText[i]);
            const expected = JSON.parse(submitTestsText[i + 1]);
            submitTests.push({ input, expected });
          } catch (error) {
            alert(`Error parsing submit test case ${Math.floor(i/2) + 1}: ${error}`);
            return;
          }
        }
      }

      const problemData = {
        metadata,
        starterCode,
        devTests,
        submitTests
      };

      const response = await fetch('/api/problems/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Problem created successfully:', result);
        navigate(`/problems/${metadata.id}`);
      } else {
        const error = await response.json();
        alert(`Error creating problem: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('Failed to create problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { key: 'javascript' as const, name: 'JavaScript', ext: 'js' },
    { key: 'python' as const, name: 'Python', ext: 'py' },
    { key: 'java' as const, name: 'Java', ext: 'java' },
    { key: 'cpp' as const, name: 'C++', ext: 'cpp' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Problem
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Design a new coding problem with starter code, test cases, and metadata
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'metadata', name: 'Problem Info', icon: '📝' },
                { key: 'starter', name: 'Starter Code', icon: '💻' },
                { key: 'tests', name: 'Test Cases', icon: '🧪' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Title and ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={metadata.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Two Sum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Problem ID (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={metadata.id}
                      onChange={(e) => setMetadata(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="two-sum"
                    />
                  </div>
                </div>

                {/* Difficulty and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={metadata.difficulty}
                      onChange={(e) => setMetadata(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {metadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Array, Hash Table, etc."
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Problem Description (Markdown supported)
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`..."
                  />
                </div>

                {/* Examples */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Examples
                  </label>
                  {metadata.examples.map((example, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-md p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Input
                          </label>
                          <input
                            type="text"
                            value={example.input}
                            onChange={(e) => {
                              const newExamples = [...metadata.examples];
                              newExamples[index].input = e.target.value;
                              setMetadata(prev => ({ ...prev, examples: newExamples }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="nums = [2,7,11,15], target = 9"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Output
                          </label>
                          <input
                            type="text"
                            value={example.output}
                            onChange={(e) => {
                              const newExamples = [...metadata.examples];
                              newExamples[index].output = e.target.value;
                              setMetadata(prev => ({ ...prev, examples: newExamples }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="[0,1]"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Explanation (optional)
                        </label>
                        <textarea
                          value={example.explanation || ''}
                          onChange={(e) => {
                            const newExamples = [...metadata.examples];
                            newExamples[index].explanation = e.target.value;
                            setMetadata(prev => ({ ...prev, examples: newExamples }));
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addExample}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Example
                  </button>
                </div>

                {/* Constraints */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Constraints
                  </label>
                  {metadata.constraints.map((constraint, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => {
                          const newConstraints = [...metadata.constraints];
                          newConstraints[index] = e.target.value;
                          setMetadata(prev => ({ ...prev, constraints: newConstraints }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="2 <= nums.length <= 10^4"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addConstraint}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Constraint
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Starter Code Tab */}
          {activeTab === 'starter' && (
            <div className="p-6">
              {/* Language Tabs */}
              <div className="mb-4">
                <div className="flex space-x-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => setActiveLanguage(lang.key)}
                      className={`px-4 py-2 rounded-md font-medium ${
                        activeLanguage === lang.key
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <Editor
                  height="500px"
                  language={activeLanguage === 'cpp' ? 'cpp' : activeLanguage}
                  theme="vs-dark"
                  value={starterCode[activeLanguage]}
                  onChange={(value) => {
                    setStarterCode(prev => ({
                      ...prev,
                      [activeLanguage]: value || ''
                    }));
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 2,
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          )}

          {/* Test Cases Tab */}
          {activeTab === 'tests' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dev Tests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Development Tests (Visible to Users)
                  </h3>
                  {/* Render test case pairs (input + expected) */}
                  {Array.from({ length: Math.ceil(devTestsText.length / 2) }, (_, testIndex) => {
                    const inputIndex = testIndex * 2;
                    const expectedIndex = testIndex * 2 + 1;
                    return (
                      <div key={testIndex} className="border border-gray-200 dark:border-gray-600 rounded-md p-4 mb-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Input (Plain Text - JSON format)
                            </label>
                            <textarea
                              value={devTestsText[inputIndex] || '{}'}
                              onChange={(e) => {
                                const newTests = [...devTestsText];
                                newTests[inputIndex] = e.target.value;
                                setDevTestsText(newTests);
                              }}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                              placeholder='{ "nums": [2, 7, 11, 15], "target": 9 }'
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Expected Output (Plain Text - JSON format)
                            </label>
                            <textarea
                              value={devTestsText[expectedIndex] || 'null'}
                              onChange={(e) => {
                                const newTests = [...devTestsText];
                                newTests[expectedIndex] = e.target.value;
                                setDevTestsText(newTests);
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                              placeholder='[0, 1]'
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => addTestCase('dev')}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Dev Test Case
                  </button>
                </div>

                {/* Submit Tests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Submit Tests (Hidden Evaluation)
                  </h3>
                  {/* Render test case pairs (input + expected) */}
                  {Array.from({ length: Math.ceil(submitTestsText.length / 2) }, (_, testIndex) => {
                    const inputIndex = testIndex * 2;
                    const expectedIndex = testIndex * 2 + 1;
                    return (
                      <div key={testIndex} className="border border-gray-200 dark:border-gray-600 rounded-md p-4 mb-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Input (Plain Text - JSON format)
                            </label>
                            <textarea
                              value={submitTestsText[inputIndex] || '{}'}
                              onChange={(e) => {
                                const newTests = [...submitTestsText];
                                newTests[inputIndex] = e.target.value;
                                setSubmitTestsText(newTests);
                              }}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                              placeholder='{ "nums": [3, 2, 4], "target": 6 }'
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Expected Output (Plain Text - JSON format)
                            </label>
                            <textarea
                              value={submitTestsText[expectedIndex] || 'null'}
                              onChange={(e) => {
                                const newTests = [...submitTestsText];
                                newTests[expectedIndex] = e.target.value;
                                setSubmitTestsText(newTests);
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                              placeholder='[1, 2]'
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => addTestCase('submit')}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Submit Test Case
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !metadata.title || !metadata.id}
            className={`px-6 py-2 rounded-md font-medium ${
              isLoading || !metadata.title || !metadata.id
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Creating Problem...' : 'Create Problem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProblemPage;
