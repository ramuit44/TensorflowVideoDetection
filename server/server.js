const express = require("express");
const upload = require("./upload");
const cors = require("cors");
const fs = require('fs')
const path = require('path')

const server = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));
server.use('/static', express.static('upload'))

server.post("/upload", upload);

server.get('/video1', function(req, res) {
  console.log("Request made");
  const path = './output_detected_1.avi'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/avi',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/avi',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

server.listen(8000, () => {
  console.log("Server started!");
});
