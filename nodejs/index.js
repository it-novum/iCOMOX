// eCOMOX_MSG_CODE
const cCOMOX_MSG_CODE_Hello               = 0;
const cCOMOX_MSG_CODE_Reset               = 1;
const cCOMOX_MSG_CODE_GetConfiguration    = 2;
const cCOMOX_MSG_CODE_SetConfiguration    = 3;
const cCOMOX_MSG_CODE_Report              = 4;

const cCOMOX_MSG_CODE_COUNT               = 5;

// eCOMOX_PAYLOAD for sIN_MSG_Report.payloadType:
const cCOMOX_SENSOR_ADXL362              = 0;  //  "\x00"
const cCOMOX_SENSOR_ADXL356B             = 1;  //  "\x01"
const cCOMOX_SENSOR_BMM150               = 2;  //  "\x02"
const cCOMOX_SENSOR_ADT7410              = 3;  //  "\x03"
const cCOMOX_SENSOR_IM69D130             = 4;  //  "\x04"

const cCOMOX_SENSOR_COUNT                = 5;

// uCOMOX_CONFIGURATION_ReportedPayloads
const cCOMOX_SENSOR_BITMASK_ADXL362       = 1 << 0;
const cCOMOX_SENSOR_BITMASK_ADXL356B      = 1 << 1;
const cCOMOX_SENSOR_BITMASK_BMM150        = 1 << 2;
const cCOMOX_SENSOR_BITMASK_ADT7410       = 1 << 3;
const cCOMOX_SENSOR_BITMASK_IM69D130      = 1 << 4;

// uCOMOX_CONFIGURATION_CommChannel
const cCOMOX_CONFIGURATION_COMM_CHANNEL_USB               = 0;
const cCOMOX_CONFIGURATION_COMM_CHANNEL_SMIP              = 1;

// uCOMOX_CONFIGURATION_Activate
const cCOMOX_CONFIGURATION_Activate_LED1                  = 1 << 0;
const cCOMOX_CONFIGURATION_Activate_LED2                  = 1 << 1;
const cCOMOX_CONFIGURATION_Activate_Vibrator              = 1 << 2;

// sCOMOX_OUT_MSG_xxxx
const OUT_MSG_Hello = "\x00";
const OUT_MSG_Reset = "\x01";
const OUT_MSG_GetConfiguration = "\x02";





const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const misc = require('locutus/php/misc');

var path = "/dev/tty.usbserial-DM0266RU";
//var path = "/dev/cu.usbmodem142201"; //Arduino UNO test
const port = new SerialPort(path, { baudRate: 125000 }); //125000

const parser = new Readline();
port.pipe(parser);

port.on('data', function(data){
    console.log('Got data!');
    console.log(data.toString());
});


// Send OUT_MSG_Hello = b"\x00" to box
port.write(OUT_MSG_Hello);

//Report sensors
var reports = cCOMOX_SENSOR_BITMASK_ADXL356B | cCOMOX_SENSOR_BITMASK_BMM150 | cCOMOX_SENSOR_BITMASK_IM69D130 | cCOMOX_SENSOR_BITMASK_ADT7410;

console.log(reports);

port.write("\x03" + misc.pack('CCC', reports, cCOMOX_CONFIGURATION_COMM_CHANNEL_USB, 0));

/*
var vars = binary() //iCOMOX_messages.OUT_MSG_SetConfiguration
    .word8lu(reports)
    .word8lu(cCOMOX_CONFIGURATION_COMM_CHANNEL_USB)
    .word8lu(0)
    .vars
;

console.dir(vars);

*/



