var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var open = require("open");
var jsonfile = require('jsonfile')
var port = 3030;
var listOfItems = [];
var file = './server/list.json'

jsonfile.readFile(file, function(err, obj) {
  listOfItems = obj;
})

app.use(express.static('public'));

//connect and define messages for add, deletion and updating the positions
io.on('connection', function(socket) {
  socket.emit('makeList', listOfItems);

  socket.on('add', function(data) {
    listOfItems = data;
    updatePositions(data);
    socket.emit('makeList', data);
  });

  socket.on('update', function(data) {
    listOfItems = data;
    updatePositions(data);
    socket.emit('makeList', data);
  });

  socket.on('delete', function(data) {
    listOfItems = data;
    updatePositions(data);
    socket.emit('makeList', data);
  });
});

//update the current positions of elements to JSON.
function updatePositions(contents){
  jsonfile.writeFile(file, contents, {spaces: 2}, function (err) {
    if (err){
      console.error(err)
    }
   })
}

//open server and default browser
server.listen(port, function() {
  open("http://127.0.0.1:"+port);
  console.log("Server running at http://127.0.0.1:"+port);
});