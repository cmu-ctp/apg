function ApgSetup(assetCacheFunction, gameLaunchFunction, networkingTestSequence, disableNetworking, isMobile, gameWidth, gameHeight, logicIRCChannelName, APGInputWidgetDivName, allowFullScreen, engineParms, onLoadEnd, handleOrientation) {
    if (gameWidth === void 0) { gameWidth = 400; }
    if (gameHeight === void 0) { gameHeight = 300; }
    if (gameWidth < 1 || gameWidth > 8192 || gameHeight < 1 || gameHeight > 8192) {
        ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + gameWidth + ", " + gameHeight + ".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
        return;
    }
    if (disableNetworking == false) {
        if (logicIRCChannelName == undefined || logicIRCChannelName == "") {
            ConsoleOutput.debugError("ApgSetup: logicIRCChannelName is not set.  The game cannot work without this.  This should be set to the name of a Twitch IRC channel, with no leading #.", "sys");
            return;
        }
    }
    if (APGInputWidgetDivName == undefined || APGInputWidgetDivName == "") {
        ConsoleOutput.debugError("ApgSetup: APGInputWidgetDivName is not set.  The game cannot work without this.  This should be the name of a valid div to contain the PhaserJS canvas.", "sys");
        return;
    }
    var cache = new AssetCacher();
    assetCacheFunction(cache);
    cache.LoadJSONAsset(LoadPhaserAssets);
    function LoadPhaserAssets() {
        var _this = this;
        var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
            preload: function () {
                game.stage.disableVisibilityChange = true;
                if (allowFullScreen) {
                    game.scale.pageAlignHorizontally = true;
                    game.scale.pageAlignVertically = true;
                    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                    game.scale.setResizeCallback(gameResized, _this);
                    function gameResized(manager, bounds) {
                        var scale = Math.min(window.innerWidth / game.width, window.innerHeight / game.height);
                        manager.setUserScale(scale, scale, 0, 0);
                    }
                }
                cache.Run(game);
            },
            create: function () {
                game.input.mouse.capture = true;
                if (cache.phaserGoogleWebFontList == undefined || cache.phaserGoogleWebFontList.length == 0) {
                    initLaunchGame();
                }
            }
        }, true);
        WebFontConfig = {
            active: function () { game.time.events.add(Phaser.Timer.SECOND, initLaunchGame, this); },
            google: {
                families: cache.phaserGoogleWebFontList
            }
        };
        function initLaunchGame() {
            if (engineParms.chat == null && disableNetworking == false) {
                engineParms.chatLoadedFunction = launchGame;
            }
            else {
                launchGame();
            }
        }
        function launchGame() {
            onLoadEnd();
            var apg = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, cache.JSONAssets, networkingTestSequence, allowFullScreen);
            var showingOrientationWarning = false;
            setInterval(function () {
                handleOrientation();
                apg.update();
            }, 1000 / 60);
            gameLaunchFunction(apg);
        }
    }
}
var APGFullSystem = (function () {
    function APGFullSystem(g, logicIRCChannelName, playerName, chat, JSONAssets, networkTestSequence, allowFullScreen) {
        var _this = this;
        this.g = g;
        this.JSONAssets = JSONAssets;
        if (playerName == "")
            playerName = "defaultPlayerName";
        this.playerName = playerName;
        this.allowFullScreen = allowFullScreen;
        this.networkTestSequence = networkTestSequence;
        this.network = new IRCNetwork(function () { return _this.handlers; }, playerName, logicIRCChannelName, chat);
    }
    APGFullSystem.prototype.update = function () {
        this.network.update();
    };
    APGFullSystem.prototype.WriteToServer = function (msgName, parmsForMessageToServer) {
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteToServer : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteToServer : ", "sys");
            return;
        }
        this.network.sendMessageToServer(msgName, parmsForMessageToServer);
    };
    APGFullSystem.prototype.WriteLocalAsServer = function (delay, msgName, parmsForMessageToServer) {
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocalAsServer : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocalAsServer : ", "sys");
            return;
        }
        this.network.sendServerMessageLocally(delay, msgName, parmsForMessageToServer);
    };
    APGFullSystem.prototype.WriteLocal = function (delay, user, msgName, parmsForMessageToServer) {
        if (user == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        this.network.sendMessageLocally(delay, user, msgName, parmsForMessageToServer);
    };
    APGFullSystem.prototype.ClearLocalMessages = function () {
        this.network.clearLocalMessages();
    };
    APGFullSystem.prototype.ResetServerMessageRegistry = function () { this.handlers = new NetworkMessageHandler(); return this; };
    APGFullSystem.prototype.Register = function (msgName, handlerForServerMessage) {
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.Register : ", "sys");
            return;
        }
        if (handlerForServerMessage == null) {
            ConsoleOutput.debugWarn("APGFullSystem.Register : ", "sys");
            return;
        }
        this.handlers.Add(msgName, handlerForServerMessage);
        return this;
    };
    APGFullSystem.prototype.RegisterPeer = function (msgName, handlerForServerMessage) {
        if (msgName == "") {
            ConsoleOutput.debugWarn("APGFullSystem.RegisterPeer : ", "sys");
            return;
        }
        if (handlerForServerMessage == null) {
            ConsoleOutput.debugWarn("APGFullSystem.RegisterPeer : ", "sys");
            return;
        }
        this.handlers.AddPeerMessage(msgName, handlerForServerMessage);
        return this;
    };
    return APGFullSystem;
}());
var AssetCacher = (function () {
    function AssetCacher() {
        this.phaserAssetCacheList = [];
        this.phaserImageList = [];
        this.phaserSoundList = [];
        this.phaserGoogleWebFontList = [];
        this.jsonAssetCacheNameList = [];
        this.curJSONAsset = 0;
        this.JSONAssets = {};
    }
    AssetCacher.prototype.assets = function (cacheFunction) {
        if (cacheFunction == null) {
            ConsoleOutput.debugWarn("AssetCacher.assets : bad caching function", "sys");
            return;
        }
        this.phaserAssetCacheList.push(cacheFunction);
    };
    AssetCacher.prototype.images = function (dir, imageList) {
        if (imageList == null || imageList.length < 1) {
            ConsoleOutput.debugWarn("AssetCacher.images : bad image list", "sys");
            return;
        }
        for (var k = 0; k < imageList.length; k++) {
            this.phaserImageList.push(dir + "/" + imageList[k]);
        }
    };
    AssetCacher.prototype.sounds = function (dir, soundList) {
        if (soundList == null || soundList.length < 1) {
            ConsoleOutput.debugWarn("AssetCacher.sounds : bad sound list", "sys");
            return;
        }
        for (var k = 0; k < soundList.length; k++) {
            this.phaserSoundList.push(dir + "/" + soundList[k]);
        }
    };
    AssetCacher.prototype.googleWebFonts = function (googleWebFontNames) {
        if (googleWebFontNames == null || googleWebFontNames.length < 1) {
            ConsoleOutput.debugWarn("AssetCacher.googleWebFonts : bad font list", "sys");
            return;
        }
        for (var k = 0; k < googleWebFontNames.length; k++) {
            this.phaserGoogleWebFontList.push(googleWebFontNames[k]);
        }
    };
    AssetCacher.prototype.json = function (fileNames) {
        if (fileNames == null || fileNames.length < 1) {
            ConsoleOutput.debugWarn("AssetCacher.json : bad json asset list", "sys");
            return;
        }
        for (var k = 0; k < fileNames.length; k++) {
            this.jsonAssetCacheNameList.push(fileNames[k]);
        }
    };
    AssetCacher.prototype.LoadJSONAsset = function (onLoadEnd) {
        var _this = this;
        if (this.curJSONAsset >= this.jsonAssetCacheNameList.length) {
            onLoadEnd();
            return;
        }
        $.getJSON(this.jsonAssetCacheNameList[this.curJSONAsset], function (data) {
            _this.JSONAssets[_this.jsonAssetCacheNameList[_this.curJSONAsset]] = data.all;
            ConsoleOutput.logAsset(_this.jsonAssetCacheNameList[_this.curJSONAsset]);
            _this.curJSONAsset++;
            _this.LoadJSONAsset(onLoadEnd);
        });
    };
    AssetCacher.prototype.Run = function (game) {
        if (this.phaserAssetCacheList.length == 0) {
            ConsoleOutput.debugWarn("ApgSetup: phaserAssetCacheList.length is 0, so no assets are being cached.  This is probably an error.", "sys");
        }
        for (var k = 0; k < this.phaserAssetCacheList.length; k++) {
            this.phaserAssetCacheList[k](game.load);
        }
        for (var k = 0; k < this.phaserImageList.length; k++) {
            game.load.image(this.phaserImageList[k], this.phaserImageList[k]);
        }
        for (var k = 0; k < this.phaserSoundList.length; k++) {
            game.load.audio(this.phaserSoundList[k], this.phaserSoundList[k]);
        }
        if (this.phaserGoogleWebFontList != undefined && this.phaserGoogleWebFontList.length > 0) {
            game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        }
    };
    return AssetCacher;
}());
var ConsoleOutput = (function () {
    function ConsoleOutput() {
    }
    ConsoleOutput.error = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        console.error("Error: " + s);
        if (debugErrorsAsAlerts) {
            alert("Error: " + s);
        }
    };
    ConsoleOutput.warn = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        console.warn("Warning: " + s);
    };
    ConsoleOutput.info = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        console.info(s);
    };
    ConsoleOutput.log = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        console.log(s);
    };
    ConsoleOutput.debugError = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        if (!debugPrintMessages)
            return;
        console.error("Error: " + s);
        if (debugErrorsAsAlerts) {
            alert("Error: " + s);
        }
    };
    ConsoleOutput.debugWarn = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        if (!debugPrintMessages)
            return;
        console.warn("Warning: " + s);
    };
    ConsoleOutput.debugInfo = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        if (!debugPrintMessages)
            return;
        console.info(s);
    };
    ConsoleOutput.debugLog = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        if (!debugPrintMessages)
            return;
        console.log(s);
    };
    ConsoleOutput.logAsset = function (s, tag) {
        if (tag === void 0) { tag = ""; }
        if (!debugShowAssetMessages)
            return;
        console.log("Successfully loaded " + s);
    };
    return ConsoleOutput;
}());
var DelayedMessage = (function () {
    function DelayedMessage() {
    }
    return DelayedMessage;
}());
var IRCNetwork = (function () {
    function IRCNetwork(getHandlers, player, logicChannelName, chat) {
        var _this = this;
        this.lastMessageTime = 0;
        this.tick = 0;
        this.messageQueue = [];
        this.localMessageHead = null;
        this.toggleSpace = false;
        this.getHandlers = getHandlers;
        this.playerName = player;
        this.logicChannelName = logicChannelName;
        this.channelName = '#' + logicChannelName;
        this.chat = chat;
        if (chat != null)
            chat.on("chat", function (channel, userstate, message, self) { return _this.handleInputMessage(userstate.username, message); });
    }
    IRCNetwork.prototype.sendMessageToServer = function (message, parms) {
        this.writeToChat(message + "###" + JSON.stringify(parms));
    };
    IRCNetwork.prototype.sendMessageLocally = function (delay, user, message, parms) {
        if (delay == 0) {
            this.handleInputMessage(user, message + "###" + JSON.stringify(parms));
        }
        else {
            var msg = new DelayedMessage();
            msg.time = this.tick + delay * ticksPerSecond;
            msg.sender = user;
            msg.message = message + "###" + JSON.stringify(parms);
            if (this.localMessageHead == null) {
                this.localMessageHead = msg;
                msg.next = null;
            }
            else {
                var head = this.localMessageHead;
                var added = false;
                while (!added) {
                    if (head.next == null) {
                        head.next = msg;
                        msg.next = null;
                        added = true;
                    }
                    else if (head.next.time > msg.time) {
                        msg.next = head.next;
                        head.next = msg;
                        added = true;
                    }
                    else {
                        head = head.next;
                    }
                }
            }
        }
    };
    IRCNetwork.prototype.sendServerMessageLocally = function (delay, message, parms) {
        this.sendMessageLocally(delay, this.logicChannelName, message, parms);
    };
    IRCNetwork.prototype.clearLocalMessages = function () {
        this.localMessageHead = null;
        this.tick = 0;
    };
    IRCNetwork.prototype.update = function () {
        this.lastMessageTime--;
        this.tick++;
        while (this.localMessageHead != null && this.localMessageHead.time < this.tick) {
            this.handleInputMessage(this.localMessageHead.sender, this.localMessageHead.message);
            this.localMessageHead = this.localMessageHead.next;
        }
        if (this.lastMessageTime <= 0 && this.messageQueue.length > 0) {
            var delayedMessage = this.messageQueue.shift();
            this.toggleSpace = !this.toggleSpace;
            if (this.chat != null)
                this.chat.say(this.channelName, delayedMessage + (this.toggleSpace ? ' ' : '  '));
            if (debugLogOutgoingIRCChat) {
                ConsoleOutput.debugLog(delayedMessage, "network");
            }
        }
    };
    IRCNetwork.prototype.handleInputMessage = function (userName, message) {
        if (userName == this.playerName)
            return;
        if (debugLogIncomingIRCChat) {
            ConsoleOutput.debugLog(userName + " " + message, "network");
        }
        if (userName == this.logicChannelName) {
            var messageTemp = message.split("%%");
            for (var k = 0; k < messageTemp.length; k++) {
                this.getHandlers().Run(messageTemp[k]);
            }
        }
        else {
            var messageTemp = message.split("%%");
            for (var k = 0; k < messageTemp.length; k++) {
                this.getHandlers().RunPeer(userName, messageTemp[k]);
            }
        }
    };
    IRCNetwork.prototype.writeToChat = function (s) {
        if (this.lastMessageTime > 0) {
            if (this.messageQueue.length > maxBufferedIRCWrites) {
                ConsoleOutput.debugWarn("writeToChat: maxBufferedIRCWrites exceeded.  Too many messages have been queued.  Twitch IRC limits how often clients can post into IRC channels.");
                return;
            }
            this.messageQueue.push(s);
            return;
        }
        this.toggleSpace = !this.toggleSpace;
        if (this.chat != null)
            this.chat.say(this.channelName, s + (this.toggleSpace ? ' ' : '  '));
        if (debugLogOutgoingIRCChat) {
            ConsoleOutput.debugLog(s, "network");
        }
        this.lastMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
    };
    return IRCNetwork;
}());
var NetworkMessageHandler = (function () {
    function NetworkMessageHandler() {
        this.inputs = {};
        this.peerInputs = {};
        this.inputs = {};
        this.peerInputs = {};
    }
    NetworkMessageHandler.prototype.Add = function (msgName, handlerForServerMessage) {
        this.inputs[msgName] =
            function (s) {
                var v = JSON.parse(s);
                handlerForServerMessage(v);
            };
        return this;
    };
    NetworkMessageHandler.prototype.AddPeerMessage = function (msgName, handlerForServerMessage) {
        this.peerInputs[msgName] =
            function (src, s) {
                var v = JSON.parse(s);
                handlerForServerMessage(src, v);
            };
        return this;
    };
    NetworkMessageHandler.prototype.Run = function (message) {
        var msgTemp = message.split("###");
        if (msgTemp.length != 2) {
            ConsoleOutput.debugError("Bad Network Message: " + message, "network");
            return false;
        }
        var msgName = msgTemp[0];
        var unparsedParms = msgTemp[1];
        if (this.inputs[msgName] == undefined) {
            ConsoleOutput.debugError("Unknown Network Message: " + msgName + " with parameters " + unparsedParms, "network");
            return false;
        }
        this.inputs[msgName](unparsedParms);
        return true;
    };
    NetworkMessageHandler.prototype.RunPeer = function (user, message) {
        var msgTemp = message.split("###");
        if (msgTemp.length != 2) {
            ConsoleOutput.debugError("Bad Network Message: " + message, "network");
            return false;
        }
        var msgName = msgTemp[0];
        var unparsedParms = msgTemp[1];
        if (this.peerInputs[msgName] == undefined) {
            ConsoleOutput.debugError("Unknown Network Message: " + msgName + " with parameters " + unparsedParms, "network");
            return false;
        }
        this.peerInputs[msgName](user, unparsedParms);
        return true;
    };
    return NetworkMessageHandler;
}());
var secondsPerChoice = 60;
var ticksPerSecond = 60;
var IRCWriteDelayInSeconds = 1;
var maxBufferedIRCWrites = 5;
var debugErrorsAsAlerts = false;
var debugPrintMessages = false;
var debugLogIncomingIRCChat = true;
var debugLogOutgoingIRCChat = true;
var debugShowAssetMessages = false;
function AddAppReposition(divName, width) {
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
        if (d === null) {
            d = document.getElementById(divName);
            if (d !== null) {
                curx = 100;
                cury = 400;
                d.style.position = "absolute";
                d.style.left = '100px';
                d.style.top = '400px';
            }
        }
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
function setTwitchIFrames(isMobile, chatIRCChannelName, chatWidth, chatHeight, videoWidth, videoHeight) {
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
    iframe.setAttribute("width", '' + chatWidth);
    iframe.setAttribute("height", '' + chatHeight);
    document.getElementById("TwitchChat").appendChild(iframe);
    iframe = document.createElement('iframe');
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("src", "http://player.twitch.tv/?channel=" + chatIRCChannelName);
    iframe.setAttribute("width", "" + '' + videoWidth);
    iframe.setAttribute("height", "" + '' + videoHeight);
    document.getElementById("TwitchVideo").appendChild(iframe);
}
function AddPreloader(phaserDivName, gameName) {
    var tick = 0;
    var preloaderFunction = setInterval(function () {
        tick++;
        var s = "Please wait while " + gameName + " loads ";
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
function MakeOrientationWarning(isMobile, phaserDivName) {
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
        };
    }
    else
        return function () { };
}
function launchAPGClient(devParms, appParms) {
    var isMobile = true;
    var chatIRCChannelName = "";
    var logicIRCChannelName = "";
    var engineParms = {
        clientID: '',
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
    if (devParms.forceMobile === true)
        isMobile = true;
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
                        if (user === null)
                            alert(error);
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
    var ClearOnLoadEnd = AddPreloader(phaserDivName, appParms.gameName);
    if (!isMobile && appParms.allowClientReposition) {
        AddAppReposition("APGInputWidget", appParms.gameWidth);
    }
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
    setTwitchIFrames(isMobile, chatIRCChannelName, appParms.chatWidth, appParms.chatHeight, appParms.videoWidth, appParms.videoHeight);
    var HandleOrientation = MakeOrientationWarning(isMobile, phaserDivName);
    ApgSetup(appParms.cacheFunction, appParms.gameLaunchFunction, devParms.networkingTestSequence, devParms.disableNetworking, isMobile, appParms.gameWidth, appParms.gameHeight, logicIRCChannelName, phaserDivName, isMobile, engineParms, ClearOnLoadEnd, HandleOrientation);
}
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null)
                    for (var nextKey in source)
                        if (source.hasOwnProperty(nextKey))
                            output[nextKey] = source[nextKey];
            }
            return output;
        };
    })();
}
var ent = (function (_super) {
    __extends(ent, _super);
    function ent(t, x, y, key, fields) {
        var _this = _super.call(this, t.game, x, y, key) || this;
        _this.upd = null;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
        _this.visible = true;
        _this.alive = true;
        _this.z = t.children.length;
        t.addChild(_this);
        if (t.enableBody) {
            t.game.physics.enable(_this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = _this;
        }
        return _this;
    }
    ent.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(ent.prototype, "scalex", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "scaley", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    ent.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    ent.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    ent.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    ent.prototype.iscaley = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    ent.prototype.ialpha = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    ent.prototype.irotation = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    Object.defineProperty(ent.prototype, "tex", {
        set: function (value) { this.loadTexture(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ent.prototype, "src", {
        set: function (value) { value.addChild(this); },
        enumerable: true,
        configurable: true
    });
    return ent;
}(Phaser.Sprite));
var enttx = (function (_super) {
    __extends(enttx, _super);
    function enttx(t, x, y, text, style, fields) {
        var _this = _super.call(this, t.game, x, y, text, style) || this;
        _this.upd = null;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
        _this.visible = true;
        _this.alive = true;
        _this.z = t.children.length;
        t.addChild(_this);
        if (t.enableBody) {
            t.game.physics.enable(_this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = _this;
        }
        return _this;
    }
    enttx.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(enttx.prototype, "scx", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "scy", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(enttx.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    enttx.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    enttx.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    enttx.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    enttx.prototype.iscx = function (value, speed) { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; };
    enttx.prototype.iscy = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    enttx.prototype.ial = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    enttx.prototype.irot = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    Object.defineProperty(enttx.prototype, "src", {
        set: function (value) { value.addChild(this); },
        enumerable: true,
        configurable: true
    });
    return enttx;
}(Phaser.Text));
function CacheTestGame(c) {
    c.images('assets', ['ClientUI3.png']);
}
var TestGame = (function () {
    function TestGame(apg) {
        var bkg = new ent(apg.g.world, 0, 0, 'assets/ClientUI3.png');
    }
    return TestGame;
}());
function TestInput(apg) {
    new TestGame(apg);
}
//# sourceMappingURL=APGApp.js.map