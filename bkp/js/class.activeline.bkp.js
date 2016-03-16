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
		this.x = 0;
		this.y = 0;

		this.spaceBetween		= 10;
		this.startPoint			= { x:settings.x1, y:settings.y1 };
		this.midPoint			= {};
		this.endPoint			= { x:settings.x2, y:settings.y2 };
		this.radius				= 1,
		this.increment			= 0;
		this.color				= settings.color;
		this.alpha				= 0;
		this.dotSpeed			= .05;

		/*
		 * Setting the graphics here, but I could have also set it outside of the class and passed the graphics object 
		 * in as a parameter. In this case that would actually be better, since the graphics don't change from square to 
		 * square. I'm just doing it here because this is a demo.
		 */
	}
	ActiveLine.prototype.update = function(settings) {
		this.dy					= this.endPoint.y - this.startPoint.y;
		this.dx					= this.endPoint.x - this.startPoint.x;
		this.lineAngle			= Math.atan2(this.dy, this.dx);
		this.distance			= STRPG.utils.getDistance(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y, true);
		this.numDots			= Math.floor(this.distance/this.spaceBetween);
		this.partialDistance	= this.distance / this.numDots;

		this.graphics
			.clear()
			.moveTo(this.startPoint.x, this.startPoint.y)
			.beginStroke('rgba(255,255,255,0.5)')
				.lineTo(this.endPoint.x, this.endPoint.y)
			.endStroke();

		// Dots
		this.midPoint = {};
		for (var i = 0; i < this.numDots; i++) {
			this.midPoint.x = Math.round( this.startPoint.x + Math.cos(this.lineAngle) * (this.increment + this.partialDistance*i) ),
			this.midPoint.y = Math.round( this.startPoint.y + Math.sin(this.lineAngle) * (this.increment + this.partialDistance*i) );
			this.graphics.beginFill(this.color)
				//.arc(this.midPoint.x, this.midPoint.y, this.radius, 0, Math.PI * 2, true)
				.moveTo(this.startPoint.x, this.startPoint.y)
				.lineTo(this.startPoint.x-2, this.startPoint.y+2)
				.lineTo(this.startPoint.x-2, this.startPoint.y-2)
				.lineTo(this.startPoint.x, this.startPoint.y)
			.endFill();
			this.increment = ( this.increment < this.partialDistance ) ? this.increment + this.dotSpeed : 1
		}
	}
	STRPG.classes.ActiveLine = ActiveLine;
}()); // End of IIFE