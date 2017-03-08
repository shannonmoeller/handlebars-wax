import handlebars from 'handlebars';
import handlebarsWax from '../../index';

export default function setup() {
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
