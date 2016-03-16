angular.module('WorldAtlas')
.controller('DetailsCtrl', ['$scope', 'STRPG', function($scope, STRPG) {
	var that = this;


	//$scope.$on('$viewContentLoaded', function (event) {

		STRPG.getData().then(function(){

			that.selectTab = function(id) {
				STRPG.setCurrent(id, false);
			};
			that.isSelectedTab = function(id) {
				return (id === that.planet.id);
			};
			that.getTechSocialDetails = function(index, rating) {
				return STRPG.getTechSocialDetails(index, rating);
			};
			that.getPopulationDesc = function(rating) {
				return STRPG.getPopulationDesc(rating);
			};
			that.showCurrent = function() {
				that.place = STRPG.getCurrent().origin;
				that.planet = that.place.planet;
				that.system = that.place.system;
			};

			that.showCurrent();
			$scope.$watch(function() {
				return STRPG.getCurrent().code },
				function(){
					that.showCurrent();
				}
			);

		}); // end of then()
	//});

}]);