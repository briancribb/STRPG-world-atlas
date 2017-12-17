"use strict";

var STRPG = STRPG || {};

STRPG.search = {
	$container:				$('#wa-search'),
	systemID:				0,
	props : {
		$systemData:		$('#details-system-data'),
		$minerals:			$('#details-minerals'),
		$searchResults:		$('#search-results'),
		$location:			$('#search-location'),
		$coords:		 	$('#search-coords')
	},
	init: function() {
		STRPG.search.update();
		// Trade Profile
		var tradeString = '';
		for (var i = 0; i < STRPG.data.tradeProfileTypes.length; i++) {
			var propType = STRPG.data.tradeProfileTypes[i];
			var propName = STRPG.data.tradeProfileNames[ STRPG.data.tradeProfileTypes[i] ];

			tradeString += '<a href="#" class="list-group-item search-criteria" data-property="tradeProfile" data-subprop1="'+ propType +'" data-subprop2="rating">'+ propName +'</a>';
		};
		$('#search-trade').find('.list-group').html(tradeString);
	},
	update: function() {
		var displayCoords = STRPG.utils.getDisplayCoords( STRPG.data.current.x, STRPG.data.current.y );
		STRPG.search.props.$location.html('Current Location: '+ STRPG.data.current.type +': '+ STRPG.data.current.value +'');
		STRPG.search.props.$coords.html('Coordinates: ' + displayCoords.full);
	},
	setupListGroup: function($clicked) {
		var property = $clicked.data('property'),
			subprop1 = $clicked.data('subprop1'),
			subprop2 = $clicked.data('subprop2'),
			searchData = null,
			resultString = '<h3>Results</h3><p>Planet name and distance from current location. Click Info Icon for planetary details.</p>';
		switch(property) {
			case 'distance':
				searchData = {
					resultSet :  {
						distance: STRPG.utils.sortByDistance( STRPG.data.location.x, STRPG.data.location.y, STRPG.data.planets )
					},
					keyList : ['distance'],
				}
				break;
			default:
				searchData = STRPG.utils.sortByProperty( $clicked.data('property'), $clicked.data('subprop1'), $clicked.data('subprop2') );
		}

		for (var i = 0; i < searchData.keyList.length; i++) {
			var listString = '',
				arrayToUse = searchData.resultSet[ searchData.keyList[i] ];

			for (var j = 0; j < arrayToUse.length; j++) {
				listString += '<tr><td>'+ arrayToUse[j].value +'</td><td>'+ arrayToUse[j].distanceFrom +'</td><td><button type="button" data-id="'+ arrayToUse[j].id +'" class="btn btn-info btn-sm pull-right search-btn-info"><span class="glyphicon glyphicon glyphicon-info-sign"></span></button></a></td></tr>';
			};

			var chevronClass, 
				openClass = '', 
				inlineStyle = '';
			if (searchData.keyList.length === 1) {
				chevronClass = 'glyphicon-chevron-up';
				openClass = ' open';
				inlineStyle = ' style="display: block;"';
			} else {
				chevronClass = 'glyphicon-chevron-down';
			}

			resultString	+=	'<div class="panel panel-info">'
							+		'<div class="panel-heading panel-toggle'+ openClass +'">'+ searchData.keyList[i] + ' (' + arrayToUse.length + ')' + '<span class="glyphicon '+ chevronClass +' pull-right"></span></div>'
							+		'<div class="panel-slider"'+ inlineStyle +'>'
							+			'<table class="table table-striped simplecols"><tbody>'
							+				listString
							+			'</tbody></table>'
							+		'</div>'
							+	'</div>';
		};
		STRPG.search.props.$searchResults.html( resultString );
	},
	clickHandler: function(event) {
		var $clicked = $(event.target);
		var clickDetails = false;

		if ( $clicked.hasClass('panel-toggle') ) {
			STRPG.atlas.updateToggle( $clicked );

		} else if ( $clicked.parent().hasClass('panel-toggle') ) {
			STRPG.atlas.updateToggle( $clicked.parent() );

		} else if ( $clicked.hasClass('search-criteria') ) {
			$('.search-criteria.active').removeClass('active');
			$clicked.addClass('active');
			STRPG.search.setupListGroup( $clicked );
		} else if ( $clicked.hasClass('search-btn-info') ) {
			STRPG.data.current = STRPG.data.planets[ $clicked.data('id') ];
			clickDetails = true;
		}

		// Needs to be in its own "if" statement. Misfire issues when it's part of the "else if" above.
		if ( clickDetails === true ) {
			$( "#wa-nav-details" ).trigger( "click" );
		}
	},
};



