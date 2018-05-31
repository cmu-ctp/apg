var APGHelper = (function () {
    function APGHelper() {
    }
    APGHelper.ScreenX = function (val) { return val / 10000 * 1024; };
    APGHelper.ScreenY = function (val) { return (1 - val / 10000) * (768 - 96 - 96); };
    return APGHelper;
}());
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
    CacheMetadataAssets(cache);
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
        this.w = new Phaser.Group(g);
        g.world.add(this.w);
        this.JSONAssets = JSONAssets;
        this.metadata = metadataSys;
        metadataSys.SetGetHandlers(function () { return _this.handlers; });
        metadataSys.InitSettingsMenu(this);
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
        this.metadata.Update(this.g.input.activePointer);
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
function CacheMetadataAssets(c) {
    c.images('assets/metadata', ['blueorb.png', 'metadatasettings.png', 'settingsbkg.png']);
}
var MetadataFullSys = (function () {
    function MetadataFullSys(useMetadata, width, height, url, onConnectionComplete, onConnectionFail, useLocalTestNetworking, forceMetadataFrames) {
        this.mouseLatch = false;
        this.frameNumber = 0;
        this.fileReadTime = 0;
        this.curFile = 1;
        this.frameStorage = {};
        this.binaryPixelLeft = 16;
        this.binaryPixelTop = 12;
        this.binaryPixelWidth = 18;
        this.binaryPixelHeight = 18;
        this.pixelExamineWidth = 700;
        this.pixelExamineHeight = 500;
        this.getHandlers = null;
        this.settingsActive = false;
        this.videoStatusMessage = "Unset";
        this.inUse = useMetadata;
        this.useLocalTestNetworking = useLocalTestNetworking;
        this.forceMetadataFrames = forceMetadataFrames;
        this.videoDestWidth = width;
        this.videoDestHeight = height;
        onConnectionComplete();
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.pixelExamineWidth;
        this.canvas.height = this.pixelExamineHeight;
        this.vid = undefined;
    }
    MetadataFullSys.prototype.InitSettingsMenu = function (apg) {
        var _this = this;
        if (this.inUse == false)
            return;
        var key = apg.g.input.keyboard.addKey(Phaser.Keyboard.ESC);
        var label, label2, frameLabel, frameAdvanceErrorLabel, parsingStatusLabel, videoStatus, offsetLabel;
        var gridSquares = [], clears = [];
        var bkg, graphics1, graphics2;
        var lastFrame = 0;
        var panel = new Phaser.Group(apg.g);
        apg.g.world.add(panel);
        var toggleButton = new Phaser.Sprite(apg.g, this.videoDestWidth - MetadataFullSys.settingButtonWidth, 0, 'assets/metadata/metadatasettings.png');
        panel.add(toggleButton);
        this.examinedVideo = apg.g.make.bitmapData(this.pixelExamineWidth, this.pixelExamineHeight);
        this.examinedVideo.copy('assets/metadata/blueorb.png');
        var videoPreviewClip = apg.g.make.sprite(0, 0, this.examinedVideo);
        panel.add(videoPreviewClip);
        videoPreviewClip.visible = false;
        this.settingToggleFunction = function () {
            if (_this.settingsActive == false) {
                apg.w.x = -1000;
                _this.settingsActive = true;
                var x1 = _this.binaryPixelLeft;
                var y1 = _this.binaryPixelTop;
                var x2 = _this.binaryPixelLeft + _this.binaryPixelWidth * (MetadataFullSys.binaryEncodingColumns - 1);
                var y2 = _this.binaryPixelTop + _this.binaryPixelHeight * (MetadataFullSys.binaryEncodingRows - 1);
                videoPreviewClip.visible = true;
                bkg = new Phaser.Sprite(apg.g, 0, 0, 'assets/metadata/settingsbkg.png');
                bkg.scale.x = bkg.scale.y = 40;
                bkg.alpha = .7;
                panel.add(bkg);
                graphics1 = new Phaser.Sprite(apg.g, x1, y1, 'assets/metadata/blueorb.png');
                graphics1.scale.x = graphics1.scale.y = .1;
                graphics1.anchor.set(.5);
                panel.add(graphics1);
                graphics2 = new Phaser.Sprite(apg.g, x2, y2, 'assets/metadata/blueorb.png');
                graphics2.scale.x = graphics2.scale.y = .1;
                graphics2.anchor.set(.5);
                panel.add(graphics2);
                label = new Phaser.Text(apg.g, 400, 340, "METADATA SYSTEM INFORMATION", { font: '24px Caveat Brush', fill: '#aac' });
                panel.add(label);
                parsingStatusLabel = new Phaser.Text(apg.g, 500, 380, "Frame number status: " + (_this.forceMetadataFrames == true ? "DEBUG, advanced by clock" : "Reading from video image"), { font: '16px Caveat Brush', fill: '#aac' });
                panel.add(parsingStatusLabel);
                videoStatus = new Phaser.Text(apg.g, 500, 410, "Video Status: " + _this.videoStatusMessage, { font: '16px Caveat Brush', fill: '#aac' });
                panel.add(videoStatus);
                offsetLabel = new Phaser.Text(apg.g, 500, 440, "Center of Upper Left Binary Digit: (" + _this.binaryPixelLeft + ", " + _this.binaryPixelTop + ")  Digit Width:(" + _this.binaryPixelWidth + ", " + _this.binaryPixelHeight + ")", { font: '16px Caveat Brush', fill: '#aac' });
                panel.add(offsetLabel);
                frameLabel = new Phaser.Text(apg.g, 500, 470, "", { font: '16px Caveat Brush', fill: '#aac' });
                panel.add(frameLabel);
                frameAdvanceErrorLabel = new Phaser.Text(apg.g, 500, 500, "", { font: '16px Caveat Brush', fill: '#f00' });
                panel.add(frameAdvanceErrorLabel);
                label2 = new Phaser.Text(apg.g, 50, 530, "To calibrate, click centers of top left and bottom right binary pixels.", { font: '32px Caveat Brush', fill: '#f44' });
                panel.add(label2);
                gridSquares = [];
                clears = [];
                for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
                    gridSquares.push([]);
                    for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
                        var pic = new Phaser.Sprite(apg.g, _this.binaryPixelLeft + _this.binaryPixelWidth * j, _this.binaryPixelTop + _this.binaryPixelHeight * k, 'assets/metadata/blueorb.png');
                        pic.tint = 0xff0000;
                        pic.scale.x = pic.scale.y = .05;
                        pic.anchor.set(.5);
                        panel.add(pic);
                        gridSquares[j].push(pic);
                        clears.push(pic);
                    }
                }
                var tick = 0;
                var pointerIsDown = false;
                _this.settingsUpdate = function () {
                    if (apg.g.input.activePointer.isDown && (apg.g.input.activePointer.x < _this.videoDestWidth - MetadataFullSys.settingButtonWidth || apg.g.input.activePointer.y > MetadataFullSys.settingButtonHeight)) {
                        if (!pointerIsDown) {
                            var dif1 = Math.sqrt((x1 - apg.g.input.activePointer.x) * (x1 - apg.g.input.activePointer.x) + (y1 - apg.g.input.activePointer.y) * (y1 - apg.g.input.activePointer.y));
                            var dif2 = Math.sqrt((x2 - apg.g.input.activePointer.x) * (x2 - apg.g.input.activePointer.x) + (y2 - apg.g.input.activePointer.y) * (y2 - apg.g.input.activePointer.y));
                            if (dif1 < dif2) {
                                x1 = graphics1.x = apg.g.input.activePointer.x;
                                y1 = graphics1.y = apg.g.input.activePointer.y;
                            }
                            else {
                                x2 = graphics2.x = apg.g.input.activePointer.x;
                                y2 = graphics2.y = apg.g.input.activePointer.y;
                            }
                            var xLeft = x1;
                            var xRight = x2;
                            if (xLeft > xRight) {
                                xLeft = x2;
                                xRight = x1;
                            }
                            var xDif = (xRight - xLeft) / (MetadataFullSys.binaryEncodingColumns - 1);
                            var yTop = y1;
                            var yBottom = y2;
                            if (yTop > yBottom) {
                                yTop = y2;
                                yBottom = y1;
                            }
                            var yDif = (yBottom - yTop) / (MetadataFullSys.binaryEncodingRows - 1);
                            _this.binaryPixelLeft = xLeft;
                            _this.binaryPixelWidth = xDif;
                            _this.binaryPixelTop = yTop;
                            _this.binaryPixelHeight = yDif;
                            offsetLabel.text = "Center of Upper Left Binary Digit: (" + _this.binaryPixelLeft + ", " + _this.binaryPixelTop + ")  Digit Width:(" + _this.binaryPixelWidth + ", " + _this.binaryPixelHeight + ")";
                            for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
                                for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
                                    gridSquares[j][k].x = _this.binaryPixelLeft + _this.binaryPixelWidth * j;
                                    gridSquares[j][k].y = _this.binaryPixelTop + _this.binaryPixelHeight * k;
                                }
                            }
                        }
                        pointerIsDown = true;
                    }
                    else {
                        pointerIsDown = false;
                    }
                    tick++;
                    frameLabel.text = "Current video frame is " + _this.frameNumber;
                    if (_this.frameNumber - lastFrame > 3)
                        frameAdvanceErrorLabel.text = "Frame Advancing Incorrectly!  Try Re-calibrating...";
                    else
                        frameAdvanceErrorLabel.text = "";
                    lastFrame = _this.frameNumber;
                    if (tick == 30) {
                        graphics1.visible = graphics2.visible = false;
                    }
                    if (tick == 60) {
                        tick = 0;
                        graphics1.visible = graphics2.visible = true;
                    }
                };
            }
            else {
                apg.w.x = 0;
                videoPreviewClip.visible = false;
                _this.settingsActive = false;
                panel.remove(bkg);
                panel.remove(label);
                panel.remove(label2);
                panel.remove(graphics1);
                panel.remove(graphics2);
                panel.remove(frameLabel);
                panel.remove(frameAdvanceErrorLabel);
                panel.remove(parsingStatusLabel);
                panel.remove(videoStatus);
                panel.remove(offsetLabel);
                for (var j = 0; j < clears.length; j++)
                    panel.remove(clears[j]);
                clears = [];
                gridSquares = [];
                _this.settingsUpdate = null;
            }
        };
        key.onDown.add(this.settingToggleFunction, this);
    };
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
    MetadataFullSys.prototype.Update = function (activePointer) {
        if (this.inUse == false)
            return;
        if (activePointer.isDown) {
            if (this.mouseLatch == false && activePointer.x > this.videoDestWidth - MetadataFullSys.settingButtonWidth && activePointer.y < MetadataFullSys.settingButtonHeight) {
                this.settingToggleFunction();
            }
            this.mouseLatch = true;
        }
        else {
            this.mouseLatch = false;
        }
        if (this.settingsUpdate != null) {
            this.settingsUpdate();
        }
        if (this.useLocalTestNetworking) {
            this.ReadLocalMetadataFile();
        }
        if (this.vid == undefined) {
            this.GetVideoPlugin(this.videoPlayer, this.SetVideoErrorMessage);
        }
        var frameNumber = this.GetFrameNumber();
        if (frameNumber != 0) {
            this.RunFrameHandlers(frameNumber);
        }
    };
    MetadataFullSys.prototype.SetVideoErrorMessage = function (message) {
        alert("Metadata Error: Couldn't find " + message);
        this.videoStatusMessage = "Failed at " + message;
    };
    MetadataFullSys.prototype.GetVideoPlugin = function (videoPlayer, onError) {
        if (videoPlayer == undefined) {
            onError("video player div");
            return false;
        }
        if (videoPlayer._bridge == undefined) {
            onError("video player div bridge component");
            return false;
        }
        var iframe = videoPlayer._bridge._iframe;
        if (iframe == undefined) {
            onError("video iframe");
            return false;
        }
        if (iframe.contentWindow.document == undefined) {
            onError("video iframe document");
            return false;
        }
        var elements = iframe.contentWindow.document.getElementsByClassName("player-video");
        if (elements == undefined) {
            onError("player-video");
            return false;
        }
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
                    this.videoStatusMessage = "Active and working";
                    return true;
                }
            }
        }
        return false;
    };
    MetadataFullSys.prototype.readTextFile = function (file) {
        var _this = this;
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
                        if (_this.frameStorage[frame] == null)
                            _this.frameStorage[frame] = [];
                        _this.frameStorage[frame].push([s[1], s[2]]);
                    }
                }
            }
        };
        rawFile.send(null);
    };
    MetadataFullSys.prototype.ReadLocalMetadataFile = function () {
        this.fileReadTime++;
        if (this.fileReadTime >= 30) {
            this.readTextFile("TestTraffic/test" + this.curFile + ".txt");
            this.fileReadTime = 0;
        }
    };
    MetadataFullSys.prototype.GetFrameNumber = function () {
        var frameNumber = 0;
        if (this.forceMetadataFrames) {
            frameNumber = this.frameNumber + 1;
        }
        else if (this.vid != undefined) {
            var videoToContainerScaleX = this.vid.videoWidth / this.videoDestWidth;
            var videoToContainerScaleY = this.vid.videoHeight / this.videoDestHeight;
            if (this.settingsActive) {
                this.examinedVideo.copy('assets/metadata/blueorb.png', Math.random() * 10, Math.random() * 10);
                this.examinedVideo.canvas.getContext('2d').drawImage(this.vid, 0, 0, this.examinedVideo.canvas.width, this.examinedVideo.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
                this.examinedVideo.update();
            }
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.vid, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.pixelExamineWidth, this.pixelExamineHeight);
            for (var j = 0; j < MetadataFullSys.binaryEncodingColumns; j++) {
                for (var k = 0; k < MetadataFullSys.binaryEncodingRows; k++) {
                    var pix = ctx.getImageData((this.binaryPixelLeft + this.binaryPixelWidth * j), (this.binaryPixelTop + this.binaryPixelHeight * k), 1, 1).data[0];
                    if (pix > MetadataFullSys.pixelBinaryCutoff)
                        frameNumber |= 1 << (j + k * MetadataFullSys.binaryEncodingColumns);
                }
            }
        }
        return frameNumber;
    };
    MetadataFullSys.prototype.RunFrameHandlers = function (frameNumber) {
        if (frameNumber != this.frameNumber && this.frameStorage[frameNumber] != null && this.frameStorage[frameNumber] != undefined && this.getHandlers != null) {
            var handlers = this.getHandlers();
            var r = this.frameStorage[frameNumber];
            for (var k = 0; k < r.length; k++) {
                handlers.Run(NetworkMessageHandler.JoinNetworkMessage(r[k][0], r[k][1]));
            }
        }
        this.frameNumber = frameNumber;
        this.curFile = Math.floor(this.frameNumber / 60) + 3;
    };
    MetadataFullSys.settingButtonWidth = 32;
    MetadataFullSys.settingButtonHeight = 32;
    MetadataFullSys.binaryEncodingRows = 4;
    MetadataFullSys.binaryEncodingColumns = 4;
    MetadataFullSys.pixelBinaryCutoff = 127;
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
    var metadataSys = new MetadataFullSys(appParms.useMetadata, appParms.videoWidth, appParms.videoHeight, location.hash, metadataLoadSuccess, metadataLoadFail, devParms.useLocalTestNetworking, devParms.forceMetadataFrames);
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