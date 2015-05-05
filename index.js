'use strict';

var requireGlob = require('require-glob'),
	pathSepPattern = /[ \/.-]+/g; // matches spaces, forward slashes, dots, and hyphens

function registerModule(handlebars, method, obj, mod) {
	var name = mod && mod.shortPath,
		content = mod && mod.exports;

	if (!content) {
		return;
	}

	if (typeof content.register === 'function') {
		content.register(handlebars);

		return;
	}

	if (typeof content === 'function') {
		if (method === 'registerHelper') {
			name = name.replace(pathSepPattern, '-');
		}

		handlebars[method](name, content);

		return;
	}

	handlebars[method](content);
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
 * @param {Function=} options.helpersReducer Custom reducer for registering helpers.
 * @param {Object|String|Array.<String>|Function=} options.partials One or more glob strings matching partials.
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
		options.reducer = options.helpersReducer || (
			registerModule.bind(null, handlebars, 'registerHelper')
		);

		requireGlob.sync(helpers, options);
	}

	// Register partials
	if (partials) {
		options.reducer = options.partialsReducer || (
			registerModule.bind(null, handlebars, 'registerPartial')
		);

		requireGlob.sync(partials, options);
	}

	return handlebars;
}

module.exports = registrar;
