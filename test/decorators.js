import test from 'ava';
import { setup } from './helpers/setup';

test('should not modify decorators', async t => {
	const { hb, wax, defaultDecorators } = setup();

	wax.decorators().decorators('./fixtures/decorators/bogu*.js');

	t.deepEqual(Object.keys(hb.decorators), defaultDecorators);
});

test('should register decorators by object', async t => {
	const { hb, wax } = setup();

	function foo() {}
	function bar() {}

	wax.decorators({ foo, bar });

	t.is(hb.decorators.foo, foo);
	t.is(hb.decorators.bar, bar);
});

test('should register decorators by globbed factory', async t => {
	const { hb, wax } = setup();

	wax.decorators('./fixtures/decorators/factory/**/*.js');

	t.is(typeof hb.decorators.currencyDecimal, 'function');
	t.is(typeof hb.decorators.currencyFormat, 'function');
	t.is(typeof hb.decorators.i18nLanguage, 'function');
	t.is(typeof hb.decorators.i18nCountry, 'function');
	t.is(hb.decorators.empty, undefined);
});

test('should register decorators by globbed function', async t => {
	const { hb, wax } = setup();

	wax.decorators('./fixtures/decorators/function/**/*.{hbs,js}');

	t.is(typeof hb.decorators['currency-decimal'], 'function');
	t.is(typeof hb.decorators['currency-format'], 'function');
	t.is(typeof hb.decorators.language, 'function');
	t.is(typeof hb.decorators.country, 'function');
	t.is(hb.decorators.empty, undefined);
});

test('should register decorators by globbed object', async t => {
	const { hb, wax } = setup();

	wax.decorators('./fixtures/decorators/object/**/*.js');

	t.is(typeof hb.decorators.currencyDecimal, 'function');
	t.is(typeof hb.decorators.currencyFormat, 'function');
	t.is(typeof hb.decorators.i18nLanguage, 'function');
	t.is(typeof hb.decorators.i18nCountry, 'function');
	t.is(hb.decorators.empty, undefined);
});

test('should raise errors', async t => {
	const { wax } = setup();
	const template = wax.compile('{{* foo}}');

	t.throws(() => template(), /not a function/i);
});
