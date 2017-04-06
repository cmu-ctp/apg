var setupParms = {
    isMobile: true,
    chatIRCChannelName: "",
    logicIRCChannelName: "",
    playerName: "",
    playerOauth: "",
    skipAuthentication: true,
    isDebug: true
};

var engineParms = {
    chat: null,
    chatLoadedFunction: null
};

function CreateTwitchApp() {

    if (/Mobi/.test(navigator.userAgent)) {
        setupParms.isMobile = true;
    }
    else {
        setupParms.isMobile = false;
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
                }).catch(function (err) { });
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

        var s = "Please wait while the game loads.";
        for (var k = 0; k < tick; k++) {
            s += '.';
        }
        document.getElementById('loadLabel').textContent = s;

    }, 1000 / 6);
}

if (setupParms.isDebug === false) {
    AddPreloader();
}

// This is the only script referenced by the web page.

function onLoadEnd() {

    document.getElementById("orientationWarning").style.display = 'none';
    document.getElementById("orientationWarning").textContent = 'This game only works in landscape mode.  Please reposition your phone or tablet.';

    function addTwitchIFrames() {

        if (setupParms.isMobile || setupParms.isDebug ) {
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
        iframe.setAttribute("width", "800");
        iframe.setAttribute("height", "600");
        document.getElementById("TwitchVideo").appendChild(iframe);
    }
    addTwitchIFrames();

    var isFullScreen = false;
    var phaserDivName = "APGInputWidget";

    if (setupParms.isMobile || setupParms.isDebug) {
        phaserDivName = "APGInputWidgetMobile";
    }

    if (setupParms.isMobile) {
        isFullScreen = true;
    }

    document.getElementById(phaserDivName).style.display = 'none';
    ApgSetup(setupParms.isMobile, 400, 720, setupParms.logicIRCChannelName, setupParms.playerName, phaserDivName, isFullScreen, engineParms, function () {
        if (preloaderFunction !== null) {
            clearInterval(preloaderFunction);
            preloaderFunction = null;
        }
        document.getElementById('loadLabel').style.display = 'none';
        document.getElementById(phaserDivName).style.display = '';
    });
}