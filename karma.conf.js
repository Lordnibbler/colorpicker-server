// Karma configuration
// Generated on Sun Jun 08 2014 21:42:38 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'assets/bower_components/jquery/jquery.min.js',
      'assets/bower_components/underscore/underscore.js',
      'assets/bower_components/backbone/backbone.js',
      'assets/scripts/vendor/color.min.js',
      'assets/scripts/vendor/rainbowvis.js',
      'http://localhost:9876/socket.io/socket.io.js',

      'test/main.js',

      'assets/scripts/models/color.js',
      'assets/scripts/collections/colors.js',
      // 'assets/scripts/views/color.js',
      'assets/scripts/routes/router.js',
      'assets/scripts/views/app.js',
      // 'assets/scripts/main.js',
      'test/assets/scripts/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'templates/**/*.hbs': [] // prevent preprocessing on the templates
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
