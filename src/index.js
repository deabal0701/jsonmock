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
const statsRoute = require('./routes/stats');

// Middleware
const { visitorCounter } = require('./middleware/visitorCounter');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'production' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Visitor counter middleware
app.use(visitorCounter);

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
  
  // 서버 URL 결정
  if (swaggerDocument.servers && swaggerDocument.servers.length) {
    const isProduction = process.env.NODE_ENV === 'production';
    const hasValidBaseUrl = process.env.BASE_URL && !process.env.BASE_URL.includes('localhost');
    
    if (isProduction && hasValidBaseUrl) {
      // 프로덕션 환경이고 유효한 BASE_URL이 있는 경우
      swaggerDocument.servers[0].url = `${process.env.BASE_URL}/api`;
      swaggerDocument.servers[0].description = 'Production server';
      console.log(`Swagger configured with production URL: ${process.env.BASE_URL}/api`);
    } else if (isProduction) {
      // 프로덕션 환경이지만 유효한 BASE_URL이 없는 경우 하드코딩된 URL 사용
      swaggerDocument.servers[0].url = 'https://jsonmock.toolbox365.co.kr/api';
      swaggerDocument.servers[0].description = 'Production server';
      console.log('Swagger configured with hardcoded production URL: https://jsonmock.toolbox365.co.kr/api');
    } else {
      // 개발 환경인 경우 로컬 URL 사용
      swaggerDocument.servers[0].url = `http://localhost:${PORT}/api`;
      swaggerDocument.servers[0].description = 'Local development server';
      console.log(`Swagger configured with local URL: http://localhost:${PORT}/api`);
    }
  }
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger document not found, API docs will not be available', error);
}

// API Routes
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/custom', customRoute);
app.use('/api/stats', statsRoute);

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
  // 환경 변수 상태 로깅
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || PORT,
    BASE_URL: process.env.BASE_URL || '(not set)',
  });

  // 서버 URL 결정 - BASE_URL이 없거나 localhost를 포함하면 로컬 URL 사용
  const serverBaseUrl = (process.env.NODE_ENV === 'production' && process.env.BASE_URL && !process.env.BASE_URL.includes('localhost'))
    ? process.env.BASE_URL
    : `http://localhost:${PORT}`;

  console.log(`🚀 Mock API Server running at ${serverBaseUrl}`);
  console.log(`📚 API Documentation available at ${serverBaseUrl}/api-docs`);
}); 