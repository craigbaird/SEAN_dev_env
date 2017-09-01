module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: ['client/scripts/*.js',
              'client/scripts/**/*.js'],
        dest: 'server/public/scripts/client.min.js'
      }
    },
    copy: {
      html: {
        expand: true,
        cwd: 'client/views',
        src: ['index.html',
              '**/*.html'],
        dest: 'server/public/views/'
      },
      css: {
        expand: true,
        cwd: 'client/styles',
        src: ['style.css'],
        dest: 'server/public/styles/'
      },
    //   bootstrap: {
    //     expand: true,
    //     cwd: 'node_modules/bootstrap/dist/',
    //     src: ['css/bootstrap.css',
    //           'css/bootstrap.css.map',
    //           'js/bootstrap.js'],
    //     dest: 'server/public/vendors/bootstrap/'
    //   },
      angular: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['angular.js',
              'angular.min.js',
              'angular.min.js.map'],
        dest: 'server/public/vendors/angular/'
      },
      angularRoute: {
        expand: true,
        cwd: 'node_modules/angular-route/',
        src: ['angular-route.js',
              'angular-route.min.js',
              'angular-route.min.js.map'],
        dest: 'server/public/vendors/angular-route/'
      },
    //   angularMaterial: {
    //       expand: true,
    //       cwd: 'node_modules/angular-material/',
    //       src: ['angular-material.js',
    //             'angular-material.css',
    //             'angular-material.min.css',
    //             'angular-material.min.js'],
    //       dest: 'server/public/vendors/angular-material/'
    //   },
    //   angularAnimate: {
    //     expand: true,
    //     cwd: 'node_modules/angular-animate/',
    //     src: ['angular-animate.js',
    //           'angular-animate.min.js',
    //           'angular-animate.min.js.map'],
    //     dest: 'server/public/vendors/angular-material/'
    //   },
    //   angularAria: {
    //     expand: true,
    //     cwd: 'node_modules/angular-aria/',
    //     src: ['angular-aria.js',
    //           'angular-aria.min.js',
    //           'angular-aria.min.js.map'],
    //     dest: 'server/public/vendors/angular-material/'
    //   },
    //   angularMessages: {
    //     expand: true,
    //     cwd: 'node_modules/angular-messages/',
    //     src: ['angular-messages.js',
    //           'angular-messages.min.js',
    //           'angular-messages.min.js.map'],
    //     dest: 'server/public/vendors/angular-material/'
    //   },
    //   sweetAlert2: {
    //     expand: true,
    //     cwd: 'node_modules/sweetalert2/dist/',
    //     src: ['sweetalert2.min.css',
    //           'sweetalert2.min.js'],
    //     dest: 'server/public/vendors/sweetalert2/'
    //   }
   }, // end copy
    watch: {
      files: [
        'client/**/*.*'
      ],
      tasks: ['uglify', 'copy']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'copy', 'watch']);
};
