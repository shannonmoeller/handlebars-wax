'use strict';

var handlebarsRegistrar = require('../index'),
	handlebars = require('handlebars'),
	expect = require('expect.js');

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

		expect(hb.helpers.lower).to.be.a('function');
		expect(hb.helpers.upper).to.be.a('function');
		expect(hb.helpers['flow-lest']).to.be.a('function');
		expect(hb.helpers['flow-when']).to.be.a('function');
		expect(hb.helpers.empty).to.be(undefined);
	});

	it('should register an object of helpers', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			helpers: __dirname + '/fixtures/helpers/object/*.js'
		});

		expect(hb.helpers.lower).to.be.a('function');
		expect(hb.helpers.upper).to.be.a('function');
		expect(hb.helpers.lest).to.be.a('function');
		expect(hb.helpers.when).to.be.a('function');
	});

	it('should defer registration of helpers', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			helpers: __dirname + '/fixtures/helpers/deferred/*.js'
		});

		expect(hb.helpers.lower).to.be.a('function');
		expect(hb.helpers.upper).to.be.a('function');
		expect(hb.helpers.lest).to.be.a('function');
		expect(hb.helpers.when).to.be.a('function');
	});

	it('should register raw partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/raw/**/*.hbs'
		});

		expect(hb.partials.layout).to.be.a('function');
		expect(hb.partials['layout-2col']).to.be.a('function');
		expect(hb.partials['components/item']).to.be.a('function');
		expect(hb.partials['components/link']).to.be.a('function');
	});

	it('should register an object of partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/object/*.js'
		});

		expect(hb.partials.layout).to.be.a('string');
		expect(hb.partials['layout-2col']).to.be.a('string');
		expect(hb.partials.item).to.be.a('string');
		expect(hb.partials.link).to.be.a('string');
	});

	it('should defer registration of partials', function () {
		var hb = handlebars.create();

		handlebarsRegistrar(hb, {
			partials: __dirname + '/fixtures/partials/deferred/*.js'
		});

		expect(hb.partials.layout).to.be.a('string');
		expect(hb.partials['layout-2col']).to.be.a('string');
		expect(hb.partials.item).to.be.a('string');
		expect(hb.partials.link).to.be.a('string');
	});
});
