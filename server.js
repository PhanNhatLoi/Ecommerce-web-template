const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 7001;
const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, function () {
  console.log('app opened at http://localhost:' + port);
});
