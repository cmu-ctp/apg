// way more error messsages
// debug sending of messages interally
// launching app without using chat somehow?
// make it easier to configure client - in what ways?  Screen size.  Landscape vs portrait.
// simpler examples
// vs code
// reorganize this file better.

// This is the only script referenced by the web page.

function onLoadEnd( gameLaunchFunction, devParms, appParms ) {

    var isMobile= true;
    var appFailedWithoutRecovery= false;
    var appFailMessage= '';

    var chatIRCChannelName = "";
    var logicIRCChannelName = "";
    
    var engineParms = {
        chat: null,
        chatLoadedFunction: null,
        playerName :"",
        playerOauth : ""
    };

    function FatalError() { Error.apply(this, arguments); this.name = "FatalError"; }
    FatalError.prototype = Object.create(Error.prototype);

    function AppFail(s) {
        appFailMessage = s;
        appFailedWithoutRecovery = true;
    }

    function CreateTwitchApp() {

        if (/Mobi/.test(navigator.userAgent)) {
            isMobile = true;
        }
        else {
            isMobile = false;
        }
        if (devParms.forceMobile === true) {
            isMobile = true;
        }

        if (devParms.skipAuthentication === true ) {
            chatIRCChannelName = devParms.forceChatIRCChannelName;
            logicIRCChannelName = devParms.forceLogicIRCChannelName;
            engineParms.playerName = devParms.forcePlayerName;
            engineParms.playerOauth = devParms.forcePlayerOauth;
        }

        if (location.hash !== null && location.hash !== "") {
            var lochash = location.hash.substr(1);
            var stateVals = lochash.substr(lochash.indexOf('state=')).split('&')[0].split('=')[1];
            var stateValTable = stateVals.split("+");
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
            Twitch.init({ clientId: appParms.clientID }, function (error, status) {
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
    }
    CreateTwitchApp();

    var preloaderFunction = null;
    function AddPreloader() {
        var tick = 0;
        var preloaderFunction = setInterval(function () {
            tick++;

            var s = "Please wait while the audience app loads ";
            for (var k = 0; k < tick; k++) {
                s += '.';
            }
            document.getElementById('loadLabel').textContent = s;

        }, 1000 / 6);
    }
    AddPreloader();

    function AddAppReposition() {
        var mouseDown = false;
        var startx = 0, starty = 0;
        var mx = 0, my = 0;
        var curx = 0, cury = 0;
        var clickx, clicky;
        var d = null;
        var dragging = false;
        document.onmousedown = function () {
            if (mouseDown === false) {
                if (mx > curx && mx < curx + 800 && my > cury && my < cury + 32) {
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
                if (d === null) { d = document.getElementById("APGInputWidget"); }
                d.style.position = "absolute";
                curx = clickx + (mx - startx);
                cury = clicky + (my - starty);
                d.style.left = "" + curx + 'px';
                d.style.top = "" + cury + 'px';
            }
        }, 1000 / 30);
    }
    if (!isMobile && appParms.allowClientReposition ) {
        AddAppReposition();
    }

    if (appFailedWithoutRecovery === true) {
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById("orientationWarning").style.display = 'none';
        document.getElementById("appErrorMessage").style.display = '';
        document.getElementById("appErrorMessage").textContent = 'Unrecoverable Error: ' + appFailMessage;
        throw new FatalError();
    }

    document.getElementById("appErrorMessage").style.display = 'none';
    document.getElementById("orientationWarning").style.display = 'none';
    document.getElementById("orientationWarning").textContent = 'This game only works in landscape mode.  Please reposition your phone or tablet.';

    function addTwitchIFrames() {

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
        iframe.setAttribute("width", appParms.chatWidth);
        iframe.setAttribute("height", appParms.chatHeight);
        document.getElementById("TwitchChat").appendChild(iframe);

        iframe = document.createElement('iframe');
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + chatIRCChannelName);
        iframe.setAttribute("width", ""+appParms.videoWidth);
        iframe.setAttribute("height", ""+appParms.videoHeight);
        document.getElementById("TwitchVideo").appendChild(iframe);
    }
    addTwitchIFrames();

    var isFullScreen = false;
    var phaserDivName = "APGInputWidget";

    if (isMobile) {
        phaserDivName = "APGInputWidgetMobile";
    }

    if (isMobile) {
        isFullScreen = true;
    }

    document.getElementById(phaserDivName).style.display = 'none';
    ApgSetup(gameLaunchFunction, devParms.disableNetworking, isMobile, appParms.gameWidth, appParms.gameHeight, logicIRCChannelName, phaserDivName, isFullScreen, engineParms, function () {
        if (preloaderFunction !== null) {
            clearInterval(preloaderFunction);
            preloaderFunction = null;
        }
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById(phaserDivName).style.display = '';
    });
}