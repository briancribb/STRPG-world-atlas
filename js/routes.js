angular.module("WorldAtlas")
	.config(function($routeProvider){
		$routeProvider
			.when('/course', {
				templateUrl: 'templates/pages/course/index.html',
				controller: 'CourseCtrl',
				controllerAs: 'course'
			})
			.when('/details', {
				templateUrl: 'templates/pages/details/index.html',
				controller: 'DetailsCtrl',
				controllerAs: 'details'
			})
			.when('/sort', {
				templateUrl: 'templates/pages/sort/index.html',
				controller: 'SortCtrl',
				controllerAs: 'sort'
			})
			//.when('/', {
			//	templateUrl: 'templates/pages/details/index.html'
			//})
			.otherwise( {redirectTo: '/details' });
	});