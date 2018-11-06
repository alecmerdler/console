declare var require: NodeRequire;

// Require all modules ending in ".spec.ts" from the test directory and all subdirectories
var testsContext = (<any>require).context(".", true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
