var ticksPerSecond: number = 60;

var disconnectionTime: number = 30 * ticksPerSecond;
var keepAliveTime: number = 20 * ticksPerSecond;

var IRCWriteDelayInSeconds: number = 1;
var maxBufferedIRCWrites: number = 5;

var debugErrorsAsAlerts: boolean = false;
var debugPrintMessages: boolean = false;
var debugLogIncomingIRCChat: boolean = true;
var debugLogOutgoingIRCChat: boolean = true;
var debugShowAssetMessages: boolean = false;