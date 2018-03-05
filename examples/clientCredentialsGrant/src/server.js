/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const express = require("express");
const Wskey = require("nodeauth/src/Wskey");
const AccessToken = require("nodeauth/src/accessToken");
const User = require("nodeauth/src/user");
const OCLCMiddleware = require("nodeauth/src/oclcMiddleware");

// Authentication parameters -------------------------------------------------------------------------------------------

const wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["{scope 1}","{scope 2}","..."]
});

let user = new User({
    "authenticatingInstitutionId": "{your institution ID}"
});

let accessToken = new AccessToken({
    wskey: wskey,
    user: user,
    grantType: "client_credentials"
});

const port = 8000;

// ---- Initialize a Server --------------------------------------------------------------------------------------------

const app = express();
app.set("view engine", "pug");
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// ---- Middleware -----------------------------------------------------------------------------------------------------

app.use(OCLCMiddleware.authenticationManager({
    homePath: "/",
    authenticationPath: "/login",
    port: port,
    accessToken: accessToken,
    user: user,
    wskey: wskey,
}));

// Serve the main page
app.get("/", function (req, res) {
    res.render("index", {
        pageTitle: "Client Credentials Grant",
        token: JSON.stringify(accessToken.params, null, 4)
    });
});
