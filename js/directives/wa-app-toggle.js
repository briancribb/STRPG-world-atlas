angular.module("WorldAtlas")
.directive("waAppToggle", function($rootScope){
	return {
		restrict:"E",
		templateUrl: 'templates/directives/wa-app-toggle.html',
		scope:{
			action:"@",
			icon:"@"
		},
		link: function(scope, element, attrs) {
			element.find('button').on("click", function() {
				//$('#atlas').toggleClass('open');
				angular.element( document.querySelector('#atlas') ).toggleClass('open');
			});
		}
	};
});