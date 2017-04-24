function ApgSetup(assetCacheFunction, gameLaunchFunction, disableNetworking, isMobile, gameWidth, gameHeight, logicIRCChannelName, APGInputWidgetDivName, allowFullScreen, engineParms, onLoadEnd, handleOrientation) {
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
            var apg = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, cache.JSONAssets);
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
    function APGFullSystem(g, logicIRCChannelName, playerName, chat, JSONAssets) {
        var _this = this;
        this.g = g;
        this.JSONAssets = JSONAssets;
        this.playerName = playerName;
        this.network = new IRCNetwork(function () { return _this.handlers; }, playerName, logicIRCChannelName, chat);
    }
    APGFullSystem.prototype.update = function () {
        this.network.update();
    };
    APGFullSystem.prototype.WriteToServer = function (msgName, parmsForMessageToServer) {
        this.network.sendMessageToServer(msgName, parmsForMessageToServer);
    };
    APGFullSystem.prototype.ResetServerMessageRegistry = function () { this.handlers = new NetworkMessageHandler(); return this; };
    APGFullSystem.prototype.Register = function (msgName, handlerForServerMessage) {
        this.handlers.Add(msgName, handlerForServerMessage);
        return this;
    };
    APGFullSystem.prototype.RegisterPeer = function (msgName, handlerForServerMessage) {
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
        this.phaserAssetCacheList.push(cacheFunction);
    };
    AssetCacher.prototype.images = function (dir, imageList) {
        for (var k = 0; k < imageList.length; k++) {
            this.phaserImageList.push(dir + "/" + imageList[k]);
        }
    };
    AssetCacher.prototype.sounds = function (dir, soundList) {
        for (var k = 0; k < soundList.length; k++) {
            this.phaserSoundList.push(dir + "/" + soundList[k]);
        }
    };
    AssetCacher.prototype.googleWebFonts = function (googleWebFontNames) {
        for (var k = 0; k < googleWebFontNames.length; k++) {
            this.phaserGoogleWebFontList.push(googleWebFontNames[k]);
        }
    };
    AssetCacher.prototype.json = function (fileNames) {
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
var IRCNetwork = (function () {
    function IRCNetwork(getHandlers, player, logicChannelName, chat) {
        var _this = this;
        this.lastMessageTime = 0;
        this.messageQueue = [];
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
    IRCNetwork.prototype.sendMessageLocally = function (user, message, parms) {
        this.handleInputMessage(user, message + "###" + JSON.stringify(parms));
    };
    IRCNetwork.prototype.update = function () {
        this.lastMessageTime--;
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
        if (this.inputs[msgName] == undefined) {
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
//# sourceMappingURL=APGApp.js.map