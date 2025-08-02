import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import { KeyMappingProvider } from './utils/KeyMappingContext';
import ProblemPage from './pages/ProblemPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import AddProblemPage from './pages/AddProblemPage';

function App() {
  return (
    <ThemeProvider>
      <KeyMappingProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProblemsListPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/add-problem" element={<AddProblemPage />} />
            <Route path="/problems/:problemId" element={<ProblemPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </Router>
      </KeyMappingProvider>
    </ThemeProvider>
  );
}

export default App;
