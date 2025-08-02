import { loadProblemFromFiles, loadAllProblemsFromFiles } from './problemLoader';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
  expected: any;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
  solutions: Record<string, string>;
  starterCode: Record<string, string>;
}

// Cache for problems to avoid repeated loading
let problemsCache: Problem[] | null = null;

// Get all problems with caching
export const getProblems = async (): Promise<Problem[]> => {
  if (!problemsCache) {
    problemsCache = await loadAllProblemsFromFiles();
  }
  return problemsCache;
};

// Export the async problem loading functions from problemLoader
export { getProblemByIdFromFiles } from './problemLoader';

// User progress management
export interface Submission {
  language: string;
  code: string;
  timestamp: number;
  success: boolean;
}

export interface UserProgress {
  solvedProblems: Record<string, boolean>;
  submissions: Record<string, Submission[]>;
}

// Get user progress from local storage
export const getUserProgress = (): UserProgress => {
  const savedProgress = localStorage.getItem('lunchcode_user_progress');
  if (savedProgress) {
    try {
      return JSON.parse(savedProgress);
    } catch (e) {
      console.error('Error parsing saved progress', e);
    }
  }
  
  return {
    solvedProblems: {},
    submissions: {}
  };
};

// Clear user progress from local storage
export const clearUserProgress = (): void => {
  // 1. Clear the main progress object (submissions and solved status)
  localStorage.removeItem('lunchcode_user_progress');

  // 2. Clear all last saved codes for all problems
  localStorage.removeItem(LAST_CODE_KEY);

  // 3. Clear last used language
  localStorage.removeItem(LAST_LANGUAGE_KEY);
};  // Optionally, you might want to reload or update the state of the app after this

// Save user progress to local storage
export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem('lunchcode_user_progress', JSON.stringify(progress));
};

// ... (rest of the code remains the same)
// Mark a problem as solved
export const markProblemAsSolved = (problemId: string): void => {
  const progress = getUserProgress();
  progress.solvedProblems[problemId] = true;
  saveUserProgress(progress);
};

// --- Last Code Persistence ---

const LAST_CODE_KEY = 'lunchCode_lastCode';

export const saveLastCode = (problemId: string, language: string, code: string) => {
  try {
    const lastCodeData = JSON.parse(localStorage.getItem(LAST_CODE_KEY) || '{}');
    if (!lastCodeData[problemId]) {
      lastCodeData[problemId] = {};
    }
    lastCodeData[problemId][language] = code;
    localStorage.setItem(LAST_CODE_KEY, JSON.stringify(lastCodeData));
  } catch (error) {
    console.error('Failed to save last code:', error);
  }
};

export const getLastCode = (problemId: string, language: string): string | null => {
  try {
    const lastCodeData = JSON.parse(localStorage.getItem(LAST_CODE_KEY) || '{}');
    return lastCodeData[problemId]?.[language] || null;
  } catch (error) {
    console.error('Failed to get last code:', error);
    return null;
  }
};

// Save a submission
export const saveSubmission = (problemId: string, language: string, code: string, success: boolean): void => {
  const progress = getUserProgress();
  if (!progress.submissions[problemId]) {
    progress.submissions[problemId] = [];
  }
  
  progress.submissions[problemId].push({
    language,
    code,
    timestamp: Date.now(),
    success
  });
  
  saveUserProgress(progress);
};

// Check if a problem is solved
export const isProblemSolved = (problemId: string): boolean => {
  const progress = getUserProgress();
  return !!progress.solvedProblems[problemId];
};

// Reset all progress
// --- Language Persistence ---

const LAST_LANGUAGE_KEY = 'lunchCode_lastLanguage';

export const saveLastLanguage = (language: string): void => {
  try {
    localStorage.setItem(LAST_LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save last language:', error);
  }
};

export const getLastLanguage = (): string | null => {
  try {
    return localStorage.getItem(LAST_LANGUAGE_KEY);
  } catch (error) {
    console.error('Failed to get last language:', error);
    return null;
  }
};

export const resetAllProgress = (): void => {
  saveUserProgress({
    solvedProblems: {},
    submissions: {}
  });
};
