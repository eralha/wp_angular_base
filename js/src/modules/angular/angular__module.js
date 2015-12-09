define(['angular'], function () {


	var app = angular.module('app', []);
	    //generic controlers go here
	    app.controller('myCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

	        $scope.name = "Emanuel Ralha";

	        if(window.isAdmin && $location.url() == ''){
				window.location = '#/url-por-defeito/';
			}

	    }]);
    
    angular.bootstrap(document, ['app']);

    return {module: app};

});
