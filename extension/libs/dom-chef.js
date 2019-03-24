(function (f) {
	window.React = f();
})(function () {
	return (function () {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;
						if (!f && c) return c(i, !0);
						if (u) return u(i, !0);
						var a = new Error("Cannot find module '" + i + "'");
						throw a.code = "MODULE_NOT_FOUND", a
					}
					var p = n[i] = {
						exports: {}
					};
					e[i][0].call(p.exports, function (r) {
						var n = e[i][1][r];
						return o(n || r)
					}, p, p.exports, r, e, n, t)
				}
				return n[i].exports
			}
			for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
			return o
		}
		return r
	})()({
		1: [function (require, module, exports) {
			'use strict';

			const svgTagNames = require('svg-tag-names');
			const flatten = require('arr-flatten');

			// Copied from Preact
			const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

			const excludeSvgTags = [
				'a',
				'audio',
				'canvas',
				'iframe',
				'script',
				'video'
			];

			const svgTags = svgTagNames.filter(name => excludeSvgTags.indexOf(name) === -1);

			const isSVG = tagName => svgTags.indexOf(tagName) >= 0;

			const setCSSProps = (el, style) => {
				Object
					.keys(style)
					.forEach(name => {
						let value = style[name];

						if (typeof value === 'number' && !IS_NON_DIMENSIONAL.test(name)) {
							value += 'px';
						}

						el.style[name] = value;
					});
			};

			const createElement = tagName => {
				if (isSVG(tagName)) {
					return document.createElementNS('http://www.w3.org/2000/svg', tagName);
				}

				if (tagName === DocumentFragment) {
					return document.createDocumentFragment();
				}

				return document.createElement(tagName);
			};

			const setAttribute = (el, name, value) => {
				// Naive support for xlink namespace
				// Full list: https://github.com/facebook/react/blob/1843f87/src/renderers/dom/shared/SVGDOMPropertyConfig.js#L258-L264
				if (/^xlink[AHRST]/.test(name)) {
					el.setAttributeNS('http://www.w3.org/1999/xlink', name.replace('xlink', 'xlink:').toLowerCase(), value);
				} else {
					el.setAttribute(name, value);
				}
			};

			const build = (tagName, attrs, children) => {
				const el = createElement(tagName);

				Object.keys(attrs).forEach(name => {
					const value = attrs[name];
					if (name === 'class' || name === 'className') {
						setAttribute(el, 'class', value);
					} else if (name === 'style') {
						setCSSProps(el, value);
					} else if (name.indexOf('on') === 0) {
						const eventName = name.substr(2).toLowerCase();
						el.addEventListener(eventName, value);
					} else if (name === 'dangerouslySetInnerHTML') {
						el.innerHTML = value.__html;
					} else if (name !== 'key' && value !== false) {
						setAttribute(el, name, value === true ? '' : value);
					}
				});

				if (!attrs.dangerouslySetInnerHTML) {
					el.appendChild(children);
				}

				return el;
			};

			function h(tagName, attrs) {
				// eslint-disable-next-line prefer-rest-params
				const childrenArgs = [].slice.apply(arguments, [2]);
				const children = document.createDocumentFragment();

				flatten(childrenArgs).forEach(child => {
					if (child instanceof Node) {
						children.appendChild(child);
					} else if (typeof child !== 'boolean' && child !== null) {
						children.appendChild(document.createTextNode(child));
					}
				});

				return build(tagName, attrs || {}, children);
			}

			// Improve TypeScript support for DocumentFragment
			// https://github.com/Microsoft/TypeScript/issues/20469
			const React = {
				createElement: h,
				Fragment: typeof DocumentFragment === 'function' ? DocumentFragment : () => {}
			};

			// Enable support for
			// const React = require('dom-chef')
			module.exports = React;

			// Enable support for
			// const {h} = require('dom-chef')
			// import {h} from 'dom-chef'
			module.exports.h = h;

			// Enable support for
			// import React from 'dom-chef'
			module.exports.default = React;

		}, {
			"arr-flatten": 2,
			"svg-tag-names": 3
		}],
		2: [function (require, module, exports) {
			/*!
			 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
			 *
			 * Copyright (c) 2014-2017, Jon Schlinkert.
			 * Released under the MIT License.
			 */

			'use strict';

			module.exports = function (arr) {
				return flat(arr, []);
			};

			function flat(arr, res) {
				var i = 0,
					cur;
				var len = arr.length;
				for (; i < len; i++) {
					cur = arr[i];
					Array.isArray(cur) ? flat(cur, res) : res.push(cur);
				}
				return res;
			}

		}, {}],
		3: [function (require, module, exports) {
			module.exports = [
				"a",
				"altGlyph",
				"altGlyphDef",
				"altGlyphItem",
				"animate",
				"animateColor",
				"animateMotion",
				"animateTransform",
				"animation",
				"audio",
				"canvas",
				"circle",
				"clipPath",
				"color-profile",
				"cursor",
				"defs",
				"desc",
				"discard",
				"ellipse",
				"feBlend",
				"feColorMatrix",
				"feComponentTransfer",
				"feComposite",
				"feConvolveMatrix",
				"feDiffuseLighting",
				"feDisplacementMap",
				"feDistantLight",
				"feDropShadow",
				"feFlood",
				"feFuncA",
				"feFuncB",
				"feFuncG",
				"feFuncR",
				"feGaussianBlur",
				"feImage",
				"feMerge",
				"feMergeNode",
				"feMorphology",
				"feOffset",
				"fePointLight",
				"feSpecularLighting",
				"feSpotLight",
				"feTile",
				"feTurbulence",
				"filter",
				"font",
				"font-face",
				"font-face-format",
				"font-face-name",
				"font-face-src",
				"font-face-uri",
				"foreignObject",
				"g",
				"glyph",
				"glyphRef",
				"handler",
				"hatch",
				"hatchpath",
				"hkern",
				"iframe",
				"image",
				"line",
				"linearGradient",
				"listener",
				"marker",
				"mask",
				"mesh",
				"meshgradient",
				"meshpatch",
				"meshrow",
				"metadata",
				"missing-glyph",
				"mpath",
				"path",
				"pattern",
				"polygon",
				"polyline",
				"prefetch",
				"radialGradient",
				"rect",
				"script",
				"set",
				"solidColor",
				"solidcolor",
				"stop",
				"style",
				"svg",
				"switch",
				"symbol",
				"tbreak",
				"text",
				"textArea",
				"textPath",
				"title",
				"tref",
				"tspan",
				"unknown",
				"use",
				"video",
				"view",
				"vkern"
			]

		}, {}]
	}, {}, [1])(1)
});
