var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var _data = require('./data');

var voltage_battery = require('./mcp3201')(_data);
var temp_chickencoop = require('./ds1820-temp')(_data);
var door = require('./door');
door.Watch(_data);

io.on('connection', function (socket) {
  
    console.log('user connected ' + socket.id);
    
    setInterval(function(){
      io.emit('set_data', JSON.stringify(_data));
    }, 1000);
         
    socket.on('door_open', function(){
  
      door.Open();
    });

  
    socket.on('door_close', function(){
  
      door.Close();
    });

    socket.on('disconnect', function(){
  
      console.log('user disconnected');
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});