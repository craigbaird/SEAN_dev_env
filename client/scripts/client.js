var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

// Angular Material Theme
myApp.config(['$mdThemingProvider', function($mdThemingProvider){
  $mdThemingProvider.theme('altTheme').primaryPalette('blue').accentPalette('blue');
}]);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
    // Login View
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController',
    })
    // Register new user View
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController'
    })
    // Forgot password view
    .when('/forgotpassword', {
      templateUrl: '/views/templates/forgot.html',
      controller: 'LoginController'
    })
    // change password view (accesible through email link)
    .when('/confirmreset/:code', {
      templateUrl: '/views/templates/confirm.html',
      controller: 'LoginController'
    })
    // Admin landing View
    
    //
    .otherwise({
      redirectTo: 'home'
    });
}]);
