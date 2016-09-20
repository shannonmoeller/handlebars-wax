'use strict';

var fs = require('fs');
var path = require('path');
var assign = require('object-assign');
var requireGlob = require('require-glob');

var toString = Object.prototype.toString;

var NON_WORD_CHARACTERS = /\W+/g;
var PATH_SEPARATOR = '/';
var PATH_SEPARATORS = /[\\\/]/g;
var WHITESPACE_CHARACTERS = /\s+/g;
var WORD_SEPARATOR = '-';
var TYPE_FUNCTION = 'fun';
var TYPE_OBJECT = 'obj';

// Utilities

function getTypeOf(value) {
	return toString
		.call(value)
		.substr(8, 3)
		.toLowerCase();
}

function hookRequire(handlebars) {
	var extLong = require.extensions['.handlebars'];
	var extShort = require.extensions['.hbs'];

	function extensions(module, filename) {
		var templateString = fs.readFileSync(filename, 'utf8');

		module.exports = handlebars.compile(templateString);
	}

	require.extensions['.handlebars'] = extensions;
	require.extensions['.hbs'] = extensions;

	return function unhookRequire() {
		require.extensions['.handlebars'] = extLong;
		require.extensions['.hbs'] = extShort;
	};
}

// Map Reduce

function keygenPartial(options, file) {
	var fullPath = file.path.replace(PATH_SEPARATORS, PATH_SEPARATOR);
	var basePath = file.base.replace(PATH_SEPARATORS, PATH_SEPARATOR) + PATH_SEPARATOR;
	var shortPath = fullPath.replace(new RegExp('^' + basePath, 'i'), '');
	var extension = path.extname(shortPath);

	return shortPath
		.substr(0, shortPath.length - extension.length)
		.replace(WHITESPACE_CHARACTERS, WORD_SEPARATOR);
}

function keygenHelper(options, file) {
	return keygenPartial(options, file)
		.replace(NON_WORD_CHARACTERS, WORD_SEPARATOR);
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
		value = value.register(options.handlebars, options);

		if (getTypeOf(value) === TYPE_OBJECT) {
			return assign(obj, value);
		}

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

	if (getTypeOf(value) === TYPE_FUNCTION) {
		value = value(options.handlebars, options);

		if (getTypeOf(value) === TYPE_OBJECT) {
			return value;
		}

		return {};
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return reducer(options, {}, { exports: value });
	}

	return requireGlob.sync(value, options);
}

// Wax

function HandlebarsWax(handlebars, options) {
	var defaults = {
		handlebars: handlebars,
		bustCache: true,
		cwd: process.cwd(),
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

	var unhookRequire = hookRequire(options.handlebars);

	options.handlebars.registerPartial(
		resolveValue(options, partials)
	);

	unhookRequire();

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
		templateOptions.data.root = assign({ _parent: context }, templateOptions.data.root || context);

		// {{foo}} and {{_parent.foo}}
		return template(assign({ _parent: context }, context, data), templateOptions);
	};
};

// API

function handlebarsWax(handlebars, config) {
	return new HandlebarsWax(handlebars, config);
}

module.exports = handlebarsWax;
module.exports.HandlebarsWax = HandlebarsWax;
