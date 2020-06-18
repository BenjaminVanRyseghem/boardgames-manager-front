/*
 * Copied from https://github.com/i18next/react-i18next/blob/master/src/Trans.js in order to fix interpolation
 * to match our way of translating.
 */

import HTML from "html-parse-stringify2";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Return true when the node has at least a child.
 *
 * @param {PropTypes.node} node - Node to test
 * @return {boolean} True when a child is present
 */
function hasChildren(node) {
	return getChildren(node);
}

/**
 * Return the node children.
 *
 * @param {PropTypes.node} node - Node to test
 * @return {PropTypes.node} Children
 */
function getChildren(node) {
	return node && node.children ? node.children : node.props && node.props.children;
}

/**
 * Convert nodes into a string.
 *
 * @param {*} rawMem - ?
 * @param {*} children - ?
 * @return {string} Result
 */
function nodesToString(rawMem, children) {
	let mem = rawMem;
	if (!children) {
		return "";
	}
	if (Object.prototype.toString.call(children) !== "[object Array]") {
		// eslint-disable-next-line no-param-reassign
		children = [children];
	}

	children.forEach((child, i) => {
		/*
		 * const isElement = React.isValidElement(child);
		 * const elementKey = `${index !== 0 ? index + '-' : ''}${i}:${typeof child.type === 'function' ? child.type.name : child.type || 'var'}`;
		 */
		const elementKey = `${i}`;

		if (typeof child === "string") {
			mem = `${mem}${child}`;
		} else if (hasChildren(child)) {
			mem = `${mem}<${elementKey}>${nodesToString("", getChildren(child), i + 1)}</${elementKey}>`;
		} else if (React.isValidElement(child)) {
			mem = `${mem}<${elementKey}></${elementKey}>`;
		} else if (typeof child === "object") {
			const clone = Object.assign({}, child);
			const { format } = clone;
			delete clone.format;

			const keys = Object.keys(clone);
			if (format && keys.length === 1) {
				mem = `${mem}<${elementKey}>{{${keys[0]}, ${format}}}</${elementKey}>`;
			} else if (keys.length === 1) {
				mem = `${mem}<${elementKey}>{{${keys[0]}}}</${elementKey}>`;
			} else if (console && console.warn) { // eslint-disable-line no-console
				// not a valid interpolation object (can only contain one value plus format)
				console.warn("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child); // eslint-disable-line no-console
			}
		} else if (console && console.warn) { // eslint-disable-line no-console
			console.warn("react-i18next: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child); // eslint-disable-line no-console
		}
	});

	return mem;
}

/**
 * Render nodes
 * @param {*} children - ?
 * @param {*} targetString - ?
 * @param {*} i18n - ?
 * @param {*} contextAndProps - ?
 * @return {*} ?
 */
// eslint-disable-next-line max-params
function renderNodes(children, targetString, i18n, contextAndProps) {
	if (targetString === "") {
		return [];
	}
	if (!children) {
		return [targetString];
	}

	/*
	 * parse ast from string with additional wrapper tag
	 * -> avoids issues in parser removing prepending text nodes
	 */
	const ast = HTML.parse(`<0>${targetString}</0>`);

	function mapAST(reactNodes, astNodes) {
		if (Object.prototype.toString.call(reactNodes) !== "[object Array]") {
			reactNodes = [reactNodes]; // eslint-disable-line no-param-reassign
		}
		if (Object.prototype.toString.call(astNodes) !== "[object Array]") {
			astNodes = [astNodes]; // eslint-disable-line no-param-reassign
		}

		// eslint-disable-next-line max-statements
		return astNodes.reduce((mem, node, i) => {
			if (node.type === "tag") {
				const child = reactNodes[parseInt(node.name, 10)] || {};
				const isElement = React.isValidElement(child);

				if (typeof child === "string") {
					let interpolation = i18n.services.interpolator.interpolate(child, contextAndProps, i18n.language);
					if (interpolation) {
						mem.push(interpolation);
					} else {
						mem.push(child);
					}
				} else if (hasChildren(child)) {
					const inner = mapAST(getChildren(child), node.children);
					if (child.dummy) {
						child.children = inner;
					} // needed on preact!
					mem.push(React.cloneElement(
						child,
						Object.assign({}, child.props, { key: i }),
						inner
					));
				} else if (typeof child === "object" && !isElement) {
					const content = node.children[0] ? node.children[0].content : null;
					if (content) {
						const interpolated = i18n.services.interpolator.interpolate(
							node.children[0].content,
							child,
							i18n.language
						);
						mem.push(interpolated);
					}
				} else {
					mem.push(child);
				}
			} else if (node.type === "text") {
				mem.push(node.content);
			}
			return mem;
		}, []);
	}

	/*
	 * call mapAST with having react nodes nested into additional node like
	 * we did for the string ast from translation
	 * return the children of that extra node to get expected result
	 */
	const result = mapAST([
		{
			dummy: true,
			children
		}
	], ast);
	return getChildren(result[0]);
}

/**
 * Interpolate allows to translate string with React markup.
 *
 * @example
 *
 * <Interpolate i18nKey="key" name="Ben">
 *     Hello <strong>%name%</strong>
 * </Interpolate>
 */
export default function Interpolate(props) { // eslint-disable-line max-statements
	const { t: tFromContextAndProps, i18n } = useTranslation();
	const contextAndProps = Object.assign({}, props, {
		i18n,
		t: tFromContextAndProps
	});

	const { children, count, parent, i18nKey, tOptions, values, defaults, components, ns: namespace } = contextAndProps; // eslint-disable-line max-len
	const t = tFromContextAndProps || i18n.t.bind(i18n);

	const reactI18nextOptions = (i18n.options && i18n.options.react) || {};
	const useAsParent = parent === undefined ? reactI18nextOptions.defaultTransParent : parent;

	const defaultValue = defaults || nodesToString("", children, 0);
	const { hashTransKey } = reactI18nextOptions;
	const key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);

	const translation = key
		? t(key, Object.assign(
			{},
			contextAndProps,
			tOptions,
			values,
			{ defaultValue },
			{ count },
			{ ns: namespace }
		))
		: defaultValue;

	if (reactI18nextOptions.exposeNamespace) {
		let ns = typeof t.ns === "string" ? t.ns : t.ns[0];
		if (i18nKey && i18n.options && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
			const parts = i18nKey.split(i18n.options.nsSeparator);
			ns = parts[0]; // eslint-disable-line prefer-destructuring
		}
		if (t.ns) {
			contextAndProps["data-i18next-options"] = JSON.stringify({ ns });
		}
	}

	if (!useAsParent) {
		return renderNodes(components || children, translation, i18n, contextAndProps);
	}

	return React.createElement(
		useAsParent,
		contextAndProps,
		renderNodes(components || children, translation, i18n, contextAndProps)
	);
}

Interpolate.propTypes = {
	count: PropTypes.number,
	i18n: PropTypes.object,
	i18nKey: PropTypes.string,
	parent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	t: PropTypes.func
};

Interpolate.contextTypes = {
	i18n: PropTypes.object,
	t: PropTypes.func
};
