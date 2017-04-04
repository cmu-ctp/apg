var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ent = (function (_super) {
    __extends(ent, _super);
    function ent(t, x, y, key, fields) {
        _super.call(this, t.game, x, y, key);
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
    return ent;
}(Phaser.Sprite));
var enttx = (function (_super) {
    __extends(enttx, _super);
    function enttx(t, x, y, text, style, fields) {
        _super.call(this, t.game, x, y, text, style);
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
    return enttx;
}(Phaser.Text));
function StartGame(sys) {
    MainPlayerInput(sys);
}
var APGSys = (function () {
    function APGSys(g, logicIRCChannelName, playerName, chat, JSONAssets) {
        var _this = this;
        this.g = g;
        this.w = g.world;
        this.JSONAssets = JSONAssets;
        this.playerName = playerName;
        this.network = new IRCNetwork(function () { return _this.handlers; }, playerName, logicIRCChannelName, chat, this.w);
    }
    APGSys.prototype.update = function () {
        this.network.update();
    };
    APGSys.prototype.sendMessageToServer = function (msgName, parmsForMessageToServer) {
        this.network.sendMessageToServer(msgName, parmsForMessageToServer);
    };
    return APGSys;
}());
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
var phaserAssetCacheList = [];
var phaserImageList = [];
var phaserSoundList = [];
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
var phaserGoogleWebFontList = [];
function cacheGoogleWebFonts(googleWebFontNames) {
    if (phaserGoogleWebFontList == undefined) {
        phaserGoogleWebFontList = [];
    }
    for (var k = 0; k < googleWebFontNames.length; k++) {
        phaserGoogleWebFontList.push(googleWebFontNames[k]);
    }
}
var jsonAssetCacheNameList = [];
function cacheJSONs(fileNames) {
    if (jsonAssetCacheNameList == undefined) {
        jsonAssetCacheNameList = [];
    }
    for (var k = 0; k < fileNames.length; k++) {
        jsonAssetCacheNameList.push(fileNames[k]);
    }
}
function ApgSetup(isMobile, gameWidth, gameHeight, logicIRCChannelName, playerName, APGInputWidgetDivName, allowFullScreen, engineParms, onLoadEnd) {
    if (gameWidth === void 0) { gameWidth = 400; }
    if (gameHeight === void 0) { gameHeight = 300; }
    if (gameWidth < 1 || gameWidth > 8192 || gameHeight < 1 || gameHeight > 8192) {
        ConsoleOutput.debugError("ApgSetup: gameWidth and gameHeight are set to " + gameWidth + ", " + gameHeight + ".  These values should be set to the width and height of the desired HTML5 app.  400 and 300 are the defaults.", "sys");
        return;
    }
    if (logicIRCChannelName == undefined || logicIRCChannelName == "") {
        ConsoleOutput.debugError("ApgSetup: logicIRCChannelName is not set.  The game cannot work without this.  This should be set to the name of a Twitch IRC channel, with no leading #.", "sys");
        return;
    }
    if (playerName == undefined || playerName == "") {
        ConsoleOutput.debugError("ApgSetup: playerName is not set.  The game cannot work without this.  This should be set to the name of a valid Twitch account.", "sys");
        return;
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
        var _this = this;
        var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
            preload: function () {
                game.stage.disableVisibilityChange = true;
                if (allowFullScreen) {
                    game.input.onDown.add(goFull, _this);
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
            create: function () {
                game.input.mouse.capture = true;
                if (phaserGoogleWebFontList == undefined || phaserGoogleWebFontList.length == 0) {
                    initLaunchGame();
                }
            }
        });
        WebFontConfig = {
            active: function () { game.time.events.add(Phaser.Timer.SECOND, initLaunchGame, this); },
            google: {
                families: phaserGoogleWebFontList
            }
        };
        function initLaunchGame() {
            if (engineParms.chat == null) {
                engineParms.chatLoadedFunction = launchGame;
            }
            else {
                launchGame();
            }
        }
        function launchGame() {
            onLoadEnd();
            var apg = new APGSys(game, logicIRCChannelName, playerName, engineParms.chat, JSONAssets);
            var showingLandscapeWarning = false;
            setInterval(function () {
                if (isMobile) {
                    var width = window.innerWidth || document.body.clientWidth;
                    var height = window.innerHeight || document.body.clientHeight;
                    if (height > width) {
                        if (!showingLandscapeWarning) {
                            showingLandscapeWarning = true;
                            document.getElementById("landscapeWarning").style.display = '';
                            document.getElementById(APGInputWidgetDivName).style.display = 'none';
                        }
                    }
                    else {
                        if (showingLandscapeWarning) {
                            showingLandscapeWarning = false;
                            document.getElementById("landscapeWarning").style.display = 'none';
                            document.getElementById(APGInputWidgetDivName).style.display = '';
                        }
                    }
                }
                apg.update();
            }, 1000 / 60);
            StartGame(apg);
        }
        function goFull() {
            game.scale.pageAlignHorizontally = true;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            if (game.scale.isFullScreen) {
            }
            else {
                game.scale.startFullScreen(true);
            }
        }
    }
}
var ActionEntry = (function () {
    function ActionEntry(label, tooltip) {
        this.label = label;
        this.tooltip = tooltip;
    }
    return ActionEntry;
}());
cacheImages('assets/imgs', ['blueorb.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
var ButtonCollection = (function () {
    function ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var big = this;
        this.selected = 0;
        this.update = function (active) {
            updateActive = active;
        };
        var clickSound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
        var fontName = "Caveat Brush";
        function addOption(id, str, x, y, toolTip) {
            var highlighted = false, highlightVertical = size * 3 / 4, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + str.length * highlightHorizontal, y1 = y - highlightVertical, y2 = y, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var textColor = { font: '20px ' + fontName, fill: '#222' };
            new enttx(sys.w, 60, 50 + 20, str, textColor, {
                upd: function (e) {
                    mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);
                    e.x = x + 10 * (1 - mul);
                    e.y = y - 14 + 20 * (1 - mul);
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
                    if (sys.g.input.activePointer.isDown == false)
                        inputUsed = false;
                    if (!updateActive) {
                        return;
                    }
                    highlighted = true;
                    if (sys.g.input.x < x1 || sys.g.input.x > x2 || sys.g.input.y < y1 || sys.g.input.y > y2)
                        highlighted = false;
                    if (highlighted) {
                        setToolTip(toolTip);
                    }
                    if (highlighted && sys.g.input.activePointer.isDown && inputUsed == false) {
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
            var goalx = 0, goaly = 0, mul = 1, tick = Math.random() * Math.PI * 2, tickScale = Math.random() * .8 + .4;
            new ent(sys.w, 50, 50, 'assets/imgs/blueorb.png', { scalex: .24, scaley: .24,
                upd: function (e) {
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
    return ButtonCollection;
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
    function IRCNetwork(getHandlers, player, logicChannelName, chat, w) {
        this.lastMessageTime = 0;
        this.messageQueue = [];
        this.channelName = '#' + logicChannelName;
        var src = this;
        chat.on("chat", function (channel, userstate, message, self) {
            if (self)
                return;
            if (debugLogIncomingIRCChat) {
                ConsoleOutput.debugLog(channel + " " + userstate.username + " " + message, "network");
            }
            if (userstate.username == logicChannelName) {
                getHandlers().run(message);
            }
            else {
            }
        });
        this.chat = chat;
    }
    IRCNetwork.prototype.sendMessageToServer = function (msg, parms) {
        this.writeToChat(msg + "###" + JSON.stringify(parms));
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
        this.chat.say(this.channelName, s);
        if (debugLogOutgoingIRCChat) {
            ConsoleOutput.debugLog(s, "network");
        }
        this.lastMessageTime = IRCWriteDelayInSeconds * ticksPerSecond;
    };
    IRCNetwork.prototype.update = function () {
        this.lastMessageTime--;
        if (this.lastMessageTime <= 0 && this.messageQueue.length > 0) {
            var delayedMessage = this.messageQueue.shift();
            this.chat.say(this.channelName, delayedMessage);
            if (debugLogOutgoingIRCChat) {
                ConsoleOutput.debugLog(delayedMessage, "network");
            }
        }
    };
    return IRCNetwork;
}());
var Scroller = (function () {
    function Scroller(g, x, y, windowx, windowy, clearOnScroll) {
        this.px = 0;
        this.py = 0;
        this.x = x;
        this.y = y;
        this.windowx = windowx;
        this.windowy = windowy;
        this.clearOnScroll = clearOnScroll;
        this.b = g.make.bitmapData(x, y);
        this.img = this.b.addToWorld();
        this.img.x = this.img.y = 0;
        this.img2 = this.b.addToWorld();
        this.img.x = x;
        this.img.y = 0;
        this.img3 = this.b.addToWorld();
        this.img.x = 0;
        this.img.y = y;
        this.img4 = this.b.addToWorld();
        this.img.x = x;
        this.img.y = y;
        this.b.fill(0, 0, 0, 0);
    }
    Scroller.prototype.draw = function (s, x, y, sc) {
        x += this.px;
        y += this.py;
        this.b.draw(s, x, y, s.width * sc, s.height * sc);
        this.b.draw(s, x - this.x, y, s.width * sc, s.height * sc);
        this.b.draw(s, x, y - this.y, s.width * sc, s.height * sc);
        this.b.draw(s, x - this.x, y - this.y, s.width * sc, s.height * sc);
    };
    Scroller.prototype.scrollBy = function (x, y) {
        if (this.clearOnScroll) {
            var x1, y1, x2, y2;
            if (y < 0) {
                x1 = this.px;
                y1 = this.py + this.windowy + y;
                x2 = this.px + this.windowx;
                y2 = this.py + this.windowy;
                if (x1 > this.x)
                    x1 -= this.x;
                if (y1 > this.y)
                    y1 -= this.y;
                if (x2 > this.x)
                    x2 -= this.x;
                if (y2 > this.y)
                    y2 -= this.y;
                if (y1 < y2)
                    this.b.clear(x1, y1, x2 - x1, y2 - y1);
                else {
                    this.b.clear(x1, 0, x2 - x1, y2);
                    this.b.clear(x1, y1, x2 - x1, this.y - y1);
                }
            }
        }
        this.px += x;
        if (this.px < 0)
            this.px += this.x;
        if (this.px > this.x)
            this.px -= this.x;
        this.py += y;
        if (this.py < 0)
            this.py += this.y;
        if (this.py > this.y)
            this.py -= this.y;
        this.doScroll(this.px, this.py);
    };
    Scroller.prototype.doScroll = function (x, y) {
        this.px = x % this.x;
        if (x < 0)
            this.px -= this.x;
        this.py = y % this.y;
        if (y < 0)
            this.py -= this.y;
        this.img.x = -this.px;
        this.img.y = -this.py;
        this.img2.x = -this.px + this.x;
        this.img2.y = -this.py;
        this.img3.x = -this.px;
        this.img3.y = -this.py + this.y;
        this.img4.x = -this.px + this.x;
        this.img4.y = -this.py + this.y;
    };
    return Scroller;
}());
var debugAllCarParts = [];
cachePhaserAssets(function (l) {
    var assetSets = ["bodyHood", "bodySide", "bodyTrunk", "defense", "nitro", "offense", "case", "pistons", "plugs", "airfreshner", "seat", "steering", "tireBolts", "tireBrand", "tire"];
    for (var k = 0; k < assetSets.length; k++) {
        for (var j = 1; j < 4; j++) {
            l.image("carPart_" + k + "_" + j, "racinggame/" + assetSets[k] + j + ".png");
            debugAllCarParts.push("carPart_" + k + "_" + j);
        }
    }
});
cacheImages('racinggame', ['audienceInterfaceBG.png', 'selected.png', 'unselected.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheGoogleWebFonts(['Anton']);
function RacingInput(sys) {
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
    var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];
    var timer = 0;
    var roundNumber = 1;
    var choices = [1, 1, 1, 1, 1, 1];
    var endOfRoundSound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = sys.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);
    var carSet = 3;
    sys.handlers = new APGSubgameMessageHandler();
    var tick = 0, choiceLeft = 50, choiceUp = 118;
    var lastRoundUpdate = 0;
    var bkg = new ent(sys.w, 0, 0, 'racinggame/audienceInterfaceBG.png', {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                lastRoundUpdate = roundNumber;
            }
        }
    });
    function fnt(sz) {
        return '' + sz + 'px Anton';
    }
    new enttx(sys.w, 10, 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });
    for (var k = 0; k < 5; k++) {
        new enttx(sys.w, 10, 48 + (72 - 48) * k, statNames[k] + ":", { font: fnt(16), fill: '#fff' });
    }
    new enttx(sys.w, 12, 228, "CASING TECH", { font: fnt(20), fill: '#fff' });
    new enttx(sys.w, 15, 256, "Piston Tech:", { font: fnt(16), fill: '#fff' });
    new enttx(sys.w, 15, 275, "Sparkplug Tech:", { font: fnt(16), fill: '#fff' });
    new enttx(sys.w, 152, 10, "OPTIONS", { font: fnt(20), fill: '#fff' });
    new ent(sys.w, 158, 36, "racinggame/selected.png");
    new ent(sys.w, 158, 92, "racinggame/unselected.png");
    new ent(sys.w, 158, 150, "racinggame/unselected.png");
    new enttx(sys.w, 158, 36, "Featherwate", { font: fnt(16), fill: '#0' });
    new enttx(sys.w, 158, 92, "Unguzzler", { font: fnt(16), fill: '#0' });
    new enttx(sys.w, 158, 150, "Hulkite", { font: fnt(16), fill: '#0' });
    var picChangeTick = 0;
    var picFrame = 0;
    for (var k = 1; k < 4; k++) {
        new ent(sys.w, 220, 40, debugAllCarParts[carSet * 9 + (k - 1) * 3 + 2], { scalex: .5, scaley: .5 });
    }
    new enttx(sys.w, 220, 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });
}
var secondsPerChoice = 60;
var ticksPerSecond = 60;
var IRCWriteDelayInSeconds = 1;
var maxBufferedIRCWrites = 5;
var debugErrorsAsAlerts = false;
var debugPrintMessages = false;
var debugLogIncomingIRCChat = false;
var debugLogOutgoingIRCChat = true;
var debugShowAssetMessages = false;
var APGSubgameMessageHandler = (function () {
    function APGSubgameMessageHandler() {
        this.inputs = {};
        this.inputs = {};
    }
    APGSubgameMessageHandler.prototype.add = function (msgName, handlerForServerMessage) {
        this.inputs[msgName] =
            function (s) {
                var v = JSON.parse(s);
                handlerForServerMessage(v);
            };
        return this;
    };
    APGSubgameMessageHandler.prototype.run = function (message) {
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
    return APGSubgameMessageHandler;
}());
cacheImages('assets/imgs', ['ClientUI2.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheJSONs(['TestActions.json']);
function MainPlayerInput(sys) {
    var fontName = "Caveat Brush";
    var actions = sys.JSONAssets['TestActions.json'];
    var endOfRoundSound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = sys.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);
    function makeButtonSet(baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
    }
    function addActionSet(setToolTip) {
        var o = [];
        for (var j = 0; j < actions.length; j++)
            o.push(new ActionEntry(actions[j].name, ""));
        return makeButtonSet(40, 80, 70, 0, 18, '#F00000', '#200000', setToolTip, function (v) { }, o);
    }
    function addActions(srcChoices, setToolTip) {
        var choiceLeft = 50, choiceUp = 118;
        var curCollection = 0;
        function add(choiceSet) {
            var id = curCollection;
            curCollection++;
            return makeButtonSet(choiceLeft, choiceUp, 0, 20, 14, '#F00000', '#200000', setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
    sys.handlers = new APGSubgameMessageHandler()
        .add("time", function (p) {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .add("submit", function (p) {
        sys.sendMessageToServer("upd", { choices: choices });
    });
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, choiceLeft = 50, choiceUp = 118, tabButtons, choiceButtons, bkg = new Image();
    bkg.src = 'ClientUI2.png';
    var labelColor = '#608080';
    var roundLabel, toolTipLabel, nextChoiceLabel;
    var lastRoundUpdate = 0;
    new ent(sys.w, 0, 0, 'assets/imgs/ClientUI2.png', {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                roundLabel.text = "Actions for Round " + roundNumber;
                lastRoundUpdate = roundNumber;
            }
            tabButtons.update(true);
            for (var j = 0; j < choiceButtons.length; j++)
                choiceButtons[j].update(tabButtons.selected == j);
            toolTipLabel.text = toolTip;
            nextChoiceLabel.text = "Action Selected in " + timer + " Seconds";
        }
    });
    roundLabel = new enttx(sys.w, 120, 30, "Actions for Round ", { font: '28px ' + fontName, fill: '#688' });
    toolTipLabel = new enttx(sys.w, choiceLeft + 80, 108, "ToolTip", { font: '14px ' + fontName, fill: '#233', wordWrap: true, wordWrapWidth: 230 });
    nextChoiceLabel = new enttx(sys.w, 120, 260, "Actions Selected in", { font: '14px ' + fontName, fill: '#688' });
    tabButtons = addActionSet(setToolTip);
    choiceButtons = addActions(choices, setToolTip);
}
cacheImages('assets/imgs', ['ClientUI2.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function ShowSubmitted(sys, getRoundNumber) {
    var inputUsed = false;
    var clickSound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
    sys.handlers = new APGSubgameMessageHandler();
    new ent(sys.w, 0, 0, 'assets/imgs/ClientUI2.png', {
        upd: function (e) {
            if (sys.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(sys);
                clickSound.play();
            }
        }
    });
    new enttx(sys.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });
}
cacheImages('assets/imgs', ['ClientUI2.png']);
cacheSounds('assets/snds/fx', ['strokeup4.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingForJoinAcknowledement(sys) {
    var endOfRoundSound = sys.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0;
    sys.handlers = new APGSubgameMessageHandler()
        .add("join", function (p) {
        if (p.name != sys.playerName)
            return;
        endSubgame = true;
        endOfRoundSound.play();
        MainPlayerInput(sys);
    });
    new ent(sys.w, 60, 0, 'assets/imgs/ClientUI2.png', {
        alpha: 0,
        upd: function (e) {
            timeOut++;
            if (timeOut > ticksPerSecond * 30) {
                endSubgame = true;
                WaitingToJoin(sys);
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
    new enttx(sys.w, 160, 50 + 20, "Waiting to Connect...", { font: '16px Caveat Brush', fill: '#222' }, {
        alpha: 0,
        upd: function (e) {
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
cacheImages('assets/imgs', ['ClientUI2.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingToJoin(sys) {
    var clickSound = sys.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
    sys.handlers = new APGSubgameMessageHandler();
    var inputUsed = false, endSubgame = false;
    new ent(sys.g.world, 0, 0, 'assets/imgs/ClientUI2.png', {
        upd: function (e) {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -30;
                if (e.x < -27)
                    e.destroy(true);
                return;
            }
            if (sys.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                clickSound.play();
                WaitingForJoinAcknowledement(sys);
                sys.sendMessageToServer("join", {});
                endSubgame = true;
            }
        }
    });
    var tc = 0, textColor = { font: '16px Caveat Brush', fill: '#222' };
    new enttx(sys.w, 60, 50 + 20, "Click to Join Game!", textColor, {
        upd: function (e) {
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
//# sourceMappingURL=../Typescript Src/ts/game.js.map