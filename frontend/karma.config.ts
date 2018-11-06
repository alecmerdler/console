// FIXME(alecmerdler): Use ES6 `import`
const webpackConfig = require('./webpack.config');

const config = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '__tests__/**/*.js',
      '__tests__/**/*.ts',
    ],
    preprocessors: {
      '__tests__/**/*.js': ['webpack'],
      '__tests__/**/*.ts': ['webpack'],
    },
    webpack: webpackConfig,
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      type: 'html'
    },
    client: {
      captureConsole: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeNoSandbox'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    concurrency: Infinity,
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
  });
};

// FIXME(alecmerdler): Use ES6 `export`
module.exports = config;
