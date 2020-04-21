const email = Symbol("email");
const firstName = Symbol("firstName");
const lastName = Symbol("lastName");
const token = Symbol("token");

export default class User {
	constructor({ id, firstName: userFirsName = "", lastName: userLastName = "", token: userToken }) {
		this[email] = id;
		this[firstName] = userFirsName;
		this[lastName] = userLastName;
		this[token] = userToken;
	}

	id() {
		return this[email];
	}

	token() {
		return this[token];
	}

	toJSON() {
		return {
			id: this[email],
			firstName: this[firstName],
			lastName: this[lastName],
			token: this[token]
		};
	}
}
