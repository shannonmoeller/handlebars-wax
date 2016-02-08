'use strict';

var assign = require('object-assign');
var path = require('path');
var requireGlob = require('require-glob');
var toString = Object.prototype.toString;

var NON_WORD_CHARACTERS = /\W+/g;
var TYPE_FUNCTION = 'fun';
var TYPE_OBJECT = 'obj';

// Utilities

function getCwd() {
	return path.dirname(module.parent.filename);
}

function getTypeOf(value) {
	return toString
		.call(value)
		.substr(8, 3)
		.toLowerCase();
}

// Map Reduce

function reducer(options, obj, fileObj) {
	var value = fileObj.exports;

	if (!value) {
		return obj;
	}

	if (getTypeOf(value.register) === TYPE_FUNCTION) {
		value.register(options.handlebars);

		return obj;
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return assign(obj, value);
	}

	obj[options.keygen(fileObj)] = value;

	return obj;
}

function keygenPartial(options, file) {
	var shortPath = file.path.replace(file.base + '/', '');
	var extension = path.extname(shortPath);

	return shortPath
		.substr(0, shortPath.length - extension.length);
}

function keygenHelper(options, file) {
	return keygenPartial(options, file)
		.replace(NON_WORD_CHARACTERS, '-');
}

function keygenDecorator(options, file) {
	return keygenHelper(options, file);
}

function register(options, value) {
	if (!value) {
		return;
	}

	if (getTypeOf(value) !== TYPE_OBJECT) {
		options.cwd = options.cwd || getCwd();
		options.reducer = reducer;
		value = requireGlob.sync(value, options);
	}

	options.handlebars[options.registerMethod](value);
}

// Glob

function HandlebarsGlob(handlebars) {
	this.handlebars = handlebars;
}

HandlebarsGlob.prototype.decorators = function (decorators, options) {
	options = assign({}, options);

	options.handlebars = this.handlebars;
	options.registerMethod = 'registerDecorator';
	options.keygen = options.parseDecoratorName || keygenDecorator;

	register(options, decorators);

	return this;
};

HandlebarsGlob.prototype.helpers = function (helpers, options) {
	options = assign({}, options);

	options.handlebars = this.handlebars;
	options.registerMethod = 'registerHelper';
	options.keygen = options.parseHelperName || keygenHelper;

	register(options, helpers);

	return this;
};

HandlebarsGlob.prototype.partials = function (partials, options) {
	options = assign({}, options);

	options.handlebars = this.handlebars;
	options.registerMethod = 'registerPartial';
	options.keygen = options.parsePartialName || keygenPartial;

	register(options, partials);

	return this;
};

// API

function handlebarsGlob(handlebars) {
	return new HandlebarsGlob(handlebars);
}

module.exports = handlebarsGlob;
module.exports.HandlebarsGlob = HandlebarsGlob;
