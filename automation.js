var sun = require('./sunrisesunset');
var sunrise, sunset, currHour;
var openCheckStart = 6;
var openCheckEnd = 15;
var closeCheckStart = 16;
var closeCheckEnd = 4;
var closeBuffer = 20 * 60000; //20 min buffer time

module.exports = function(data, door){

    Perform(data, door);

    setInterval(function(){Perform(data, door)}, 60000); 
}


function Perform(data, door){

    //check current time for open or close door
    data.CurrentDateTime = new Date(Date.now());

    console.log(data.CurrentDateTime);

    sunrise = sun.GetSunrise(data.CurrentDateTime);
    sunset = sun.GetSunset(data.CurrentDateTime);

    data.Sunrise = sunrise.toLocaleTimeString();
    data.Sunset = sunset.toLocaleTimeString();

    currHour = data.CurrentDateTime.getHours();


    //check for opening
    if('OPEN' != data.Door_Status){

        if(data.Fix_Open_Time_Active){
                console.log('fix open');
        }
        else if(currHour >= openCheckStart && currHour <= openCheckEnd){
            console.log('open check');
        }
    }
    
    if('CLOSED' != data.Door_Status){
        //check for closing
        if(currHour >= closeCheckStart || currHour <= closeCheckEnd){
            console.log((sunset - data.CurrentDateTime) + closeBuffer);
            if(0 > (sunset - data.CurrentDateTime) + closeBuffer){
                //time to close
                console .log('CLOOOOSE');
                door.Close(data);
            }
        }
    }

    
}
