import test from 'ava';
import { setup } from './helpers/setup';

test('should not modify helpers', async t => {
	const { hb, wax, defaultHelpers } = setup();

	wax.helpers().helpers('./fixtures/helpers/bogu*.js');

	t.deepEqual(Object.keys(hb.helpers), defaultHelpers);
});

test('should register helpers by object', async t => {
	const { hb, wax } = setup();

	function foo() {}
	function bar() {}

	wax.helpers({ foo, bar });

	t.is(hb.helpers.foo, foo);
	t.is(hb.helpers.bar, bar);
});

test('should register helpers by globbed factory', async t => {
	const { hb, wax } = setup();

	wax.helpers('./fixtures/helpers/factory/**/*.js');

	t.is(typeof hb.helpers.lower, 'function');
	t.is(typeof hb.helpers.upper, 'function');
	t.is(typeof hb.helpers.lest, 'function');
	t.is(typeof hb.helpers.when, 'function');
	t.is(hb.helpers.empty, undefined);
});

test('should register helpers by globbed function', async t => {
	const { hb, wax } = setup();

	wax.helpers('./fixtures/helpers/function/**/*.{hbs,js}');

	t.is(typeof hb.helpers.lower, 'function');
	t.is(typeof hb.helpers.upper, 'function');
	t.is(typeof hb.helpers['flow-lest'], 'function');
	t.is(typeof hb.helpers['flow-when'], 'function');
	t.is(hb.helpers.empty, undefined);
});

test('should register helpers by globbed object', async t => {
	const { hb, wax } = setup();

	wax.helpers('./fixtures/helpers/object/**/*.js');

	t.is(typeof hb.helpers.lower, 'function');
	t.is(typeof hb.helpers.upper, 'function');
	t.is(typeof hb.helpers.lest, 'function');
	t.is(typeof hb.helpers.when, 'function');
	t.is(hb.helpers.empty, undefined);
});
