import { useState, useEffect } from 'react';

// Define Problem interface
export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  examples: Array<{ input: string, output: string, explanation?: string }>;
  constraints: string[];
  testCases: Array<{ input: any, expected: any }>;
  starterCode: Record<string, string>;
  solutions: Record<string, string>;
}

// Since we can't directly read from the file system in the browser,
// we'll use dynamic imports for our problem files
const problemIds = ['two-sum', 'palindrome-number'];

// Helper function to load a single problem
async function loadProblem(id: string): Promise<Problem | null> {
  try {
    // Import metadata
    const metadata = await import(`./problems/${id}/metadata.json`);
    
    // Import markdown description as text
    const descriptionModule = await import(`./problems/${id}/description.md?raw`);
    const description = descriptionModule.default;
    
    // Import test cases
    const testCases = await import(`./problems/${id}/test-cases.json`);
    
    // Import starter code for each language
    const jsStarterModule = await import(`./problems/${id}/solutions/javascript.js?raw`);
    const pythonStarterModule = await import(`./problems/${id}/solutions/python.py?raw`);
    const javaStarterModule = await import(`./problems/${id}/solutions/java.java?raw`);
    const cppStarterModule = await import(`./problems/${id}/solutions/cpp.cpp?raw`);
    
    // Combine everything into a Problem object
    return {
      ...metadata,
      content: description,
      examples: metadata.examples || [],
      constraints: metadata.constraints || [],
      testCases: testCases.default,
      starterCode: {
        javascript: jsStarterModule.default,
        python: pythonStarterModule.default,
        java: javaStarterModule.default,
        cpp: cppStarterModule.default
      },
      solutions: {
        javascript: jsStarterModule.default, // In a real app, these would be separate solution files
        python: pythonStarterModule.default,
        java: javaStarterModule.default,
        cpp: cppStarterModule.default
      }
    };
  } catch (error) {
    console.error(`Error loading problem ${id}:`, error);
    return null;
  }
}

// Custom hook to load all problems
export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProblems() {
      try {
        const loadedProblems = await Promise.all(
          problemIds.map(id => loadProblem(id))
        );
        
        // Filter out any problems that failed to load
        setProblems(loadedProblems.filter(p => p !== null) as Problem[]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load problems'));
        setLoading(false);
      }
    }

    loadProblems();
  }, []);

  return { problems, loading, error };
}

// Function to get a single problem by ID
export function useProblem(id: string) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const loadedProblem = await loadProblem(id);
        setProblem(loadedProblem);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to load problem ${id}`));
        setLoading(false);
      }
    }

    fetchProblem();
  }, [id]);

  return { problem, loading, error };
}

// User progress functions
const USER_PROGRESS_KEY = 'lunchcode_user_progress';

interface UserProgress {
  solvedProblems: Record<string, boolean>;
  submissions: Record<string, {
    language: string;
    code: string;
    timestamp: number;
  }[]>;
}

// Load user progress from localStorage
export function getUserProgress(): UserProgress {
  const savedProgress = localStorage.getItem(USER_PROGRESS_KEY);
  
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  
  return {
    solvedProblems: {},
    submissions: {}
  };
}

// Save submission and update progress
export function saveSubmission(problemId: string, language: string, code: string): void {
  const progress = getUserProgress();
  
  if (!progress.submissions[problemId]) {
    progress.submissions[problemId] = [];
  }
  
  progress.submissions[problemId].push({
    language,
    code,
    timestamp: Date.now()
  });
  
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
}

// Mark a problem as solved
export function markProblemAsSolved(problemId: string): void {
  const progress = getUserProgress();
  progress.solvedProblems[problemId] = true;
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
}

// Check if a problem is solved
export function isProblemSolved(problemId: string): boolean {
  const progress = getUserProgress();
  return !!progress.solvedProblems[problemId];
}

// Reset progress for a problem
export function resetProblemProgress(problemId: string): void {
  const progress = getUserProgress();
  delete progress.solvedProblems[problemId];
  delete progress.submissions[problemId];
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
}

// Get latest submission for a problem
export function getLatestSubmission(problemId: string, language: string): string | null {
  const progress = getUserProgress();
  
  if (!progress.submissions[problemId] || progress.submissions[problemId].length === 0) {
    return null;
  }
  
  // Filter by language and get the most recent
  const languageSubmissions = progress.submissions[problemId]
    .filter(sub => sub.language === language)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  return languageSubmissions.length > 0 ? languageSubmissions[0].code : null;
}

// For backward compatibility with existing code
export function getProblemById(id: string): Problem | null {
  // This is a synchronous version just for compatibility
  // In real use, we should switch to the async hook version
  const savedProblems = localStorage.getItem('lunchcode_cached_problems');
  if (savedProblems) {
    const problems = JSON.parse(savedProblems);
    return problems.find((p: Problem) => p.id === id) || null;
  }
  return null;
}
