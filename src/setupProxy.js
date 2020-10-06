const proxy = require("http-proxy-middleware").createProxyMiddleware;

module.exports = (app) => {
	// app.use(proxy("/api", { target: "http://localhost:8080/" }));
	app.use(proxy("/api", { target: "http://chani:9099/" }));
};
