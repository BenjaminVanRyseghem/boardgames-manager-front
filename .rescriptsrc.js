const CopyPlugin = require("copy-webpack-plugin");
const jestConfig = require("./jest.config");
const webpackConfig = require("./webpack.config");

module.exports = [
	["use-babel-config", ".babelrc"],
	"rescript-disable-eslint",
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
					filename: "main.css",
					moduleFilename: ({name}) => `${name}.css`
				};
			}

			webpack.plugins.push(
				new CopyPlugin([
					{
						from: "src/i18n/locales/**/*.json",
						to:"./public",
						transformPath: (path) => path.replace("src/i18n/", "")
					}
				])
			);

			webpack.resolve.modules = webpackConfig.resolve.modules;
			webpack.optimization.splitChunks = webpackConfig.optimization.splitChunks;
			webpack.optimization.runtimeChunk = webpackConfig.optimization.runtimeChunk;
			webpack.output.filename = webpackConfig.output.filename;

			return webpack;
		}
	}
];
