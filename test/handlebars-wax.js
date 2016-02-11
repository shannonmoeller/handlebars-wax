import test from 'ava';
import handlebars from 'handlebars';
import handlebarsWax from '../src/handlebars-wax';

function setup() {
	const hb = handlebars.create();
	const defaultPartials = Object.keys(hb.partials);
	const defaultHelpers = Object.keys(hb.helpers);
	const defaultDecorators = Object.keys(hb.decorators);

	const wax = handlebarsWax(hb);
	const defaultData = Object.keys(wax.context);

	return {
		hb,
		wax,
		defaultPartials,
		defaultHelpers,
		defaultDecorators,
		defaultData
	};
}

// Partials

test('should not modify partials', async assert => {
	const {hb, wax, defaultPartials} = setup();

	wax.partials().partials('./fixtures/helpers/bogu*.js');

	assert.same(Object.keys(hb.partials), defaultPartials);
});

test('should register partials by object', async assert => {
	const {hb, wax} = setup();

	function foo() {}
	function bar() {}

	wax.partials({foo, bar});

	assert.is(hb.partials.foo, foo);
	assert.is(hb.partials.bar, bar);
});

test('should register partials by globbed function', async assert => {
	const {hb, wax} = setup();

	wax.partials('./fixtures/partials/function/**/*.{hbs,js}');

	assert.is(typeof hb.partials['components/item'], 'function');
	assert.is(typeof hb.partials['components/link'], 'function');
	assert.is(typeof hb.partials.layout, 'function');
	assert.is(typeof hb.partials['layout-2col'], 'function');
});

test('should register partials by globbed object', async assert => {
	const {hb, wax} = setup();

	wax.partials('./fixtures/partials/object/**/*.js');

	assert.is(typeof hb.partials.item, 'string');
	assert.is(typeof hb.partials.link, 'string');
	assert.is(typeof hb.partials.layout, 'string');
	assert.is(typeof hb.partials['layout-2col'], 'string');
});

test('should register partials by globbed factory', async assert => {
	const {hb, wax} = setup();

	wax.partials('./fixtures/partials/factory/**/*.js');

	assert.is(typeof hb.partials.item, 'string');
	assert.is(typeof hb.partials.link, 'string');
	assert.is(typeof hb.partials.layout, 'string');
	assert.is(typeof hb.partials['layout-2col'], 'string');
});

// Helpers

test('should not modify helpers', async assert => {
	const {hb, wax, defaultHelpers} = setup();

	wax.helpers().helpers('./fixtures/helpers/bogu*.js');

	assert.same(Object.keys(hb.helpers), defaultHelpers);
});

test('should register helpers by object', async assert => {
	const {hb, wax} = setup();

	function foo() {}
	function bar() {}

	wax.helpers({foo, bar});

	assert.is(hb.helpers.foo, foo);
	assert.is(hb.helpers.bar, bar);
});

test('should register helpers by globbed function', async assert => {
	const {hb, wax} = setup();

	wax.helpers('./fixtures/helpers/function/**/*.{hbs,js}');

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers['flow-lest'], 'function');
	assert.is(typeof hb.helpers['flow-when'], 'function');
	assert.is(hb.helpers.empty, undefined);
});

test('should register helpers by globbed object', async assert => {
	const {hb, wax} = setup();

	wax.helpers('./fixtures/helpers/object/**/*.js');

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers.lest, 'function');
	assert.is(typeof hb.helpers.when, 'function');
	assert.is(hb.helpers.empty, undefined);
});

test('should register helpers by globbed factory', async assert => {
	const {hb, wax} = setup();

	wax.helpers('./fixtures/helpers/factory/**/*.js');

	assert.is(typeof hb.helpers.lower, 'function');
	assert.is(typeof hb.helpers.upper, 'function');
	assert.is(typeof hb.helpers.lest, 'function');
	assert.is(typeof hb.helpers.when, 'function');
	assert.is(hb.helpers.empty, undefined);
});

// Decorators

test('should not modify decorators', async assert => {
	const {hb, wax, defaultDecorators} = setup();

	wax.decorators().decorators('./fixtures/decorators/bogu*.js');

	assert.same(Object.keys(hb.decorators), defaultDecorators);
});

test('should register decorators by object', async assert => {
	const {hb, wax} = setup();

	function foo() {}
	function bar() {}

	wax.decorators({foo, bar});

	assert.is(hb.decorators.foo, foo);
	assert.is(hb.decorators.bar, bar);
});

test('should register decorators by globbed function', async assert => {
	const {hb, wax} = setup();

	wax.decorators('./fixtures/decorators/function/**/*.{hbs,js}');

	assert.is(typeof hb.decorators['currency-decimal'], 'function');
	assert.is(typeof hb.decorators['currency-format'], 'function');
	assert.is(typeof hb.decorators.language, 'function');
	assert.is(typeof hb.decorators.country, 'function');
	assert.is(hb.decorators.empty, undefined);
});

test('should register decorators by globbed object', async assert => {
	const {hb, wax} = setup();

	wax.decorators('./fixtures/decorators/object/**/*.js');

	assert.is(typeof hb.decorators.currencyDecimal, 'function');
	assert.is(typeof hb.decorators.currencyFormat, 'function');
	assert.is(typeof hb.decorators.i18nLanguage, 'function');
	assert.is(typeof hb.decorators.i18nCountry, 'function');
	assert.is(hb.decorators.empty, undefined);
});

test('should register decorators by globbed factory', async assert => {
	const {hb, wax} = setup();

	wax.decorators('./fixtures/decorators/factory/**/*.js');

	assert.is(typeof hb.decorators.currencyDecimal, 'function');
	assert.is(typeof hb.decorators.currencyFormat, 'function');
	assert.is(typeof hb.decorators.i18nLanguage, 'function');
	assert.is(typeof hb.decorators.i18nCountry, 'function');
	assert.is(hb.decorators.empty, undefined);
});

// Data

test('should not modify data', async assert => {
	const {wax, defaultData} = setup();

	wax.data();

	assert.same(Object.keys(wax.context), defaultData);
});

test('should register data by object', async assert => {
	const {wax} = setup();
	const foo = 'hello';
	const bar = 'world';

	wax.data({foo, bar});

	assert.is(wax.context.foo, foo);
	assert.is(wax.context.bar, bar);
});

test('should register data by globbed object', async assert => {
	const {wax} = setup();

	wax.data('./fixtures/data/object/**/*.{js,json}');

	assert.is(wax.context.hello, 'world');
	assert.same(wax.context.good.night, ['chair', 'bear', 'moon']);
});

// Compile

test('should pre-fill template-string data', async assert => {
	const {wax} = setup();
	const waxedTemplate = wax.compile('{{foo}} {{bar}} {{baz}}');

	wax.data({foo: 'hello', bar: 'world'});

	assert.is(waxedTemplate(), 'hello world ');
	assert.is(waxedTemplate({foo: 'a'}), 'a world ');
	assert.is(waxedTemplate({bar: 'b'}), 'hello b ');
	assert.is(waxedTemplate({baz: 'c'}), 'hello world c');
});

test('should pre-fill template-function data', async assert => {
	const {hb, wax} = setup();
	const template = hb.compile('{{foo}} {{bar}} {{baz}}');
	const waxedTemplate = wax.compile(template);

	wax.data({foo: 'hello', bar: 'world'});

	assert.is(template(), '  ');
	assert.is(template({foo: 'a'}), 'a  ');
	assert.is(template({bar: 'b'}), ' b ');
	assert.is(template({baz: 'c'}), '  c');

	assert.is(waxedTemplate(), 'hello world ');
	assert.is(waxedTemplate({foo: 'a'}), 'a world ');
	assert.is(waxedTemplate({bar: 'b'}), 'hello b ');
	assert.is(waxedTemplate({baz: 'c'}), 'hello world c');
});

// Housekeeping

test.after('should not cause cross-contamination', async assert => {
	assert.is(Object.keys(handlebars.partials).length, 0);
});
