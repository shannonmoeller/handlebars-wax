var handlebars = require('handlebars');
var handlebarsWax = require('../../src/handlebars-wax');

exports.setup = function setup() {
	var hb = handlebars.create();
	var defaultPartials = Object.keys(hb.partials);
	var defaultHelpers = Object.keys(hb.helpers);
	var defaultDecorators = Object.keys(hb.decorators);

	var wax = handlebarsWax(hb);
	var defaultData = Object.keys(wax.context);

	return {
		hb: hb,
		wax: wax,
		defaultPartials: defaultPartials,
		defaultHelpers: defaultHelpers,
		defaultDecorators: defaultDecorators,
		defaultData: defaultData
	};
};
