var mixin = require('mtil/object/mixin'),
	requireGlob = require('require-glob'),
	pathSepPattern = /[ \/.-]+/g; // matches spaces, forward slashes, dots, and hyphens

function parseHelperName(file) {
	var shortPath = file && file.shortPath;

	return shortPath.replace(pathSepPattern, '-');
}

function parsePartialName(file) {
	return file && file.shortPath;
}

function reducer(obj, file) {
	var content = file && file.exports;

	if (!content) {
		return obj;
	}

	if (typeof content.register === 'function') {
		content.register(this.handlebars);

		return obj;
	}

	switch (typeof content) {
		case 'function':
			obj[this.keygen(file)] = content;

			return obj;

		case 'object':
			mixin(obj, content);

			return obj;

		// no default
	}

	return obj;
}

/**
 * Effortless wiring of Handlebars helpers and partials.
 *
 * @type {Function}
 * @param {Object} handlebars Handlebars instance.
 * @param {Object=} options Plugin options.
 * @param {Boolean=} options.bustCache Whether to force the reload of modules by deleting them from the cache.
 * @param {String=} options.cwd Current working directory. Defaults to `process.cwd()`.
 * @param {Object|String|Array.<String>|Function=} options.helpers One or more glob strings matching helpers.
 * @param {Function=} options.parseHelperName Custom name generator for helpers.
 * @param {Function=} options.helpersReducer Custom reducer for registering helpers.
 * @param {Object|String|Array.<String>|Function=} options.partials One or more glob strings matching partials.
 * @param {Function=} options.parsePartialName Custom name generator for partials.
 * @param {Function=} options.partialsReducer Custom reducer for registering partials.
 * @return {Object} Handlebars instance.
 */
function registrar(handlebars, options) {
	options = options || {};

	var helpers = options.helpers,
		partials = options.partials;

	// Expose handlebars to custom reducers
	options.handlebars = handlebars;

	// Register helpers
	if (helpers) {
		options.keygen = options.parseHelperName || parseHelperName;
		options.reducer = options.helpersReducer || reducer.bind(options);

		helpers = requireGlob.sync(helpers, options);
		handlebars.registerHelper(helpers);
	}

	// Register partials
	if (partials) {
		options.keygen = options.parsePartialName || parsePartialName;
		options.reducer = options.partialsReducer || reducer.bind(options);

		partials = requireGlob.sync(partials, options);
		handlebars.registerPartial(partials);
	}

	return handlebars;
}

module.exports = registrar;
