angular.module('WorldAtlas')
.controller('CourseCtrl', ['$scope', 'STRPG', function($scope, STRPG) {

	var that = this; // Reference kept even when current scope changes value of "this".

	STRPG.getData().then(function(){


		that.resetForm = function() {
			that.plotted = false;
			that.warpFactor = 1;
			that.knownDistance = null;
			that.partialTime = 1;
			that.partialDistance = null;
			that.startName = '';
			that.finishName = '';
			that.startX = 0;
			that.startY = 0;
			that.finishX = null;
			that.finishY = null;
			that.results = null;
			that.resultsPartial = null;
			angular.element('#course-origin').val('');
			angular.element('#course-destination').val('');
		};

		that.setByCurrent = function() {

			var current = STRPG.getCurrent();

			if (current.code.substring(0,1) === "o") {
				that.startName = current.origin.system.name;
				that.startX = current.origin.system.x;
				that.startY = current.origin.system.y;
			} else {
				that.finishName = current.destination.system.name;
				that.finishX = current.destination.system.x;
				that.finishY = current.destination.system.y;
			}

		};
		that.useLocation = function() {
			var location = STRPG.getLocation();
			that.startX = location.x;
			that.startY = location.y;
			that.startName = STRPG.getPlaceFromCoords(location.x, location.y).name;
			angular.element('#course-origin').val('');
		}
		that.useLocationDest = function() {
			var location = STRPG.getLocation();
			that.finishX = location.destx;
			that.finishY = location.desty;
			that.finishName = STRPG.getPlaceFromCoords(location.destx, location.desty).name;
			angular.element('#course-destination').val('');
		}
		that.setOrigin = function(x,y) {
			STRPG.setOrigin(x,y);
		}
		that.setDestination = function(x,y) {
			STRPG.setDestination(x,y);
		}
		that.applyResults = function(plotCourse) {
			that.plotted = false; // used to show/hide a message in the template.

			if ( that.validate() ) {
				var rate = that.warpFactor,
					distance = ( that.knownDistance !== null ) ? that.knownDistance : STRPG.getDistance( that.startX, that.startY, that.finishX, that.finishY );
				var time = STRPG.getTime( distance, rate );
				var distPerDay = distance/time;

				that.results = {
					rate: rate,
					time: time,
					distance: distance,
					distPerDay: distPerDay
				};
				that.partialDistance = that.getPartialDistance();

				if (plotCourse === true) {
					that.plotted = true;
					that.setOrigin(that.startX, that.startY);
					that.setDestination(that.finishX, that.finishY);
				}
			}

		};
		that.getPartialDistance = function() {
			if (that.results !== null) {
				that.partialTime = Number(that.partialTime );
				that.partialTime = ( that.partialTime < 0 ) ? 1 : that.partialTime;
				that.partialTime = ( that.partialTime > that.results.time ) ? that.results.time : that.partialTime;

				return ( that.partialDistance = (that.results.distPerDay * that.partialTime) );
			}
		};
		that.validate = function() {
			if ( !that.warpFactor || !that.startX || !that.startY || !that.finishX || !that.finishY) {
				//console.log('Form is bogus.');
				return false;
			}
			return true;
		};

		// DO STUFF
		that.resetForm(); // Initialize form.

		$scope.$watch(function() {
			return STRPG.getCurrent().code },
			function(){
				that.setByCurrent();
			}
		);

	}); // end of then()

}]);