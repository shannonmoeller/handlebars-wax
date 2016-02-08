import handlebars from 'handlebars';
import path from 'path';
import test from 'ava';
import handlebarsGlob from '../src/handlebars-glob';

const cwd = path.dirname(__dirname);

test('should register nothing', async assert => {
	const hb = handlebars.create();

	handlebarsGlob(hb)
		.decorators()
		.helpers()
		.partials();

	assert.is(hb.decorators.foo, undefined);
	assert.is(hb.decorators.bar, undefined);
	assert.is(hb.helpers.baz, undefined);
	assert.is(hb.helpers.qux, undefined);
	assert.is(hb.partials.boo, undefined);
	assert.is(hb.partials.far, undefined);

	handlebarsGlob(hb)
		.decorators('./fixtures/decorators/bogu*.js')
		.helpers('./fixtures/helpers/bogu*.js')
		.partials('./fixtures/partials/bogu*.js');

	assert.is(hb.decorators.foo, undefined);
	assert.is(hb.decorators.bar, undefined);
	assert.is(hb.helpers.baz, undefined);
	assert.is(hb.helpers.qux, undefined);
	assert.is(hb.partials.boo, undefined);
	assert.is(hb.partials.far, undefined);
});

test('should register objects', async assert => {
	const hb = handlebars.create();

	function foo() {}
	function bar() {}
	function baz() {}
	function qux() {}
	function boo() {}
	function far() {}

	handlebarsGlob(hb)
		.decorators({
			foo: foo,
			bar: bar
		})
		.helpers({
			baz: baz,
			qux: qux
		})
		.partials({
			boo: boo,
			far: far
		});

	assert.is(hb.decorators.foo, foo);
	assert.is(hb.decorators.bar, bar);

	assert.is(hb.helpers.baz, baz);
	assert.is(hb.helpers.qux, qux);

	assert.is(hb.partials.boo, boo);
	assert.is(hb.partials.far, far);
});

test('should register objects by glob', async assert => {
	const hb = handlebars.create();

	handlebarsGlob(hb)
		.decorators('./test/fixtures/decorators/object/**/*.js', {cwd})
		.helpers('./fixtures/helpers/object/**/*.js')
		.partials('./fixtures/partials/object/**/*.js');

	assert.is(typeof hb.decorators.currencyDecimal, 'function');
	assert.is(typeof hb.decorators.currencyFormat, 'function');
	assert.is(typeof hb.decorators.i18nLanguage, 'function');
	assert.is(typeof hb.decorators.i18nCountry, 'function');
	assert.is(hb.decorators.empty, undefined);

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers.lest, 'function');
	assert.is(typeof hb.helpers.when, 'function');
	assert.is(hb.helpers.empty, undefined);

	assert.is(typeof hb.partials.item, 'string');
	assert.is(typeof hb.partials.link, 'string');
	assert.is(typeof hb.partials.layout, 'string');
	assert.is(typeof hb.partials['layout-2col'], 'string');
});

test('should register functions by glob', async assert => {
	const hb = handlebars.create();

	handlebarsGlob(hb)
		.decorators('./fixtures/decorators/raw/**/*.js')
		.helpers('./test/fixtures/helpers/raw/**/*.js', {cwd})
		.partials('./fixtures/partials/raw/**/*.hbs');

	assert.is(typeof hb.decorators['currency-decimal'], 'function');
	assert.is(typeof hb.decorators['currency-format'], 'function');
	assert.is(typeof hb.decorators['i18n-language'], 'function');
	assert.is(typeof hb.decorators['i18n-country'], 'function');
	assert.is(hb.decorators.empty, undefined);

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers['flow-lest'], 'function');
	assert.is(typeof hb.helpers['flow-when'], 'function');
	assert.is(hb.helpers.empty, undefined);

	assert.is(typeof hb.partials['components/item'], 'function');
	assert.is(typeof hb.partials['components/link'], 'function');
	assert.is(typeof hb.partials.layout, 'function');
	assert.is(typeof hb.partials['layout-2col'], 'function');
});

test('should defer registration by glob', async assert => {
	const hb = handlebars.create();

	handlebarsGlob(hb)
		.decorators('./fixtures/decorators/deferred/**/*.js')
		.helpers('./fixtures/helpers/deferred/**/*.js')
		.partials('./test/fixtures/partials/deferred/**/*.js', {cwd});

	assert.is(typeof hb.decorators.currencyDecimal, 'function');
	assert.is(typeof hb.decorators.currencyFormat, 'function');
	assert.is(typeof hb.decorators.i18nLanguage, 'function');
	assert.is(typeof hb.decorators.i18nCountry, 'function');
	assert.is(hb.decorators.empty, undefined);

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers.lest, 'function');
	assert.is(typeof hb.helpers.when, 'function');
	assert.is(hb.helpers.empty, undefined);

	assert.is(typeof hb.partials.item, 'string');
	assert.is(typeof hb.partials.link, 'string');
	assert.is(typeof hb.partials.layout, 'string');
	assert.is(typeof hb.partials['layout-2col'], 'string');
});

test.after('should not cause cross-contamination', async assert => {
	const hb = handlebars.create();

	assert.is(hb.decorators.currencyDecimal, undefined);
	assert.is(hb.helpers.lower, undefined);
	assert.is(hb.partials.layout, undefined);

	assert.is(handlebars.decorators.currencyDecimal, undefined);
	assert.is(handlebars.helpers.upper, undefined);
	assert.is(handlebars.partials.layout, undefined);
});
