var setupParms = {
    isMobile: false,
    chatIRCChannelName: "",
    logicIRCChannelName: "",
    playerName: "",
    playerOauth: "",
    skipAuthentication: false,
    isDebug: false,
    appFailedWithoutRecovery: false,
    appFailMessage:''
};

var engineParms = {
    chat: null,
    chatLoadedFunction: null
};

function FatalError() { Error.apply(this, arguments); this.name = "FatalError"; }
FatalError.prototype = Object.create(Error.prototype);

function AppFail(s) {
    setupParms.appFailMessage = s;
    setupParms.appFailedWithoutRecovery = true;
}

function CreateTwitchApp() {

    if (setupParms.isDebug !== true) {
        if (/Mobi/.test(navigator.userAgent)) {
            setupParms.isMobile = true;
        }
        else {
            setupParms.isMobile = false;
        }
    }

    // The following values should be set manually for testing locally.  These values will be overridden by the server when launching from a server.

    var clientID = 'hjgrph2akqwki1617ac5rdq9rqiep0k';

    if (location.hash !== null && location.hash !== "") {

        setupParms.skipAuthentication = false;

        var lochash = location.hash.substr(1);

        var stateVals = lochash.substr(lochash.indexOf('state=')).split('&')[0].split('=')[1];

        var stateValTable = stateVals.split("+");
        //setupParms.isMobile = (stateValTable[0] == "M") ? true : false;
        setupParms.chatIRCChannelName = stateValTable[1];
        setupParms.logicIRCChannelName = stateValTable[2];
    }

    if (setupParms.logicIRCChannelName === '') {
        AppFail('Logic IRC Twitch Channel Name was empty.  The client app needs this field to be set.');
    }

    if (setupParms.chatIRCChannelName === '') {
        AppFail('Chat IRC Twitch Channel Name was empty.  The client app needs this field to be set.');
    }


    // The Client-ID is used by Twitch.init .  See https://github.com/justintv/twitch-js-sdk
    //	It was generated here: https://www.twitch.tv/kraken/oauth2/clients/new
    // You need to register a new game with Twitch to get your own Client-ID.
    // The Client-ID is public - there is no need to hide it.  It should be a string of 31 alpha-numeric digits.

    // Initialize. If we are already logged in, there is no need for the connect button
    Twitch.init({ clientId: clientID }, function (error, status) {
        if (status.authenticated || setupParms.skipAuthentication) {
            Twitch.api({ method: 'user' }, function (error, user) {

                if (!setupParms.skipAuthentication) {
                    if (user === null) alert(error);
                    setupParms.playerName = user.display_name;
                    setupParms.playerOauth = "oauth:" + Twitch.getToken();
                }

                if (setupParms.logicIRCChannelName === setupParms.playerName) {
                    AppFail('' + setupParms.playerName + ' is the same as the streamers networking channel.');
                }

                var options = {
                    options: { debug: true },
                    connection: { reconnect: true },
                    identity: { username: setupParms.playerName, password: setupParms.playerOauth },
                    channels: ["#" + setupParms.logicIRCChannelName]
                };
                engineParms.chat = new tmi.client(options);
                if (engineParms.chatLoadedFunction !== null) {
                    engineParms.chatLoadedFunction();
                    engineParms.chatLoadedFunction = null;
                }
                engineParms.chat.connect().then(function (data) {
                }).catch(function (err) {
                    AppFail( 'Twitch Chat Initialization Error: ' + err );
                    console.log("Error: " + err);
                });
            });
        }
    });
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

if (!setupParms.isMobile ) {
    AddAppReposition();
}

// This is the only script referenced by the web page.

function onLoadEnd() {

    if (setupParms.appFailedWithoutRecovery === true) {
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById("orientationWarning").style.display = 'none';
        document.getElementById("appErrorMessage").style.display = '';
        document.getElementById("appErrorMessage").textContent = 'Unrecoverable Error: ' + setupParms.appFailMessage;
        throw new FatalError();
    }

    document.getElementById("appErrorMessage").style.display = 'none';
    document.getElementById("orientationWarning").style.display = 'none';
    document.getElementById("orientationWarning").textContent = 'This game only works in landscape mode.  Please reposition your phone or tablet.';

    function addTwitchIFrames() {

        if (setupParms.isMobile ) {
            $('.browser').removeClass();
            return;
        }

        $('.mobile').removeClass();

        var iframe = document.createElement('iframe');
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("id", "chat_embed");
        iframe.setAttribute("src", "http://www.twitch.tv/" + setupParms.chatIRCChannelName + "/chat");
        iframe.setAttribute("width", "400");
        iframe.setAttribute("height", "720");
        document.getElementById("TwitchChat").appendChild(iframe);

        iframe = document.createElement('iframe');
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + setupParms.chatIRCChannelName);
        iframe.setAttribute("width", "1024");
        iframe.setAttribute("height", "768");
        document.getElementById("TwitchVideo").appendChild(iframe);
    }
    addTwitchIFrames();

    var isFullScreen = false;
    var phaserDivName = "APGInputWidget";

    if (setupParms.isMobile ) {
        phaserDivName = "APGInputWidgetMobile";
    }

    if (setupParms.isMobile) {
        isFullScreen = true;
    }

    document.getElementById(phaserDivName).style.display = 'none';
    ApgSetup(setupParms.isMobile, 800, 450, setupParms.logicIRCChannelName, setupParms.playerName, phaserDivName, isFullScreen, engineParms, function () {
        if (preloaderFunction !== null) {
            clearInterval(preloaderFunction);
            preloaderFunction = null;
        }
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById(phaserDivName).style.display = '';
    });
}