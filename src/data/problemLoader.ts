import { Problem, TestCase } from './problemsData';
import { getAllStarterCode, STARTER_CODE_DATA } from './generatedStarterCode';

/**
 * Load a problem from its file structure by loading resources directly
 * @param problemId - The ID of the problem to load
 * @returns Promise<Problem | null> - The loaded problem or null if not found
 */
export const loadProblemFromFiles = async (problemId: string): Promise<Problem | null> => {
  try {
    // Load metadata
    const metadataModule = await import(`./problems/${problemId}/metadata.json`);
    const metadata = metadataModule.default;
    
    // Load dev test cases
    const devTestCases = await loadTestCases(problemId, 'dev');
    
    // Load submit test cases  
    const submitTestCases = await loadTestCases(problemId, 'submit');
    
    // Load solutions (embedded for now, but could be loaded from files later)
    const solutions = await loadSolutions(problemId);
    
    // Load starter code (embedded for now, but could be loaded from files later)
    const starterCode = await loadStarterCode(problemId);
    
    // Construct the Problem object
    const problem: Problem = {
      id: metadata.id,
      title: metadata.title,
      difficulty: metadata.difficulty,
      tags: metadata.tags,
      description: metadata.description,
      examples: metadata.examples,
      constraints: metadata.constraints,
      testCases: devTestCases, // Use dev tests for regular testing
      solutions,
      starterCode
    };
    
    // Add submit test cases as a custom property for evaluation
    (problem as any).submitTestCases = submitTestCases;
    
    return problem;
  } catch (error) {
    console.error(`Error loading problem ${problemId}:`, error);
    return null;
  }
};

/**
 * Load test cases for a specific problem and type
 * @param problemId - The ID of the problem
 * @param testType - 'dev' for development tests, 'submit' for evaluation tests
 * @returns Promise<TestCase[]> - Array of test cases
 */
export const loadTestCases = async (problemId: string, testType: 'dev' | 'submit'): Promise<TestCase[]> => {
  try {
    const testModule = await import(`./problems/${problemId}/${testType}-tests.json`);
    return testModule.default;
  } catch (error) {
    console.warn(`Failed to load ${testType} test cases for problem ${problemId}:`, error);
    return [];
  }
};

/**
 * Load solutions for a specific problem from solutions/ directory files
 * Note: Solutions are kept for future features like hints, validation, and learning modes
 * @param problemId - The ID of the problem
 * @returns Promise<Record<string, string>> - Solutions by language
 */
const loadSolutions = async (problemId: string): Promise<Record<string, string>> => {
  const solutions: Record<string, string> = {};
  
  // For now, return empty solutions object since solutions/ files aren't actively used yet
  // Future features could load from solutions/ directory for:
  // - Providing hints to users
  // - Auto-grading and validation  
  // - Showing optimal solutions after submission
  // - Educational/tutorial purposes
  
  console.log(`Solutions loading for ${problemId} - feature placeholder`);
  return solutions;
};

/**
 * Load starter code for a specific problem using build-time generated data
 * @param problemId - The ID of the problem
 * @returns Promise<Record<string, string>> - Starter code by language
 */
const loadStarterCode = async (problemId: string): Promise<Record<string, string>> => {
  // Use the build-time generated starter code data
  // This replaces all the hardcoded fallbacks and actually reads from starter/ files
  return getAllStarterCode(problemId);
};



/**
 * Load all available problems from the problems directory
 * @returns Promise<Problem[]> - Array of loaded problems
 */
export const loadAllProblemsFromFiles = async (): Promise<Problem[]> => {
  try {
    // Dynamically get problem IDs from the build-time generated starter code data
    // This replaces hardcoded arrays and automatically includes all problems with starter files
    const knownProblemIds = Object.keys(STARTER_CODE_DATA);
    
    const problems: Problem[] = [];
    
    for (const problemId of knownProblemIds) {
      const problem = await loadProblemFromFiles(problemId);
      if (problem) {
        problems.push(problem);
      }
    }
    
    return problems;
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

/**
 * Get available problem IDs dynamically from build-time generated data
 * @returns string[] - Array of problem IDs
 */
export const getAvailableProblemIds = (): string[] => {
  return Object.keys(STARTER_CODE_DATA);
};

/**
 * Cache for loaded problems to avoid repeated file reads
 */
let problemsCache: Problem[] | null = null;

/**
 * Get all problems with caching
 * @param forceReload - Whether to force reload from files
 * @returns Promise<Problem[]> - Array of problems
 */
export const getProblems = async (forceReload: boolean = false): Promise<Problem[]> => {
  if (!problemsCache || forceReload) {
    problemsCache = await loadAllProblemsFromFiles();
  }
  return problemsCache;
};

/**
 * Get a problem by ID with caching
 * @param id - Problem ID
 * @param forceReload - Whether to force reload from files
 * @returns Promise<Problem | undefined> - The problem or undefined if not found
 */
export const getProblemByIdFromFiles = async (id: string, forceReload: boolean = false): Promise<Problem | undefined> => {
  const problems = await getProblems(forceReload);
  return problems.find(p => p.id === id);
};
