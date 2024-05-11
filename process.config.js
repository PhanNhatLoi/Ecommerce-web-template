module.exports = {
  apps: [
    {
      name: 'SYSTEMV',
      script: 'server.js',
      max_memory_restart: '256M',
      ignore_watch: ['node_modules'],
      watch_options: {
        followSymlinks: false
      },
      env_production: {
        PORT: 7001,
        NODE_ENV: 'production'
      }
    }
  ]
};
