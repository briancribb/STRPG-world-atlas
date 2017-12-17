"use strict";

var STRPG = STRPG || {};
STRPG.starmap = STRPG.starmap || {};


STRPG.starmap = {
	$container: $('#wa-map'),
	canvas : document.getElementById('starmap'),
	stage : new createjs.Stage('starmap'),
	container : new createjs.Container(),
	allStars : [],//will hold all stars.
	allRegions : [],
	allSelections : [],
	startingPoint : {x:-440,y:-780},
	scaleXY: 2,
	timeStamp:0,
	testNum:0,
	mousedown: false,
	dragging: false,
	pointBeforeEvent : {},
	currentStar: null,
	$ttDropDownMenu: null,
	//planetListStarter: '<li class="list-group-item list-group-item-info">Planets<button id="map__set-dest--planet" class="btn btn-primary btn-sm btn-list-group">Set</button></li>',
	//planetListStarter: '<li class="list-group-item list-group-item-info">Planets</li>',
	mapControl : {
		width: $('#map-interface').outerWidth(), 
		height: $('#map-interface').outerHeight()
	},
	$currentSystemLabel : $('#current-system-name'),
	init: function() {
		STRPG.starmap.setupCanvas();
		STRPG.starmap.setupBehaviors();
	},
	update: function() {
		var interfaceHeight = $('#map-interface').outerHeight(true) + $('#wa-nav').outerHeight(true),
			viewHeight = $(window).height() - interfaceHeight;

		STRPG.starmap.canvas.height = (viewHeight > 1000) ? 1000 : viewHeight;
		STRPG.starmap.canvas.width = ( STRPG.starmap.$container.width() > 680) ? 680 : STRPG.starmap.$container.width();
	},
	changeScale: function(modifier) {
		// Get current values.
		var oldScaleXY = STRPG.starmap.scaleXY,
			oldWidth = STRPG.starmap.container.width * STRPG.starmap.scaleXY,
			oldHeight = STRPG.starmap.container.height * STRPG.starmap.scaleXY;

		// Change scale variable.
		STRPG.starmap.scaleXY += modifier;


		// Keep scaling within boundaries.
		STRPG.starmap.scaleXY = STRPG.starmap.scaleXY < 2 ? 2 : STRPG.starmap.scaleXY;
		STRPG.starmap.scaleXY = STRPG.starmap.scaleXY > 6 ? 6 : STRPG.starmap.scaleXY;

		// Get new values.
		var newWidth = STRPG.starmap.container.width * STRPG.starmap.scaleXY,
			newHeight = STRPG.starmap.container.height * STRPG.starmap.scaleXY;

		// Adjust position to keep our place on the map. (Messing with regX/regY gets messy.)
		// Don't worry about position boundaries. That's taken care of elsewhere.
		STRPG.starmap.container.x -= ( newWidth - oldWidth )/2;
		STRPG.starmap.container.y -= ( newHeight - oldHeight )/2;
	},
	mouseToMap: function(stageX, stageY) {
		var mapPoint = {};

		// How much of the map is off-screen to the left.
		mapPoint.x = ( ( (stageX - STRPG.starmap.container.x) / STRPG.starmap.scaleXY ) ).toFixed(0);
		mapPoint.y = ( ( (stageY - STRPG.starmap.container.y) / STRPG.starmap.scaleXY ) ).toFixed(0);
		return mapPoint
	},
	setCurrentStar: function(datum) {
		var tempID = null;

		if( datum.type === 'planet' ) {
			datum = STRPG.utils.getSystemFromPlanet(datum);
		}
		//if (STRPG.starmap.currentStar !== null) {
		//	STRPG.starmap.currentStar.scaleX = STRPG.starmap.currentStar.scaleY = 1;
		//}
		STRPG.starmap.currentStar = STRPG.starmap.allStars[datum.id];
		//STRPG.starmap.currentStar.scaleX = STRPG.starmap.currentStar.scaleY = 3;

		STRPG.starmap.current.x = STRPG.starmap.currentStar.x;
		STRPG.starmap.current.y = STRPG.starmap.currentStar.y;
		STRPG.starmap.current.alpha = 1;

		STRPG.starmap.$currentSystemLabel.val( STRPG.data.systems[ datum.id ].value );
		STRPG.data.current = STRPG.data.systems[STRPG.starmap.currentStar.id];
	},
	correctPosition: function() {
		var startX = STRPG.starmap.startingPoint.x * STRPG.starmap.scaleXY,
			startY = STRPG.starmap.startingPoint.y * STRPG.starmap.scaleXY;

		// Don't go too far down or to the right.
		STRPG.starmap.container.x = STRPG.starmap.container.x > startX ? startX : STRPG.starmap.container.x;
		STRPG.starmap.container.y = STRPG.starmap.container.y > startY ? startY : STRPG.starmap.container.y;


		// Don't go too far up or to the left.
		var rightLimit = startX - ((STRPG.starmap.container.width * STRPG.starmap.scaleXY) - STRPG.starmap.canvas.width),
			bottomLimit = startY - ((STRPG.starmap.container.height * STRPG.starmap.scaleXY) - STRPG.starmap.canvas.height);

		STRPG.starmap.container.x = STRPG.starmap.container.x < rightLimit ? rightLimit : STRPG.starmap.container.x;
		STRPG.starmap.container.y = STRPG.starmap.container.y < bottomLimit ? bottomLimit : STRPG.starmap.container.y;
	},
	setupBehaviors: function() {
		STRPG.starmap.stage.on("stagemousedown", function(event) {
			if( STRPG.atlas.currentBoxID = 'wa-map') {
				STRPG.starmap.mousedown = true;
			}
			STRPG.starmap.timeStamp = event.timeStamp;
			x:STRPG.starmap.container.offset = {x:STRPG.starmap.container.x - event.stageX, y:STRPG.starmap.container.y - event.stageY};
		});
		STRPG.starmap.stage.on("stagemousemove", function(event) {
			if( STRPG.starmap.mousedown === true && (event.timeStamp - STRPG.starmap.timeStamp) > 150) {
				STRPG.starmap.dragging = true;
			}

			if(STRPG.starmap.dragging === true) {
				STRPG.starmap.container.x = event.stageX + STRPG.starmap.container.offset.x;
				STRPG.starmap.container.y = event.stageY + STRPG.starmap.container.offset.y;
			}
		});
		STRPG.starmap.stage.on("stagemouseup", function(event) {
			if( STRPG.starmap.mousedown === true) {

				STRPG.starmap.mousedown = false;
				if( STRPG.starmap.dragging === false) {
					if( STRPG.starmap.$ttDropDownMenu.is(":hidden") ) {
						var mapPointReturned = STRPG.starmap.mouseToMap(event.stageX, event.stageY);
						var nearestSystem = STRPG.utils.getNearestFromPoint(mapPointReturned.x, mapPointReturned.y, true);
						if (nearestSystem.distanceFrom < 30) {
							STRPG.starmap.setCurrentStar(nearestSystem);							
						}
					}
				} else {
					STRPG.starmap.dragging = false;
				}
			}
		})

		// Behaviors
		$('#map-interface').on( "click.map", ".map-control", function() {
			if ( $(this).hasClass('btn--map-zoom-in') ) {
				STRPG.starmap.changeScale(.5);
			}
			if ( $(this).hasClass('btn--map-zoom-out') ) {
				STRPG.starmap.changeScale(-.5);
			}
		});

		$('#current-system-name').on( "typeahead:selected", function(event, datum) {
			STRPG.starmap.setCurrentStar(datum);
		});


		$('#current-system-name').typeahead([
			{
				name: 'systems',
				local: STRPG.data.systems,
				limit: 10,
				header: '<h3 class="league-name">Systems</h3>'
			},
			{
				name: 'planets',
				local: STRPG.data.planets,
				limit: 10,
				header: '<h3 class="league-name">Planets</h3>',
			}
		]);
		STRPG.starmap.$ttDropDownMenu = $('.tt-dropdown-menu');
	},
	setupCanvas: function() {
		createjs.Touch.enable(STRPG.starmap.stage, true, false);


		// Setting up the stage.
		STRPG.starmap.stage.width = 680;
		STRPG.starmap.stage.height = 1000;
		STRPG.starmap.stage.x = STRPG.starmap.stage.width/2;
		STRPG.starmap.stage.y = STRPG.starmap.stage.height/2;
		STRPG.starmap.stage.regX = STRPG.starmap.stage.width/2;
		STRPG.starmap.stage.regY = STRPG.starmap.stage.height/2;

		// Setting up the container. Numbers are halved because we're going to default to x2 scale.
		STRPG.starmap.container.width = 340;
		STRPG.starmap.container.height = 500;
		STRPG.starmap.container.x = STRPG.starmap.startingPoint.x * STRPG.starmap.scaleXY;
		STRPG.starmap.container.y = STRPG.starmap.startingPoint.y * STRPG.starmap.scaleXY;


		// Adding the FPS counter. Starts as an empty string, gets filled with words on each Tick().
		STRPG.starmap.fpsInfo = STRPG.starmap.stage.addChild(new createjs.Text("init", "14px monospace", "#aaaaaa"));
		var fpsInfo = STRPG.starmap.fpsInfo;
		fpsInfo.lineHeight = 15;
		fpsInfo.textBaseline = "top";
		fpsInfo.x = 10;
		fpsInfo.y = 10;

		// Adding Regions
			for (var i in STRPG.data.regionProps) {
				if (STRPG.data.regionProps.hasOwnProperty(i) && i !== 'I') { // filter
					var tempRegion = new STRPG.classes.Region({ 
						name:i,  
						x: 0, 
						y: 0,
						alpha: .2, 
						color: STRPG.data.regionProps[i].color
					});
					STRPG.starmap.allRegions.push(tempRegion);
					STRPG.starmap.container.addChild(tempRegion);
				}
			}
		// Done with Regions


		// Adding Stars
			for (var i = 0; i < STRPG.data.systems.length; i++) { //creating the stars
				var tempStar = new STRPG.classes.Star({ 
					//stage:STRPG.starmap.stage, 
					id:STRPG.data.systems[i].id, 
					index: i, 
					name:STRPG.data.systems[i].value,  
					x: (STRPG.data.systems[i].x * 100), 
					y: (STRPG.data.systems[i].y * -100), 
					radius:1, 
					color: STRPG.data.regionProps[ STRPG.data.systems[i].affiliation ].color 
				});
				STRPG.starmap.allStars.push(tempStar);
				STRPG.starmap.container.addChild(tempStar);
			}
		// Done with Stars


		// Adding Selections
			// Location Selection
			var locationPoint = STRPG.utils.getPointFromCoords( STRPG.data.location.x, STRPG.data.location.y ); 
			STRPG.starmap.location = new STRPG.classes.Selection({ 
				id:0, 
				name:'location',  
				x: locationPoint.x, 
				y: locationPoint.y, 
				radius:10, 
				color: 'rgba(100,255,100,0.5)' 
			});
			STRPG.starmap.allSelections.push(STRPG.starmap.location);
			STRPG.starmap.container.addChild( STRPG.starmap.location );
			STRPG.starmap.location.alpha = 1;

			// Origin Selection
			STRPG.starmap.origin = new STRPG.classes.Selection({ 
				id:1, 
				name:'origin',  
				x: STRPG.starmap.location.x, 
				y: STRPG.starmap.location.y,
				radius:10, 
				color: 'rgba(125,180,255,0.5)' 
			});
			STRPG.starmap.allSelections.push(STRPG.starmap.origin);
			STRPG.starmap.container.addChild( STRPG.starmap.origin );

			// Destination Selection
			var destinationPoint = STRPG.utils.getPointFromCoords( STRPG.data.location.x, STRPG.data.location.y ); 
			STRPG.starmap.destination = new STRPG.classes.Selection({ 
				id:1, 
				name:'destination',  
				x: destinationPoint.x, 
				y: destinationPoint.y,
				radius:10, 
				color: 'rgba(255,255,100,0.5)' 
			});
			STRPG.starmap.allSelections.push(STRPG.starmap.destination);
			STRPG.starmap.container.addChild( STRPG.starmap.destination );

			// Current Selection
			STRPG.starmap.current = new STRPG.classes.Selection({ 
				id:2, 
				name:'current',  
				x: 0, 
				y: 0, 
				radius:8, 
				type:'circles',
				color: 'rgba(255,255,255,0.25)' 
			});
			STRPG.starmap.allSelections.push(STRPG.starmap.current);
			STRPG.starmap.container.addChild( STRPG.starmap.current );
			// Update all selections.
			for (var i = 0; i < STRPG.starmap.allSelections.length; i++) {
				STRPG.starmap.allSelections[i].update();
			};
		// Done with Selections

		STRPG.starmap.travelLine = new STRPG.classes.ActiveLine({ 
			id:3, 
			name:'travelLine',  
			x: 0, 
			y: 0, 
			radius:1, 
			color: 'rgba(255,255,255,0.5)' 
		});
		STRPG.starmap.container.addChild( STRPG.starmap.travelLine );


		// Adding container to the stage.
		STRPG.starmap.stage.addChild(STRPG.starmap.container);


		/** 
		 * Adding the Tick listener. We're going to update everything when this event happens.
		 * For details, go here: http://createjs.com/tutorials/easeljs/Animation%20and%20Ticker/
		 */
		createjs.Ticker.addEventListener("tick", STRPG.starmap.tick);
		createjs.Ticker.useRAF = true; // Using requestAnimationFrame because it's better.
		createjs.Ticker.setFPS(60); // Setting to a standard 60 fps.

		STRPG.starmap.tick(STRPG.starmap.stage);
	},
	tick: function(event) {
		/**
		 * This is all the stuff we want to do each time the canvas updates. CreateJS sends out a Tick event, 
		 * which we can listen to and act upon. We could also put a tick listener into each square, but that 
		 * seems like a lot of listeners to me. I'd rather just have one and go through the list of objects.
		 * @type {Function}
		 */

		/**
		 * Using time-based animation instead of frame-based. Here's the formula:
		 * move a given number of pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond)
		 * called for 100 pixels per second:  myObject.x += event.delta/1000*100;
		 * Note: the event.delta variable is how CreateJS notes the elapsed time. For more details, go here: 
		 * http://createjs.com/tutorials/easeljs/Animation%20and%20Ticker/
		 * 
		 * We're going to loop through all of the ZipSquares to make our updates. We could save a bit by saving 
		 * ZipSquares[i] to a variable, but I wanted to leave it as-is for readability.
		 */


		
		// Drawing our FPS text.
		createjs.Ticker.getFPS()
		STRPG.starmap.fpsInfo.text = "createjs.Ticker.getFPS() = " + createjs.Ticker.getFPS();

		// Set scale value.
		STRPG.starmap.container.scaleX = STRPG.starmap.container.scaleY = STRPG.starmap.scaleXY;

		// Correct for edge limits using the new scale value. Works on STRPG.starmap.newPoint
		STRPG.starmap.correctPosition();




		// Handle Selections


		// Show destination if we have one. Otherwise, hide selection.
		if ( STRPG.data.destination !== null ) {
			var originPoint			= STRPG.utils.getPointFromCoords( STRPG.data.origin.x, STRPG.data.origin.y ),
				destinationPoint	= STRPG.utils.getPointFromCoords( STRPG.data.destination.x, STRPG.data.destination.y );

			if ( STRPG.data.origin.x === STRPG.data.location.x && STRPG.data.origin.y === STRPG.data.location.y ) {
				STRPG.starmap.origin.alpha = 0;
			} else {
				STRPG.starmap.origin.x = originPoint.x;
				STRPG.starmap.origin.y = originPoint.y;	
				STRPG.starmap.origin.alpha = 1;
			}

			STRPG.starmap.destination.x = destinationPoint.x;
			STRPG.starmap.destination.y = destinationPoint.y;	
			STRPG.starmap.destination.alpha = 1;


			STRPG.starmap.travelLine.startPoint	= { x:originPoint.x, y:originPoint.y };
			STRPG.starmap.travelLine.endPoint	= { x:destinationPoint.x, y:destinationPoint.y };
			STRPG.starmap.travelLine.update();
			STRPG.starmap.travelLine.alpha = 1;

		} else {
			STRPG.starmap.destination.alpha = 0;
			STRPG.starmap.travelLine.alpha = 0;
		}




		//STRPG.starmap.allStars[13].update();
		/*
		if (STRPG.starmap.currentStar !== null) {
			var sineWave = ( Math.sin(STRPG.starmap.testNum * Math.PI / 180) + 2 );
			STRPG.starmap.currentStar.radius = sineWave;

			STRPG.starmap.currentStar.update();
			STRPG.starmap.testNum += 5;
		}
		*/


		//STRPG.starmap.container.x +=1;
		/*
		//STRPG.starmap.myStar.x ++;
		STRPG.starmap.allStars[5].x ++;

		if (STRPG.starmap.allStars[5].x > 500) {
			STRPG.starmap.allStars[5].x = 10;
		}
		*/

		STRPG.starmap.current.update();
		STRPG.starmap.stage.update(event); // This is a big deal. It draws all the child objects that have been added to the stage.
	}
};



