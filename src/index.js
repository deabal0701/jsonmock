const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

// Routes
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const customRoute = require('./routes/custom');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Load Swagger document
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  // Update server URL if in production
  if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {
    if (swaggerDocument.servers && swaggerDocument.servers.length) {
      swaggerDocument.servers[0].url = `${process.env.BASE_URL}/api`;
      swaggerDocument.servers[0].description = 'Production server';
    }
  }
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger document not found, API docs will not be available');
}

// API Routes
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/custom', customRoute);

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running at ${process.env.NODE_ENV === 'production' ? process.env.BASE_URL : `http://localhost:${PORT}`}`);
  console.log(`📚 API Documentation available at ${process.env.NODE_ENV === 'production' ? `${process.env.BASE_URL}/api-docs` : `http://localhost:${PORT}/api-docs`}`);
}); 