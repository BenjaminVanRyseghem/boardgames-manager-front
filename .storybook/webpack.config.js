const path = require("path");

module.exports = async ({ config, mode }) => {
	config.resolve.modules = [
		path.resolve(process.cwd(), "src"),
		"node_modules"
	];

	config.plugins = config.plugins.filter(
		p => String(p.resourceRegExp) !== "/core-js/"
	);

	return config;
};
