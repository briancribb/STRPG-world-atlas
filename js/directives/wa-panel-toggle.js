angular.module("WorldAtlas")
.directive("waPanelToggle", function($rootScope){
	return {
		restrict:"E",
		templateUrl: 'templates/directives/wa-panel-toggle.html',
		scope:{
			name:"@",
			type:"@"
		},
		link: function(scope, element, attrs) {
			element.on("click", function() {
				//$('#atlas').toggleClass('open');
				//angular.element( document.querySelector('#atlas') ).toggleClass('open');
				element.parent().toggleClass('open');
			});
		}
	};
});