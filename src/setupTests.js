import "jest-enzyme";
import "helpers/fontAwesome";

import Adapter from "enzyme-adapter-react-16/build";
import { configure } from "enzyme/build";

configure({ adapter: new Adapter() });

global.fetch = require("jest-fetch-mock");
