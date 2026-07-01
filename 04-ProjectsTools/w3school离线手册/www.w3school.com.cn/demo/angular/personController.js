angular.module('myApp', []).controller('personCtrl', function($scope) {
    $scope.firstName = "Bill",
    $scope.lastName = "Gates",
    $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    }
});