'use strict';

var requireGlob = require('require-glob'),
	pathSepPattern = /[ \/.-]+/g; // matches spaces, forward slashes, dots, and hyphens

function registerModule(method, obj, mod) {
	// jshint validthis:true
	var name = mod && mod.shortPath,
		content = mod && mod.exports;

	if (!content) {
		return;
	}

	if (typeof content.register === 'function') {
		content.register(this);

		return;
	}

	if (typeof content === 'function') {
		if (method === 'registerHelper') {
			name = name.replace(pathSepPattern, '-');
		}

		this[method](name, content);

		return;
	}

	this[method](content);
}

/**
 * Effortless wiring of Handlebars helpers and partials.
 *
 * @type {Function}
 * @param {Object} handlebars Handlebars instance.
 * @param {Object} options Plugin options.
 * @param {String|Array.<String>} options.helpers One or more glob strings matching helpers.
 * @param {String|Array.<String>} options.partials One or more glob strings matching partials.
 * @return {Object} Handlebars instance.
 */
function registrar(handlebars, options) {
	options = options || {};

	var helpers = options.helpers,
		partials = options.partials;

	if (helpers) {
		options.reducer = registerModule.bind(handlebars, 'registerHelper');
		requireGlob.sync(helpers, options);
	}

	if (partials) {
		options.reducer = registerModule.bind(handlebars, 'registerPartial');
		requireGlob.sync(partials, options);
	}

	return handlebars;
}

/**
 * Assemble-compatible register method.
 *
 * @method register
 * @param {Object} handlebars Handlebars instance.
 * @return {Object} Handlebars instance.
 * @static
 */
registrar.register = registrar;

module.exports = registrar;
