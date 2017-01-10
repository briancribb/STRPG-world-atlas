var STRPG = STRPG || {};
STRPG.classes = STRPG.classes || {}; // Giving a namespace to the class we're creating. It keeps things out of global.


(function(){ // IIFE: http://benalman.com/news/2010/11/immediately-invoked-function-expression/

	var ActiveLine = function(settings) {
		// Very important. Our constructor passes all of the parameters to the initialize function.
		// Our custom stuff will live in that function.
		this.initialize(settings);
	}

	/**
	 * This next bit is extremely important. Since we're inheriting from createjs.Shape(), we need to make 
	 * sure that the initialize function for that is called before our custom stuff comes in. First, we make 
	 * our constructor equals Shape's, so we are now inheriting everything. I'm also assigning it to a short 
	 * variable name to make the rest of the code more readable. 
	 */
	var tempConstructor = ActiveLine.prototype = new createjs.Shape(); // inheriting from CreateJS Shape class.

	/**
	 * Now that we have everything that createjs.Shape() has, we need to save the initialize function to another 
	 * name. We'll need to call it in a moment, unchanged and out-of-the-box. So now the original initialize 
	 * function will be called ActiveLine.Shape_initialize().
	 */
	ActiveLine.prototype.Shape_initialize = tempConstructor.initialize;

	/**
	 * Now we're ready to make our own initialize function. First we call the original function, now named 
	 * ActiveLine.Shape_initialize(), so we can have all the super powers of createjs.Shape(). Then we have our 
	 * custom code. We set some variables which are mostly matched up to the docs for the Shape class. For more 
	 * details on that, go here: http://createjs.com/Docs/EaselJS/classes/Shape.html
	 * @type {Function}
	 */
	ActiveLine.prototype.initialize = function(settings) {
		this.Shape_initialize();
		// add custom setup logic here.

		//this.stage = settings.stage;		// We could just use "stage", but I like writing things in a similar pattern.
		this.id = settings.id;				// Optional number id for the Shape, not to be confused with the HTML id attribute.
		//this.index = settings.index;		// This records the stars place in the allActiveLines array.
		this.name = settings.name || '';	// We can also give it a text name. Remember this from ActionScript?
		this.x = settings.x;
		this.y = settings.y;
		this.startPoint = {x:0, y:0},
		this.endPoint = {x:0, y:0},
		this.spaceBetween = 10,
		this.radius = settings.radius,
		this.increment = 0;
 





		/*
		 * Setting the graphics here, but I could have also set it outside of the class and passed the graphics object 
		 * in as a parameter. In this case that would actually be better, since the graphics don't change from square to 
		 * square. I'm just doing it here because this is a demo.
		 */
	}
	ActiveLine.prototype.update = function(settings) {
		this.graphics.clear();

		var dy = this.endPoint.y - this.startPoint.y,
			dx = this.endPoint.x - this.startPoint.x,
			lineAngle = Math.atan2(dy, dx) * (180/Math.PI), // Converting from radians.
			distance = getDistance(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
			numDots = Math.floor(distance/this.spaceBetween),
			partialDistance = distance / numDots,
			midPoint = {}; // Cleared on each loop

		this.x = this.startPoint.x;
		this.y = this.startPoint.y;

		this.graphics
			.setStrokeStyle(1,"round")
			.beginStroke("rgba(255,255,255,1)")
				.moveTo(0,0)
				.lineTo(distance,0)
			.endStroke();


		for (var i = 0; i < numDots; i++) {
			midPoint.x = this.increment + partialDistance*i;
			midPoint.y = 0;
			
			this.graphics
				.setStrokeStyle(2,"round")
				.beginFill("rgba(255,255,255,1)")
					.moveTo(midPoint.x+2, midPoint.y-.25)
					//.arc(midPoint.x, midPoint.y, this.radius, 0, Math.PI * 2, true)
					.lineTo(midPoint.x-2, midPoint.y-2)
					.lineTo(midPoint.x-2, midPoint.y+2)
					.lineTo(midPoint.x+2, midPoint.y+.25)
					.lineTo(midPoint.x+2, midPoint.y)
				.endFill();
			
			this.increment = ( this.increment < partialDistance ) ? this.increment+.020 : 1;
		}


		this.rotation = lineAngle;

		function getDistance(x1, y1, x2, y2) {
			return ( Math.sqrt( Math.pow( (x2 - x1) ,2) + Math.pow( (y2 - y1) ,2) ) );
		}


	}
	STRPG.classes.ActiveLine = ActiveLine;
}()); // End of IIFE