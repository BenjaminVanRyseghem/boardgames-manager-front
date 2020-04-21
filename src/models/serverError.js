export default class ServerError extends Error {
	constructor(response, error) {
		super(`[Server Error - ${response.status}] ${response.statusText} `); // eslint-disable-line prefer-rest-params

		this.response = response;
		this.error = error;
		this.type = this.constructor.type;
	}
}

ServerError.type = "ServerError";
