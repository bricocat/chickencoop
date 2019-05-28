var sun = require('./sunrisesunset');
var sunrise, sunset, currHour;
var openCheckStart = 6;
var openCheckEnd = 16;
var closeCheckStart = 17;
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
    if('CLOSED' == data.Door_Status){

        
        if(currHour >= openCheckStart && currHour <= openCheckEnd){

            if(data.Fix_Open_Time_Active){
                
                console.log('fix open check');
              

                var fixOpenTime = new Date(data.CurrentDateTime.getFullYear(), 
                                            data.CurrentDateTime.getMonth(), 
                                            data.CurrentDateTime.getDate(), 
                                            data.Fix_Open_Time[0], 
                                            data.Fix_Open_Time[1], 
                                            0,0);

                                            console.log(fixOpenTime - data.CurrentDateTime);

                if(0 > (fixOpenTime - data.CurrentDateTime)){

                        console .log('OOOOOPEN FIX');
                        door.Open(data);
                    }
                 
            }
            else{

                console.log('open check sun rise');

                console.log(sunrise - data.CurrentDateTime);

                if(0 > (sunrise - data.CurrentDateTime)){
                    //time to open
                    console .log('OOOOOPEN');
                    door.Open(data);
                }
            }

            
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
