const spi = require('spi-device');

const adc_MAX = 4095; 

module.exports = function (dataOject){

  // The MCP3201 is on bus 0 and it's device 0
	const mcp3201 = spi.open(0, 0, (err) => {
		if (err) throw err;
		// An SPI message is an array of one or more read+write transfers
		const message = [{
			sendBuffer: Buffer.from([0x00, 0x00]), // dummy buffer, the MCP3201 does not read data
			receiveBuffer: Buffer.alloc(2),   //two bute message
			byteLength: 2,
			speedHz: 500000 // lower speed
		}];

		setInterval(() => {
				mcp3201.transfer(message, (err, message) => {
					if (err) throw err;
					
				//first way to manipulate the received bytes (datasheet)
				const rawValue = ((message[0].receiveBuffer[0] & 0x1f) << 7) + (message[0].receiveBuffer[1] >> 1);

				if(rawValue < adc_MAX){
					//var voltage = ((rawValue * 4.99) / adc_MAX * 4) + ((rawValue - 750) / 1000);

					var voltage = (rawValue * 5.0) / adc_MAX;
					voltage *= 4;
					//dataObject.Current_Voltage = voltage;
					//console.log(rawValue + '   '  + voltage);

					dataOject.Voltage_Battery = voltage.toFixed(1);

				}

				/* NOT USED HERE
				//second way to manipulate the received bytes (datasheet)
				var MSB_1 = message[0].receiveBuffer[1]
						MSB_1 = MSB_1 >> 1  // shift right 1 bit to remove B01 from the LSB mode

						var MSB_0 = message[0].receiveBuffer[0] & 0b00011111 // # mask the 2 unknown bits and the null bit
				MSB_0 = MSB_0 << 7 //# shift left 7 bits (i.e. the first MSB 5 bits of 12 bits)
				
				//console.log(MSB_0 + MSB_1);
				*/

				});
			}, 2000);
			
	});
}