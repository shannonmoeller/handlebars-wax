import test from 'ava';
import handlebars from 'handlebars';
import { setup } from './helpers/setup';

test('should not modify partials', async t => {
	const { hb, wax, defaultPartials } = setup();

	wax.partials().partials('./fixtures/helpers/bogu*.js');

	t.deepEqual(Object.keys(hb.partials), defaultPartials);
});

test('should register partials by factory', async t => {
	const { hb, wax } = setup();

	function foo() {}
	function bar() {}

	wax.partials({
		register: function (handlebars) {
			t.is(handlebars, hb);
			handlebars.registerPartial('foo', foo);
		}
	});

	wax.partials({
		register: function (handlebars) {
			t.is(handlebars, hb);
			return { bar };
		}
	});

	t.is(hb.partials.foo, foo);
	t.is(hb.partials.bar, bar);
});

test('should register partials by function', async t => {
	const { hb, wax } = setup();

	function foo() {}
	function bar() {}

	wax.partials(function (handlebars) {
		t.is(handlebars, hb);
		handlebars.registerPartial('foo', foo);
	});

	wax.partials(function (handlebars) {
		t.is(handlebars, hb);
		return { bar };
	});

	t.is(hb.partials.foo, foo);
	t.is(hb.partials.bar, bar);
});

test('should register partials by object', async t => {
	const { hb, wax } = setup();

	function foo() {}
	function bar() {}

	wax.partials({ foo, bar });

	t.is(hb.partials.foo, foo);
	t.is(hb.partials.bar, bar);
});

test('should register partials by globbed factory', async t => {
	const { hb, wax } = setup();

	wax.partials('./fixtures/partials/factory/**/*.js');

	t.is(typeof hb.partials.item, 'string');
	t.is(typeof hb.partials.link, 'string');
	t.is(typeof hb.partials.layout, 'string');
	t.is(typeof hb.partials['layout-2col'], 'string');
});

test('should register partials by globbed function', async t => {
	const { hb, wax } = setup();

	wax.partials('./fixtures/partials/function/**/*.{hbs,js}');

	t.is(typeof hb.partials['components/item'], 'function');
	t.is(typeof hb.partials['components/link'], 'function');
	t.is(typeof hb.partials.layout, 'function');
	t.is(typeof hb.partials['layout-2col'], 'function');
});

test('should register partials by globbed object', async t => {
	const { hb, wax } = setup();

	wax.partials('./fixtures/partials/object/**/*.js');

	t.is(typeof hb.partials.item, 'string');
	t.is(typeof hb.partials.link, 'string');
	t.is(typeof hb.partials.layout, 'string');
	t.is(typeof hb.partials['layout-2col'], 'string');
});

test.after('should not cause cross-contamination', async t => {
	t.is(Object.keys(handlebars.partials).length, 0);
});
