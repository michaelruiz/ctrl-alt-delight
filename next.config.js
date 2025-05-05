module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      'js-dos': require.resolve('js-dos/dist/js-dos.js'),
    };
    return config;
  },
};
