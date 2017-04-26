// way more error messsages
// debug sending of messages interally
// launching app without using chat somehow?
// make it easier to configure client - in what ways?  Screen size.  Landscape vs portrait.
// simpler examples
// vs code
// reorganize this file better.

// This is the only script referenced by the web page.

declare var WebFontConfig: Object;

interface TwitchIFace {
	init(parms: Object, fn: Function): void;
	api(parms: Object, fn: Function): void;
	getToken(): string;
}

interface tmiIFace {
	client(parms: Object): void;
}

declare var Twitch: TwitchIFace;
declare var tmi: tmiIFace;

function AddAppReposition(divName:string, width:number):void {
	var mouseDown = false;
	var startx = 0, starty = 0;
	var mx = 0, my = 0;
	var curx = 0, cury = 0;
	var clickx, clicky;
	var d = null;
	var dragging = false;
	document.onmousedown = function () {
		if (mouseDown === false) {
			if (mx > curx && mx < curx + width && my > cury && my < cury + 32) {
				startx = mx;
				starty = my;
				clickx = curx;
				clicky = cury;
				dragging = true;
			}
		}
		mouseDown = true;
	};
	document.onmouseup = function () {
		dragging = false;
		mouseDown = false;
	};
	document.onmousemove = function (e) {
		mx = e.clientX;
		my = e.clientY;
	};
	setInterval(function () {
		if (dragging) {
			if (d === null) {
				d = document.getElementById(divName);
			}
			d.style.position = "absolute";
			curx = clickx + (mx - startx);
			cury = clicky + (my - starty);
			d.style.left = "" + curx + 'px';
			d.style.top = "" + cury + 'px';
		}
	}, 1000 / 30);
}

function setTwitchIFrames(isMobile:boolean, chatIRCChannelName:string, chatWidth:number, chatHeight:number, videoWidth:number, videoHeight:number ):void {

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

	iframe = document.createElement('iframe');
	iframe.setAttribute("allowfullscreen", "true");
	iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + chatIRCChannelName);
	iframe.setAttribute("width", "" + '' +videoWidth);
	iframe.setAttribute("height", "" + '' +videoHeight);
	document.getElementById("TwitchVideo").appendChild(iframe);
}

function AddPreloader(phaserDivName:string ):()=>void {
	var tick = 0;
	var preloaderFunction = setInterval(function () {
		tick++;

		var s = "Please wait while the audience app loads ";
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

function launchAPGClient(assetCacheFunction, gameLaunchFunction, devParms, appParms) {

	var isMobile = true;

	var chatIRCChannelName = "";
	var logicIRCChannelName = "";

	var engineParms = {
		clientID:'',
		chat: null,
		chatLoadedFunction: null,
		playerName: "",
		playerOauth: ""
	};

	var appFailMessage = '';
	var appFailedWithoutRecovery = false;

	function AppFail(s) {
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

	var phaserDivName = (isMobile ? "APGInputWidgetMobile" : "APGInputWidget");
	document.getElementById(phaserDivName).style.display = 'none';

	var ClearOnLoadEnd = AddPreloader(phaserDivName);

	if (!isMobile && appParms.allowClientReposition) {
		AddAppReposition("APGInputWidget", appParms.gameWidth);
	}

	function FatalError() { Error.apply(this, arguments); this.name = "FatalError"; }
	FatalError.prototype = Object.create(Error.prototype);
	if (appFailedWithoutRecovery === true) {
		document.getElementById('loadLabel').style.display = 'none';
		document.getElementById("orientationWarning").style.display = 'none';
		document.getElementById("appErrorMessage").style.display = '';
		document.getElementById("appErrorMessage").textContent = 'Unrecoverable Error: ' + appFailMessage;
		throw new FatalError();
	}
	document.getElementById("appErrorMessage").style.display = 'none';

	setTwitchIFrames(isMobile, chatIRCChannelName, appParms.chatWidth, appParms.chatHeight, appParms.videoWidth, appParms.videoHeight);

	var HandleOrientation = MakeOrientationWarning(isMobile, phaserDivName);

	ApgSetup(assetCacheFunction, gameLaunchFunction, devParms.disableNetworking, isMobile, appParms.gameWidth, appParms.gameHeight, logicIRCChannelName, phaserDivName, isMobile, engineParms, ClearOnLoadEnd, HandleOrientation);
}