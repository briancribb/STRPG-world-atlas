var STRPG = STRPG || {};
STRPG.classes = STRPG.classes || {}; // Giving a namespace to the class we're creating. It keeps things out of global.


(function(){ // IIFE: http://benalman.com/news/2010/11/immediately-invoked-function-expression/

	var Star = function(settings) {
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
	var tempConstructor = Star.prototype = new createjs.Shape(); // inheriting from CreateJS Shape class.

	/**
	 * Now that we have everything that createjs.Shape() has, we need to save the initialize function to another 
	 * name. We'll need to call it in a moment, unchanged and out-of-the-box. So now the original initialize 
	 * function will be called Star.Shape_initialize().
	 */
	Star.prototype.Shape_initialize = tempConstructor.initialize;

	/**
	 * Now we're ready to make our own initialize function. First we call the original function, now named 
	 * Star.Shape_initialize(), so we can have all the super powers of createjs.Shape(). Then we have our 
	 * custom code. We set some variables which are mostly matched up to the docs for the Shape class. For more 
	 * details on that, go here: http://createjs.com/Docs/EaselJS/classes/Shape.html
	 * @type {Function}
	 */
	Star.prototype.initialize = function(settings) {
		this.Shape_initialize();
		// add custom setup logic here.

		//this.stage = settings.stage;		// We could just use "stage", but I like writing things in a similar pattern.
		this.id = settings.id;				// Optional number id for the Shape, not to be confused with the HTML id attribute.
		this.name = settings.name || '';	// We can also give it a text name. Remember this from ActionScript?
		this.x = settings.x;
		this.y = settings.y;
		this.radius = settings.radius;
		this.color = settings.color;

		this.width = 2;						// All of our squares will be the same size.
		this.height = 2;
		this.regX = this.width/2;			// Setting the registration point so we can rotate around the center of the square.
		this.regY = this.height/2;

		/**
		 * Setting the graphics here, but I could have also set it outside of the class and passed the graphics object 
		 * in as a parameter. In this case that would actually be better, since the graphics don't change from square to 
		 * square. I'm just doing it here because this is a demo.
		 */
		this.graphics.beginFill(this.color).arc(this.regX, this.regY, this.radius, 0, Math.PI * 2, true).endFill().closePath();
	}
	Star.prototype.update = function(settings) {
		this.graphics.clear();
		this.graphics.beginPath().beginFill(this.color).arc(this.regX, this.regY, this.radius, 0, Math.PI * 2, true).endFill().closePath();
	}
	STRPG.classes.Star = Star;
}()); // End of IIFE