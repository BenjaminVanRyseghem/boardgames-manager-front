export default class ServerError extends Error {
	constructor(response, error) {
		super(`[Server Error - ${response.status}] ${response.statusText} `);

		this.response = response;
		this.error = error;
		this.type = this.constructor.type;
	}
}

ServerError.type = "ServerError";
