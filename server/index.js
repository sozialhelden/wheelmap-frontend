var express = require('express');
var proxy = require('http-proxy-middleware');
var cors = require('cors')

var app = express();
app.use(cors())

app.use('/nodes', proxy({
  target: 'https://staging.wheelmap.org',
  // target: 'https://wheelmap.org',
  // target: 'http://192.168.33.10:3000',
  changeOrigin: true,
}));

app.listen(5000);
