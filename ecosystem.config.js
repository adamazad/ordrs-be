module.exports = {
  apps: [
    {
      namespace: 'ordrs',
      name: 'ordrs-api-server',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      node_args: '-r ts-node/register -r tsconfig-paths/register',
      args: '--color',
      script: './build/index.js',
    },
  ],
};
