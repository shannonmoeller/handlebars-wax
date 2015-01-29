'use strict';

var glob = require('globby'),
	path = require('path'),
	pathSepPattern = /[ \/.-]+/g; // matches spaces, forward slashes, dots, and hyphens

function toObject(value) {
	// Create an object containing an original value and a modifiable string
	return {
		value: value,
		oldValue: value
	};
}

function getRootDir(obj) {
	var value = obj.value,
		index = value.indexOf('/');

	// Return root directory, if any
	if (index > -1) {
		return value.slice(0, index + 1);
	}
}

function normalizePaths(paths) {
	var objects = paths && paths.map(toObject),
		first = objects && objects[0],
		prefix = first && getRootDir(first);

	function hasPrefix(obj) {
		return obj.value.indexOf(prefix) === 0;
	}

	function trimPrefix(obj) {
		obj.value = obj.value.slice(prefix.length);
	}

	// If every path has the same prefix
	while (prefix && objects.every(hasPrefix)) {
		// Remove prefix
		objects.forEach(trimPrefix);

		// Determine next prefix
		prefix = getRootDir(first);
	}

	return objects;
}

function findAll(patterns) {
	// Glob patterns and normalize returned paths
	return normalizePaths(glob.sync(patterns));
}

function requireModule(file) {
	file = path.resolve(process.cwd(), file);

	// Clear cached module, if any
	delete require.cache[require.resolve(file)];

	// Load module
	return require(file);
}

function registerModule(method, file) {
	/*jshint validthis: true */

	var extension, name,
		module = requireModule(file.oldValue);

	if (!module) {
		return;
	}

	if (typeof module.register === 'function') {
		module.register(this);

		return;
	}

	if (typeof module === 'function') {
		extension = path.extname(file.value);
		name = file.value.slice(0, -extension.length);

		if (method === 'registerHelper') {
			/**
			 * Replace path separators with hyphens to avoid having to use the
			 * [square-bracket syntax][square] when referencing helpers.
			 *
			 * [square]: http://handlebarsjs.com/expressions.html#basic-blocks
			 */
			name = name.replace(pathSepPattern, '-');
		}

		this[method](name, module);

		return;
	}

	this[method](module);
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
		findAll(helpers).forEach(registerModule.bind(handlebars, 'registerHelper'));
	}

	if (partials) {
		findAll(partials).forEach(registerModule.bind(handlebars, 'registerPartial'));
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
