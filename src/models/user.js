const email = Symbol("email");
const firstName = Symbol("firstName");
const lastName = Symbol("lastName");
const role = Symbol("role");

export default class User {
	constructor({ id, firstName: userFirstName = "", lastName: userLastName = "", role: userRole }) {
		this[email] = id;
		this[firstName] = userFirstName;
		this[lastName] = userLastName;
		this[role] = userRole;
	}

	id() {
		return this[email];
	}

	role() {
		return this[role];
	}

	fullName() {
		return `${this[firstName]} ${this[lastName]}`;
	}

	toJSON() {
		return {
			id: this[email],
			firstName: this[firstName],
			lastName: this[lastName],
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
