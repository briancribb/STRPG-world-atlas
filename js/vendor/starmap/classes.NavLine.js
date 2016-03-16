var classes = classes || {}; // Giving a namespace to the class we're creating. It keeps things out of global.

//http://createjs.com/tutorials/Inheritance/
(function() {
	/*
	We're creating a temporary object that lives only during this anonymous setup function. Once it's built up and 
	ready, we will add it to our classes object to be used by an outside application.
	*/

	//function NavLine(canvas, id, x, y, vx, vy, vr) {
	function NavLine(settings) {
		//console.log('NavLine constructor');
		this.Shape_constructor();
		// Assign properties from what is passed in.
		this.canvas		= settings.canvas;			// We could just use "stage", but I like writing things in a similar pattern.
		this.name = settings.name || '';	// We can also give it a text name. Remember this from ActionScript?
		this.radius = settings.radius;
		this.color		= settings.color;

		this.x = 0;
		this.y = 0;
		this.startPoint = {x:null, y:null},
		this.endPoint = {x:null, y:null},
		this.spaceBetween = 10,
		this.increment = 0;
	}

	// extend() builds our temporary object up with the parent as it's prototype. It then returns the new prototype, 
	// so we could give this a shorter variable name if we wanted to.
	NavLine.prototype = createjs.extend(NavLine, createjs.Shape);

	NavLine.prototype.update = function() {

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

	/*
	Now we're actually going to create the class and use it. Any methods we override will be renamed
	to prefix_methodName(), as in: Container_draw(). We're adding the resulting class to our classes
	object to avoid polluting the global namespace.
	*/
	
	classes.NavLine = createjs.promote(NavLine, "Shape");

}());
