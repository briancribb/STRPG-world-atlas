	/*
INSPIRATIONS:
Structure inspired by:
	http://viget.com/extend/2666
Page Visibility API and Polyfill for vendor prefixes:
	http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
	http://www.w3.org/TR/page-visibility/
	http://caniuse.com/#feat=pagevisibility
	http://jsfiddle.net/0GiS0/cAG5N/
*/
var Starmap = Starmap || (function() {
	/* putting the app inside a closure so I can call the app object by name internally before returning its methods. */
	var APP = {
		stage : null,
		container : null,
		initiated:false,
		states: {
			INIT: "INIT",
			READY: "READY"
		},	
		currentState: 'INIT',
		props: {
			now:null,				// "now" and "then" get initial values in APP.setup.addListeners().
			then:null,
			interval:0,
			width:600,				// Width of our canvas app. Used when creating the canvas and testing its bounds.
			height:300,				// Height of our canvas app.
			textColor: '#FFFD8A',
			keycodes: {
				SPACE: 32,
				LEFT: 37,
				RIGHT: 39,
				UP: 38,
				DOWN: 40
			},
			assets: [
				{id:"canvas_book", src:"img/html5-canvas-book.jpg"},
				{id:"lynda", src:"img/lynda-logo-square-200.gif"},
				{id:"curiosity", src:"img/curiosity-tars-tarkas.jpg"},
				{id:"ie6_old", src:"img/ie6-old.png"}
				],
			regionProps : {
				UFP		: { color: "rgba(110, 200, 250, 1)", 	fullName: "United Federation of Planets" },
				KE		: { color: "rgba(255, 0, 0, 1)", 		fullName: "Klingon Empire" },
				RSA		: { color: "rgba(190, 20, 190, 1)", 	fullName: "Romulan Star Empire" },
				AOFW	: { color: "rgba(200, 200, 0, 1)", 		fullName: "Affiliation of Outer Free Worlds" },
				OFMA	: { color: "rgba(0, 255, 0, 1)", 		fullName: "Orion Free Merchantile Association" },
				MCA		: { color: "rgba(150, 150, 255, 1)", 	fullName: "Mantiev Colonial Association" },
				IKS		: { color: "rgba(255, 150, 150, 1)", 	fullName: "Independent Klingon States" },
				I		: { color: "rgba(0, 255, 0, 1)", 		fullName: "Independent" },
				U		: { color: "rgba(150, 150, 150, 1)", 	fullName: "Unexplored" }
			},
			startingPoint : {x:-440,y:-780},
			hideIcons:false,
			mousedown: false,
			dragging: false,
			timeStamp:0,
			scaleXY: 2,
			fpsText : ''
		},
		currentStar : null,
		systems : [],
		stars : [],
		selections : {
			current : null,
			origin : null,
			destination : null
		},
		activeLine : null,
		regions : [],		
		pause: function() {
			//console.log('APP.pause()');
			createjs.Ticker.paused = true;
		},
		play: function() {
			//console.log('APP.play()');
			APP.props.then = Date.now();	// Resetting the 'then'.
			createjs.Ticker.paused = false;
		},
		init: function(targetID, systemsArray) {
			APP.initiated = true;

			// http://stackoverflow.com/questions/10490570/call-angular-js-from-legacy-code
			APP.ngCtrl = angular.element(document.getElementById('atlas')).controller();


			/* Setting strings to match vendor visibility names. */
			if (typeof document.hidden !== "undefined") {
				APP.hidden = "hidden", APP.visibilityChange = "visibilitychange", APP.visibilityState = "visibilityState";
			} else if (typeof document.mozHidden !== "undefined") {
				APP.hidden = "mozHidden", APP.visibilityChange = "mozvisibilitychange", APP.visibilityState = "mozVisibilityState";
			} else if (typeof document.msHidden !== "undefined") {
				APP.hidden = "msHidden", APP.visibilityChange = "msvisibilitychange", APP.visibilityState = "msVisibilityState";
			} else if (typeof document.webkitHidden !== "undefined") {
				APP.hidden = "webkitHidden", APP.visibilityChange = "webkitvisibilitychange", APP.visibilityState = "webkitVisibilityState";
			}
			// We'll check this string against the document in the listener function.
			APP.document_hidden = document[APP.hidden];


			/* Setup */
			APP.systems = systemsArray;
			APP.setup.createCanvas(targetID);
			APP.setup.addListeners();
			APP.setup.createloadGraphic();


			/* Load assets. The handler functions for the queue live in init() rather than the addListeners function because they won't need to exist after init() has run. */
			var queue = new createjs.LoadQueue(true);
			queue.loadManifest(APP.props.assets);
			queue.on("fileload", handleFileLoad, this);
			queue.on("complete", handleComplete, this);

			function handleFileLoad(event) {
				//console.log('handleFileLoad()');

				// Add any images to the page body. Just a temporary thing for testing.
				//if (event.item.type === createjs.LoadQueue.IMAGE) {
				//	document.body.appendChild(event.result);
				//}
			}
			function handleComplete(event) {
				//console.log('handleComplete()');
				/* Once assets are loaded, run the rest of the app. */
				APP.setup.createObjects();
				APP.play();
				APP.stage.removeChild(APP.loadGraphic);
				APP.currentState = APP.states.READY;

				var loc = APP.ngCtrl.getLocation();
				var systemID = APP.ngCtrl.getPlaceFromCoords(loc.x,loc.y).id;
				Starmap.setCurrentStar( systemID );
			}
		},
		setup: {
			createCanvas: function(targetID) {
				APP.canvas = document.createElement('canvas');
				APP.canvas.width = APP.props.width;
				APP.canvas.height = APP.props.height;
				APP.context = APP.canvas.getContext('2d');
				document.getElementById(targetID).appendChild(APP.canvas);
				APP.setup.matchSizeToParent();
				APP.stage = new createjs.Stage(APP.canvas);

				/* Enable touch */
				createjs.Touch.enable(APP.stage, true, false);

				// Setting bounds so CreateJS doesn't keep calculating them.
				//APP.stage.setBounds(0, 0, APP.props.width, APP.props.height);
			},
			matchSizeToParent: function() {
				APP.canvas.width = APP.canvas.parentElement.clientWidth;
				APP.canvas.height = APP.canvas.parentElement.clientHeight;
				var parent = APP.canvas.parentElement;
				return {
					width: APP.canvas.parentElement.clientWidth,
					height: APP.canvas.parentElement.clientHeight
				}
			},
			addListeners: function() {
				// Visibility API
				document.addEventListener(APP.visibilityChange, function() {
					if(APP.document_hidden !== document[APP.hidden]) {
						if(document[APP.hidden]) {
							// Pause the animation when the document is hidden.
							APP.pause();
						} else {
							// When the document is visible, play the animation.
							APP.play();
						}
						APP.document_hidden = document[APP.hidden];
						//console.log('visibilityChange(): APP.document_hidden = ' + APP.document_hidden);
					}
				});

				// http://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
				document.onkeydown = function(event) {
					event = event || window.event;
					switch(event.which || event.keyCode) {
						case APP.props.keycodes.SPACE: // left
							//console.log('SPACE');
							var paused = !createjs.Ticker.getPaused();
							createjs.Ticker.setPaused(paused);
							break;

						case APP.props.keycodes.LEFT: // left
							//console.log('LEFT');
							break;

						case APP.props.keycodes.UP: // up
							//console.log('UP');
							break;

						case APP.props.keycodes.RIGHT: // right
							//console.log('RIGHT');
							break;

						case APP.props.keycodes.DOWN: // down
							//console.log('DOWN');
							break;

						default: return; // exit this handler for other keys
					}
					event.preventDefault(); // prevent the default action (scroll / move caret)
				};

				/* This part relies upon having UnderscoreJS loaded. It resizes the canvas to match its parent container. */
				var throttled = _.throttle(APP.setup.matchSizeToParent, 250);
				$(window).resize(throttled);


				/* For moving the map around. */
				APP.stage.on("stagemousedown", function(event) {
					APP.props.mousedown = true;
					//console.log('stagemousedown: APP.props.mousedown = ' + APP.props.mousedown);
					//console.log(event);
					APP.props.timeStamp = event.timeStamp;
					x:APP.container.offset = {x:APP.container.x - event.stageX, y:APP.container.y - event.stageY};

				});
				APP.stage.on("stagemousemove", function(event) {
					//console.log('stagemousemove');
					if( APP.props.mousedown === true && (event.timeStamp - APP.props.timeStamp) > 150) {
						//console.log('dragging');
						APP.props.dragging = true;
					}
					if(APP.props.dragging === true) {
						APP.container.x = event.stageX + APP.container.offset.x;
						APP.container.y = event.stageY + APP.container.offset.y;
					}
				});
				APP.stage.on("stagemouseup", function(event) {
					APP.props.mousedown = false;

					if( APP.props.dragging === false) {

						var point = APP.utils.stageToMap({x:event.stageX, y:event.stageY}),
							nearestStar = APP.utils.getNearestFromPoint(point.x, point.y);

						/* If near a star, call the "setCurrent" function from the AngularJS app through our "angularAPI" object. */
						if ( (nearestStar.distanceFrom / APP.props.scaleXY) < 10) {
							APP.angularAPI.setCurrent(nearestStar.id);
						} else {
							//console.log('Nothing close enought to that click.');
						}


					} else {
						APP.props.dragging = false;
					}
				})



				// CreateJS Ticker
				createjs.Ticker.on("tick", APP.tick);
				APP.props.now = Date.now();							// Instantiating the 'now'.
				APP.props.then = createjs.Ticker.now;				// Instantiating the 'then'.


				/*
				This is fine for most animations, but isn't as good as using straight RAF. Delta doesn't 
				account for time spent on another tab. That can lead to weird stuff if you go away and come back.
				*/
				// createjs.Ticker.setFPS(60);


				/*
				Using requestAnimationFrame because it's better.
				Although it's tempting to just set the FPS to 60 and use the Ticker event's delta value, this can get 
				weird under certain circumstances. The delta value doesn't account for time spent on other tabs. When 
				you come back, your objects are in weird positions. For this reason, I just set the animation to use 
				requestAnimationFrame and I calculate my own FPS which accounts for pausing and going to othecr tabs.
				*/
				createjs.Ticker.timingMode = createjs.Ticker.RAF;
			},
			createloadGraphic: function() {
				//console.log('createloadGraphic()');
				/* Some small animation that does not require external assets. This will play until the all of assets in the manifest are loaded. */
				APP.loadGraphic = new createjs.Shape();
				APP.loadGraphic.graphics.beginFill("#4385E0").drawCircle(0, 0, 50);
				APP.loadGraphic.x = 100;
				APP.loadGraphic.y = 100;
				APP.stage.addChild(APP.loadGraphic);
			},
			createObjects: function() {
				var topLimit = 0,
					rightLimit = 0;
					bottomLimit = 0;
					leftLimit = 0;

				APP.container = new createjs.Container();


				// Set initial scale value.
				APP.container.scaleX = APP.container.scaleY = APP.props.scaleXY;
				APP.container.x = APP.props.startingPoint.x * APP.props.scaleXY;
				APP.container.y = APP.props.startingPoint.y * APP.props.scaleXY;

				/* Adding container to the stage. */
				APP.stage.addChild(APP.container);



				/* Create Stars. */
				/* ============================================================== */
				for (i = 0; i < APP.systems.length; i++) {

					/* Convert display coordinates into map coordinates. */
					var coords = APP.utils.convertCoords( APP.systems[i].x, APP.systems[i].y );

					/* New Star instance. */
					var tempStar = new classes.Star({
						canvas:	APP.canvas, 
						id:		APP.systems[i].id, 
						name:	APP.systems[i].name,
						x:		coords.x, 
						y:		coords.y,
						coordX:	APP.systems[i].x,
						coordY:	APP.systems[i].y,
						radius:	2, 
						color: APP.props.regionProps[ APP.systems[i].affiliation ].color 
					});
					APP.stars.push(tempStar);
					APP.container.addChild(tempStar);
				}

				/* Set boundaries for the map based upon star positions. */
				/* ============================================================== */
				var firstX = _.min(APP.stars, function(star){ return star.x; }).x,
					firstY = _.min(APP.stars, function(star){ return star.y; }).y,
					lastX = _.max(APP.stars, function(star){ return star.x; }).x,
					lastY = _.max(APP.stars, function(star){ return star.y; }).y;


				APP.container.setBounds(
					firstX,
					firstY,
					(lastX - firstX),
					(lastY - firstY)
				);


				/* Create Regions. */
				/* ============================================================== */
				for (var i in APP.props.regionProps) {
					if (APP.props.regionProps.hasOwnProperty(i) && i !== 'I') { // filter
						var tempRegion = new classes.Region({
							canvas:	APP.canvas, 
							name:	i,  
							x:		0, 
							y:		0,
							alpha:	.2, 
							color:	APP.props.regionProps[i].color
						});
						APP.regions.push(tempRegion);
						APP.container.addChild(tempRegion);
						APP.container.setChildIndex(tempRegion, 0);
					}
				}

				/* Create Selection icons. */
				/* ============================================================== */
				APP.selections.current = new classes.Selection({
					canvas:	APP.canvas, 
					name:'Current',
					x: 521, 
					y: 838, 
					radius:10,
					type:'circles',
					color: 'rgba(255,255,255,1)'
				});
				APP.selections.origin = new classes.Selection({
					canvas:	APP.canvas, 
					name:'Origin',
					x: 521, 
					y: 838, 
					radius:10,
					type:'circles',
					color: 'rgba(0,0,255,1)'
				});
				APP.selections.destination = new classes.Selection({
					canvas:	APP.canvas, 
					name:'Destination',
					x: 521, 
					y: 838, 
					radius:10,
					type:'circles',
					color: 'rgba(0,255,0,1)'
				});

				_.each(APP.selections, function(item){
					APP.container.addChild(item);
					APP.container.setChildIndex(item, 0);
				});


				/* Create Travel Line. */
				/* ============================================================== */
				APP.activeLine = new classes.ActiveLine({
					canvas:	APP.canvas, 
					name:'travel',  
					radius:1, 
					color: 'rgba(255,255,255,0.5)' 
				});
				APP.container.addChild(APP.activeLine);
				APP.container.setChildIndex(APP.activeLine, 0);
			}
		},
		tick: function(event) {
			if ( createjs.Ticker.paused === false ) {
				APP.updateInterval();
				switch(APP.currentState) {
					case 'INIT':
						//console.log('APP.tick() - INIT: ' + APP.currentState);
						APP.updateloadGraphic(APP.props.interval);
						break;
					default:
						//console.log('APP.tick() - READY: ' + APP.currentState);
						//console.log( 'Time: ' + (APP.props.now) );
						APP.updateObjects(APP.props.interval);
				}
				APP.stage.update(event); // important!!
			}
		},
		getFPS: function(elapsed) {
			/* Reasons are explained in APP.setup.addListeners(), but we're going to calculate our own delta values for this animation. */
			var now = createjs.Ticker.getTime(),
				fps = 0;

			var tempFPS = Math.round(1000/(elapsed*1000));
			fps = isFinite(tempFPS) ? tempFPS : 0;

			return fps;
		},
		getCurrentStar: function() {
			return APP.currentStar;
		},
		setCurrentStar: function(id) {
			/* Positions the "current" selection on the map. This is only called from the STRPG service. */
			APP.currentStar = APP.stars[id];
			APP.selections.current.x = APP.currentStar.x;
			APP.selections.current.y = APP.currentStar.y;
			APP.selections.current.alpha = 1;

			/* Set the value of the TypeAhead directive input. We're doing it here because the change isn't coming from Typeahead this time. */
			angular.element('#WAtlas-place').val(APP.stars[id].name);
		},
		setOrigin: function(x,y) {
			/* This is only called from outside, in the STRPG service via the World Atlas controller. */
			var coords = APP.utils.convertCoords(x,y);
			APP.selections.origin.x = coords.x;
			APP.selections.origin.y = coords.y;
			APP.selections.origin.alpha = 1;

			/* Set start of travel line. */
			//console.log('Set start of travel line.');
			Starmap.activeLine.startPoint.x = coords.x;
			Starmap.activeLine.startPoint.y = coords.y;
		},
		setDestination: function(x,y) {
			/* This is only called from outside, in the STRPG service via the World Atlas controller. */
			var coords = APP.utils.convertCoords(x,y);
			APP.selections.destination.x = coords.x;
			APP.selections.destination.y = coords.y;
			APP.selections.destination.alpha = 1;

			/* Set end of travel line. */
			//console.log('Set end of travel line.');
			Starmap.activeLine.endPoint.x = coords.x;
			Starmap.activeLine.endPoint.y = coords.y;
			Starmap.activeLine.alpha = 1;
		},
		clearMap: function() {
			APP.props.hideIcons = true;
		},
		angularAPI: {
			getLocation: function() {
				return APP.ngCtrl.getLocation();
			},
			getCurrent: function() {
				return APP.ngCtrl.getCurrent();
			},
			getOrigin: function() {
				return APP.ngCtrl.getOrigin();
			},
			getDestination: function() {
				return APP.ngCtrl.getDestination();
			},
			setCurrent: function(id) {
				return APP.ngCtrl.setCurrent(id, true, false);
			},
			setOrigin: function(x,y) {
				APP.ngCtrl.setOrigin(x,y);
			},
			setDestination: function(x,y) {
				APP.ngCtrl.setDestination(x,y);
			}
		},
		utils: {
			getNearestFromPoint: function(mapX, mapY) {
				var sortedArray = (_.sortBy(APP.stars, function(star){
					var distance = Math.round(Math.sqrt(Math.pow(star.x - mapX,2) + Math.pow(star.y - mapY,2)));
					star.distanceFrom = distance;
					return distance;
				}));
				return sortedArray[0]
			},
			convertCoords: function(x,y) {
				return {
					x:	Math.ceil( x * 100 ), 
					y:	Math.ceil( y * -100 )
				};
			},
			stageToMap: function(stagePoint) {
				return {
					x: Math.round( (stagePoint.x - APP.container.x) / APP.props.scaleXY ),
					y: Math.round( (stagePoint.y - APP.container.y) / APP.props.scaleXY )
				};
			},
			mapToStage: function(mapPoint) {
				return {
					x: Math.round( (mapPoint.x * APP.props.scaleXY) + APP.container.x ),
					y: Math.round( (mapPoint.y * APP.props.scaleXY) + APP.container.y )
				};
			},
			correctPosition: function() {
				var bounds = APP.container.getBounds(),
					marginX = 40,
					marginY = 60

				var dragLimit = { // UL for "upper left" and BR for "bottom right"
					UL: {
						x: -(bounds.x * APP.props.scaleXY) + marginX,
						y: -(bounds.y * APP.props.scaleXY) + marginY
					},
					BR: {
						/* Full width of image area minus the current canvas width, negative. */
						x: -( ( (bounds.x + bounds.width) * APP.props.scaleXY ) - APP.canvas.width ) - marginX, 
						y: -( ( (bounds.y + bounds.height) * APP.props.scaleXY ) - APP.canvas.height ) - (marginY*2)
					}
				}

				/* Control the horizontal. */
				if ( (bounds.width * APP.props.scaleXY) + (marginX*2) > APP.canvas.width) { // Map is wider than the canvas.
					APP.container.x = APP.container.x > dragLimit.UL.x ? dragLimit.UL.x : APP.container.x;
					APP.container.x = APP.container.x < dragLimit.BR.x ? dragLimit.BR.x : APP.container.x;
				} else { // Canvas is wider than the map and its horizontal margins.
					var diff = (APP.canvas.width - (bounds.width * APP.props.scaleXY));
					APP.container.x = dragLimit.UL.x + (diff/2) - (marginX);
				}

				/* Control the vertical. */
				if ( (bounds.height * APP.props.scaleXY) + (marginY*2) > APP.canvas.height) {
					// Map is taller than the canvas and its vertical margins.
					APP.container.y = APP.container.y > dragLimit.UL.y ? dragLimit.UL.y : APP.container.y;
					APP.container.y = APP.container.y < dragLimit.BR.y ? dragLimit.BR.y : APP.container.y;

				} else {
					// Canvas is taller than the map.
					var diff = (APP.canvas.height - (bounds.height * APP.props.scaleXY));
					APP.container.y = dragLimit.UL.y + (diff/2) - (marginY*2);
				}
			},
			changeScale: function(modifier) {

				/* Find the coordinates for the center of the canvas. */
				var canvasCenter = {x:APP.canvas.width/2, y:APP.canvas.height/2};
				var pointBefore = APP.utils.stageToMap( canvasCenter );

				/* Change scale. */
				APP.props.scaleXY += modifier;

				/* Find out where that coordinate is on the canvas after the scale change. */
				var pointAfter = APP.utils.mapToStage(pointBefore);

				/* Move app container to put that coordinate back into the center of the canvas. */
				APP.container.x -= (pointAfter.x - canvasCenter.x);
				APP.container.y -= (pointAfter.y - canvasCenter.y);
			}
		},
		updateInterval: function() {
			APP.props.now = Date.now();
			APP.props.interval = (APP.props.now - APP.props.then) / 1000;// seconds since last frame.
			APP.props.then = APP.props.now;
		},
		updateloadGraphic : function(elapsed) {
			/* Simple logic to update the loading graphic while the user waits for assets. */
			APP.loadGraphic.x += elapsed/1000*100;
			if (APP.loadGraphic.x > APP.canvas.width) {
				APP.loadGraphic.x -= APP.canvas.width;
			}
		},
		updateObjects : function(elapsed) {
			var starsArray = APP.stars;

			// Set scale value.
			APP.container.scaleX = APP.container.scaleY = APP.props.scaleXY;

			/* Active line only appears if there's a proper origin and destination. */
			if ( APP.activeLine.startPoint.x === null || APP.activeLine.endPoint.x === null ) {
				APP.activeLine.alpha = 0;
			}

			/* Hide selections if required. */
			if ( APP.props.hideIcons === true ) {
				_.each(APP.selections, function(item){
					item.alpha = 0;
				});
				APP.activeLine.alpha = 0;
			}

			APP.activeLine.update();




			//APP.props.fpsText.text = APP.getFPS(elapsed);
			// move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
			//if (createjs.Ticker.getTicks() % 20 == 0) {
				//console.log('updateObjects() ticks = ' + createjs.Ticker.getTicks());
			//	APP.updateCornerText();
			//}

			//for(var i=0; i<starsArray.length; i++) {

			//}
			APP.utils.correctPosition();
			APP.props.hideIcons = false;
		}
	};
	return APP;
})();