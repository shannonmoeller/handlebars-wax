'use strict';

module.exports.register = function (hb) {
	hb.registerHelper({
		lower: function (str) {
			return str.toLowerCase();
		},
		upper: function (str) {
			return str.toUpperCase();
		}
	});
};
