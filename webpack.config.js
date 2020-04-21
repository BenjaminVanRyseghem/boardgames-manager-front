/* eslint-disable filenames/match-regex */
const path = require("path");

module.exports = {
	output: {
		filename: "bundle.js"
	},
	optimization: {
		splitChunks: {},
		runtimeChunk: false
	},
	externals: {
		jsdom: "window",
		cheerio: "window",
		"react/lib/ExecutionEnvironment": true,
		"react/lib/ReactContext": "window",
		"react/addons": true
	},
	module: {
		rules: [
			{
				test: /src\/js\/.+\.js$/,
				loader: "babel-loader?plugins=rewire",
				query: {
					presets: ["react"]
				}
			},
			{
				test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
				loader: require.resolve("file-loader"),
				query: {
					name: "static/assets/[name].[hash:8].[ext]"
				}
			}
		]
	},
	resolve: {
		modules: [
			path.resolve(process.cwd(), "src"),
			"node_modules"
		]
	}
};
