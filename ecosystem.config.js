module.exports = {
  apps: [
    {
      name: 'caproject-backend',
      script: './server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      }
    },
    {
      name: 'caproject-frontend',
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
