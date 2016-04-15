import test from 'ava';
import { setup } from './helpers/setup';

test('should not modify data', async t => {
	const { wax, defaultData } = setup();

	wax.data();

	t.deepEqual(Object.keys(wax.context), defaultData);
});

test('should register data by object', async t => {
	const { wax } = setup();
	const foo = 'hello';
	const bar = 'world';

	wax.data({ foo, bar });

	t.is(wax.context.foo, foo);
	t.is(wax.context.bar, bar);
});

test('should register data by globbed object', async t => {
	const { wax } = setup();

	wax.data('./fixtures/data/object/**/*.{js,json}');

	t.is(wax.context.hello, 'world');
	t.deepEqual(wax.context.good.night, ['chair', 'bear', 'moon']);
});
