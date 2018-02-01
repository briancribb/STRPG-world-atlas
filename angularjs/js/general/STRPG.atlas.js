var STRPG = STRPG || {};

STRPG.atlas = {
	$container: $('#atlas'),
	$appToggle: $('#btn-app-open, #btn-app-close'),
	$mapContainer: $('#app-container'),
	$waNav: $('#wa-nav'),
	$waView: $('#wa-view'),
	resizeTasks : [],
	init: function() {
		function setupApp(data_1,data_2) {
			STRPG.data.init(data_1,data_2);

			STRPG.atlas.$appToggle.on( "click", function( event ) {
				// Toggle class to open/close menu. 
				if ( STRPG.atlas.$container.hasClass('open') ) {
					STRPG.atlas.$container.removeClass('open');
					//STRPG.atlas.$appToggle.find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
				} else {
					STRPG.atlas.$container.addClass('open');
					//STRPG.atlas.$appToggle.find('.glyphicon').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
				}
			});

			STRPG.atlas.$waNav.on( "click", "a", function(event) {
				STRPG.atlas.$waNav.find('.active').removeClass('active');
				$(this).addClass('active');
			});

			/* Setting up throttled resize functions. */
			$(window).resize( _.throttle(STRPG.atlas.manageResize, 250) );
			STRPG.atlas.manageResize();

			if (STRPG.starmap) {
				STRPG.starmap.init();
			}


			var initTasks = {
				func: function(){
					//console.log("I'm resizing!");

					// Support for CSS break-points
					//if ( STRPG.atlas.getSTRPG.atlasViewType() !== 'palm' ) {
					//	STRPG.atlas.props.$bodyElement.removeClass('menu-open');
					//}
				}
			};

			initTasks.func(); // Initial call of initial resize task.
			STRPG.atlas.addResizeTask(initTasks);
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
	addResizeTask : function(task) {
		//console.log('adding task');
		// myTask = {func:myfunction, args:[arg1,arg2]}
		task.args = task.args || [];
		STRPG.atlas.resizeTasks.push(task);
	},
	manageResize : function() {
		// Cycle through resize tasks.
		for (var i = 0; i < STRPG.atlas.resizeTasks.length; i++) {
			var task = STRPG.atlas.resizeTasks[i];
			task.func.apply(this, task.args);
		};
	},
	updateToggle: function($toggle) {
		if ( $toggle.hasClass('open') ) {
			$toggle.siblings('.panel-slider').slideUp();
			$toggle.removeClass('open').find('.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
		} else {
			$toggle.siblings('.panel-slider').slideDown();
			$toggle.addClass('open').find('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
		}
	},
};
//STRPG.atlas.init();

/*
$('#wa-nav').on( "click", ".btn", function() {
	$(this).addClass('active');
});
*/
