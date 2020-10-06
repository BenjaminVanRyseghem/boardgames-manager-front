import "./editLocationButton.scss";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class EditLocationButton extends React.Component {
	static propTypes = {
		location: PropTypes.object.isRequired,
		onUpdate: PropTypes.func.isRequired
	};

	state = {
		open: false,
		name: this.props.location.name()
	};

	toggleModal() {
		this.setState((state) => ({
			open: !state.open
		}));
	}

	submit() {
		this.toggleModal();
		this.props.onUpdate({ name: this.state.name });
	}

	renderModal() {
		let toggle = this.toggleModal.bind(this);

		return (
			<Modal className="edit-location-modal" isOpen={this.state.open} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					<Translate i18nKey="update.location.header" name={this.props.location.name()}>
						Edit %name%
					</Translate>
				</ModalHeader>
				<ModalBody>
					<Form inline onSubmit={(event) => {
						this.submit();
						return event.preventDefault();
					}}>
						<FormGroup>
							<Label><Translate i18nKey="form.name">Name:</Translate></Label>
							<Input
								autoFocus
								value={this.state.name}
								onChange={({ target: { value: name } }) => this.setState({ name })}
							/>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => this.submit()}>
						<Translate i18nKey="update.location.button">Update</Translate>
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
				<div className="editLocationButton">
					<FontAwesomeIcon
						className="edit-icon"
						icon="pen"
						onClick={this.toggleModal.bind(this)}
					/>
				</div>
			</>
		);
	}
}
