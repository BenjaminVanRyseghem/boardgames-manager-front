const CopyPlugin = require("copy-webpack-plugin");
const jestConfig = require("./jest.config");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
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
			webpack.plugins.push(
				new CopyPlugin([
					{
						from: "src/i18n/locales/**/*.json",
						to: "./",
						transformPath: (path) => path.replace("src/i18n/", "")
					}
				])
			);

			webpack.plugins.push(
				new PreloadWebpackPlugin({
					rel: "preload",
					as: "font",
					include: "allAssets",
					fileWhitelist: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i]
				})
			);

			webpack.resolve.modules = webpackConfig.resolve.modules;
			webpack.optimization.splitChunks = webpackConfig.optimization.splitChunks;
			webpack.optimization.runtimeChunk = webpackConfig.optimization.runtimeChunk;
			webpack.output.filename = webpackConfig.output.filename;
			webpack.resolve.alias = Object.assign({}, webpack.resolve.alias, webpackConfig.resolve.alias);

			return webpack;
		}
	}
];
