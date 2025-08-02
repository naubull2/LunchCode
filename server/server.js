const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const ExecutionEngine = require('./executors/ExecutionEngine');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize execution engine
const executionEngine = new ExecutionEngine();

// Import and use problem management routes
const problemsRouter = require('./routes/problems');
app.use('/api/problems', problemsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Code execution endpoint
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, testCases, timeLimit = 5000, problemId } = req.body;
    
    // Validate request
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    // Generate execution ID for tracking
    const executionId = uuidv4();
    
    console.log(`[${executionId}] Executing ${language} code`);
    
    // Execute code with test cases
    const result = await executionEngine.execute({
      executionId,
      code,
      language,
      testCases: testCases || [],
      timeLimit,
      problemId
    });
    
    console.log(`[${executionId}] Execution completed:`, result.success ? 'SUCCESS' : 'FAILED');
    
    res.json(result);
    
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during code execution',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`LunchCode server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
