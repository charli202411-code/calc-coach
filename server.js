var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var PORT = 8000;
var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer(function (req, res) {
  var urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch (e) {
    res.writeHead(400); res.end('Bad Request'); return;
  }
  var filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath.indexOf(ROOT) !== 0) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  try {
    if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch (e) { /* not exists, readFile will 404 */ }
  fs.readFile(filePath, function (err, data) {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, function () {
  console.log('Serving ' + ROOT);
  console.log('Local:   http://localhost:' + PORT);
});
