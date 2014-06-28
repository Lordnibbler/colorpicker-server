module.exports = (grunt) ->

  # show elapsed time at the end
  require("time-grunt") grunt

  # load all grunt tasks
  require("load-grunt-tasks") grunt
  grunt.initConfig

    # grunt nodemon setup: https://github.com/ChrisWren/grunt-nodemon#advanced-usage
    concurrent:
      dev:
        tasks: [
          "nodemon"
          # "node-inspector" # might want to add this back
          "watch"
        ]
        options:
          logConcurrentOutput: true
      dist: [
        "copy:styles"
        "copy:fonts"
        "svgmin"
        "htmlmin"
      ]
      test:
        tasks: [
          "karma:unit"
          "watch:mocha"
        ]
        options:
          logConcurrentOutput: true

    nodemon:
      dev:
        script: "app.coffee"
        options:
          # nodeArgs: ["--debug"]
          env:
            PORT: "1337"

          # omit this property if you aren't serving HTML files and
          # don't want to open a browser tab on start
          callback: (nodemon) ->
            nodemon.on "log", (event) ->
              console.log event.colour
              return

            # # opens browser on initial server start
            # nodemon.on "config:update", ->
            #
            #   # Delay before server listens on port
            #   setTimeout (->
            #     require("open") "http://localhost:5455"
            #     return
            #   ), 1000
            #   return

            # refreshes browser when server reboots
            nodemon.on "restart", ->

              # Delay before server listens on port
              setTimeout (->
                require("fs").writeFileSync ".rebooted", "rebooted"
                return
              ), 1000
              return

            return

    watch:
      server:
        files: [".rebooted"]
        options:
          livereload: true
      scripts:
        files: ["assets/scripts/**/*.js", "src/**/*.coffee"]

      css:
        files: ["assets/styles/**/*.css"]

      sass:
        files: ["assets/styles/**/*.scss"]
        tasks: ["sass:dev"]

      images:
        files: ["assets/images/**/*.{png,jpg,jpeg,webp}"]

      mocha:
        options:
          spawn: false # faster reloading
        files: "test/src/**/*.coffee"
        tasks: ['mochaTest:test']

    karma:
      unit:
        configFile: 'karma.conf.js'
        autoWatch: true

    mochaTest:
      test:
        options:
          clearRequireCache: true # for spawn: false tests (https://github.com/pghalliday/grunt-mocha-test#running-in-permanent-environments-like-watch)
          reporter: 'spec'
          require: ['coffee-script/register', 'test/test_helper.coffee']
          recursive: true
          timeout: 5000
        src: ['test/src/**/*.coffee']


    # Clean Config
    clean:
      dist:
        files: [
          dot: true
          src: [
            ".tmp"
            "dist/*"
            "!dist/.git*"
          ]
        ]

      server: [".tmp"]

    # Hint Config
    jshint:
      options:
        jshintrc: ".jshintrc"

      all: [
        "Gruntfile.js"
        "assets/scripts/**/*.js"
        "!assets/scripts/vendor/*"
        "test/spec/**/*.js"
      ]

    # Sass Config
    sass:
      options:
        cacheLocation: ".tmp/.sass-cache"

      dev:
        options:
          style: "expanded"
          lineComments: true

        files: [
          expand: true
          cwd: "assets/styles/sass"
          dest: "assets/styles"
          src: ["screen.scss"]
          ext: ".css"
        ]

    # Express Config
    express:
      options:

        # Override defaults here
        opts: ["node_modules/coffee-script/bin/coffee"]
        port: 1337

      dev:
        options:
          script: "app.coffee"


    # Open Config
    open:
      site:
        path: "http://localhost:1337"
        app: "Google Chrome"

      editor:
        path: "./"
        app: "atom"


    # Rev Config
    rev:
      dist:
        files:
          src: [
            "dist/assets/scripts/**/*.js"
            "dist/assets/styles/**/*.css"
            "dist/assets/images/**/*.{png,jpg,jpeg,gif,webp}"
            "dist/assets/styles/fonts/**/*.*"
          ]


    # Usemin Config
    useminPrepare:
      options:
        dest: "dist/assets"

      html: [
        "assets/{,*/}*.html"
        "views/**/*.handlebars"
      ]

    usemin:
      options:
        dirs: ["dist/assets"]
        basedir: "dist/assets"

      html: [
        "dist/assets/{,*/}*.html"
        "dist/views/**/*.handlebars"
      ]
      css: ["dist/assets/styles/{,*/}*.css"]


    # Imagemin Config
    imagemin:
      dist:
        files: [
          expand: true
          cwd: "assets/images"
          src: "**/*.{png,jpg,jpeg}"
          dest: "dist/assets/images"
        ]


    # SVGmin Config
    svgmin:
      dist:
        files: [
          expand: true
          cwd: "assets/images"
          src: "{,*/}*.svg"
          dest: "dist/assets/images"
        ]


    # CSSmin config
    cssmin: {}

    # This task is pre-configured if you do not wish to use Usemin
    # blocks for your CSS. By default, the Usemin block from your
    # `index.html` will take care of minification, e.g.
    #
    #     <!-- build:css({.tmp,app}) styles/main.css -->
    #
    # dist: {
    #     files: {
    #         'dist/assets/styles/main.css': [
    #             '.tmp/styles/{,*/}*.css',
    #             'assets/styles/{,*/}*.css'
    #         ]
    #     }
    # }

    # HTML Config
    htmlmin:
      dist:
        options: {}

        #removeCommentsFromCDATA: true,
        #                    // https://github.com/yeoman/grunt-usemin/issues/44
        #                    //collapseWhitespace: true,
        #                    collapseBooleanAttributes: true,
        #                    removeAttributeQuotes: true,
        #                    removeRedundantAttributes: true,
        #                    useShortDoctype: true,
        #                    removeEmptyAttributes: true,
        #                    removeOptionalTags: true
        files: [
          expand: true
          cwd: "assets"
          src: "*.html"
          dest: "dist/assets"
        ]


    # Copy Config
    # Put files not handled in other tasks here
    copy:
      dist:
        files: [
          {
            expand: true
            dot: true
            cwd: "assets"
            dest: "dist/assets"
            src: [
              "*.{ico,png,txt}"
              ".htaccess"
              "images/**/*.{webp,gif}"
              "styles/fonts/{,*/}*.*"
            ]
          }
          {
            expand: true
            dot: true
            cwd: "views"
            dest: "dist/views/"
            src: "**/*.handlebars"
          }
        ]

      styles:
        expand: true
        dot: true
        cwd: "assets/styles"
        dest: ".tmp/styles/"
        src: "{,*/}*.css"

      fonts:
        expand: true
        src: ['assets/font/**']
        dest: 'dist/'


  # Register Tasks
  # Workon
  grunt.registerTask "workon", "Start working on this project.", [
    # "jshint"
    "sass:dev"
    # "express:dev"
    # "open:site"
    # "open:editor"
    "nodemon"
  ]

  # Restart
  grunt.registerTask "restart", "Restart the server.", [
    "express:dev"
    "watch"
  ]

  # Build
  grunt.registerTask "build", "Build production ready assets and views.", [
    "clean:dist"
    "concurrent:dist"
    "useminPrepare"
    "imagemin"
    "concat"
    "cssmin"
    "uglify"
    "copy:dist"
    "rev"
    "usemin"
  ]
  return