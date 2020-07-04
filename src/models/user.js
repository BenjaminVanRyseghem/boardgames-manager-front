import accessControl, { roles } from "models/accessControl";
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

	role() {
		return this[role];
	}

	canAddGames() {
		return accessControl.can(this[role]).create("game").granted;
	}

	canAddLocations() {
		return accessControl.can(this[role]).create("location").granted;
	}

	canViewUsers() {
		return accessControl.can(this[role]).read("user").granted;
	}

	canViewGames() {
		return accessControl.can(this[role]).read("game").granted;
	}

	canLendGame() {
		return accessControl.can(this[role]).update("game").granted;
	}

	canMoveGame() {
		return accessControl.can(this[role]).update("game").granted;
	}

	canDeleteGame() {
		return accessControl.can(this[role]).delete("game").granted;
	}

	canNavigateToUsers() {
		return accessControl.can(this[role]).readAny("user").granted;
	}

	toJSON() {
		return {
			id: this[email],
			firstName: this[firstName],
			lastName: this[lastName],
			token: this[token],
			role: this[role]
		};
	}

	static from(user, options = {}) {
		let data = {
			...user.toJSON(),
			...options
		};

		return new this(data);
	}
}

class AnonymousUser extends User {
	id() {
		return "anonymous";
	}

	role() {
		return roles.anonymous;
	}
}

export const anonymousUser = new AnonymousUser({});
