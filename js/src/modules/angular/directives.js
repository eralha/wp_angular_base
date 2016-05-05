(function(){

    var app = angular.module('app.Directives', []);

		app.directive('erFrontendBaseDir', ['$rootScope', '$injector', '$filter', '$sce', function($rootScope, $injector, $filter, $sce) {
		  return {
		  	restrict: 'EAC',
		  	templateUrl: window.pluginsDir+'/templates/frontend/main.php',
		  	compile: function(e, a){
			        //console.log($(e).html(), arguments);
			        return function(scope, element, attrs) {

			        }
			    }
		  };
		}]);

		app.directive('erBackendBaseDir', ['$rootScope', '$injector', '$filter', '$sce', function($rootScope, $injector, $filter, $sce) {
		  return {
		  	restrict: 'EAC',
		  	templateUrl: window.pluginsDir+'/templates/backend/main.php',
		  	compile: function(e, a){
			        //console.log($(e).html(), arguments);
			        return function(scope, element, attrs) {

			        }
			    }
		  };
		}]);

})();