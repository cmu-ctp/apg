class APGFullSystem {
    constructor(g, logicIRCChannelName, playerName, chat, JSONAssets) {
        this.g = g;
        this.JSONAssets = JSONAssets;
        this.playerName = playerName;
        this.network = new IRCNetwork(() => this.handlers, playerName, logicIRCChannelName, chat);
    }
    update() {
        this.network.update();
    }
    WriteToServer(msgName, parmsForMessageToServer) {
        this.network.sendMessageToServer(msgName, parmsForMessageToServer);
    }
    ResetServerMessageRegistry() { this.handlers = new NetworkMessageHandler(); return this; }
    Register(msgName, handlerForServerMessage) {
        this.handlers.Add(msgName, handlerForServerMessage);
        return this;
    }
    RegisterPeer(msgName, handlerForServerMessage) {
        this.handlers.AddPeerMessage(msgName, handlerForServerMessage);
        return this;
    }
}
var phaserAssetCacheList;
var phaserImageList;
var phaserSoundList;
function cachePhaserAssets(cacheFunction) {
    if (phaserAssetCacheList == undefined) {
        phaserAssetCacheList = [];
    }
    phaserAssetCacheList.push(cacheFunction);
}
function cacheImages(dir, imageList) {
    if (phaserImageList == undefined) {
        phaserImageList = [];
    }
    for (var k = 0; k < imageList.length; k++) {
        phaserImageList.push(dir + "/" + imageList[k]);
    }
}
function cacheSounds(dir, soundList) {
    if (phaserSoundList == undefined) {
        phaserSoundList = [];
    }
    for (var k = 0; k < soundList.length; k++) {
        phaserSoundList.push(dir + "/" + soundList[k]);
    }
}
var phaserGoogleWebFontList;
function cacheGoogleWebFonts(googleWebFontNames) {
    if (phaserGoogleWebFontList == undefined) {
        phaserGoogleWebFontList = [];
    }
    for (var k = 0; k < googleWebFontNames.length; k++) {
        phaserGoogleWebFontList.push(googleWebFontNames[k]);
    }
}
var jsonAssetCacheNameList;
function cacheJSONs(fileNames) {
    if (jsonAssetCacheNameList == undefined) {
        jsonAssetCacheNameList = [];
    }
    for (var k = 0; k < fileNames.length; k++) {
        jsonAssetCacheNameList.push(fileNames[k]);
    }
}
class ent extends Phaser.Sprite {
    constructor(t, x, y, key, fields) {
        super(t.game, x, y, key);
        this.upd = null;
        if (fields)
            Object.assign(this, fields);
        this.exists = true;
        this.visible = true;
        this.alive = true;
        this.z = t.children.length;
        t.addChild(this);
        if (t.enableBody) {
            t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = this;
        }
    }
    update() { if (this.upd != null)
        this.upd(this); }
    set scalex(value) { this.scale.x = value; }
    set scaley(value) { this.scale.y = value; }
    set anchorx(value) { this.anchor.x = value; }
    set anchory(value) { this.anchor.y = value; }
    ix(value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; }
    iy(value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; }
    ixy(x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
    iscaley(value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
    ialpha(value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
    irotation(value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }
    set tex(value) { this.loadTexture(value); }
    set src(value) { value.addChild(this); }
}
class enttx extends Phaser.Text {
    constructor(t, x, y, text, style, fields) {
        super(t.game, x, y, text, style);
        this.upd = null;
        if (fields)
            Object.assign(this, fields);
        this.exists = true;
        this.visible = true;
        this.alive = true;
        this.z = t.children.length;
        t.addChild(this);
        if (t.enableBody) {
            t.game.physics.enable(this, t.physicsBodyType, t.enableBodyDebug);
        }
        if (t.cursor === null) {
            t.cursor = this;
        }
    }
    update() { if (this.upd != null)
        this.upd(this); }
    set scx(value) { this.scale.x = value; }
    set scy(value) { this.scale.y = value; }
    set anchorx(value) { this.anchor.x = value; }
    set anchory(value) { this.anchor.y = value; }
    ix(value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; }
    iy(value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; }
    ixy(x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; }
    iscx(value, speed) { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; }
    iscy(value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; }
    ial(value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; }
    irot(value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; }
    set src(value) { value.addChild(this); }
}
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
function ApgSetup(gameLaunchFunction, disableNetworking, isMobile, gameWidth = 400, gameHeight = 300, logicIRCChannelName, APGInputWidgetDivName, allowFullScreen, engineParms, onLoadEnd) {
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
    var curJSONAsset = 0;
    var JSONAssets = {};
    function LoadJSONAsset() {
        if (curJSONAsset >= jsonAssetCacheNameList.length) {
            LoadPhaserAssets();
            return;
        }
        $.getJSON(jsonAssetCacheNameList[curJSONAsset], function (data) {
            JSONAssets[jsonAssetCacheNameList[curJSONAsset]] = data.all;
            ConsoleOutput.logAsset(jsonAssetCacheNameList[curJSONAsset]);
            curJSONAsset++;
            LoadJSONAsset();
        });
    }
    LoadJSONAsset();
    function LoadPhaserAssets() {
        var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
            preload: () => {
                game.stage.disableVisibilityChange = true;
                if (allowFullScreen) {
                    game.scale.pageAlignHorizontally = true;
                    game.scale.pageAlignVertically = true;
                    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                    game.scale.setResizeCallback(gameResized, this);
                    function gameResized(manager, bounds) {
                        var scale = Math.min(window.innerWidth / game.width, window.innerHeight / game.height);
                        manager.setUserScale(scale, scale, 0, 0);
                    }
                }
                if (phaserAssetCacheList.length == 0) {
                    ConsoleOutput.debugWarn("ApgSetup: phaserAssetCacheList.length is 0, so no assets are being cached.  This is probably an error.", "sys");
                }
                for (var k = 0; k < phaserAssetCacheList.length; k++) {
                    phaserAssetCacheList[k](game.load);
                }
                for (var k = 0; k < phaserImageList.length; k++) {
                    game.load.image(phaserImageList[k], phaserImageList[k]);
                }
                for (var k = 0; k < phaserSoundList.length; k++) {
                    game.load.audio(phaserSoundList[k], phaserSoundList[k]);
                }
                if (phaserGoogleWebFontList != undefined && phaserGoogleWebFontList.length > 0) {
                    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
                }
            },
            create: () => {
                game.input.mouse.capture = true;
                if (phaserGoogleWebFontList == undefined || phaserGoogleWebFontList.length == 0) {
                    initLaunchGame();
                }
            }
        }, true);
        WebFontConfig = {
            active: function () { game.time.events.add(Phaser.Timer.SECOND, initLaunchGame, this); },
            google: {
                families: phaserGoogleWebFontList
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
            var apg = new APGFullSystem(game, logicIRCChannelName, engineParms.playerName, engineParms.chat, JSONAssets);
            var showingOrientationWarning = false;
            setInterval(function () {
                if (!isMobile)
                    return;
                var width = window.innerWidth || document.body.clientWidth;
                var height = window.innerHeight || document.body.clientHeight;
                if (height > width) {
                    if (!showingOrientationWarning) {
                        showingOrientationWarning = true;
                        document.getElementById("orientationWarning").style.display = '';
                        document.getElementById(APGInputWidgetDivName).style.display = 'none';
                    }
                }
                else {
                    if (showingOrientationWarning) {
                        showingOrientationWarning = false;
                        document.getElementById("orientationWarning").style.display = 'none';
                        document.getElementById(APGInputWidgetDivName).style.display = '';
                    }
                }
                apg.update();
            }, 1000 / 60);
            gameLaunchFunction(apg);
        }
    }
}
class ActionEntry {
    constructor(label, tooltip) {
        this.label = label;
        this.tooltip = tooltip;
    }
}
cacheImages('cartoongame/imgs', ['blueorb.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3']);
class ButtonCollection {
    constructor(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        let fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var w = apg.g.world;
        var big = this;
        this.selected = 0;
        this.update = active => {
            updateActive = active;
        };
        let clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
        var fontName = "Caveat Brush";
        function addOption(id, str, x, y, toolTip) {
            let highlighted = false, highlightVertical = size * 3 / 4, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + str.length * highlightHorizontal, y1 = y - highlightVertical, y2 = y + 10, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var textColor = { font: '18px ' + fontName, fill: '#222' };
            new enttx(w, 60, 50 + 20, str, textColor, {
                upd: e => {
                    mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);
                    e.x = x + 10 * 1.5 * (1 - mul);
                    e.y = y - 14 * 1.5 + 20 * 1.5 * (1 - mul);
                    e.alpha = mul;
                    e.scx = e.scy = size * mul * .05;
                    if (e.alpha < .01) {
                        if (e.visible == true)
                            e.visible = false;
                        return;
                    }
                    if (e.visible == false)
                        e.visible = true;
                    if (highlighted) {
                        if (!lastHighlight)
                            e.addColor(highlightColor, 0);
                    }
                    else {
                        if (lastHighlight)
                            e.addColor(baseColor, 0);
                    }
                    lastHighlight = highlighted;
                    if (apg.g.input.activePointer.isDown == false)
                        inputUsed = false;
                    if (!updateActive) {
                        return;
                    }
                    highlighted = true;
                    if (apg.g.input.x < x1 || apg.g.input.x > x2 || apg.g.input.y < y1 || apg.g.input.y > y2)
                        highlighted = false;
                    if (highlighted) {
                        setToolTip(toolTip);
                    }
                    if (highlighted && apg.g.input.activePointer.isDown && inputUsed == false) {
                        clickSound.play();
                        big.selected = id;
                        inputUsed = true;
                        setOption(id);
                        fx1 = x1;
                        fx2 = x2;
                        fy1 = y1;
                        fy2 = y2;
                    }
                }
            });
        }
        for (var k = 0; k < buttonsInit.length; k++) {
            var b = buttonsInit[k];
            addOption(k, b.label, baseX, baseY, b.tooltip);
            baseX += xAdd;
            baseY += yAdd;
        }
        function addSelector() {
            let goalx = 0, goaly = 0, mul = 1, tick = Math.random() * Math.PI * 2, tickScale = Math.random() * .8 + .4;
            new ent(w, 50, 50, 'cartoongame/imgs/blueorb.png', { scalex: .24, scaley: .24,
                upd: e => {
                    e.x = goalx;
                    e.y = goaly;
                    e.alpha = mul * (.5 + .2 * Math.cos(tick * tickScale));
                    tick += .05;
                    mul = mul * .8 + .2 * (updateActive ? 1 : 0);
                    if (e.alpha < .01) {
                        if (e.visible == true)
                            e.visible = false;
                    }
                    if (e.visible == false)
                        e.visible = true;
                    if (mul < .05)
                        return;
                    goalx = goalx * .9 + .1 * ((fx1) - 16);
                    goaly = goaly * .9 + .1 * ((fy1 + fy2) / 2 - 12);
                }
            });
        }
        addSelector();
    }
}
class ConsoleOutput {
    static error(s, tag = "") {
        console.error("Error: " + s);
        if (debugErrorsAsAlerts) {
            alert("Error: " + s);
        }
    }
    static warn(s, tag = "") {
        console.warn("Warning: " + s);
    }
    static info(s, tag = "") {
        console.info(s);
    }
    static log(s, tag = "") {
        console.log(s);
    }
    static debugError(s, tag = "") {
        if (!debugPrintMessages)
            return;
        console.error("Error: " + s);
        if (debugErrorsAsAlerts) {
            alert("Error: " + s);
        }
    }
    static debugWarn(s, tag = "") {
        if (!debugPrintMessages)
            return;
        console.warn("Warning: " + s);
    }
    static debugInfo(s, tag = "") {
        if (!debugPrintMessages)
            return;
        console.info(s);
    }
    static debugLog(s, tag = "") {
        if (!debugPrintMessages)
            return;
        console.log(s);
    }
    static logAsset(s, tag = "") {
        if (!debugShowAssetMessages)
            return;
        console.log("Successfully loaded " + s);
    }
}
class IRCNetwork {
    constructor(getHandlers, player, logicChannelName, chat) {
        this.lastMessageTime = 0;
        this.messageQueue = [];
        this.toggleSpace = false;
        this.getHandlers = getHandlers;
        this.playerName = player;
        this.logicChannelName = logicChannelName;
        this.channelName = '#' + logicChannelName;
        this.chat = chat;
        if (chat != null)
            chat.on("chat", (channel, userstate, message, self) => this.handleInputMessage(userstate.username, message));
    }
    sendMessageToServer(message, parms) {
        this.writeToChat(message + "###" + JSON.stringify(parms));
    }
    sendMessageLocally(user, message, parms) {
        this.handleInputMessage(user, message + "###" + JSON.stringify(parms));
    }
    update() {
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
    }
    handleInputMessage(userName, message) {
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
    }
    writeToChat(s) {
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
    }
}
var carParts;
cachePhaserAssets(l => {
    var assetSets = ["bodyHood", "bodySide", "bodyTrunk", "defense", "nitro", "offense", "case", "pistons", "plugs", "airfreshner", "seat", "steering", "tireBolts", "tireBrand", "tire"];
    carParts = [];
    for (var k = 0; k < 5; k++) {
        carParts.push([]);
        for (var j = 0; j < 3; j++) {
            carParts[k].push([]);
        }
    }
    for (var k = 0; k < assetSets.length; k++) {
        for (var j = 1; j < 4; j++) {
            var s = "carPart_" + k + "_" + j;
            l.image(s, "racinggame/" + assetSets[k] + j + ".png");
            carParts[Math.floor(k / 3)][k % 3].push(s);
        }
    }
});
cacheImages('racinggame', ['audienceInterfaceBG.png', 'selected.png', 'unselected.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheGoogleWebFonts(['Anton']);
class RacingGame {
    constructor(apg) {
        this.myPart = null;
        this.pitstopID = 0;
        this.timer = 0;
        this.choices = [1, 1, 1, 1, 1, 1];
        this.roundNumber = 1;
        this.myPitstop = { pitStopID: 0, part1: "", part2: "", part3: "" };
        this.haveJoined = false;
        this.tryingToJoin = false;
        this.haveStarted = false;
        this.curPlayerChoice = 1;
        this.mySpot = -1;
        var PlayerChoice;
        (function (PlayerChoice) {
            PlayerChoice[PlayerChoice["bodyHood"] = 0] = "bodyHood";
            PlayerChoice[PlayerChoice["bodySide"] = 1] = "bodySide";
            PlayerChoice[PlayerChoice["bodyTrunk"] = 2] = "bodyTrunk";
            PlayerChoice[PlayerChoice["defense"] = 3] = "defense";
            PlayerChoice[PlayerChoice["nitro"] = 4] = "nitro";
            PlayerChoice[PlayerChoice["offense"] = 5] = "offense";
            PlayerChoice[PlayerChoice["case"] = 6] = "case";
            PlayerChoice[PlayerChoice["pistons"] = 7] = "pistons";
            PlayerChoice[PlayerChoice["plugs"] = 8] = "plugs";
            PlayerChoice[PlayerChoice["airfreshner"] = 9] = "airfreshner";
            PlayerChoice[PlayerChoice["seat"] = 10] = "seat";
            PlayerChoice[PlayerChoice["steering"] = 11] = "steering";
            PlayerChoice[PlayerChoice["tireBolts"] = 12] = "tireBolts";
            PlayerChoice[PlayerChoice["tireBrand"] = 13] = "tireBrand";
            PlayerChoice[PlayerChoice["tire"] = 14] = "tire";
        })(PlayerChoice || (PlayerChoice = {}));
        var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
        this.warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
        var tick = 0, choiceLeft = 50, choiceUp = 118;
        var lastRoundUpdate = 0;
        this.makeHandlers(apg);
        var sc = 1.5;
        var inputUsed = false;
        var joinTimer = 0;
        var bkg = new ent(apg.g.world, 0, 0, 'racinggame/audienceInterfaceBG.png', {
            scalex: sc, scaley: sc,
            upd: e => {
                if (!this.haveJoined) {
                    if (!this.tryingToJoin) {
                        if (apg.g.input.activePointer.isDown == true) {
                            this.tryingToJoin = true;
                            this.joinText.text = "Asking to join Streamer's game - wait for a resposne";
                            apg.WriteToServer("join", {});
                        }
                    }
                    else {
                        joinTimer++;
                        if (joinTimer > 60 * 5 * 4) {
                            this.tryingToJoin = false;
                            this.joinText.text = "Trouble joining Streamer's game.  Tap to try again.";
                        }
                        else if (joinTimer % (60 * 5) == 0) {
                            apg.WriteToServer("join", {});
                        }
                    }
                    return;
                }
                if (apg.g.input.activePointer.isDown == false)
                    inputUsed = false;
                if (apg.g.input.activePointer.isDown == true) {
                    if (!inputUsed) {
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 54 && apg.g.input.y < 103) {
                            if (this.curPlayerChoice != 1)
                                apg.WriteToServer("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 0 });
                            this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][0]);
                            this.curPlayerChoice = 1;
                            this.select1.alpha = 1;
                            this.select2.alpha = .5;
                            this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 138 && apg.g.input.y < 187) {
                            if (this.curPlayerChoice != 2)
                                apg.WriteToServer("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 1 });
                            this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][1]);
                            this.curPlayerChoice = 2;
                            this.select1.alpha = .5;
                            this.select2.alpha = 1;
                            this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 225 && apg.g.input.y < 276) {
                            if (this.curPlayerChoice != 3)
                                apg.WriteToServer("select", { pitstopID: this.pitstopID, partID: this.mySpot, currentPart: 2 });
                            this.myPart.loadTexture(carParts[this.pitstopID][this.mySpot][2]);
                            this.curPlayerChoice = 3;
                            this.select1.alpha = .5;
                            this.select2.alpha = .5;
                            this.select3.alpha = 1;
                        }
                    }
                    inputUsed = true;
                }
            }
        });
        this.addArt(apg, sc);
    }
    addArt(apg, sc) {
        var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];
        function fnt(sz) {
            sz *= sc;
            return '' + sz + 'px Anton';
        }
        var w = apg.g.world;
        new enttx(w, sc * 10, sc * 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });
        for (var k = 0; k < 5; k++) {
            new enttx(w, sc * 10, sc * (48 + (72 - 48) * k), statNames[k] + ":", { font: fnt(16), fill: '#fff' });
        }
        new enttx(w, sc * 12, sc * 228, "CASING TECH", { font: fnt(20), fill: '#fff' });
        new enttx(w, sc * 15, sc * 256, "Piston Tech:", { font: fnt(16), fill: '#fff' });
        new enttx(w, sc * 15, sc * 275, "Sparkplug Tech:", { font: fnt(16), fill: '#fff' });
        new enttx(w, sc * 152, sc * 10, "OPTIONS", { font: fnt(20), fill: '#fff' });
        this.select1 = new ent(w, sc * 158, sc * 36, "racinggame/selected.png", { alpha: 1 });
        this.select2 = new ent(w, sc * 158, sc * 92, "racinggame/unselected.png", { alpha: .5 });
        this.select3 = new ent(w, sc * 158, sc * 150, "racinggame/unselected.png", { alpha: .5 });
        this.partLabel1 = new enttx(w, sc * 158, sc * 36, "Featherwate", { font: fnt(16), fill: '#0' });
        this.partLabel2 = new enttx(w, sc * 158, sc * 92, "Unguzzler", { font: fnt(16), fill: '#0' });
        this.partLabel3 = new enttx(w, sc * 158, sc * 150, "Hulkite", { font: fnt(16), fill: '#0' });
        var picChangeTick = 0;
        var picFrame = 0;
        this.carPart1 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][0][0], { scalex: sc * .4, scaley: sc * .4 });
        this.carPart2 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][1][0], { scalex: sc * .4, scaley: sc * .4 });
        this.carPart3 = new ent(w, sc * 220, sc * 40, carParts[this.pitstopID][2][0], { scalex: sc * .4, scaley: sc * .4 });
        this.myPart = this.carPart1;
        new enttx(w, sc * 220, sc * 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });
        this.joinBkg = new ent(w, 0, 0, "racinggame/selected.png", { alpha: 1, scalex: sc * 10, scaley: sc * 10 });
        this.joinText = new enttx(w, sc * 40, sc * 178, "Tap Anywhere to Join Game", { font: fnt(18), fill: '#0' });
    }
    makeHandlers(apg) {
        var that = this;
        function JoinAcknowledge(joinInfo) {
            if (joinInfo.user == apg.playerName) {
                if (that.haveJoined == false) {
                    that.joinText.text = "Joined Streamer's game!  Waiting for game to start...";
                    that.haveJoined = true;
                }
            }
        }
        function Team(teamInfo) {
            if (that.mySpot != -1)
                return;
            if (teamInfo.part1 == apg.playerName)
                that.mySpot = 0;
            if (teamInfo.part2 == apg.playerName)
                that.mySpot = 1;
            if (teamInfo.part3 == apg.playerName)
                that.mySpot = 2;
            if (that.mySpot == -1)
                return;
            if (!that.haveStarted) {
                that.haveStarted = true;
                that.joinText.destroy();
                that.joinBkg.destroy();
                that.joinText = null;
                that.joinBkg = null;
            }
            that.myPitstop = teamInfo;
            that.pitstopID = teamInfo.pitStopID;
            that.carPart1.loadTexture(carParts[that.pitstopID][0][0]);
            that.carPart2.loadTexture(carParts[that.pitstopID][1][0]);
            that.carPart3.loadTexture(carParts[that.pitstopID][2][0]);
            if (that.mySpot == 0) {
                that.myPart = that.carPart1;
            }
            if (that.mySpot == 1) {
                that.myPart = that.carPart2;
            }
            if (that.mySpot == 2) {
                that.myPart = that.carPart3;
            }
        }
        function PlayerChoice(user, partInfo) {
            if (partInfo.pitstopID == that.pitstopID) {
                if (partInfo.partID == 0) {
                    that.carPart1.loadTexture(carParts[that.pitstopID][0][partInfo.currentPart]);
                }
                if (partInfo.partID == 1) {
                    that.carPart2.loadTexture(carParts[that.pitstopID][1][partInfo.currentPart]);
                }
                if (partInfo.partID == 2) {
                    that.carPart2.loadTexture(carParts[that.pitstopID][2][partInfo.currentPart]);
                }
            }
        }
        apg.ResetServerMessageRegistry();
        apg.Register("joinawk", JoinAcknowledge);
        apg.Register("team", Team);
        apg.RegisterPeer("select", PlayerChoice);
    }
}
function RacingInput(apg) {
    new RacingGame(apg);
}
var secondsPerChoice = 60;
var ticksPerSecond = 60;
var IRCWriteDelayInSeconds = 1;
var maxBufferedIRCWrites = 5;
var debugErrorsAsAlerts = false;
var debugPrintMessages = false;
var debugLogIncomingIRCChat = true;
var debugLogOutgoingIRCChat = true;
var debugShowAssetMessages = false;
class NetworkMessageHandler {
    constructor() {
        this.inputs = {};
        this.peerInputs = {};
        this.inputs = {};
        this.peerInputs = {};
    }
    Add(msgName, handlerForServerMessage) {
        this.inputs[msgName] =
            function (s) {
                var v = JSON.parse(s);
                handlerForServerMessage(v);
            };
        return this;
    }
    AddPeerMessage(msgName, handlerForServerMessage) {
        this.peerInputs[msgName] =
            function (src, s) {
                var v = JSON.parse(s);
                handlerForServerMessage(src, v);
            };
        return this;
    }
    Run(message) {
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
    }
    RunPeer(user, message) {
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
    }
}
cacheImages('cartoongame/imgs', ['ClientUI4.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheJSONs(['cartoongame/json/TestActions.json']);
function MainPlayerInput(apg) {
    var w = apg.g.world;
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/TestActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    function makeButtonSet(baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        return new ButtonCollection(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
    }
    function addActionSet(setToolTip) {
        var o = [];
        for (var j = 0; j < actions.length; j++)
            o.push(new ActionEntry(actions[j].name, ""));
        return makeButtonSet(200, 120, 81, 0, 28, '#F00000', '#200000', setToolTip, v => { }, o);
    }
    function addActions(srcChoices, setToolTip) {
        var choiceLeft = 200, choiceUp = 170;
        var curCollection = 0;
        function add(choiceSet) {
            var id = curCollection;
            curCollection++;
            return makeButtonSet(choiceLeft, choiceUp, 0, 40, 22, '#F00000', '#200000', setToolTip, v => srcChoices[id] = v, choiceSet);
        }
        function st(name, tip) { return new ActionEntry(name, tip); }
        var o = [];
        for (var j = 0; j < actions.length; j++) {
            var p = [];
            for (var k = 0; k < actions[j].choices.length; k++) {
                var r = actions[j].choices[k];
                p.push(st(r.name, r.tip));
            }
            o.push(add(p));
        }
        return o;
    }
    var timer = 0;
    var roundNumber = 1;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = { nm: "", hp: 3, money: 0 };
    apg.ResetServerMessageRegistry()
        .Register("time", p => {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Register("pl", p => {
        if (p.nm != apg.playerName)
            return;
        myStats = p;
    })
        .Register("submit", p => {
        apg.WriteToServer("upd", { choices: choices });
    });
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, choiceLeft = 50, choiceUp = 118, tabButtons, choiceButtons, bkg = new Image();
    bkg.src = 'ClientUI4.png';
    var labelColor = '#608080';
    var roundLabel, toolTipLabel, nextChoiceLabel;
    var lastRoundUpdate = 0;
    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI4.png', {
        upd: e => {
            if (roundNumber != lastRoundUpdate) {
                roundLabel.text = "Choices for Round " + roundNumber;
                lastRoundUpdate = roundNumber;
            }
            tabButtons.update(true);
            for (var j = 0; j < choiceButtons.length; j++)
                choiceButtons[j].update(tabButtons.selected == j);
            toolTipLabel.text = toolTip;
            nextChoiceLabel.text = "" + timer;
        }
    });
    roundLabel = new enttx(w, 220, 25, "Choices for Round ", { font: '54px ' + fontName, fill: '#688' });
    toolTipLabel = new enttx(w, 340, 150, "ToolTip", { font: '20px ' + fontName, fill: '#233', wordWrap: true, wordWrapWidth: 330 });
    nextChoiceLabel = new enttx(w, 650, 350, "", { font: '40px ' + fontName, fill: '#688' });
    tabButtons = addActionSet(setToolTip);
    choiceButtons = addActions(choices, setToolTip);
    function category(msg, x, y) {
        new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });
    }
    function inCategory(x, y, add, labels) {
        for (var k = 0; k < labels.length; k++) {
            new enttx(w, x, y + k * add, labels[k], { font: '14px ' + fontName, fill: '#211' });
        }
    }
    category("RESOURCES", 40, 100);
    inCategory(50, 120, 16, ["Health:", "Gold:", "Tacos:", "Silver:"]);
    category("STATS", 40, 120 + 64 + 8);
    inCategory(50, 120 + 64 + 8 + 20, 16, ["Defense:", "Action+", "Heal+", "Item Get+", "Work+"]);
    category("SELECTED CHOICES", 40, 300);
    inCategory(50, 320, 16, ["Move:", "Action:", "Stance:", "Item:"]);
}
cacheImages('cartoongame/imgs', ['ClientUI3.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function ShowSubmitted(apg, getRoundNumber) {
    var inputUsed = false;
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
    apg.ResetServerMessageRegistry();
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        upd: e => {
            if (apg.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(apg);
                clickSound.play();
            }
        }
    });
    new enttx(apg.g.world, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });
}
cacheImages('cartoongame/imgs', ['ClientUI3.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup4.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingForJoinAcknowledement(apg) {
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0, retry = 0;
    apg.ResetServerMessageRegistry()
        .Register("join", p => {
        if (p.name != apg.playerName)
            return;
        endSubgame = true;
        endOfRoundSound.play();
        MainPlayerInput(apg);
    });
    new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', {
        alpha: 0,
        upd: e => {
            retry++;
            if (retry > ticksPerSecond * 4) {
                retry = 0;
                apg.WriteToServer("join", {});
            }
            timeOut++;
            if (timeOut > ticksPerSecond * 20) {
                endSubgame = true;
                WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game.");
                return;
            }
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -30;
                if (e.x < -27)
                    e.destroy(true);
                return;
            }
            e.x = e.x * .7 + .3 * 0;
            e.alpha = e.alpha * .8 + .2 * 1;
        }
    });
    var tick = 0;
    new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
        alpha: 0,
        upd: e => {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -50;
                if (e.x < -47)
                    e.destroy(true);
                return;
            }
            tick++;
            e.x = e.x * .7 + .3 * 60;
            e.alpha = e.alpha * .8 + .2 * (.5 + .5 * Math.cos(tick * .01));
        }
    });
}
cacheImages('cartoongame/imgs', ['ClientUI3.png']);
cacheSounds('cartoongame/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingToJoin(apg, previousMessage = "") {
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
    apg.ResetServerMessageRegistry();
    var inputUsed = false, endSubgame = false;
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        upd: e => {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -30;
                if (e.x < -27)
                    e.destroy(true);
                return;
            }
            if (apg.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                clickSound.play();
                WaitingForJoinAcknowledement(apg);
                apg.WriteToServer("join", {});
                endSubgame = true;
            }
        }
    });
    var tc = 0, textColor = { font: '32px Caveat Brush', fill: '#222' }, textColor2 = { font: '20px Caveat Brush', fill: '#811', wordWrap: true, wordWrapWidth: 430 };
    if (previousMessage != "") {
        new enttx(apg.g.world, 160, 2 * (50 + 20) + 60, previousMessage, textColor2, {
            upd: e => {
                if (endSubgame) {
                    e.x = e.x * .7 + .3 * -50;
                    if (e.x < -47)
                        e.destroy(true);
                    return;
                }
            }
        });
    }
    new enttx(apg.g.world, 140, 2 * (50 + 20) - 20, "Tap or click to Connect to the Streamer's Game!", textColor, {
        upd: e => {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -50;
                if (e.x < -47)
                    e.destroy(true);
                return;
            }
            tc++;
            if (tc % 120 < 60)
                e.visible = false;
            else
                e.visible = true;
        }
    });
}
//# sourceMappingURL=../Typescript Src/ts/APGApp.js.map