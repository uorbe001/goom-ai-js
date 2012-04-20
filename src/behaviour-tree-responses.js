if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function() {
	var Responses = {};
	Responses.SUCCESS = 0;
	Responses.FAILURE = 1;
	Responses.RUNNING = 2;
	return Responses;
});