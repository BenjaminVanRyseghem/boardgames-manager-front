import "./loading.scss";

import PropTypes from "prop-types";
import React from "react";
import ReactLoading from "react-loading";

export default class Loading extends React.Component {
	static defaultProps = {
		bubbles: false,
		className: "",
		dark: false,
		full: false,
		height: 64,
		width: 64
	};

	static propTypes = {
		bubbles: PropTypes.bool,
		className: PropTypes.string,
		dark: PropTypes.bool,
		full: PropTypes.bool,
		height: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		])
	};

	render() {
		return (
			<div className={`loading-wrapper ${this.props.dark ? "dark" : ""} ${this.props.full ? "full" : ""}`}>
				<div className={`loading ${this.props.className}`}>
					<ReactLoading height={this.props.height} type={this.props.bubbles ? "bubbles" : "spinningBubbles"} width={this.props.width}/>
				</div>
			</div>
		);
	}
}
