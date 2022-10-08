const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <html>
<body style="background-color:A4DE02;">
<h2 style="color:#1E5631;">Upload your CV!</h2>
      <form action="/upload" enctype="multipart/form-data" method="post"; margin:40px;>
        <input type="file" name="someCoolFiles"><br>
        <button style="background-color:#1E5631; color:white;font-size: 20px;margin-top:10px;">Upload!</button>
      </form>
</body>
</html>
         `);
  } else if (req.url === '/upload') {
    let filename = '';
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      filename = info.filename;
      const saveTo = path.join(__dirname, filename);
      file.pipe(fs.createWriteStream(saveTo));
    });
    bb.on('close', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`upload success: ${filename}`);
    });
    req.pipe(bb);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
  }
});

server.listen(4000, () => {
  console.log('Server listening on http://localhost:4000 ...');
});