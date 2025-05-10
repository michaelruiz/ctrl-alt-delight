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
    };
    return config;
  },
};
