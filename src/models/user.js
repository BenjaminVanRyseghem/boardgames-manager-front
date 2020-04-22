import accessControl from "models/accessControl";
const email = Symbol("email");
const firstName = Symbol("firstName");
const lastName = Symbol("lastName");
const token = Symbol("token");
const role = Symbol("role");

export default class User {
	constructor({ id, firstName: userFirsName = "", lastName: userLastName = "", token: userToken, role: userRole }) {
		this[email] = id;
		this[firstName] = userFirsName;
		this[lastName] = userLastName;
		this[role] = userRole;
		this[token] = userToken;
	}

	id() {
		return this[email];
	}

	token() {
		return this[token];
	}

	canAddGames() {
		return accessControl.can(this[role]).create("game").granted;
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
