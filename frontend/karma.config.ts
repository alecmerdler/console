import webpackConfig from './webpack.config';

export default (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // '__tests__/**/*.js',
      // '__tests__/**/*.ts',

      // '__tests__/index.ts',
      // FIXME(alecmerdler): Just trying to get a test to run...
      '__tests__/units.js',
    ],
    exclude: [
      // FIXME: Is this right?
      '**/*.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)',
    ],
    preprocessors: {
      '__tests__/**/*.js': ['webpack', 'sourcemap'],
      '__tests__/**/*.ts': ['webpack', 'sourcemap'],
      '__tests/index.ts': ['webpack', 'sourcemap'],
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
