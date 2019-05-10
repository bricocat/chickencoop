const Gpio = require('onoff').Gpio;
const door_open = new Gpio(24, 'out');
const door_close = new Gpio(23, 'out');
const door_closed_sensor = new Gpio(22, 'in', 'both');
const time_open_close = 50000; //50 sec time to close or open the door

exports.Watch = function(data){

    door_closed_sensor.watch((err, value) => {
        if (err) {
        throw err;
        }
    
        switch(value){
            case 0:
                //door closed
                data.Door_Status = 'Closed'
                break;
            case 1:
                //door open
                data.Door_Status = 'Open'
                break;
            default:
                data.Door_Status = 'n.a.'
                break;
        }
    });   
}

exports.Open = function(){

    door_close.write(0, function(){

        setTimeout(function(){
            door_open.write(1, function(){
                setTimeout(function(){
                    door_open.writeSync(0);
                },time_open_close);
            });
        }, 1000);
    });

    console.log('OPEN');
}

exports.Close = function(){

    door_open.write(0, function(){

        setTimeout(function(){
            door_close.write(1, function(){
                setTimeout(function(){
                    door_close.writeSync(0);
                },time_open_close);
            });
        }, 1000);
    });
}


process.on('SIGINT', () => {
    door_open.unexport();
    door_close.unexport();
    door_closed_sensor.unexport();
});