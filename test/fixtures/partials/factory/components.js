'use strict';

module.exports.register = function (hb) {
	hb.registerPartial({
		item: '<li>{{label}}</li>',
		link: '<a href="{{url}}">{{label}}</a>'
	});
};
