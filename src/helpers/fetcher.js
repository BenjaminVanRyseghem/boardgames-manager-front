import CancelablePromise from "cancelable-promise";
import ServerError from "models/serverError";

const networkDelay = 2000;

/**
 * Wrap DATA as a fake Response.
 *
 * @param {*} data - Data to wrap
 * @return {{json: (function(): Promise<*>)}} Wrapped data
 */
function wrapAsResponse(data) {
	return {
		json: () => Promise.resolve(data)
	};
}

/**
 * Perform a function FN with or without a delay based on the
 * `REACT_APP_SLOW_CONNECTION` env var.
 *
 * @param {Function} fn - Function to perform
 */
function perform(fn) {
	if (process.env.REACT_APP_SLOW_CONNECTION) { // eslint-disable-line no-process-env
		setTimeout(() => {
			fn();
		}, networkDelay);
	} else {
		fn();
	}
}

/**
 * Perform a `fetch` request and wrap the result for a better error handling.
 *
 * @param {RequestInfo} input - This defines the resource that you wish to fetch
 * @param {RequestInit} [init] - An options object containing any custom settings that you want to apply to the request
 * @return {Promise<Response>} Promise handling data fetching
 */
function performFetch(input, init) {
	return fetch(input, init)
		.then((response) => {
			let { ok, status } = response;

			if (!ok) {
				return response.json()
					.then((error) => {
						error.status = status;
						throw new ServerError(response, error);
					});
			}

			if (status === 204) {
				return { json: () => "" };
			}

			return response;
		})
		.then((data) => data.json());
}

/**
 * Fetch data over the network. Use some env vars to tweak the dev experience.
 * Arguments are similar to [`fetch` arguments]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch}.
 *
 * @param {RequestInfo} input - This defines the resource that you wish to fetch
 * @param {RequestInit} [init] - An options object containing any custom settings that you want to apply to the request
 * @return {Promise<Response>} Promise handling data fetching
 */
export default function fetcher(input, init) {
	if (process.env.NODE_ENV === "development" && process.env.REACT_APP_FAKE_DATA) { // eslint-disable-line no-process-env
		let url = input.url || input;
		let method = input.method || "GET";

		console.log(`[${method}] ${url}`); // eslint-disable-line no-console

		let finalUrl = `/fakeData${url.replace(/\?[\s\S]+$/, "")}/${method}.json`;

		return new CancelablePromise((resolve, reject) => fetch(finalUrl)
			.then((response) => response.json())
			.then(({ status, data }) => {
				if (status < 400) {
					perform(() => resolve(wrapAsResponse(data)));
				} else {
					perform(() => reject(status));
				}
			}));
	}

	return CancelablePromise.resolve(performFetch(input, init));
}
