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
var feed = require('./feed');
var sun = require('./sunrisesunset');

io.on('connection', function (socket) {
  
    console.log('user connected ' + socket.id);

    _data.Sunrise = sun.GetSunrise().toLocaleString();
    _data.Sunset = sun.GetSunset().toLocaleString();
    
    setInterval(function(){
      io.emit('set_data', JSON.stringify(_data));
    }, 1000);
         
    socket.on('door_open', function(){
  
      door.Open(_data);
    });

    socket.on('door_close', function(){
  
      door.Close(_data);
    });
    
    socket.on('water_open', function(){
  
      feed.Water(_data);
    });

    socket.on('food_open', function(){
  
      feed.Food(_data);
    });

    socket.on('toggle_control_mode', function(){
      console.log(_data.AUTOMATIC);
      if(_data.AUTOMATIC){
        _data.AUTOMATIC = false;
      }
      else{
        _data.AUTOMATIC = true;
      }
    });

    socket.on('disconnect', function(){
  
      console.log('user disconnected');
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});