require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/git', require('./API/git/git.controller'));

app.get("/", (req, res) => {
    res.send("Personal Groups Update API " + String(process.env.NODE_ENV));
});

// global error handler
app.use(errorHandler);

// start server
if (process.env.NODE_ENV === 'DEV') {
    const port = 4000;
    app.listen(port, "git.personalgroup.it", () => console.log('Server listening on port ' + port));
} else {
    var privateKey  = fs.readFileSync('config/sslcert/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('config/sslcert/cert.pem', 'utf8');
    var credentials = { key: privateKey, cert: certificate };

    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);

    httpServer.listen(4000, "git.personalgroup.it");
    httpsServer.listen(4001, "git.personalgroup.it");
}