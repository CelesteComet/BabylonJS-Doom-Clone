var port = process.env.PORT || 3000;
var express = require('express')
var app = express()
var server = require('http').Server(app);
var verbose = true;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile('index.html');
})


server.listen(port, () => {
  console.log(`server listening on port ${port}`);
})
