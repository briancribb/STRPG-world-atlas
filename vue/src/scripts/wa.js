var WA = WA || {};

// Accepts a jQuery Deferred object which will be resolved when the data is ready.

WA.init = function() {
	console.log('init()');
	WA.getData( $.Deferred().done(function(data) {
		console.log(['data has arrived: ', data]);
		WA.vm(data);
	}) );

}

WA.vm = function (data) {
	console.log(['vm: ', data]);

};



