const proxy = require("http-proxy-middleware").createProxyMiddleware;
const packageJson = require("../package");

module.exports = function expressMiddleware(router) {
	router.use("/api", proxy({
		target: "http://localhost:8080",
		changeOrigin: true
	}))
};
