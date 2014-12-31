'use strict';

module.exports.register = function (hb) {
	hb.registerHelper('lest', function (a, b) {
		return a !== b;
	});
	hb.registerHelper('when', function (a, b) {
		return a === b;
	});
};
