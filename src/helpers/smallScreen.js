import { isMobile } from "mobile-device-detect";

/**
 * @module smallScreen
 */

export default function smallScreen() {
	return isMobile || document.getElementsByTagName("body")[0].getBoundingClientRect().width <= 610;
}
