(function(){
	/*
	 Layout management is powered by jQuery because it has nothing to do with the data. This function 
	 corrects the app's padding and margins on the top/bottom to make room for the nav and our sticky footer.
	 */

	var $bodyElement		= $('body'),
		$mainNav			= $('#main-nav'),
		$mainFooter			= $('#main-footer'),
		$mainFooterContent	= $('#main-footer-content');

	var throttled = _.throttle(function(){
		manageResize();
	}, 250);

	function manageResize() {
		var footerHeight = $mainFooterContent.outerHeight(true),
			navHeight = $mainNav.outerHeight(true);

		$mainFooter.height( footerHeight );

		$bodyElement.css({
			'padding-bottom'	:footerHeight,
			'padding-top'		:navHeight
		});
	}

	// Wait until the DOM is loaded.
	$(function() {
		// Run it once to cover smaller window sizes on page load.
		manageResize();

		// Now start throttling.
		$(window).resize(throttled);
	});
}());