import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import User from "./user";

const user = Symbol("user");

const cookieName = "com.XXX.new-project";

class GlobalState {
	constructor() {
		let cookie = Cookies.getJSON(cookieName);

		if (cookie) {
			this[user] = new User(cookie.user);
		}
	}

	setUser(currentUser) {
		this[user] = currentUser;
		let payload = jwt.decode(currentUser.token());

		// Set a cookie expiring at the same time as the token
		Cookies.set(cookieName, { user: currentUser.toJSON() }, {
			expires: new Date(payload.exp * 1000)
		});
	}

	user() {
		if (process.env.NODE_ENV === "development") { // eslint-disable-line no-process-env
			return new User({
				id: "benjamin.vanryseghem@cyberzen.com"
			});
		}

		return this[user];
	}

	isLogged() {
		return !!this.user();
	}
}

export { GlobalState };
export default new GlobalState();
