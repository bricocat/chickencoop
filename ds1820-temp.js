const sensors = require('ds1820-temp');
const mySensor = '0416a16936ff'; //id of my ds1820 sensor

module.exports = function(data){

    setInterval(function(){

        sensors.readDevice(mySensor, function (err, result) {

            if (err) {
                console.log('An error occurred - ds1820-temp.', err);
                data.Temp_Chickencoop = NaN;
            return;
            }
    
            data.Temp_Chickencoop = result.value.toFixed(1);
        });
    }, 2000);
}
