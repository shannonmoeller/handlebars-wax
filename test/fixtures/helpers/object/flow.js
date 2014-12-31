'use strict';

module.exports = {
	lest: function (a, b) {
		return a !== b;
	},
	when: function (a, b) {
		return a === b;
	}
};
