const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  reactStrictMode: true,
  output: 'export',
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:crypto': 'crypto-browserify',
    };
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  },
};
