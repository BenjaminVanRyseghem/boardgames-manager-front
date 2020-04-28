import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function InnerTranslate(props) {
	const { t, i18n } = useTranslation();
	return t(props.i18nKey, Object.assign({ i18next: i18n }, props, { defaultValue: props.children }));
}

/**
 * Translation react component providing a default text (in english).
 *
 * @extends {React.Component}
 * @example
 * import React from "react";
 * let title = (<Translate i18nKey="hello" name="Ben">
 *     Salut %name%
 * </Translate>);
 */
export default function Translate(props) {
	return (
		<Suspense fallback={<span className="empty loading">{props.children}</span>}>
			<InnerTranslate {...props}>
				{props.children}
			</InnerTranslate>
		</Suspense>
	);
}

Translate.propTypes = {
	children: PropTypes.string.isRequired,
	i18nKey: PropTypes.string.isRequired
};
