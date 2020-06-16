import "./borrowersContainer.scss";
import { Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter } from "reactstrap";
import info from "helpers/info";
import Loading from "components/loading/loading";
import PropTypes from "prop-types";
import React from "react";
import Translate from "components/i18n/translate";

export default class BorrowersContainer extends React.Component {
	static defaultProps = {
		data: undefined,
		error: undefined
	}

	static propTypes = {
		data: PropTypes.array,
		error: PropTypes.bool,
		lendTo: PropTypes.func,
		toggle: PropTypes.func
	};

	state = {
		candidate: undefined
	};

	setCandidate(candidate) {
		this.setState({ candidate });
	}

	componentDidUpdate() {
		if (this.props.data && this.state.candidate === undefined) {
			this.setCandidate(this.props.data[0].id);
		}
	}

	render() {
		let { data, error } = this.props;
		if (error) {
			info.error({
				html: <Translate i18nKey="failedToLoadUsers">Failed to load users!</Translate>
			});
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
							<Input type="select" onChange={(event) => this.setCandidate(event.target.value)}>
								{
									data.map((user) => <option key={user.id} value={user.id}>
										{`${user.firstName} ${user.lastName}`}
									</option>)
								}
							</Input>
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
