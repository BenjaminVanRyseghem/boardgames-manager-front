import { AccessControl } from "accesscontrol";

const admin = "admin";
const user = "user";
const borrower = "borrower";

const accessControl = new AccessControl();

export const roles = {
	admin,
	user,
	borrower
};

accessControl.grant(borrower);

accessControl.grant(user).extend(borrower)
	.readAny("user")
	.readAny("game")
	.readOwn("account")
	.deleteOwn("account")
	.updateOwn("account", ["password, name"]);

accessControl.grant(admin).extend(user)
	.createAny("game")
	.readAny("game")
	.updateAny("game")
	.deleteAny("game")
	.createAny("account")
	.readAny("account")
	.updateAny("account")
	.deleteAny("account")
	.createAny("location")
	.readAny("location")
	.updateAny("location")
	.deleteAny("location");

accessControl.lock();

export default accessControl;
