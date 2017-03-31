var setupParms = {
    isMobile : true,
    chatIRCChannelName: "",
    logicIRCChannelName: "",
    playerName: "",
    playerOauth: "",
    skipAuthentication: false,
    chat: null
};

function CreateTwitchApp() {

    if (/Mobi/.test(navigator.userAgent)) {
        setupParms.isMobile = true;
    }
    else {
        setupParms.isMobile = false;
    }

    // The following values should be set manually for testing locally.  These values will be overridden by the server when launching from a server.

    //setupParms.isMobile = true;
    var clientID = 'hjgrph2akqwki1617ac5rdq9rqiep0k';
    var nullNetworking = false;

    if (location.hash != null && location.hash != "") {

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

    if (nullNetworking) {
        setupParms.chat = null;
    }
    else {
        // Initialize. If we are already logged in, there is no need for the connect button
        Twitch.init({ clientId: clientID }, function (error, status) {
            if (status.authenticated || setupParms.skipAuthentication) {
                Twitch.api({ method: 'user' }, function (error, user) {
                    if (setupParms.skipAuthentication) {
                    }
                    else {
                        if (user == null) alert(error);
                        setupParms.playerName = user.display_name;
                        setupParms.playerOauth = "oauth:" + Twitch.getToken();
                    }

                    var options = {
                        options: { debug: true },
                        connection: { reconnect: true },
                        identity: { username: setupParms.playerName, password: setupParms.playerOauth },
                        channels: ["#" + setupParms.logicIRCChannelName]
                    };
                    setupParms.chat = new tmi.client(options);
                    setupParms.chat.connect().then(function (data) {
                    }).catch(function (err) { });
                });
            }
        });
    }
}
CreateTwitchApp();

// This is the only script referenced by the web page.

function onLoadEnd() {
    function addTwitchIFrames() {
        if (setupParms.isMobile) {
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
        iframe.setAttribute("height", "488");
        document.getElementById("TwitchChat").appendChild(iframe);

        var iframe = document.createElement('iframe');
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + setupParms.chatIRCChannelName);
        iframe.setAttribute("width", "800");
        iframe.setAttribute("height", "600");
        document.getElementById("TwitchVideo").appendChild(iframe);
    }
    addTwitchIFrames();

    var isFullScreen = false;
    var phaserDivName = "APGInputWidget";

    if (setupParms.isMobile) {
        isFullScreen = true;
        phaserDivName = "APGInputWidgetMobile";
    }

    ApgSetup(400, 300, setupParms.logicIRCChannelName, setupParms.playerName, setupParms.chat, phaserDivName, isFullScreen);
}