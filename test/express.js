import axios from 'axios';
import express from 'express';
import test from 'ava';
import {getPortPromise} from 'portfinder';
import setup from './helpers/setup';

test('should be an express view engine', async t => {
	const port = await getPortPromise();
	const {wax} = setup();

	const server = express()
		// register view engine
		.engine('hbs', wax.engine)
		.set('view engine', 'hbs')
		.set('views', './test/fixtures/views')

		// route request and render view
		.get('/:foo/:bar', (request, response) => {
			response.render('index', request.params);
		})

		// start server
		.listen(port);

	const [responseA, responseB, responseC] = await Promise.all([
		axios(`http://0.0.0.0:${port}/hello/world`),
		axios(`http://0.0.0.0:${port}/foo/bar`),
		axios(`http://0.0.0.0:${port}/baz/bat`)
	]);

	t.is(responseA.data, '<!doctype html>\nhello world\n');
	t.is(responseB.data, '<!doctype html>\nfoo bar\n');
	t.is(responseC.data, '<!doctype html>\nbaz bat\n');

	// stop server
	server.close();
});
