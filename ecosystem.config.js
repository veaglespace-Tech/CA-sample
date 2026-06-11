module.exports = {
  apps: [
    {
      name: 'valuexpert-backend',
      script: './server/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      }
    },
    {
      name: 'valuexpert-frontend',
      script: 'npm',
      args: 'start',
      cwd: './client',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};
