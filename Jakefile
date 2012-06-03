var sys = require('util');
var fs = require('fs');
var exec = require('child_process').exec;

desc("This is the default task.");
task("default", function(params) {
	//Do something.
});

desc("Runs all the tests.");
task("test", function(params){
	exec("jasmine-node spec/", function (error, stdout, stderr) {
		sys.print(stdout);
		sys.print(stderr);
	});
});

desc("Builds the project into a minified file.");
task("build", function(params){
	console.log("Building the project into a minified file...")
	exec("browserify src/goom-ai.js  -o dist/goom-ai.js", function (error, stdout, stderr) {
		sys.print(stdout);
		if (error)
			sys.print(stderr);
		else
			console.log("The file is ready at dist/goom-ai.js");
	});
});
