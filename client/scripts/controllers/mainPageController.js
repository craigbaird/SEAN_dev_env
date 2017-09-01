myApp.controller('MainPageController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('Main Page Controller loaded');
  $scope.logout = UserService.logout;

  // connect controller data to factory data here

}]); // end myApp.controller
