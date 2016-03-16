angular.module('WorldAtlas')
.controller('SortCtrl', ['$scope', 'STRPG', function($scope, STRPG) {

	var that = this;


	//$scope.$on('$viewContentLoaded', function (event) {

		STRPG.getData().then(function(data){
			that.tradeProfiles = STRPG.getTradeProfileTypes();

			that.setPlace =  function(x,y) {
				if (!x || !y) {
					var location = STRPG.getLocation();
					x = location.x,
					y = location.y;
					angular.element('#sort-place').val('');
				}				

				that.place = STRPG.getPlaceFromCoords(x, y);
				that.place.displayCoords = STRPG.getDisplayCoords(that.place.x, that.place.y);
				that.place.type = (that.place.type === 'space') ? null : that.place.type;
				that.results = null;
			};


			that.sortByDistance =  function(testPointX, testPointY, arrayToUse) {
				return STRPG.sortByDistance(testPointX, testPointY, arrayToUse);
			};

			that.sortByProperty = function(testPointX, testPointY, property, subprop1, subprop2) {
				return STRPG.sortByProperty(testPointX, testPointY, property, subprop1, subprop2);
			};

			that.setResults = function( property, subprop1, subprop2 ) {
				that.resultType = (property === 'tradeProfile') ? 'Trade Profile' : property;
				if (subprop1) {
					for (var i = 0; i < that.tradeProfiles.length; i++) {
						if ( that.tradeProfiles[i].prop === subprop1 ) {
							that.resultTypeSub = that.tradeProfiles[i].name;
							break;
						}
					};
				}
				that.results = that.sortByProperty( that.place.x, that.place.y, property, subprop1, subprop2 );
			};


			$scope.showDetails = function(id) {
				STRPG.setCurrent(id);
				STRPG.selectPage('/details');
			}

			/* Do stuff. */
			that.setPlace();

			$scope.$watch(function() {
				return STRPG.getCurrent().code },
				function(code){
					if (code.substring(0,1) === "o") {
						var current = STRPG.getCurrent().origin.system;
						that.setPlace( current.x, current.y );
					}
				}
			);
		}); // end of then()
	//});

}]);