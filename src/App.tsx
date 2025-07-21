import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import ProblemPage from './pages/ProblemPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProblemsListPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/problems/:problemId" element={<ProblemPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
