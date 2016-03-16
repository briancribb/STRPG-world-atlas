"use strict";

var STRPG = STRPG || {};

STRPG.plot = {
	$container: $('#wa-plot'),
	origin : {},
	destination : {},
	props : {
		$origin : $('#plot-origin'),
		$destination : $('#plot-destination'),
		$startX : $('#plot-startX'),
		$startY : $('#plot-startY'),
		$finishX : $('#plot-finishX'),
		$finishY : $('#plot-finishY'),
		$warpFactor : $('#plot-warp-factor'),
		$knownDistance : $('#plot-known-distance'),
		$btnEngage : $('#plot-btn-engage'),
		$btnResults : $('#plot-btn-results'),
		$btnClear : $('#plot-btn-clear'),
		$btnUseCurrentOrigin : $('#plot-btn-origin-current'),
		$btnUseCurrentDestination : $('#plot-btn-destination-current'),
		$results : $('#plot-results'),
		$resultsHeading : $('#plot-results-heading'),
		$resultsContent : $('#plot-results-content'),

		$btnPartialResults : $('#plot-btn-partial'),
		$partialTime : $('#plot-partial-time'),
		$partialResults : $('#plot-partial-results'),
		$partialResultsHeading : $('#plot-partial-results-heading'),
		$partialResultsContent : $('#plot-partial-results-content')
	},
	setByNearest: function(testPointX, testPointY) {
		var nearest, distance, systemX, systemY, nearestID;
		for (var i=0; i < STRPG.data.systems.length; i++) {

			systemX = STRPG.data.systems[i].x * 100;
			systemY = STRPG.data.systems[i].y * 100;
			distance =	Math.sqrt(Math.pow(systemX-testPointX,2) + Math.pow(systemY-testPointY,2));

			if (!nearest) {
				nearest = distance;
				nearestID = i;
			} else {
				if (distance < nearest) {
					nearest = distance;
					nearestID = i;
				}
			}
		}
		if (nearest < 30) {
			STRPG.starmap.setCurrentStar(STRPG.data.systems[nearestID]);
		}
	},
	init: function() {		
		STRPG.plot.props.$origin.typeahead(STRPG.data.typeaheadFormat);
		STRPG.plot.props.$destination.typeahead(STRPG.data.typeaheadFormat);
		STRPG.plot.update();
	},
	update: function() {		
		STRPG.plot.resetWarpFactor();
		STRPG.plot.resetPartialTime();
	},
	resetCoords: function() {		
		STRPG.plot.props.$destination
		.add(STRPG.plot.props.$origin)
		.add(STRPG.plot.props.$startX)
		.add(STRPG.plot.props.$startY)
		.add(STRPG.plot.props.$finishX)
		.add(STRPG.plot.props.$finishY)
		.val('');
	},
	resetPartial: function() {
		$partialResults.attr('class', 'default' );
		$partialResultsHeading.html( '' );
		$partialResultsContent.html( '' );
	},
	resetWarpFactor: function() {		
		STRPG.plot.props.$warpFactor.val(1);
	},
	resetPartialTime: function() {		
		STRPG.plot.props.$partialTime.val(1);
	},
	typeaheadHandler: function(event, datum) {
		if ( event.target.id === STRPG.plot.props.$origin.attr('id') ) {
			STRPG.plot.props.$startX.removeClass('error').val( datum.x );
			STRPG.plot.props.$startY.removeClass('error').val( datum.y );
		}
		if ( event.target.id === STRPG.plot.props.$destination.attr('id') ) {
			STRPG.plot.props.$finishX.removeClass('error').val( datum.x );
			STRPG.plot.props.$finishY.removeClass('error').val( datum.y );
		}
		STRPG.plot.props.$knownDistance.val('');
	},
	focusoutHandler: function(event) {
		if ( event.target.id === STRPG.plot.props.$startX.attr('id') || event.target.id === STRPG.plot.props.$startY.attr('id') ) {
			if ( STRPG.plot.props.$startX.val() !== STRPG.data.origin.x || STRPG.plot.props.$startY.val() !== STRPG.data.origin.y ) {
				STRPG.plot.props.$origin.val('');
			}
		}
		if ( event.target.id === STRPG.plot.props.$finishX.attr('id') || event.target.id === STRPG.plot.props.$finishY.attr('id') ) {
			if ( STRPG.plot.props.$finishX.val() !== STRPG.data.destination.x || STRPG.plot.props.$finishY.val() !== STRPG.data.destination.y ) {
				STRPG.plot.props.$destination.val('');
			}
		}
		if ( event.target.id === STRPG.plot.props.$knownDistance.attr('id') ) {
			if ( STRPG.plot.props.$knownDistance.val() !== '' ) {
				STRPG.plot.resetCoords();
			}
		}
		if ( event.target.id === STRPG.plot.props.$warpFactor.attr('id') ) {
			var inputValue = Number( STRPG.plot.props.$warpFactor.val() );
			if ( inputValue !== '') {
				if ( inputValue === NaN || inputValue <= 0 ) {
					STRPG.plot.resetWarpFactor();
				}
			}
		}
		if ( event.target.id === STRPG.plot.props.$partialTime.attr('id') ) {
			var inputValue = Number( STRPG.plot.props.$partialTime.val() );
			if ( inputValue !== '') {
				if ( inputValue === NaN || inputValue <= 1 ) {
					STRPG.plot.resetPartialTime();
				}
				if ( inputValue === NaN || inputValue <= 1 ) {
					STRPG.plot.resetPartialTime();
				}
			}
		}
	},
	clickHandler: function(event, datum) {
		if ( event.target.id === STRPG.plot.props.$btnUseCurrentOrigin.attr('id') ) {
			var currentLocation = STRPG.utils.getSystemFromCoords(STRPG.data.location.x, STRPG.data.location.y);
			STRPG.plot.props.$origin.val( currentLocation.value );
			STRPG.plot.props.$startX.val( STRPG.data.location.x );
			STRPG.plot.props.$startY.val( STRPG.data.location.y );
		}
		if ( event.target.id === STRPG.plot.props.$btnUseCurrentDestination.attr('id') ) {
			STRPG.plot.props.$destination.val( STRPG.data.current.value );
			STRPG.plot.props.$finishX.val( STRPG.data.current.x );
			STRPG.plot.props.$finishY.val( STRPG.data.current.y );
		}





		// Determine which button was clicked.
		if ( event.target.id === STRPG.plot.props.$btnEngage.attr('id') ) {
			handleForm('plot');
		} else if ( event.target.id === STRPG.plot.props.$btnResults.attr('id') ) {
			handleForm('show');
		} else if ( event.target.id === STRPG.plot.props.$btnPartialResults.attr('id') ) {
			handleForm('partial');
		} else if ( event.target.id === STRPG.plot.props.$btnClear.attr('id') ) {
			handleForm('reset');
		}

		function handleForm(action) {
			var formGood = true,
			rate = STRPG.plot.props.$warpFactor.val(),
			time,
			distance;


			// Clear errors.
			STRPG.plot.$container.find('.error').removeClass('error');

			// Coordinate inputs must be numbers. Fixes in case the 'number' attribute fails in the browser.
			STRPG.plot.$container.find( '.coordinate' ).add( STRPG.plot.props.$knownDistance ).each(function( index ) {
				if ( $(this).val() !== '' ) {
					var inputValue = Number( $(this).val() );
					if ( inputValue === NaN ) {
						$(this).val('');
					}
				}
			});

			// If there's a known distance, use that.
			if ( STRPG.plot.props.$knownDistance.val() !== '' ) {


				// Known distance must be a number.
				if ( Number( STRPG.plot.props.$knownDistance.val() ) === NaN ) { formGood = false; }

				// If the form is bad, do nothing else.				
				if (formGood !== true) {return};

				// If we're still good, then set these values.
				time = STRPG.utils.getTime( STRPG.plot.props.$knownDistance.val(), rate );
				distance = Math.abs( STRPG.plot.props.$knownDistance.val() );

			} else {

				// We must have coordinates and a warp factor.
				STRPG.plot.$container.find( '.validate' ).each(function( index ) {
					STRPG.utils.checkIfEmpty( $(this) );
				});
				if ( STRPG.plot.$container.find('.error')[0] ) {formGood = false};
				if (formGood !== true) {return};

				// If we're still good, then set these values.
				//STRPG.plot.setOrigin({ x:STRPG.plot.props.$startX.val(), y:STRPG.plot.props.$startY.val() });
				//STRPG.plot.setDestination( { x:STRPG.plot.props.$finishX.val(), y:STRPG.plot.props.$finishY.val() };
				//distance = STRPG.utils.getDistance( STRPG.plot.origin.x, STRPG.plot.origin.y, STRPG.plot.destination.x, STRPG.plot.destination.y );
				distance = STRPG.utils.getDistance( STRPG.plot.props.$startX.val(), STRPG.plot.props.$startY.val(), STRPG.plot.props.$finishX.val(), STRPG.plot.props.$finishY.val() );
				time = STRPG.utils.getTime( distance, rate );

			}

			// The time form uses the time input instead of calculations.
			if (action === 'partial') {
				if ( Number(STRPG.plot.props.$partialTime.val()) > time ) {
					STRPG.plot.props.$partialTime.val(time);
				}
				if ( STRPG.plot.props.$knownDistance.val() !== '') {
					setResults( STRPG.utils.getTripProgress({ rate:rate, partialTime:STRPG.plot.props.$partialTime.val(), distance:distance }), 'partial' );
				} else {
					setResults( STRPG.utils.getTripProgress({ rate:rate, partialTime:STRPG.plot.props.$partialTime.val(), x1:STRPG.plot.props.$startX.val(), y1:STRPG.plot.props.$startY.val(), x2:STRPG.plot.props.$finishX.val(), y2:STRPG.plot.props.$finishY.val() }), 'partial' );
				}
			} else {
				if (action === 'plot') {
					STRPG.utils.setOrigin({ x:STRPG.plot.props.$startX.val(), y:STRPG.plot.props.$startY.val() });
					STRPG.utils.setDestination({ x:STRPG.plot.props.$finishX.val(), y:STRPG.plot.props.$finishY.val() });
				}
				setResults({rate:rate, time:time, distance:distance}, action);
			}
		}
		function setResults(settings, action) {
			var panelClass = '',
				headingString = '',
				resultString = '',
				coordString = '',
				yearString = '',
				$target,
				$targetHeading,
				$targetContent;



			// Resetting the form.
			if (action === 'reset') {
				STRPG.data.destination = null;
				STRPG.plot.props.$origin.val('');
				STRPG.plot.props.$destination.val('');
				STRPG.plot.props.$startX.val('');
				STRPG.plot.props.$startY.val('');
				STRPG.plot.props.$finishX.val('');
				STRPG.plot.props.$finishY.val('');
				STRPG.plot.props.$warpFactor.val('1');
				STRPG.plot.props.$knownDistance.val('1');
				STRPG.plot.props.$partialTime.val('');
				return;
			}


			// Set color according to action.
			if (action === 'plot') {
				panelClass = 'panel panel-info';
				headingString	= "<p><strong>Course Plotted</strong></p>";
			} else if (action === 'partial') {
				panelClass = 'panel panel-danger';
			} else { // Other actions get info color.
				panelClass = 'panel panel-warning';
			}

			// These two actions go to the same results box.
			if (action === 'plot' || action === 'show') {
				$target			= STRPG.plot.props.$results;
				$targetHeading	= STRPG.plot.props.$resultsHeading;
				$targetContent	= STRPG.plot.props.$resultsContent;
				if(settings.time > 365.25) {
					var years = settings.time/365.25;
					yearString	= " <em>(" + years.toFixed(2) + " years)</em>";
				}
				resultString = headingString + "Travelling <strong>" + settings.distance + " parsecs</strong> will take <strong>" + settings.time + " days</strong>" + yearString + " travelling at <strong>Warp Factor " + settings.rate + ".</strong>";
			}
			// Time has its own results box.
			if (action === 'partial') {
				$target			= STRPG.plot.props.$partialResults;
				$targetHeading	= STRPG.plot.props.$partialResultsHeading;
				$targetContent	= STRPG.plot.props.$partialResultsContent;


				if ( STRPG.plot.props.$knownDistance.val() === '' ) {
					coordString = '<li><strong>Coordinates:</strong> '	+ 'x: ' + settings.x + ', y: ' + settings.y + '</li>';
				}

				resultString =	'<ul class="list-unstyled no-space-below">' + 
									'<li><strong>Distance:</strong> '		+ settings.distance + ' parsecs</li>' + 
									'<li><strong>Rate:</strong> Warp '		+ settings.rate + '</li>' + 
									'<li><strong>Time:</strong> '			+ settings.time + ' days</li>' + 
									coordString + 
								'</ul>'; 
			}

			// Set results once using values calculated above.
			$target.attr('class', panelClass );
			//$targetHeading.html( headingString );
			$targetContent.html( resultString );
		}
	}
};



