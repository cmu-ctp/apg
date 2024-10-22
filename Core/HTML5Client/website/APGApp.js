function ApgSetup(appParms, networkingTestSequence, disableNetworking, logicIRCChannelName, APGInputWidgetDivName, allowFullScreen, engineParms, onLoadEnd, handleOrientation, metadataSys) {
    if (appParms.gameWidth < 1 || appParms.gameWidth > 8192 || appParms.gameHeight < 1 || appParms.gameHeight > 8192) {
        ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + appParms.gameWidth + ", " + appParms.gameHeight + ".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
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
    appParms.cacheFunction(cache);
    cache.LoadJSONAsset(LoadPhaserAssets);
    function LoadPhaserAssets() {
        var _this = this;
        var game = new Phaser.Game(appParms.gameWidth, appParms.gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
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
            if (engineParms.metadataDoneLoading == false) {
                engineParms.metadataLoadedFunction = launchGameFull;
            }
            else {
                launchGameFull();
            }
        }
        function launchGameFull() {
            onLoadEnd();
            var apg = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, cache.JSONAssets, networkingTestSequence, allowFullScreen, metadataSys);
            var showingOrientationWarning = false;
            setInterval(function () {
                handleOrientation();
                apg.update();
            }, 1000 / 60);
            appParms.gameLaunchFunction(apg);
        }
    }
}
var APGFullSystem = (function () {
    function APGFullSystem(g, logicIRCChannelName, playerName, chat, JSONAssets, networkTestSequence, allowFullScreen, metadataSys) {
        var _this = this;
        this.g = g;
        this.JSONAssets = JSONAssets;
        this.metadata = metadataSys;
        metadataSys.SetGetHandlers(function () { return _this.handlers; });
        if (playerName == "")
            playerName = "ludolab";
        this.useKeepAlive = false;
        this.playerName = playerName;
        this.allowFullScreen = allowFullScreen;
        this.networkTestSequence = networkTestSequence;
        this.network = new IRCNetwork(function () { return _this.handlers; }, playerName, logicIRCChannelName, chat);
    }
    APGFullSystem.prototype.SetKeepAliveStatus = function (val) {
        this.useKeepAlive = val;
        return this;
    };
    APGFullSystem.prototype.update = function () {
        this.network.update(this.useKeepAlive);
        if (this.disconnected == false && this.network.disconnected == true && this.onDisconnect != null)
            this.onDisconnect();
        this.disconnected = this.network.disconnected;
        this.metadata.Update();
    };
    APGFullSystem.prototype.CheckMessageParameters = function (funcName, message, parmsForMessageToServer) {
        if (message == "") {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message name", "sys");
            return false;
        }
        if (parmsForMessageToServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message parameters ", "sys");
            return false;
        }
        return true;
    };
    APGFullSystem.prototype.CheckMessageRegisterFunction = function (funcName, message, funcForMessageFromServer) {
        if (message == "") {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing message name", "sys");
            return false;
        }
        if (funcForMessageFromServer == null) {
            ConsoleOutput.debugWarn("APGFullSystem." + funcName + ": Missing function", "sys");
            return false;
        }
        return true;
    };
    APGFullSystem.prototype.WriteToServer = function (message, parmsForMessageToServer) {
        if (!this.CheckMessageParameters("WriteToServer", message, parmsForMessageToServer))
            return;
        this.network.sendMessageToServer(NetworkMessageHandler.JoinNetworkMessage(message, JSON.stringify(parmsForMessageToServer)));
    };
    APGFullSystem.prototype.WriteStringToServer = function (message, parmsForMessageToServer) {
        if (!this.CheckMessageParameters("WriteStringToServer", message, parmsForMessageToServer))
            return;
        this.network.sendMessageToServer(NetworkMessageHandler.JoinNetworkMessage(message, parmsForMessageToServer));
    };
    APGFullSystem.prototype.WriteLocalAsServer = function (delay, message, parmsForMessageToServer) {
        if (!this.CheckMessageParameters("WriteLocalAsServer", message, parmsForMessageToServer))
            return;
        this.network.sendServerMessageLocally(delay, NetworkMessageHandler.JoinNetworkMessage(message, JSON.stringify(parmsForMessageToServer)));
    };
    APGFullSystem.prototype.WriteLocalStringAsServer = function (delay, message, parmsForMessageToServer) {
        if (!this.CheckMessageParameters("WriteLocalStringAsServer", message, parmsForMessageToServer))
            return;
        this.network.sendServerMessageLocally(delay, NetworkMessageHandler.JoinNetworkMessage(message, parmsForMessageToServer));
    };
    APGFullSystem.prototype.WriteLocal = function (delay, user, message, parmsForMessageToServer) {
        if (user == "") {
            ConsoleOutput.debugWarn("APGFullSystem.WriteLocal : ", "sys");
            return;
        }
        if (!this.CheckMessageParameters("WriteLocal", message, parmsForMessageToServer))
            return;
        this.network.sendMessageLocally(delay, user, NetworkMessageHandler.JoinNetworkMessage(message, JSON.stringify(parmsForMessageToServer)));
    };
    APGFullSystem.prototype.ClearLocalMessages = function () {
        this.network.clearLocalMessages();
    };
    APGFullSystem.prototype.ResetServerMessageRegistry = function () { this.handlers = new NetworkMessageHandler(); this.onDisconnect = null; return this; };
    APGFullSystem.prototype.Register = function (message, handlerForServerMessage) {
        if (!this.CheckMessageRegisterFunction("Register", message, handlerForServerMessage))
            return this;
        this.handlers.Add(message, handlerForServerMessage);
        return this;
    };
    APGFullSystem.prototype.RegisterPeer = function (message, handlerForServerMessage) {
        if (!this.CheckMessageRegisterFunction("RegisterPeer", message, handlerForServerMessage))
            return this;
        this.handlers.AddPeerMessage(message, handlerForServerMessage);
        return this;
    };
    APGFullSystem.prototype.RegisterString = function (message, handlerForServerMessage) {
        if (!this.CheckMessageRegisterFunction("RegisterString", message, handlerForServerMessage))
            return this;
        this.handlers.AddString(message, handlerForServerMessage);
        return this;
    };
    APGFullSystem.prototype.RegisterDisconnect = function (disconnectFunc) {
        this.onDisconnect = disconnectFunc;
        return this;
    };
    APGFullSystem.prototype.Metadata = function (msgName) { return this.metadata.Data(msgName); };
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
        this.lastSendMessageTime = 0;
        this.lastReadMessageTime = 0;
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
            chat.on("chat", function (channel, userstate, message, self) { _this.lastReadMessageTime = _this.tick; _this.handleInputMessage(userstate.username, message); });
    }
    IRCNetwork.prototype.sendMessageToServer = function (message) {
        this.writeToChat(message);
    };
    IRCNetwork.prototype.sendMessageLocally = function (delay, user, message) {
        if (delay == 0) {
            this.handleInputMessage(user, message);
        }
        else {
            var msg = new DelayedMessage();
            msg.time = this.tick + delay * ticksPerSecond;
            msg.sender = user;
            msg.message = message;
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
    IRCNetwork.prototype.sendServerMessageLocally = function (delay, message) {
        this.sendMessageLocally(delay, this.logicChannelName, message);
    };
    IRCNetwork.prototype.clearLocalMessages = function () {
        this.localMessageHead = null;
        this.tick = 0;
    };
    IRCNetwork.prototype.update = function (useKeepAlive) {
        this.lastSendMessageTime--;
        this.tick++;
        if (useKeepAlive && (this.tick % keepAliveTime == 0)) {
            this.sendMessageToServer("alive###{\"t\":" + (this.tick / keepAliveTime) + "}");
        }
        if (this.chat != null && this.tick - this.lastReadMessageTime > disconnectionTime) {
            this.disconnected = true;
        }
        else {
            this.disconnected = false;
        }
        while (this.localMessageHead != null && this.localMessageHead.time < this.tick) {
            this.handleInputMessage(this.localMessageHead.sender, this.localMessageHead.message);
            this.localMessageHead = this.localMessageHead.next;
        }
        if (this.lastSendMessageTime <= 0 && this.messageQueue.length > 0) {
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
        if (this.lastSendMessageTime > 0) {
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
        this.lastSendMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
    };
    return IRCNetwork;
}());
var MetadataFullSys = (function () {
    function MetadataFullSys(useMetadata, url, onConnectionComplete, onConnectionFail, useLocalTestNetworking, forceMetadataFrames) {
        this.frameNumber = 0;
        this.fileReadTime = 0;
        this.curFile = 1;
        this.frameStorage = {};
        this.getHandlers = null;
        this.useLocalTestNetworking = useLocalTestNetworking;
        this.forceMetadataFrames = forceMetadataFrames;
        onConnectionComplete();
        this.canvas = document.createElement("canvas");
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.vid = undefined;
    }
    MetadataFullSys.prototype.SetGetHandlers = function (func) {
        this.getHandlers = func;
    };
    MetadataFullSys.prototype.SetVideoPlayer = function (player) {
        this.videoPlayer = player;
    };
    MetadataFullSys.prototype.Data = function (msgName) {
        var j = this.frameStorage[this.frameNumber];
        if (j != null) {
            for (var k = 0; k < j.length; k++) {
                if (j[k][0] == msgName) {
                    return JSON.parse(j[k][1]);
                }
            }
        }
        return null;
    };
    MetadataFullSys.prototype.SetVideoStream = function () {
        var thePlayer = this.videoPlayer;
        if (thePlayer == undefined)
            return false;
        var bridge = thePlayer._bridge;
        if (bridge == undefined)
            return false;
        var iframe = bridge._iframe;
        if (iframe == undefined)
            return false;
        var doc = iframe.contentWindow.document;
        if (doc == undefined)
            return false;
        var elements = doc.getElementsByClassName("player-video");
        if (elements == undefined)
            return false;
        for (var j = 0; j < elements.length; j++) {
            var player = elements[j];
            if (player != undefined && player.children != null && player.children.length > 0) {
                for (var k = 0; k < player.children.length; k++) {
                    var inner = player.children[k];
                    if (inner.className == "js-ima-ads-container ima-ads-container")
                        continue;
                    if (inner.localName != "video")
                        continue;
                    this.vid = inner;
                    return true;
                }
            }
        }
        return false;
    };
    MetadataFullSys.prototype.readTextFile = function (file) {
        var that = this;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 404) {
                }
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    var t = allText.split('\n');
                    for (var _i = 0, t_1 = t; _i < t_1.length; _i++) {
                        var v = t_1[_i];
                        var s = v.split('~');
                        var frame = s[0];
                        if (that.frameStorage[frame] == null)
                            that.frameStorage[frame] = [];
                        that.frameStorage[frame].push([s[1], s[2]]);
                    }
                }
            }
        };
        rawFile.send(null);
    };
    MetadataFullSys.prototype.Update = function () {
        if (this.useLocalTestNetworking) {
            this.fileReadTime++;
            if (this.fileReadTime >= 30) {
                this.readTextFile("TestTraffic/test" + this.curFile + ".txt");
                this.fileReadTime = 0;
            }
        }
        if (this.vid == undefined) {
            this.SetVideoStream();
        }
        var frameNumber = 0;
        if (this.forceMetadataFrames) {
            frameNumber = this.frameNumber + 1;
        }
        else if (this.vid != undefined) {
            this.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, 100, 100);
            var bx = 16, by = 12, sx = 18, sy = 18;
            var ctx = this.canvas.getContext('2d');
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    var pix = ctx.getImageData(bx + sx * j, by + sy * k, 1, 1).data[0];
                    if (pix > 127)
                        frameNumber |= 1 << (j + k * 4);
                }
            }
        }
        if (frameNumber != 0) {
            if (frameNumber != this.frameNumber && this.frameStorage[frameNumber] != null && this.frameStorage[frameNumber] != undefined && this.getHandlers != null) {
                var handlers = this.getHandlers();
                var r = this.frameStorage[frameNumber];
                for (var k = 0; k < r.length; k++) {
                    handlers.Run(NetworkMessageHandler.JoinNetworkMessage(r[k][0], r[k][1]));
                }
            }
            this.frameNumber = frameNumber;
            this.curFile = Math.floor(this.frameNumber / 60) + 3;
        }
    };
    return MetadataFullSys;
}());
var NetworkMessageHandler = (function () {
    function NetworkMessageHandler() {
        this.inputs = {};
        this.peerInputs = {};
        this.inputs = {};
        this.peerInputs = {};
    }
    NetworkMessageHandler.JoinNetworkMessage = function (message, parms) {
        return message + '###' + parms;
    };
    NetworkMessageHandler.SplitNetworkMessage = function (joinedMessage) {
        return joinedMessage.split("###");
    };
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
    NetworkMessageHandler.prototype.AddString = function (msgName, handlerForServerMessage) {
        this.inputs[msgName] = handlerForServerMessage;
        return this;
    };
    NetworkMessageHandler.prototype.Run = function (message) {
        var msgTemp = NetworkMessageHandler.SplitNetworkMessage(message);
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
        var msgTemp = NetworkMessageHandler.SplitNetworkMessage(message);
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
var ticksPerSecond = 60;
var disconnectionTime = 30 * ticksPerSecond;
var keepAliveTime = 20 * ticksPerSecond;
var IRCWriteDelayInSeconds = 1;
var maxBufferedIRCWrites = 5;
var debugErrorsAsAlerts = false;
var debugPrintMessages = false;
var debugLogIncomingIRCChat = true;
var debugLogOutgoingIRCChat = true;
var debugShowAssetMessages = false;
function setTwitchIFrames(isMobile, chatIRCChannelName, chatWidth, chatHeight, videoWidth, videoHeight, metadataSys) {
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
    var options = {
        width: videoWidth,
        height: videoHeight,
        channel: chatIRCChannelName
    };
    var player = new Twitch.Player("TwitchVideo", options);
    player.setVolume(0.5);
    metadataSys.SetVideoPlayer(player);
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
        metadataLoadedFunction: null,
        metadataDoneLoading: false,
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
    var metadataLoadSuccess = function () {
        engineParms.metadataDoneLoading = true;
        if (engineParms.metadataLoadedFunction != null) {
            engineParms.metadataLoadedFunction();
        }
    };
    var metadataLoadFail = function (errorMessage) {
        AppFail('Metadata System Initialization Error: ' + errorMessage);
    };
    var metadataSys = new MetadataFullSys(appParms.useMetadata, location.hash, metadataLoadSuccess, metadataLoadFail, devParms.useLocalTestNetworking, devParms.forceMetadataFrames);
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
    setTwitchIFrames(isMobile, chatIRCChannelName, appParms.chatWidth, appParms.chatHeight, appParms.videoWidth, appParms.videoHeight, metadataSys);
    var HandleOrientation = MakeOrientationWarning(isMobile, phaserDivName);
    ApgSetup(appParms, devParms.networkingTestSequence, devParms.disableNetworking, logicIRCChannelName, phaserDivName, isMobile, engineParms, ClearOnLoadEnd, HandleOrientation, metadataSys);
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
        _this.id = ent.entList.length;
        ent.entList.push(_this);
        return _this;
    }
    ent.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    ent.prototype.eliminate = function () { ent.entList[this.id] = null; this.destroy(true); this.id = -1; };
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
        _this.id = enttx.entList.length;
        enttx.entList.push(_this);
        return _this;
    }
    enttx.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    enttx.prototype.eliminate = function () { enttx.entList[this.id] = null; this.destroy(true); this.id = -1; };
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