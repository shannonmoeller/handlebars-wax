'use strict';

var assign = require('object-assign');
var path = require('path');
var requireGlob = require('require-glob');
var toString = Object.prototype.toString;

var NON_WORD_CHARACTERS = /\W+/g;
var WHITESPACE_CHARACTERS = /\s+/g;
var TYPE_FUNCTION = 'fun';
var TYPE_OBJECT = 'obj';

// Utilities

function getParentDir() {
	return path.dirname(module.parent.filename);
}

function getTypeOf(value) {
	return toString
		.call(value)
		.substr(8, 3)
		.toLowerCase();
}

// Map Reduce

function keygenPartial(options, file) {
	var shortPath = file.path.replace(file.base + '/', '');
	var extension = path.extname(shortPath);

	return shortPath
		.substr(0, shortPath.length - extension.length)
		.replace(WHITESPACE_CHARACTERS, '-');
}

function keygenHelper(options, file) {
	return keygenPartial(options, file)
		.replace(NON_WORD_CHARACTERS, '-');
}

function keygenDecorator(options, file) {
	return keygenHelper(options, file);
}

function reducer(options, obj, fileObj) {
	var value = fileObj.exports;

	if (!value) {
		return obj;
	}

	if (getTypeOf(value.register) === TYPE_FUNCTION) {
		value.register(options.handlebars, options);

		return obj;
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return assign(obj, value);
	}

	obj[options.keygen(fileObj)] = value;

	return obj;
}

function resolveValue(options, value) {
	if (!value) {
		return {};
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return value;
	}

	return requireGlob.sync(value, options);
}

// Wax

function HandlebarsWax(handlebars, options) {
	var defaults = {
		handlebars: handlebars,
		cwd: getParentDir(),
		compileOptions: null,
		templateOptions: null,
		parsePartialName: keygenPartial,
		parseHelperName: keygenHelper,
		parseDecoratorName: keygenDecorator,
		parseDataName: null
	};

	this.handlebars = handlebars;
	this.config = assign(defaults, options);
	this.context = Object.create(null);
}

HandlebarsWax.prototype.partials = function (partials, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parsePartialName;
	options.reducer = options.reducer || reducer;

	options.handlebars.registerPartial(
		resolveValue(options, partials)
	);

	return this;
};

HandlebarsWax.prototype.helpers = function (helpers, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseHelperName;
	options.reducer = options.reducer || reducer;

	options.handlebars.registerHelper(
		resolveValue(options, helpers)
	);

	return this;
};

HandlebarsWax.prototype.decorators = function (decorators, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseDecoratorName;
	options.reducer = options.reducer || reducer;

	options.handlebars.registerDecorator(
		resolveValue(options, decorators)
	);

	return this;
};

HandlebarsWax.prototype.data = function (data, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseDataName;

	assign(this.context, resolveValue(options, data));

	return this;
};

HandlebarsWax.prototype.compile = function (template, compileOptions) {
	var config = this.config;
	var context = this.context;

	compileOptions = assign({}, config.compileOptions, compileOptions);

	if (getTypeOf(template) !== TYPE_FUNCTION) {
		template = this.handlebars.compile(template, compileOptions);
	}

	return function (data, templateOptions) {
		templateOptions = assign({}, config.templateOptions, templateOptions);
		templateOptions.data = assign({}, templateOptions.data);

		// {{@root.foo}} and {{@root._parent.foo}}
		templateOptions.data.root = assign({_parent: context}, templateOptions.data.root || context);

		// {{foo}} and {{_parent.foo}}
		return template(assign({_parent: context}, context, data), templateOptions);
	};
};

// API

function handlebarsWax(handlebars, config) {
	return new HandlebarsWax(handlebars, config);
}

module.exports = handlebarsWax;
module.exports.HandlebarsWax = HandlebarsWax;
