// way more error messsages
// debug sending of messages interally
// launching app without using chat somehow?
// make it easier to configure client - in what ways?  Screen size.  Landscape vs portrait.
// simpler examples
// vs code
// reorganize this file better.

// This is the only script referenced by the web page.

function onLoadEnd() {

    var devParms = {
        disableNetworking: true,

        skipAuthentication: true,
        forceChatIRCChannelName: "",
        forceLogicIRCChannelName: "",
        forcePlayerName: "",
        forcePlayerOauth: "",
        forceMobile: true,
    }

    var appParms = {
        // The Client-ID is used by Twitch.init .  See https://github.com/justintv/twitch-js-sdk - It was generated here: https://www.twitch.tv/kraken/oauth2/clients/new
        // You need to register a new game with Twitch to get your own Client-ID. - The Client-ID is public - there is no need to hide it.  It should be a string of 31 alpha-numeric digits.
        clientID: 'hjgrph2akqwki1617ac5rdq9rqiep0k',

        gameWidth: 800,
        gameHeight: 450,
        landscapeOnly: true,
        portraitOnly: false,
    };

    var engineParms = {
        isMobile: true,
        chat: null,
        chatLoadedFunction: null,
        appFailedWithoutRecovery: false,
        appFailMessage: ''
    };

    function FatalError() { Error.apply(this, arguments); this.name = "FatalError"; }
    FatalError.prototype = Object.create(Error.prototype);

    function AppFail(s) {
        engineParms.appFailMessage = s;
        engineParms.appFailedWithoutRecovery = true;
    }

    function CreateTwitchApp() {

        if (/Mobi/.test(navigator.userAgent)) {
            engineParms.isMobile = true;
        }
        else {
            engineParms.isMobile = false;
        }
        if (devParms.forceMobile === true) {
            engineParms.isMobile = true;
        }

        if (devParms.skipAuthentication === true ) {
            engineParms.chatIRCChannelName = devParms.forceChatIRCChannelName;
            engineParms.logicIRCChannelName = devParms.forceLogicIRCChannelName;
            engineParms.playerName = devParms.forcePlayerName;
            engineParms.playerOauth = devParms.forcePlayerOauth;
        }

        if (location.hash !== null && location.hash !== "") {
            var lochash = location.hash.substr(1);
            var stateVals = lochash.substr(lochash.indexOf('state=')).split('&')[0].split('=')[1];
            var stateValTable = stateVals.split("+");
            engineParms.chatIRCChannelName = stateValTable[1];
            engineParms.logicIRCChannelName = stateValTable[2];
        }

        if (!devParms.disableNetworking) {
            if (engineParms.logicIRCChannelName === '') {
                AppFail('Logic IRC Twitch Channel Name was empty.  The client app needs this field to be set.');
            }

            if (engineParms.chatIRCChannelName === '') {
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

                        if (engineParms.logicIRCChannelName === engineParms.playerName) {
                            AppFail('' + engineParms.playerName + ' is the same as the streamers networking channel.');
                        }

                        var options = {
                            options: { debug: true },
                            connection: { reconnect: true },
                            identity: { username: engineParms.playerName, password: engineParms.playerOauth },
                            channels: ["#" + engineParms.logicIRCChannelName]
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

    if (!engineParms.isMobile) {
        AddAppReposition();
    }

    if (engineParms.appFailedWithoutRecovery === true) {
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById("orientationWarning").style.display = 'none';
        document.getElementById("appErrorMessage").style.display = '';
        document.getElementById("appErrorMessage").textContent = 'Unrecoverable Error: ' + engineParms.appFailMessage;
        throw new FatalError();
    }

    document.getElementById("appErrorMessage").style.display = 'none';
    document.getElementById("orientationWarning").style.display = 'none';
    document.getElementById("orientationWarning").textContent = 'This game only works in landscape mode.  Please reposition your phone or tablet.';

    function addTwitchIFrames() {

        if (engineParms.isMobile) {
            $('.browser').removeClass();
            return;
        }

        $('.mobile').removeClass();

        var iframe = document.createElement('iframe');
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("id", "chat_embed");
        iframe.setAttribute("src", "http://www.twitch.tv/" + engineParms.chatIRCChannelName + "/chat");
        iframe.setAttribute("width", "400");
        iframe.setAttribute("height", "720");
        document.getElementById("TwitchChat").appendChild(iframe);

        iframe = document.createElement('iframe');
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + engineParms.chatIRCChannelName);
        iframe.setAttribute("width", "1024");
        iframe.setAttribute("height", "768");
        document.getElementById("TwitchVideo").appendChild(iframe);
    }
    addTwitchIFrames();

    var isFullScreen = false;
    var phaserDivName = "APGInputWidget";

    if (engineParms.isMobile) {
        phaserDivName = "APGInputWidgetMobile";
    }

    if (engineParms.isMobile) {
        isFullScreen = true;
    }

    document.getElementById(phaserDivName).style.display = 'none';
    ApgSetup(devParms.disableNetworking, engineParms.isMobile, appParms.gameWidth, appParms.gameHeight, engineParms.logicIRCChannelName, engineParms.playerName, phaserDivName, isFullScreen, engineParms, function () {
        if (preloaderFunction !== null) {
            clearInterval(preloaderFunction);
            preloaderFunction = null;
        }
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById(phaserDivName).style.display = '';
    });
}