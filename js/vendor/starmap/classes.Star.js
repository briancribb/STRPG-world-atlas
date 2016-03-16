var classes = classes || {}; // Giving a namespace to the class we're creating. It keeps things out of global.

//http://createjs.com/tutorials/Inheritance/
(function() {
	/*
	We're creating a temporary object that lives only during this anonymous setup function. Once it's built up and 
	ready, we will add it to our classes object to be used by an outside application.
	*/

	//function Star(canvas, id, x, y, vx, vy, vr) {
	function Star(settings) {
		//console.log('Star constructor');
		this.Shape_constructor();
		// Assign properties from what is passed in.
		this.canvas		= settings.canvas;			// We could just use "stage", but I like writing things in a similar pattern.
		this.id			= settings.id;				// Optional number id for the Shape, not to be confused with the HTML id attribute.
		this.name		= settings.name;			// We can also give it a text name. Remember this from ActionScript?
		this.x			= settings.x;
		this.y			= settings.y;
		this.coordX		= settings.coordX;			// Original x coordinate before tranlating to map pixels.
		this.coordY		= settings.coordY;			// Original y coordinate before tranlating to map pixels.
		this.radius		= settings.radius;
		this.color		= settings.color;


		//this.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").drawCircle(160,60,40);
		//this.graphics.beginStroke("#FFF").beginFill("#bad").drawRect(0, 0, this.width, this.height);
		this.graphics.beginFill(this.color).drawCircle(0, 0, this.radius);
	}

	// extend() builds our temporary object up with the parent as it's prototype. It then returns the new prototype, 
	// so we could give this a shorter variable name if we wanted to.
	Star.prototype = createjs.extend(Star, createjs.Shape);

	Star.prototype.update = function() {

	}

	/*
	Now we're actually going to create the class and use it. Any methods we override will be renamed
	to prefix_methodName(), as in: Container_draw(). We're adding the resulting class to our classes
	object to avoid polluting the global namespace.
	*/
	
	classes.Star = createjs.promote(Star, "Shape");

}());