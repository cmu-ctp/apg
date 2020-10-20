declare var WebFontConfig: Object;

interface TwitchIFace {
	init(parms: Object, fn: Function): void;
	api(parms: Object, fn: Function): void;
	Player(name: string, parms: any): void;
	getToken(): string;
}

interface tmiIFace {
	client(parms: Object): void;
}

declare var Twitch: TwitchIFace;
declare var tmi: tmiIFace;

interface DevParms{
	disableNetworking: boolean;

	useLocalTestNetworking: boolean;
	forceMetadataFrames: boolean;

	networkingTestSequence: boolean;

	skipAuthentication: boolean;
	forceChatIRCChannelName: string;
	forceLogicIRCChannelName: string;
	forcePlayerName: string;
	forcePlayerOauth: string;
	forceClientID: string;

	forceMobile: boolean;
}

interface AppParms{
	cacheFunction: (AssetCacher) => void;

	gameLaunchFunction: (APGFullSystem) => void;

	useMetadata: boolean;

	gameName: string;

	gameWidth: number;
	gameHeight: number;

	videoWidth: number;
	videoHeight: number;
	chatWidth: number;
	chatHeight: number;
}

interface EngineParms{
	clientID: string;
	chat: any;
	chatLoadedFunction: () => void;
	metadataLoadedFunction: () => void;
	metadataDoneLoading: boolean;
	playerName: string;
	playerOauth: string;
}

function setTwitchIFrames(isMobile: boolean, chatIRCChannelName: string, chatWidth: number, chatHeight: number, videoWidth: number, videoHeight: number, metadataSys:MetadataFullSys ):void {

	if (isMobile) {
		$('.browser').removeClass();
		return;
	}

	$('.mobile').removeClass();

	var iframe = document.createElement('iframe');
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("scrolling", "no");
	iframe.setAttribute("id", "chat_embed");
	iframe.setAttribute("src", "http://www.twitch.tv/" + chatIRCChannelName + "/chat");
	iframe.setAttribute("width", ''+chatWidth);
	iframe.setAttribute("height", '' +chatHeight);
	document.getElementById("TwitchChat").appendChild(iframe);

	/*iframe = document.createElement('iframe');
	iframe.setAttribute("allowfullscreen", "true");
	iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + chatIRCChannelName);
	iframe.setAttribute("width", "" + '' +videoWidth);
	iframe.setAttribute("height", "" + '' +videoHeight);
	document.getElementById("TwitchVideo").appendChild(iframe);*/

	var options = {
		width: videoWidth,
		height: videoHeight,
		channel: chatIRCChannelName
	};
	var player = new Twitch.Player("TwitchVideo", options);
	player.setVolume(0.5);
	metadataSys.SetVideoPlayer(player);
}

function AddPreloader(phaserDivName:string, gameName:string ):()=>void {
	var tick = 0;
	var preloaderFunction = setInterval(function () {
		tick++;

		var s = "Please wait while "+gameName+" loads ";
		for (var k = 0; k < tick; k++) {
			s += '.';
		}
		document.getElementById('loadLabel').textContent = s;

	}, 1000 / 6);
	return function () {
		if (preloaderFunction !== null) {
			clearInterval(preloaderFunction);
			preloaderFunction = null;
		}
		document.getElementById('loadLabel').style.display = 'none';
		document.getElementById(phaserDivName).style.display = '';
	};
}

function MakeOrientationWarning(isMobile:boolean, phaserDivName:string):()=>void {
	document.getElementById("orientationWarning").style.display = 'none';
	document.getElementById("orientationWarning").textContent = 'This game only works in landscape mode.  Please reposition your phone or tablet.';

	if (isMobile) {
		var showingOrientationWarning = false;
		return function () {
			var width = window.innerWidth || document.body.clientWidth;
			var height = window.innerHeight || document.body.clientHeight;
			if (height > width) {
				if (!showingOrientationWarning) {
					showingOrientationWarning = true;
					document.getElementById("orientationWarning").style.display = '';
					document.getElementById(phaserDivName).style.display = 'none';
				}
			}
			else {
				if (showingOrientationWarning) {
					showingOrientationWarning = false;
					document.getElementById("orientationWarning").style.display = 'none';
					document.getElementById(phaserDivName).style.display = '';
				}
			}
		}
	}
	else return function () { };
}

/**
* Entry point for launching the APG Client HTML5 App from a containing web page.
* The fields of devParms and appParms are specified in the .html file.
*/
function launchAPGClient(devParms: DevParms, appParms: AppParms) {

	var isMobile = true;

	var chatIRCChannelName = "";
	var logicIRCChannelName = "";

	var engineParms:EngineParms = {
		clientID:'',
		chat: null,
		chatLoadedFunction: null,
		metadataLoadedFunction: null,
		metadataDoneLoading: false,
		playerName: "",
		playerOauth: ""
	};

	var appFailMessage = '';
	var appFailedWithoutRecovery = false;

	function AppFail(s:string):void {
		appFailMessage = s;
		appFailedWithoutRecovery = true;
	}

	isMobile = (/Mobi/.test(navigator.userAgent)) ? true : false;

	if (devParms.forceMobile === true) isMobile = true;

	if (devParms.skipAuthentication === true) {
		engineParms.clientID = devParms.forceClientID;
		chatIRCChannelName = devParms.forceChatIRCChannelName;
		logicIRCChannelName = devParms.forceLogicIRCChannelName;
		engineParms.playerName = devParms.forcePlayerName;
		engineParms.playerOauth = devParms.forcePlayerOauth;
	}

	if (location.hash !== null && location.hash !== "") {
		var lochash = location.hash.substr(1);
		var stateVals = lochash.substr(lochash.indexOf('state=')).split('&')[0].split('=')[1];
		var stateValTable = stateVals.split("+");
		engineParms.clientID = stateValTable[0];
		chatIRCChannelName = stateValTable[1];
		logicIRCChannelName = stateValTable[2];
	}

	if (!devParms.disableNetworking) {
		if (logicIRCChannelName === '') {
			AppFail('Logic IRC Twitch Channel Name was empty.  The client app needs this field to be set.');
		}

		if (chatIRCChannelName === '') {
			AppFail('Chat IRC Twitch Channel Name was empty.  The client app needs this field to be set.');
		}
	}

	if (devParms.disableNetworking) {
		engineParms.chat = null;
	}
	else {
		Twitch.init({ clientId: engineParms.clientID }, function (error, status) {
			if (status.authenticated || devParms.skipAuthentication) {
				Twitch.api({ method: 'user' }, function (error, user) {

					if (!devParms.skipAuthentication) {
						if (user === null) alert(error);
						engineParms.playerName = user.display_name;
						engineParms.playerOauth = "oauth:" + Twitch.getToken();
					}

					if (logicIRCChannelName === engineParms.playerName) {
						AppFail('' + engineParms.playerName + ' is the same as the streamers networking channel.');
					}

					var options = {
						options: { debug: true },
						connection: { reconnect: true },
						identity: { username: engineParms.playerName, password: engineParms.playerOauth },
						channels: ["#" + logicIRCChannelName]
					};
					engineParms.chat = new tmi.client(options);
					if (engineParms.chatLoadedFunction !== null) {
						engineParms.chatLoadedFunction();
						engineParms.chatLoadedFunction = null;
					}
					engineParms.chat.connect().then(function (data) {
					}).catch(function (err) {
						AppFail('Twitch Chat Initialization Error: ' + err);
						console.log("Error: " + err);
					});
				});
			}
		});
	}

	var metadataLoadSuccess = () => {
		engineParms.metadataDoneLoading = true;
		if (engineParms.metadataLoadedFunction != null) {
			engineParms.metadataLoadedFunction();
		}
	};
	var metadataLoadFail = errorMessage => {
		AppFail('Metadata System Initialization Error: ' + errorMessage);
	};
	var metadataSys = new MetadataFullSys(appParms.useMetadata, appParms.videoWidth, appParms.videoHeight, location.hash, metadataLoadSuccess, metadataLoadFail, devParms.useLocalTestNetworking, devParms.forceMetadataFrames );

	var phaserDivName = (isMobile ? "APGInputWidgetMobile" : "APGInputWidget");
	document.getElementById(phaserDivName).style.display = 'none';

	var ClearOnLoadEnd = AddPreloader(phaserDivName, appParms.gameName);

	function FatalError() { Error.apply(this, arguments); this.name = "FatalError"; }
	FatalError.prototype = Object.create(Error.prototype);
	if (appFailedWithoutRecovery) {
		document.getElementById('loadLabel').style.display = 'none';
		document.getElementById("orientationWarning").style.display = 'none';
		document.getElementById("appErrorMessage").style.display = '';
		document.getElementById("appErrorMessage").textContent = 'Unrecoverable Error: ' + appFailMessage;
		throw new FatalError();
	}
	document.getElementById("appErrorMessage").style.display = 'none';

	setTwitchIFrames(isMobile, chatIRCChannelName, appParms.chatWidth, appParms.chatHeight, appParms.videoWidth, appParms.videoHeight, metadataSys );

	var HandleOrientation = MakeOrientationWarning(isMobile, phaserDivName);

	ApgSetup( appParms, devParms.networkingTestSequence, devParms.disableNetworking, logicIRCChannelName, phaserDivName, isMobile,
		engineParms, ClearOnLoadEnd, HandleOrientation, metadataSys);
}