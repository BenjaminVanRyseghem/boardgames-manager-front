/**
 * @module parseQuery
 */

/**
 * Parse the query string to a js object.
 *
 * @param {string} queryString - Query string
 * @return {object} Query parameters
 */
export default function parseQuery(queryString) {
	if (!queryString) {
		return null;
	}

	let query = {};
	let pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
	for (let i = 0; i < pairs.length; i++) {
		let pair = pairs[i].split("=");
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
	}
	return query;
}
