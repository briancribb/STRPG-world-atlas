//Written

module.exports =  {
    //fn1: function() { /**/ },
    getJSFiles: function(strParent) {
    	var strLocal = 'src/scripts/';
    	var arrFiles = [
    		"wa.js",
    		"wa.data.js",
    		"wa.init.js"
    	];
    	for (var i = 0; i < arrFiles.length; i++) {
    		arrFiles[i] = strParent + strLocal + arrFiles[i];
    	}
    	return arrFiles;
    }
}