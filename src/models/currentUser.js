import accessControl, { roles } from "models/accessControl";
import User from "./user";

const token = Symbol("token");

/**
 * TODO: Write jsdoc
 * @class
 */
export default class CurrentUser extends User {
	constructor({ token: userToken }) {
		super(...arguments); // eslint-disable-line prefer-rest-params

		this[token] = userToken;
	}

	token() {
		return this[token];
	}

	canAddGames() {
		return accessControl.can(this.role()).create("game").granted;
	}

	canAddLocations() {
		return accessControl.can(this.role()).create("location").granted;
	}

	canViewUsers() {
		return accessControl.can(this.role()).read("user").granted;
	}

	canViewGames() {
		return accessControl.can(this.role()).read("game").granted;
	}

	canLendGame() {
		return accessControl.can(this.role()).update("game").granted;
	}

	canMoveGame() {
		return accessControl.can(this.role()).update("game").granted;
	}

	canDeleteGame() {
		return accessControl.can(this.role()).delete("game").granted;
	}

	canNavigateToUsers() {
		return accessControl.can(this.role()).readAny("user").granted;
	}

	toJSON() {
		let result = super.toJSON();
		result.token = this[token];
		return result;
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
