angular.module('WorldAtlas')
.controller('WorldAtlasCtrl', ['$location', '$http', '$rootScope', '$scope', 'STRPG', function($location, $http, $rootScope, $scope, STRPG) {
	var that = this;


	that.starmapReady = false;
	that.selectPage = function(setPage){
		STRPG.selectPage(setPage);
	};
	that.isSelected = function(checkPage){
		return $location.path() === checkPage;
	};

	that.changeScale = function(scaleup){
		if (Starmap.initiated) {
			var modifier = (scaleup === true) ? .25 : -0.25;
			Starmap.utils.changeScale( modifier );
		}
	};


	that.getLocation = function(){
		return STRPG.getLocation();
	};
	that.getPlaceFromCoords = function(pointX, pointY){
		return STRPG.getPlaceFromCoords(pointX, pointY);
	};
	that.getCurrent = function(){
		return STRPG.getCurrent();
	};
	that.getOrigin = function(){
		return STRPG.getOrigin();
	};
	that.getDestination = function( ){
		return STRPG.getDestination();
	};



	that.setCurrent = function(id, isDestination){
		STRPG.setCurrent( id, true, false );
	};
	that.setOrigin = function(){
		if ( Starmap.initiated && ( Starmap.getCurrentStar() !== null) ) {
			var star = Starmap.getCurrentStar();
			STRPG.setOrigin(star.coordX,star.coordY); /* Set in app with app coordinates. */
		}
	};
	that.setDestination = function(){
		if ( Starmap.initiated && ( Starmap.getCurrentStar() !== null) ) {
			var star = Starmap.getCurrentStar();
			STRPG.setDestination(star.coordX,star.coordY); /* Set in app with app coordinates. */
		}
	};
	that.clearMap = function( ){
		if ( Starmap.initiated ) {
			Starmap.clearMap();
		}
	};
	that.log = function(message){
		console.log('WAtlas controller logs: ' + message);
	};




	$scope.$on('$viewContentLoaded', function (event) {
		STRPG.getData().then(function(){
			if (!Starmap.initiated) {
				var systems = STRPG.getSystems();
				Starmap.init('canvas-container', systems );
				that.starmapReady = true;

			} else {
				//console.log('Nope, not running it again.');
			}
		}); // end of then()
	});



}]);