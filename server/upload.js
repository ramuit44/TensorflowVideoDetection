var fs = require("fs");
const IncomingForm = require("formidable").IncomingForm;
var io = require("socket.io").listen(3001);

io.sockets.on("connection", function(socket) {
  // socket.emit('news', { hello: 'world' });
  socket.on("process", function(data) {
    console.log(data);

    const { spawn } = require("child_process");
    const pyprog = spawn("python3", ["./FirstVideoDetection.py"]);
    str = "";

    pyprog.stdout.on("data", function(data) {
      str = data.toString();
      socket.emit("frames",str);
    });

    pyprog.stderr.on("data", data => {
      // res.end('stderr: ' + data);
      console.error("Error getting data" + data.toString());
    });

    pyprog.on("close", function(code) {
      //res.end(str);
      console.log("came to end : " + str);
      socket.emit("frames","****CAME TO END***");
    });
  });
  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = function upload(req, res) {
  var form = new IncomingForm();
  form.uploadDir = "./upload";
  form.keepExtensions = true;

  form.on("file", (field, file) => {
    console.log(file.path);
    fs.renameSync("./" + file.path, "./input.mp4");

    //     const { spawn } = require('child_process');
    //     const pyprog = spawn('python3', ['./FirstVideoDetection.py']);
    //     str = "";

    //     pyprog.stdout.on('data', function(data) {
    //       str += data.toString();
    //   });

    //   pyprog.stderr.on('data', (data) => {
    //    // res.end('stderr: ' + data);
    //     console.error("Error getting data" + data.toString())
    // });

    // pyprog.on('close', function (code) {
    //   //res.end(str);
    //   console.log("came to end : " + str);
    // });
  });
  form.on("end", () => {
    console.log("came to form end");
    res.json();
  });
  form.parse(req);
};
