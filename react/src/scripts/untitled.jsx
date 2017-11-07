	_addListeners() {
		let that = this;

		/*
		Our nav buttons are used to scroll in the browser, and have nothing to do with the data. They're also outside of 
		the app. Using jQuery to move between the top and bottom of the page.  
		*/
		$('body').on( "click", function(event) {
			var $target = $(event.target);
			switch (event.target.id) {

				/*
				// Return to the top
				case 'navbar-brand':
					window.scroll(0, 0);
					break;

				// Return to the top
				case 'btn-return-top':
					scrollToPosition(0);
					break;

				// Scroll to the footer
				case 'btn-footer':
					scrollToPosition( $pageFooter.position().top );
					break;

				// Search for a the first entry in a given century
				case 'btn-search':
					scrollToCentury();
					break;

				default:
					// If there's no id or it doesn't match anything, then do nothing.
					break;
			}
			*/
		});



		function orderPlanets(orderBy) {
			if (!orderBy) { return };
			return that.state.planets;

			//this.$parent.planets = _.sortBy(this.$parent.planets, function(planet){ return planet[orderBy] });

		}
		function reverseArray() {
			this.$parent.planets = this.$parent.planets.reverse();
		}

	}
