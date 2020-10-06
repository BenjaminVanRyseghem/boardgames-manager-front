import "./loadingButton.scss";
import { Button } from "reactstrap";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";

export default class LoadingButton extends React.Component {
	static defaultProps = {
		className: "",
		disabled: false,
		loading: false
	};

	static propTypes = {
		children: PropTypes.node,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		loading: PropTypes.bool
	};

	render() {
		let otherProps = Object.assign({}, this.props);

		delete otherProps.children;
		delete otherProps.loading;
		delete otherProps.disabled;

		return (
			<Button
				{...otherProps}
				className={`loadingButton ${this.props.className} ${this.props.loading ? "loading" : ""}`}
				color="primary"
				disabled={this.props.disabled || this.props.loading}
			>
				<span className="content-wrapper">{this.props.children}</span>
				<Loading height={24} width={24}/>
			</Button>
		);
	}
}
