import "./deleteUserButton.scss";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Interpolate from "components/i18n/interpolate";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class DeleteUserButton extends React.Component {
	static defaultProps = {};

	static propTypes = {
		onDelete: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	state = {
		open: false
	};

	toggleModal() {
		this.setState((state) => ({
			open: !state.open
		}));
	}

	renderModal() {
		let toggle = this.toggleModal.bind(this);

		return (
			<Modal className="delete-user-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="delete.user.header" name={this.props.user.fullName()}>Delete %name%?</Translate>
				</ModalHeader>
				<ModalBody>
					<Interpolate i18nKey="delete.user.label" name={this.props.user.fullName()}>
						Are you sure you want to delete <strong>%name%</strong>?
					</Interpolate>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={() => {
						toggle();
						this.props.onDelete();
					}}>
						<Translate i18nKey="delete.user.button">Delete</Translate>
					</Button>{" "}
					<Button color="secondary" onClick={toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
				</ModalFooter>
			</Modal>
		);
	}

	render() {
		return (
			<>
				{this.renderModal()}
				<div className="deleteUserButton">
					<FontAwesomeIcon
						className="delete-icon"
						icon="trash"
						onClick={this.toggleModal.bind(this)}
					/>
				</div>
			</>
		);
	}
}
