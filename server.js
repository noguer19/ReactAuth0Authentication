const express = require("express");
require("dotenv").config();

var jwt = require("express-jwt");
var jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
	algorithms: ["RS256"],
});

const app = express();

// app.use(checkJwt);

app.get("/public", function (req, res) {
	res.json({
		message: "Hello from a public API",
	});
});

app.get("/private", checkJwt, function (req, res) {
	res.json({
		message: "Hello from a private API",
	});
});

app.listen(3001);
console.log("API Server listening on port: " + process.env.REACT_APP_API_URL);
