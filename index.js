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

function findAll(cwd, patterns) {
	// Glob patterns and normalize returned paths
	return normalizePaths(glob.sync(patterns, {
		cwd: cwd
	}));
}

function requireModule(cwd, file) {
	file = path.resolve(cwd, file);

	// Clear cached module, if any
	delete require.cache[require.resolve(file)];

	// Load module
	return require(file);
}

function registerModule(method, cwd, file) {
	/*jshint validthis: true */

	var extension, name,
		fileModule = requireModule(cwd, file.oldValue);

	if (!fileModule) {
		return;
	}

	if (typeof fileModule.register === 'function') {
		fileModule.register(this);

		return;
	}

	if (typeof fileModule === 'function') {
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

		this[method](name, fileModule);

		return;
	}

	this[method](fileModule);
}

/**
 * Effortless wiring of Handlebars helpers and partials.
 *
 * @type {Function}
 * @param {Object} handlebars Handlebars instance.
 * @param {Object} options Plugin options.
 * @param {String} options.cwd Current working directory. Defaults to `process.cwd()`.
 * @param {String|Array.<String>} options.helpers One or more glob strings matching helpers.
 * @param {String|Array.<String>} options.partials One or more glob strings matching partials.
 * @return {Object} Handlebars instance.
 */
function registrar(handlebars, options) {
	options = options || {};

	var register,
		cwd = options.cwd || process.cwd(),
		helpers = options.helpers,
		partials = options.partials;

	if (helpers) {
		// Setup helper regsiter method
		register = registerModule.bind(handlebars, 'registerHelper', cwd);

		// Register helpers
		findAll(cwd, helpers).forEach(register);
	}

	if (partials) {
		// Setup partial regsiter method
		register = registerModule.bind(handlebars, 'registerPartial', cwd);

		// Register partials
		findAll(cwd, partials).forEach(register);
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
