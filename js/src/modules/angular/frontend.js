(function(){

	var app = angular.module('frontend', ['app.Services', 'app.Directives']);
	    //generic controlers go here
	    app.controller('myCtrl', ['$scope', '$rootScope', '$location', 'dataService', function($scope, $rootScope, $location, dataService) {

	        $scope.name = "Emanuel Ralha";

	        if(window.isAdmin && $location.url() == ''){
				window.location = '#/url-por-defeito/';
			}

	    }]);

})();