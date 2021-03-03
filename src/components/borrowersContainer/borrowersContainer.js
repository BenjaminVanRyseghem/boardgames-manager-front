import "./borrowersContainer.scss";
import { Button, Form, FormGroup, Label, ModalBody, ModalFooter } from "reactstrap";
import i18n from "i18n/i18n";
import info from "helpers/info";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import Translate from "components/i18n/translate";
import User from "models/user";

export default class BorrowersContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.object,
		lendTo: PropTypes.func,
		toggle: PropTypes.func
	};

	state = {
		candidate: undefined
	};

	setCandidate(candidate) {
		this.setState({ candidate });
	}

	componentDidUpdate(prevProps) {
		if (this.props.data && this.state.candidate === undefined) {
			this.setCandidate(this.props.data[0].id());
		}

		if (prevProps.error !== this.props.error) {
			info.error({
				html: <Translate i18nKey="failedToLoadUsers">Failed to load users!</Translate>
			});
		}
	}

	render() {
		let { data, error } = this.props;
		if (error) {
			return null;
		}

		if (!data) {
			return <div className="loading"><Loading/></div>;
		}

		if (!data.length) {
			return <div className="no-user"><Translate i18nKey="noUserFound">No user found!</Translate></div>;
		}

		return (
			<>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label>
								<Translate i18nKey="chooseAUser">Choose a user:</Translate>
							</Label>
							<Select
								formatOptionLabel={(option) => option.fullName()}
								getOptionLabel={(option) => option.fullName()}
								getOptionValue={(option) => option.id()}
								options={data.sort(User.sortAlphabetically)}
								placeholder={i18n.t("placeholder", "Select...")}
								value={this.state.candidate}
								onChange={(candidate) => this.setCandidate(candidate)}
							/>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => {
						this.props.toggle();
						this.props.lendTo(this.state.candidate);
					}}>
						<Translate i18nKey="lend">Lend</Translate>
					</Button>{" "}
					<Button color="secondary" onClick={this.props.toggle}><Translate i18nKey="cancel">Cancel</Translate></Button>
				</ModalFooter>
			</>
		);
	}
}
