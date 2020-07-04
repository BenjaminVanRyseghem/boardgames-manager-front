import "./addLocation.scss";
import * as Yup from "yup";
import { Col, Container, Row } from "reactstrap";
import { FormikReactstrapBuilder, Input } from "zen-forms";
import i18n from "i18n/i18n";
import info from "helpers/info";
import Page from "../page";
import React from "react";
import { Redirect } from "react-router";
import Translate from "components/i18n/translate";

const validationSchema = Yup.object().shape({
	name: Yup.string().required(i18n.t("required", "Required"))
});

export default class AddLocation extends Page {
	static defaultProps = {};

	static propTypes = {};

	state = {
		name: "",
		redirect: null
	};

	title = <Translate i18nKey="addALocation">Add a location</Translate>;

	addLocation(name) {
		this.fetch("/api/v1/location", {
			method: "POST",
			body: {
				name
			}
		})
			.then(({ id }) => {
				this.setState({ redirect: id });
			})
			.catch(() => {
				info.error({
					html: <Translate i18nKey="failedToCreateLocation">Failed to create location!</Translate>
				});
			});
	}

	renderForm() {
		return <FormikReactstrapBuilder
			inline
			formClassName="add-location-form"
			initialValues={{
				name: ""
			}}
			spec={[
				new Input("name")
					.label("Name")
			]}
			submitProps={{
				color: "primary"
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => this.addLocation(values.name)}
		/>;
	}

	renderContent() {
		if (this.state.redirect) {
			return <Redirect to={`/location/${this.state.redirect}`}/>;
		}
		return (
			<div className="addLocation">
				<Container>
					<Row>
						<Col className="form-container" sm="12">
							{this.renderForm()}
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
