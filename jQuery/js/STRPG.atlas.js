"use strict";

var STRPG = STRPG || {};

STRPG.atlas = {
	$container: $('#atlas'),
	$currentBox: $('#wa-search'),
	currentBoxID: 'wa-search',
	$nav: $('#wa-nav'),
	$navButtons: $('#wa-nav .btn'),

	init: function() {
		var setupApp = function(data_1,data_2) {
			STRPG.data.init(data_1,data_2);
			STRPG.starmap.init();
			STRPG.plot.init();
			STRPG.details.init();
			STRPG.search.init();
			STRPG.atlas.$currentBox.addClass('wa-visible');
			$('.map-interface input, .tt-hint').addClass('form-control');
			STRPG.starmap.update();

			$(window).on({
				resize: function() {
					// Handle mouseleave...
					if ( STRPG.atlas.currentBoxID === 'wa-map' ) {
						STRPG.starmap.update();
					}
				},
			});

			STRPG.atlas.$nav.on( "click", ".btn", function() {
				STRPG.atlas.$currentBox.removeClass('wa-visible');
				STRPG.atlas.$navButtons.removeClass('active');
				window.scrollTo(0,0);

				$(this).addClass('active');
				STRPG.atlas.$currentBox = $( '#' + $(this).data('target') );
				STRPG.atlas.currentBoxID = STRPG.atlas.$currentBox.attr('id');

				STRPG.atlas.$currentBox.addClass('wa-visible');

				STRPG[ $(this).data('module') ].update();
			});

			STRPG.atlas.$container.on({
				focusout: function() {
					// Handle mouseleave...
					if ( STRPG.atlas.currentBoxID === 'wa-plot' ) {
						STRPG.plot.focusoutHandler(event);
					}
				},
				'typeahead:selected': function(event, datum) {
					// Handle typeahead:selected...
					if ( STRPG.atlas.currentBoxID === 'wa-plot') {
						STRPG.plot.typeaheadHandler(event, datum);
					}
					if ( STRPG.atlas.currentBoxID === 'wa-details') {
						STRPG.details.typeaheadHandler(event, datum);
					}
				},
				click: function(event) {
					// Handle click...
					switch(STRPG.atlas.currentBoxID) {
						case 'wa-plot':
							STRPG.plot.clickHandler(event);
							break;
						case 'wa-details':
							STRPG.details.clickHandler(event);
							break;
						case 'wa-search':
							STRPG.search.clickHandler(event);
							break;
						default:
							// do nothing.
					}
				},
			});
		};

		// http://damolab.blogspot.com/2011/03/od6-and-finding-other-worksheet-ids.html
		// https://spreadsheets.google.com/feeds/worksheets/YOUR_SPREADSHEET_ID/private/full

		var json_uri_1 = "https://spreadsheets.google.com/feeds/list/0AmArFrvAS2V7dFdVMXRBbmJoLXZTam9FNDVYcVhDanc/od8/public/values?alt=json";
		var json_uri_2 = "https://spreadsheets.google.com/feeds/list/0AmArFrvAS2V7dFdVMXRBbmJoLXZTam9FNDVYcVhDanc/od5/public/values?alt=json";

		$.when( $.ajax( json_uri_1 ), $.ajax( json_uri_2 ) )
			.then(function ( data_1, data_2 ) {
				setupApp(data_1,data_2);
			});

	},
	updateToggle: function($toggle) {
		if ( $toggle.hasClass('open') ) {
			$toggle.siblings('.panel-slider').slideUp();
			$toggle.removeClass('open').find('.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
		} else {
			$toggle.siblings('.panel-slider').slideDown();
			$toggle.addClass('open').find('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
		}
	}
};
STRPG.atlas.init();

/*
$('#wa-nav').on( "click", ".btn", function() {
	$(this).addClass('active');
});
*/
