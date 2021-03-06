import CancelablePromise from "cancelable-promise";
import ServerError from "models/serverError";

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
						throw new ServerError(response, error, response.status);
					});
			}

			if (status === 204) {
				return { json: () => "" };
			}

			return response;
		})
		.then((data) => {
			if (init.noJSON) {
				return data;
			}
			return data.json();
		});
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
	return CancelablePromise.resolve(performFetch(input, init));
}
