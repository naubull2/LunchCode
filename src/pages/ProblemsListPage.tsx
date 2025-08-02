import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import MainLayout from '../components/layout/MainLayout';
import { getProblems, isProblemSolved, Problem } from '../data/problemsData';

// Define the problem interface we'll use for display
interface ProblemListItem {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  solved: boolean;
}

const ProblemsListPage: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Load problems asynchronously
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Transform problems with solved status when they load
  const [problemsList, setProblemsList] = useState<ProblemListItem[]>([]);
  
  // Load problems on component mount
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const loadedProblems = await getProblems();
        setProblems(loadedProblems);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load problems'));
      } finally {
        setLoading(false);
      }
    };
    
    loadProblems();
  }, []);
  
  useEffect(() => {
    if (problems && problems.length > 0) {
      const enhancedProblems = problems.map((problem: Problem) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        solved: isProblemSolved(problem.id)
      }));
      setProblemsList(enhancedProblems);
    }
  }, [problems]);
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(problemsList.flatMap(problem => problem.tags || []))
  );
  
  // Filter problems based on difficulty, search term, and tags
  const filteredProblems = problemsList.filter((problem) => {
    const matchesDifficulty = filter === 'all' || problem.difficulty.toLowerCase() === filter.toLowerCase();
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => problem.tags.includes(tag));
    
    return matchesDifficulty && matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Problems</h1>
          <Link
            to="/add-problem"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            Create Problem
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
          
          <div className="w-full md:w-2/3 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('easy')}
              className={`px-4 py-2 rounded ${
                filter === 'easy'
                  ? 'bg-green-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded ${
                filter === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilter('hard')}
              className={`px-4 py-2 rounded ${
                filter === 'hard'
                  ? 'bg-red-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className={`overflow-hidden rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <table className="min-w-full">
            <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Difficulty</th>
                <th className="p-3 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className={theme === 'dark' ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'}>
                  <td className="p-3">
                    <span className={problem.solved ? 'text-green-500' : 'text-gray-400'}>
                      {problem.solved ? '✓' : '○'}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link 
                      to={`/problems/${problem.id}`} 
                      className={`hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : problem.difficulty === 'Medium' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className={`px-2 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProblemsListPage;