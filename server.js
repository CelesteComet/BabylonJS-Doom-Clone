var port = process.env.PORT || 3000;
var express = require('express')
var app = express()
var server = require('http').Server(app);
var verbose = true;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


server.listen(port, () => {
  console.log(`server listening on port ${port}`);
})
