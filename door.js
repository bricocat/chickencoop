const Gpio = require('onoff').Gpio;
const door_open = new Gpio(23, 'out');
const door_close = new Gpio(24, 'out');
const door_closed_sensor = new Gpio(22, 'in', 'both');

module.exports = function(data){

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

    process.on('SIGINT', () => {
        door_open.unexport();
        door_close.unexport();
        door_closed_sensor.unexport();
    });
}