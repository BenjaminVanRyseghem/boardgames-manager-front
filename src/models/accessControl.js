import { AccessControl } from "accesscontrol";

const admin = "admin";
const user = "user";
const borrower = "borrower";
const anonymous = "anonymous";

const accessControl = new AccessControl();

export const roles = {
	admin,
	user,
	borrower,
	anonymous
};

accessControl.grant(anonymous)
	.readAny("game");
accessControl.grant(borrower).extend(anonymous);

accessControl.grant(user).extend(borrower)
	.readAny("user")
	.readAny("game")
	.readOwn("user")
	.deleteOwn("user")
	.updateOwn("user", ["password, name"]);

accessControl.grant(admin).extend(user)
	.createAny("game")
	.readAny("game")
	.updateAny("game")
	.deleteAny("game")
	.createAny("user")
	.readAny("user")
	.updateAny("user")
	.deleteAny("user")
	.createAny("location")
	.readAny("location")
	.updateAny("location")
	.deleteAny("location");

accessControl.lock();

export default accessControl;
