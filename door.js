const Gpio = require('onoff').Gpio;
const door_open = new Gpio(24, 'out');
const door_close = new Gpio(23, 'out');
const door_closed_sensor = new Gpio(22, 'in', 'both');
const time_open_close = 40000; //50 sec time to close or open the door

exports.Watch = function(data){

    door_closed_sensor.watch((err, value) => {

        if (err) {
            throw err;
        }
    
        switch(value){
            case 0:
                //door closed
                data.Door_Status = 'CLOSED'
                break;
            case 1:
                //door open
                data.Door_Status = 'OPEN'
                break;
            default:
                data.Door_Status = 'n.a.'
                break;
        }
    });   
}

exports.Open = function(data){

    door_close.write(0, function(){

        setTimeout(function(){
            data.Door_Message_Open = 'opening...';
            door_open.write(1, function(){
                setTimeout(function(){
                    door_open.writeSync(0);
                    data.Door_Message_Open = 'Last: ' + new Date(Date.now()).toLocaleString();
                },time_open_close);
            });
        }, 1000);
    });
}

exports.Close = function(data){

    door_open.write(0, function(){

        setTimeout(function(){
            door_close.write(1, function(){
                data.Door_Message_Close = 'closing...';
                setTimeout(function(){
                    door_close.writeSync(0);
                    data.Door_Message_Close = 'Last: ' + new Date(Date.now()).toLocaleString();
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