import "./deleteLocationButton.scss";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Interpolate from "components/i18n/interpolate";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class DeleteLocationButton extends React.Component {
	static defaultProps = {};

	static propTypes = {
		location: PropTypes.object.isRequired,
		onDelete: PropTypes.func.isRequired
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
			<Modal className="delete-location-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="delete.location.header" name={this.props.location.name()}>Delete %name%?</Translate>
				</ModalHeader>
				<ModalBody>
					<Interpolate i18nKey="delete.location.label" name={this.props.location.name()}>
						Are you sure you want to delete <strong>%name%</strong>?
					</Interpolate>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={() => {
						toggle();
						this.props.onDelete();
					}}>
						<Translate i18nKey="delete.location.button">Delete</Translate>
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
				<div className="deleteLocationButton">
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
