'use strict';

module.exports.register = function (hb) {
	hb.registerPartial('layout', '<!doctype html>\n<html>\n<head>\n	<title>{{{block "title"}}}</title>\n</head>\n<body>\n	{{{block "body"}}}\n</body>\n</html>');
	hb.registerPartial('layout-2col', '{{#extend "layout"}}\n	{{#content "body"}}\n		{{{block "left"}}}\n		{{{block "right"}}}\n	{{/content}}\n{{/extend}}');
};
