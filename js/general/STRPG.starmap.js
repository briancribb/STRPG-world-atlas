var STRPG = STRPG || {};

STRPG.starmap = {
	$container: $('#canvas-container'),	
	states: {
		INIT: "INIT",
		READY: "READY"
	},
	currentState: 'INIT',
	props: {
		now:null,				// "now" and "then" get initial values in STRPG.starmap.setup.addListeners().
		then:null,
		interval:0,
		width:680,				// Width of our canvas app. Used when creating the canvas and testing its bounds.
		height:1000,			// Height of our canvas app.
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
		fpsText : '',
		snowflakes : [],
		gravity:80,
		wind:15
	},
	pause: function() {
		//console.log('STRPG.starmap.pause()');
		createjs.Ticker.paused = true;
	},
	play: function() {
		//console.log('STRPG.starmap.play()');
		STRPG.starmap.props.then = Date.now();	// Resetting the 'then'.
		createjs.Ticker.paused = false;
	},
	init: function() {

		/* Setting strings to match vendor visibility names. */
		if (typeof document.hidden !== "undefined") {
			STRPG.starmap.hidden = "hidden", STRPG.starmap.visibilityChange = "visibilitychange", STRPG.starmap.visibilityState = "visibilityState";
		} else if (typeof document.mozHidden !== "undefined") {
			STRPG.starmap.hidden = "mozHidden", STRPG.starmap.visibilityChange = "mozvisibilitychange", STRPG.starmap.visibilityState = "mozVisibilityState";
		} else if (typeof document.msHidden !== "undefined") {
			STRPG.starmap.hidden = "msHidden", STRPG.starmap.visibilityChange = "msvisibilitychange", STRPG.starmap.visibilityState = "msVisibilityState";
		} else if (typeof document.webkitHidden !== "undefined") {
			STRPG.starmap.hidden = "webkitHidden", STRPG.starmap.visibilityChange = "webkitvisibilitychange", STRPG.starmap.visibilityState = "webkitVisibilityState";
		}
		// We'll check this string against the document in the listener function.
		STRPG.starmap.document_hidden = document[STRPG.starmap.hidden];


		/* Setup */
		STRPG.starmap.setup.createCanvas();
		STRPG.starmap.setup.addListeners();


		/* Once assets are loaded, run the rest of the app. */
		STRPG.starmap.setup.createObjects();
		STRPG.starmap.play();
		STRPG.starmap.stage.removeChild(STRPG.starmap.loadGraphic);
		STRPG.starmap.currentState = STRPG.starmap.states.READY;
	},
	setup: {
		createCanvas: function() {
			STRPG.starmap.canvas = document.createElement('canvas');
			STRPG.starmap.canvas.width = STRPG.starmap.props.width;
			STRPG.starmap.canvas.height = STRPG.starmap.props.height;
			STRPG.starmap.context = STRPG.starmap.canvas.getContext('2d');
			STRPG.starmap.$container[0].appendChild(STRPG.starmap.canvas);
			STRPG.starmap.stage = new createjs.Stage(STRPG.starmap.canvas);

			// Setting bounds so CreateJS doesn't keep calculating them.
			STRPG.starmap.stage.setBounds(0, 0, STRPG.starmap.props.width, STRPG.starmap.props.height);
		},
		addListeners: function() {
			// Visibility API
			document.addEventListener(STRPG.starmap.visibilityChange, function() {
				if(STRPG.starmap.document_hidden !== document[STRPG.starmap.hidden]) {
					if(document[STRPG.starmap.hidden]) {
						// Pause the animation when the document is hidden.
						STRPG.starmap.pause();
					} else {
						// When the document is visible, play the animation.
						STRPG.starmap.play();
					}
					STRPG.starmap.document_hidden = document[STRPG.starmap.hidden];
					//console.log('visibilityChange(): STRPG.starmap.document_hidden = ' + STRPG.starmap.document_hidden);
				}
			});

			// http://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
			document.onkeydown = function(event) {
				event = event || window.event;
				switch(event.which || event.keyCode) {
					case STRPG.starmap.props.keycodes.SPACE: // left
						//console.log('SPACE');
						var paused = !createjs.Ticker.getPaused();
						createjs.Ticker.setPaused(paused);
						break;

					case STRPG.starmap.props.keycodes.LEFT: // left
						//console.log('LEFT');
						break;

					case STRPG.starmap.props.keycodes.UP: // up
						//console.log('UP');
						break;

					case STRPG.starmap.props.keycodes.RIGHT: // right
						//console.log('RIGHT');
						break;

					case STRPG.starmap.props.keycodes.DOWN: // down
						//console.log('DOWN');
						break;

					default: return; // exit this handler for other keys
				}
				event.preventDefault(); // prevent the default action (scroll / move caret)
			};


			// CreateJS Ticker
			createjs.Ticker.on("tick", STRPG.starmap.tick);
			STRPG.starmap.props.now = Date.now();							// Instantiating the 'now'.
			STRPG.starmap.props.then = createjs.Ticker.now;				// Instantiating the 'then'.


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
			requestAnimationFrame and I calculate my own FPS which accounts for pausing and going to other tabs.
			*/
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
		},
		createObjects: function() {
			/* Make all the stuff that will move around on the stage. */
			/*
			console.log('createObjects()');
			STRPG.starmap.props.fpsText = new createjs.Text("Hello World", "14px Arial", STRPG.starmap.props.textColor);
			STRPG.starmap.props.fpsText.textAlign = "right";
			STRPG.starmap.props.fpsText.x = STRPG.starmap.canvas.width - 10;
			STRPG.starmap.props.fpsText.y = 10;
			STRPG.starmap.stage.addChild(STRPG.starmap.props.fpsText);
			*/

			var numFlakes = (STRPG.starmap.canvas.width/50 * 2) * (STRPG.starmap.canvas.height/50 * 2);
			/*
			for (i = 0; i < numFlakes; i++) {
				// Randomly placed, but no less than 10 pixels from each side.
				var tempX = 10 + ( Math.floor( Math.random() * (STRPG.starmap.canvas.width - 10) ) ),
					tempY = 10 + ( Math.floor( Math.random() * (STRPG.starmap.canvas.height - 10) ) ),
					tempRadius = 2 + ( Math.floor( Math.random() * 4 ) ),
					tempResistance = (100 - (Math.floor(Math.random() * 50))) / 100; // Random 5 to 15, from 100, then turned into decimal. Ex .85

				var tempSpeed = (tempRadius - 2) * 10;
				
				// New Snowflake instance.
				//var tempSnowflake = new STRPG.starmap.snowflake( { context:STRPG.starmap.context, x:tempX, y:tempY, radius:tempRadius, resistance:tempResistance, speed:tempSpeed } );
				var tempSnowflake = new classes.Snowflake( { canvas:STRPG.starmap.canvas, id:i, x:tempX, y:tempY, radius:tempRadius, resistance:tempResistance, speed:tempSpeed } );
				STRPG.starmap.props.snowflakes.push(tempSnowflake);
				STRPG.starmap.stage.addChild(tempSnowflake);
			}
			*/
		}
	},
	manageResize: function(event) {
		STRPG.starmap.canvas.width = ( STRPG.starmap.$container.width() < STRPG.starmap.props.width ) ? STRPG.starmap.$container.width() : STRPG.starmap.props.width; 
		STRPG.starmap.canvas.height = ( STRPG.starmap.$container.height() < STRPG.starmap.props.height ) ? STRPG.starmap.$container.height() : STRPG.starmap.props.height; 
	},
	tick: function(event) {

		if ( createjs.Ticker.paused === false ) {
			STRPG.starmap.updateInterval();
			STRPG.starmap.updateObjects(STRPG.starmap.props.interval);
			STRPG.starmap.stage.update(event); // important!!
		}
	},
	getFPS: function(elapsed) {
		/* Reasons are explained in STRPG.starmap.setup.addListeners(), but we're going to calculate our own delta values for this animation. */
		var now = createjs.Ticker.getTime(),
			fps = 0;

		var tempFPS = Math.round(1000/(elapsed*1000));
		fps = isFinite(tempFPS) ? tempFPS : 0;

		return fps;
	},
	updateInterval: function() {
		STRPG.starmap.props.now = Date.now();
		STRPG.starmap.props.interval = (STRPG.starmap.props.now - STRPG.starmap.props.then) / 1000;// seconds since last frame.
		STRPG.starmap.props.then = STRPG.starmap.props.now;
	},
	updateloadGraphic : function(elapsed) {
		/* Simple logic to update the loading graphic while the user waits for assets. */
		STRPG.starmap.loadGraphic.x += elapsed/1000*100;
		if (STRPG.starmap.loadGraphic.x > STRPG.starmap.canvas.width) {
			STRPG.starmap.loadGraphic.x -= STRPG.starmap.canvas.width;
		}
	},
	updateObjects : function(elapsed) {
		var snowflakesArray = STRPG.starmap.props.snowflakes;
		//STRPG.starmap.props.fpsText.text = STRPG.starmap.getFPS(elapsed);
		// move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
		//if (createjs.Ticker.getTicks() % 20 == 0) {
			//console.log('updateObjects() ticks = ' + createjs.Ticker.getTicks());
		//	STRPG.starmap.updateCornerText();
		//}

		for(var i=0; i<snowflakesArray.length; i++) {
			//STRPG.starmap.snowflakes[i].updatePosition(elapsed);

			// vx means "horizontal velocity" and vr means "rotational velocity". Adding them to the x and rotation properties.


			snowflakesArray[i].x += ((STRPG.starmap.props.wind + snowflakesArray[i].speed) * snowflakesArray[i].resistance) * (elapsed);
			snowflakesArray[i].y += ((STRPG.starmap.props.gravity + snowflakesArray[i].speed) * snowflakesArray[i].resistance) * (elapsed);


			// Preparing velocities for the next frame.
			//=========================================
			// wrapping from the left wall.
			if ( (snowflakesArray[i].x + snowflakesArray[i].radius) < 0 ) {
				snowflakesArray[i].x = STRPG.starmap.canvas.width + snowflakesArray[i].radius;
			}
			// wrapping from the right wall.
			if ( (snowflakesArray[i].x - snowflakesArray[i].radius) > STRPG.starmap.canvas.width ) {
				snowflakesArray[i].x = 0 - snowflakesArray[i].radius;
			}
			// wrapping from the floor.
			if ( (snowflakesArray[i].y + snowflakesArray[i].radius) > STRPG.starmap.canvas.height+10) {
				snowflakesArray[i].y = -10 - snowflakesArray[i].radius;
			}
		}
	}
};

STRPG.starmap.init();