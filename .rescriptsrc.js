const webpackConfig = require("./webpack.config");
const jestConfig = require("./jest.config");

module.exports = [
	["use-babel-config", ".babelrc"],
	{
		jest: (config) => {
			let result = Object.assign({}, config, jestConfig);
			result.transform["^.+\\.(js|jsx|ts|tsx)$"] = "babel-jest";
			result.moduleDirectories = webpackConfig.resolve.modules;
			return result;
		},
		webpack: (webpack) => {
			let cssPlugin = webpack.plugins.find((plugin) => plugin.constructor.name === "MiniCssExtractPlugin");

			if (cssPlugin) {
				cssPlugin.options = {
					filename: "main.css"
				};
			}

			webpack.resolve.modules = webpackConfig.resolve.modules;
			webpack.optimization.splitChunks = webpackConfig.optimization.splitChunks;
			webpack.optimization.runtimeChunk = webpackConfig.optimization.runtimeChunk;
			webpack.output.filename = webpackConfig.output.filename;

			return webpack;
		}
	}
];
