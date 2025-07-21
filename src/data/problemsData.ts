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

// Sample problems data
export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expected: [0, 1]
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expected: [1, 2]
      },
      {
        input: { nums: [3, 3], target: 6 },
        expected: [0, 1]
      }
    ],
    solutions: {
      javascript: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        remaining = target - value
        if remaining in seen:
            return [seen[remaining], i]
        seen[value] = i
    return []`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`
    },
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
};`,
      python: `from typing import List

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
def two_sum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass
`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`
    }
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['Math'],
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\nFor example, 121 is a palindrome while 123 is not.',
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.'
      }
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    testCases: [
      {
        input: { x: 121 },
        expected: true
      },
      {
        input: { x: -121 },
        expected: false
      },
      {
        input: { x: 10 },
        expected: false
      }
    ],
    solutions: {
      javascript: `function isPalindrome(x) {
  if (x < 0) return false;
  
  // Convert to string and check
  const str = x.toString();
  return str === str.split('').reverse().join('');
}`,
      python: `def isPalindrome(x):
    if x < 0:
        return False
    
    # Convert to string and check
    return str(x) == str(x)[::-1]`,
      java: `public boolean isPalindrome(int x) {
    if (x < 0) return false;
    
    // Convert to string and check
    String str = Integer.toString(x);
    int left = 0, right = str.length() - 1;
    
    while (left < right) {
        if (str.charAt(left) != str.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}`,
      cpp: `bool isPalindrome(int x) {
    if (x < 0) return false;
    
    // Convert to string and check
    string s = to_string(x);
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}`
    },
    starterCode: {
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
    // Write your code here
    
};`,
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Write your code here
        pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        // Write your code here
        
    }
};`
    }
  }
];

// Helper function to get a problem by ID
export const getProblemById = (id: string): Problem | undefined => {
  return problems.find(p => p.id === id);
};

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

// Save user progress to local storage
export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem('lunchcode_user_progress', JSON.stringify(progress));
};

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
