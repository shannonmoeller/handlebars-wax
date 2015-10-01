/* eslint-env mocha */

var handlebarsRegistrar = require('../index'),
	handlebars = require('handlebars'),
	expect = require('expect'),
	path = require('path');

describe('handlebars-registrar e2e', function () {
	var hb;

	beforeEach(function () {
		hb = handlebars.create();
	});

	it('should use default options', function () {
		handlebarsRegistrar(hb);
	});

	it('should register simple helpers', function () {
		handlebarsRegistrar(hb, {
			helpers: path.join(__dirname, '/fixtures/helpers/function/**/*.js')
		});

		expect(hb.helpers.lower).toBeA(Function);
		expect(hb.helpers.upper).toBeA(Function);
		expect(hb.helpers['flow-lest']).toBeA(Function);
		expect(hb.helpers['flow-when']).toBeA(Function);
		expect(hb.helpers.bogus).toBe(undefined);
		expect(hb.helpers.empty).toBe(undefined);
	});

	it('should register an object of helpers', function () {
		handlebarsRegistrar(hb, {
			helpers: path.join(__dirname, '/fixtures/helpers/object/*.js')
		});

		expect(hb.helpers.lower).toBeA(Function);
		expect(hb.helpers.upper).toBeA(Function);
		expect(hb.helpers.lest).toBeA(Function);
		expect(hb.helpers.when).toBeA(Function);
	});

	it('should register an object literal of helpers', function () {
		handlebarsRegistrar(hb, {
			helpers: {
				lower: require('./fixtures/helpers/function/lower'),
				upper: require('./fixtures/helpers/function/upper')
			}
		});

		handlebarsRegistrar(hb, {
			helpers: function () {
				return {
					lest: require('./fixtures/helpers/function/flow/lest'),
					when: require('./fixtures/helpers/function/flow/when')
				};
			}
		});

		expect(hb.helpers.lower).toBeA(Function);
		expect(hb.helpers.upper).toBeA(Function);
		expect(hb.helpers.lest).toBeA(Function);
		expect(hb.helpers.when).toBeA(Function);
	});

	it('should defer registration of helpers', function () {
		handlebarsRegistrar(hb, {
			helpers: path.join(__dirname, '/fixtures/helpers/deferred/*.js')
		});

		expect(hb.helpers.lower).toBeA(Function);
		expect(hb.helpers.upper).toBeA(Function);
		expect(hb.helpers.lest).toBeA(Function);
		expect(hb.helpers.when).toBeA(Function);
	});

	it('should register raw partials', function () {
		handlebarsRegistrar(hb, {
			partials: path.join(__dirname, '/fixtures/partials/raw/**/*.hbs')
		});

		expect(hb.partials.layout).toBeA(Function);
		expect(hb.partials['layout-2col']).toBeA(Function);
		expect(hb.partials['components/item']).toBeA(Function);
		expect(hb.partials['components/link']).toBeA(Function);
	});

	it('should register an object of partials', function () {
		handlebarsRegistrar(hb, {
			partials: path.join(__dirname, '/fixtures/partials/object/*.js')
		});

		expect(hb.partials.layout).toBeA('string');
		expect(hb.partials['layout-2col']).toBeA('string');
		expect(hb.partials.item).toBeA('string');
		expect(hb.partials.link).toBeA('string');
	});

	it('should register an object literal of partials', function () {
		handlebarsRegistrar(hb, {
			partials: require('./fixtures/partials/object/layouts')
		});

		handlebarsRegistrar(hb, {
			partials: function () {
				return require('./fixtures/partials/object/components');
			}
		});

		expect(hb.partials.layout).toBeA('string');
		expect(hb.partials['layout-2col']).toBeA('string');
		expect(hb.partials.item).toBeA('string');
		expect(hb.partials.link).toBeA('string');
	});

	it('should defer registration of partials', function () {
		handlebarsRegistrar(hb, {
			partials: path.join(__dirname, '/fixtures/partials/deferred/*.js')
		});

		expect(hb.partials.layout).toBeA('string');
		expect(hb.partials['layout-2col']).toBeA('string');
		expect(hb.partials.item).toBeA('string');
		expect(hb.partials.link).toBeA('string');
	});

	it('should allow setting the cwd', function () {
		handlebarsRegistrar(hb, {
			cwd: __dirname,
			helpers: 'fixtures/helpers/function/**/*.js',
			partials: 'fixtures/partials/raw/**/*.hbs'
		});

		expect(hb.helpers.lower).toBeA(Function);
		expect(hb.helpers.upper).toBeA(Function);
		expect(hb.helpers['flow-lest']).toBeA(Function);
		expect(hb.helpers['flow-when']).toBeA(Function);
		expect(hb.helpers.empty).toBe(undefined);

		expect(hb.partials.layout).toBeA(Function);
		expect(hb.partials['layout-2col']).toBeA(Function);
		expect(hb.partials['components/item']).toBeA(Function);
		expect(hb.partials['components/link']).toBeA(Function);
	});
});
