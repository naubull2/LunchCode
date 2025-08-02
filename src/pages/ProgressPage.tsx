import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useTheme } from '../utils/ThemeContext';
import { getUserProgress, getProblems, Submission, Problem } from '../data/problemsData';
import SubmissionHeatmap from '../components/SubmissionHeatmap';

const ProgressPage: React.FC = () => {
  const { theme } = useTheme();
  const progress = getUserProgress();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load problems asynchronously
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const loadedProblems = await getProblems();
        setProblems(loadedProblems);
      } catch (error) {
        console.error('Failed to load problems in ProgressPage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProblems();
  }, []);

  // Calculate stats
  const totalProblems = problems.length;
  const solvedProblems = Object.keys(progress.solvedProblems).length;

  const solvedByDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  Object.keys(progress.solvedProblems).forEach(problemId => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      solvedByDifficulty[problem.difficulty]++;
    }
  });

  const allSubmissions: (Submission & { problemId: string; problemTitle: string })[] = [];
  Object.entries(progress.submissions).forEach(([problemId, subs]) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      subs.forEach(sub => {
        allSubmissions.push({ ...sub, problemId, problemTitle: problem.title });
      });
    }
  });

  const recentSubmissions = allSubmissions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  // Calculate tag-based success rates
  const tagStats: Record<string, { total: number; successful: number }> = {};

  Object.entries(progress.submissions).forEach(([problemId, subs]) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      problem.tags.forEach(tag => {
        if (!tagStats[tag]) {
          tagStats[tag] = { total: 0, successful: 0 };
        }
        // This logic is slightly flawed as it recounts all submissions for a problem for each tag.
        // A better approach would be to calculate stats per problem then aggregate by tag.
        // For now, we'll proceed and can refine if performance is an issue.
      });

      subs.forEach(sub => {
        problem.tags.forEach(tag => {
          tagStats[tag].total++;
          if (sub.success) {
            tagStats[tag].successful++;
          }
        });
      });
    }
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 5;

  const sortedTagRates = useMemo(() => {
    const rates = Object.entries(tagStats).map(([tag, stats]) => ({
      tag,
      rate: stats.total > 0 ? (stats.successful / stats.total) * 100 : 0,
      total: stats.total
    }));

    return rates.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.rate - b.rate;
      }
      return b.rate - a.rate;
    });
  }, [tagStats, sortOrder]);

  const paginatedTagRates = useMemo(() => {
    const startIndex = (currentPage - 1) * tagsPerPage;
    return sortedTagRates.slice(startIndex, startIndex + tagsPerPage);
  }, [sortedTagRates, currentPage, tagsPerPage]);

  const totalPages = Math.ceil(sortedTagRates.length / tagsPerPage);

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Your Progress
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-2">Problems Solved</h2>
            <p className="text-4xl font-bold">{solvedProblems} / {totalProblems}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-2">Difficulty Breakdown</h2>
            <div className="flex justify-around">
              <div className="text-center"><p className="font-bold text-2xl text-green-500">{solvedByDifficulty.Easy}</p><p>Easy</p></div>
              <div className="text-center"><p className="font-bold text-2xl text-yellow-500">{solvedByDifficulty.Medium}</p><p>Medium</p></div>
              <div className="text-center"><p className="font-bold text-2xl text-red-500">{solvedByDifficulty.Hard}</p><p>Hard</p></div>
            </div>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-2">Total Submissions</h2>
            <p className="text-4xl font-bold">{allSubmissions.length}</p>
          </div>
        </div>

        {/* Submission Heatmap */}
        <div className="mb-8">
          <SubmissionHeatmap />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tag Success Rates */}
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Success Rate by Tag</h2>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`px-3 py-1 text-sm rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Sort by: {sortOrder === 'asc' ? 'Weakest' : 'Strongest'}
              </button>
            </div>
            <div className="space-y-4">
              {paginatedTagRates.length > 0 ? paginatedTagRates.map(({ tag, rate, total }) => (
                <div key={tag}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{tag}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{rate.toFixed(0)}% ({total} attempts)</span>
                  </div>
                  <div className={`w-full rounded-full h-2.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${rate}%` }}></div>
                  </div>
                </div>
              )) : <p>No submissions with tags yet.</p>}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr; Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Problem</th>
                    <th className="py-2 px-4 text-left">Language</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub, index) => (
                    <tr key={index} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                      <td className="py-2 px-4">{new Date(sub.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-4">{sub.problemTitle}</td>
                      <td className="py-2 px-4 capitalize">{sub.language}</td>
                      <td className={`py-2 px-4 font-semibold ${sub.success ? 'text-green-500' : 'text-red-500'}`}>
                        {sub.success ? 'Accepted' : 'Failed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentSubmissions.length === 0 && <p className="text-center py-4">No submissions yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgressPage;
