var express = require('express'),
    app = express(),
    port = process.env.PORT || 8087;

app.listen(port);

console.log('RESTful api server started on: ' + port)