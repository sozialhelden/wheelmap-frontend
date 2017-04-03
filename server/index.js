var express = require('express');
var proxy = require('http-proxy-middleware');
var cors = require('cors')

var app = express();
app.use(cors())

app.use('/nodes', proxy({
  target: 'https://wheelmap.org',
  changeOrigin: true,
}));

app.listen(5000);
