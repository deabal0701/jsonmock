module.exports = {
  apps: [{
    name: 'toolbox365-jsonmock',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'development',
      PORT: 3100
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3100,
      BASE_URL: 'https://jsonmock.toolbox365.co.kr'
    }
  }]
}; 