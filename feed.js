const Gpio = require('onoff').Gpio;
const water_open = new Gpio(20, 'out');
const water_open_time = 2000;
const food_open = new Gpio(16, 'out');
const food_open_time = 1000;

exports.Water = function(data){

    water_open.write(1, function(){
        setTimeout(function(){
            water_open.writeSync(0);
            data.Water_Message = 'Last: ' + new Date(Date.now()).toLocaleString();
        },water_open_time);
    });
}

exports.Food = function(data){

    food_open.write(1, function(){
        setTimeout(function(){
            food_open.writeSync(0);
            data.Food_Message = 'Last: ' + new Date(Date.now()).toLocaleString();
        },food_open_time);
    });
}

process.on('SIGINT', () => {
    water_open.unexport();
    food_open.unexport();
});