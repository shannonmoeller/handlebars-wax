'use strict';

var handlebarsRegistrar = require('../index'),
	handlebars = require('handlebars'),
	expect = require('expect');

describe('handlebars-registrar e2e', function () {
	it('should use default options', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb);
	});

	it('should register simple helpers', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			helpers: __dirname + '/fixtures/helpers/function/**/*.js'
		});

		expect(hb.helpers.lower).toBeA('function');
		expect(hb.helpers.upper).toBeA('function');
		expect(hb.helpers['flow-lest']).toBeA('function');
		expect(hb.helpers['flow-when']).toBeA('function');
		expect(hb.helpers.empty).toBe(undefined);
	});

	it('should register an object of helpers', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			helpers: __dirname + '/fixtures/helpers/object/*.js'
		});

		expect(hb.helpers.lower).toBeA('function');
		expect(hb.helpers.upper).toBeA('function');
		expect(hb.helpers.lest).toBeA('function');
		expect(hb.helpers.when).toBeA('function');
	});

	it('should defer registration of helpers', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			helpers: __dirname + '/fixtures/helpers/deferred/*.js'
		});

		expect(hb.helpers.lower).toBeA('function');
		expect(hb.helpers.upper).toBeA('function');
		expect(hb.helpers.lest).toBeA('function');
		expect(hb.helpers.when).toBeA('function');
	});

	it('should register raw partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/raw/**/*.hbs'
		});

		expect(hb.partials.layout).toBeA('function');
		expect(hb.partials['layout-2col']).toBeA('function');
		expect(hb.partials['components/item']).toBeA('function');
		expect(hb.partials['components/link']).toBeA('function');
	});

	it('should register an object of partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/object/*.js'
		});

		expect(hb.partials.layout).toBeA('string');
		expect(hb.partials['layout-2col']).toBeA('string');
		expect(hb.partials.item).toBeA('string');
		expect(hb.partials.link).toBeA('string');
	});

	it('should defer registration of partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/deferred/*.js'
		});

		expect(hb.partials.layout).toBeA('string');
		expect(hb.partials['layout-2col']).toBeA('string');
		expect(hb.partials.item).toBeA('string');
		expect(hb.partials.link).toBeA('string');
	});

	it('should allow setting the cwd', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			cwd: __dirname,
			helpers: 'fixtures/helpers/function/**/*.js',
			partials: 'fixtures/partials/raw/**/*.hbs'
		});

		expect(hb.helpers.lower).toBeA('function');
		expect(hb.helpers.upper).toBeA('function');
		expect(hb.helpers['flow-lest']).toBeA('function');
		expect(hb.helpers['flow-when']).toBeA('function');
		expect(hb.helpers.empty).toBe(undefined);

		expect(hb.partials.layout).toBeA('function');
		expect(hb.partials['layout-2col']).toBeA('function');
		expect(hb.partials['components/item']).toBeA('function');
		expect(hb.partials['components/link']).toBeA('function');
	});
});
