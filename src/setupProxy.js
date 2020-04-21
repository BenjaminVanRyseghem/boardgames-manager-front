const proxy = require("http-proxy-middleware").createProxyMiddleware;

module.exports = (app) => {
	app.use(proxy("/api", { target: "http://localhost:8080/" }));
};
