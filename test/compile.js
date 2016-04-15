import test from 'ava';
import { setup } from './helpers/setup';

test('should pre-fill template-string data', async t => {
	const { wax } = setup();
	const waxedTemplate = wax.compile('{{foo}} {{bar}} {{baz}}');

	wax.data({ foo: 'hello', bar: 'world' });

	t.is(waxedTemplate(), 'hello world ');
	t.is(waxedTemplate({ foo: 'a' }), 'a world ');
	t.is(waxedTemplate({ bar: 'b' }), 'hello b ');
	t.is(waxedTemplate({ baz: 'c' }), 'hello world c');
});

test('should pre-fill template-function data', async t => {
	const { hb, wax } = setup();
	const template = hb.compile('{{foo}} {{bar}} {{baz}}');
	const waxedTemplate = wax.compile(template);

	wax.data({ foo: 'hello', bar: 'world' });

	t.is(template(), '  ');
	t.is(template({ foo: 'a' }), 'a  ');
	t.is(template({ bar: 'b' }), ' b ');
	t.is(template({ baz: 'c' }), '  c');

	t.is(waxedTemplate(), 'hello world ');
	t.is(waxedTemplate({ foo: 'a' }), 'a world ');
	t.is(waxedTemplate({ bar: 'b' }), 'hello b ');
	t.is(waxedTemplate({ baz: 'c' }), 'hello world c');
});

test('should set registered data as _parent', async t => {
	const { wax } = setup();
	const waxedTemplate = wax.compile('{{_parent.foo}} {{foo}}');

	wax.data({ foo: 'hello' });

	t.is(waxedTemplate({ foo: 'world' }), 'hello world');
});

test('should set registered data as @root', async t => {
	const { wax } = setup();
	const waxedTemplate = wax.compile('{{@root.foo}} {{foo}}');

	wax.data({ foo: 'hello' });

	t.is(waxedTemplate({ foo: 'world' }), 'hello world');
});

test('should prefer user-specified @root', async t => {
	const { wax } = setup();
	const waxedTemplate = wax.compile('{{foo}} {{_parent.foo}} {{@root.foo}} {{@root._parent.foo}}');

	wax.data({ foo: 'hello' });

	t.is(waxedTemplate({ foo: 'world' }, { data: { root: { foo: 'bye' } } }), 'world hello bye hello');
});
