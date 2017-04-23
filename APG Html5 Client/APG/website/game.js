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
    Object.defineProperty(enttx.prototype, "src", {
        set: function (value) { value.addChild(this); },
        enumerable: true,
        configurable: true
    });
    return enttx;
}(Phaser.Text));
function StartGame(apg) {
    MainPlayerInput(apg);
}
var APGSys = (function () {
    function APGSys(g, logicIRCChannelName, playerName, chat, JSONAssets) {
        var _this = this;
        this.g = g;
        this.w = g.world;
        this.JSONAssets = JSONAssets;
        this.playerName = playerName;
        this.network = new IRCNetwork(function () { return _this.handlers; }, playerName, logicIRCChannelName, chat);
    }
    APGSys.prototype.update = function () {
        this.network.update();
    };
    APGSys.prototype.WriteToServer = function (msgName, parmsForMessageToServer) {
        this.network.sendMessageToServer(msgName, parmsForMessageToServer);
    };
    APGSys.prototype.SetHandlers = function (theHandlers) {
        this.handlers = theHandlers;
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
                    game.scale.pageAlignHorizontally = true;
                    game.scale.pageAlignVertically = true;
                    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                    game.scale.setResizeCallback(gameResized, _this);
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
            create: function () {
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
            var showingOrientationWarning = false;
            setInterval(function () {
                if (isMobile) {
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
                }
                apg.update();
            }, 1000 / 60);
            StartGame(apg);
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
    function ButtonCollection(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var big = this;
        this.selected = 0;
        this.update = function (active) {
            updateActive = active;
        };
        var clickSound = apg.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
        var fontName = "Caveat Brush";
        function addOption(id, str, x, y, toolTip) {
            var highlighted = false, highlightVertical = size * 3 / 4, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + str.length * highlightHorizontal, y1 = y - highlightVertical, y2 = y + 10, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var textColor = { font: '18px ' + fontName, fill: '#222' };
            new enttx(apg.w, 60, 50 + 20, str, textColor, {
                upd: function (e) {
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
            var goalx = 0, goaly = 0, mul = 1, tick = Math.random() * Math.PI * 2, tickScale = Math.random() * .8 + .4;
            new ent(apg.w, 50, 50, 'assets/imgs/blueorb.png', { scalex: .24, scaley: .24,
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
    IRCNetwork.prototype.handleInputMessage = function (userName, message) {
        if (userName == this.playerName)
            return;
        if (debugLogIncomingIRCChat) {
            ConsoleOutput.debugLog(userName + " " + message, "network");
        }
        console.log("testing " + userName + " vs " + this.logicChannelName);
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
    IRCNetwork.prototype.sendMessageToServer = function (message, parms) {
        this.writeToChat(message + "###" + JSON.stringify(parms));
    };
    IRCNetwork.prototype.sendMessageLocally = function (user, message, parms) {
        this.handleInputMessage(user, message + "###" + JSON.stringify(parms));
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
var carParts;
cachePhaserAssets(function (l) {
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
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheGoogleWebFonts(['Anton']);
var RacingGame = (function () {
    function RacingGame(apg) {
        var _this = this;
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
        apg.WriteToServer("join", {});
        var endOfRoundSound = apg.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
        this.warningSound = apg.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);
        var tick = 0, choiceLeft = 50, choiceUp = 118;
        var lastRoundUpdate = 0;
        this.makeHandlers(apg);
        var sc = 1.5;
        var inputUsed = false;
        var joinTimer = 0;
        var bkg = new ent(apg.w, 0, 0, 'racinggame/audienceInterfaceBG.png', {
            scalex: sc, scaley: sc,
            upd: function (e) {
                if (!_this.haveJoined) {
                    if (!_this.tryingToJoin) {
                        if (apg.g.input.activePointer.isDown == true) {
                            _this.tryingToJoin = true;
                            _this.joinText.text = "Asking to join Streamer's game - wait for a resposne";
                            apg.WriteToServer("join", {});
                        }
                    }
                    else {
                        joinTimer++;
                        if (joinTimer > 60 * 5 * 4) {
                            _this.tryingToJoin = false;
                            _this.joinText.text = "Trouble joining Streamer's game.  Tap to try again.";
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
                            if (_this.curPlayerChoice != 1)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 0 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][0]);
                            _this.curPlayerChoice = 1;
                            _this.select1.alpha = 1;
                            _this.select2.alpha = .5;
                            _this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 138 && apg.g.input.y < 187) {
                            if (_this.curPlayerChoice != 2)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 1 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][1]);
                            _this.curPlayerChoice = 2;
                            _this.select1.alpha = .5;
                            _this.select2.alpha = 1;
                            _this.select3.alpha = .5;
                        }
                        if (apg.g.input.x > 237 && apg.g.input.x < 285 && apg.g.input.y > 225 && apg.g.input.y < 276) {
                            if (_this.curPlayerChoice != 3)
                                apg.WriteToServer("select", { pitstopID: _this.pitstopID, partID: _this.mySpot, currentPart: 2 });
                            _this.myPart.loadTexture(carParts[_this.pitstopID][_this.mySpot][2]);
                            _this.curPlayerChoice = 3;
                            _this.select1.alpha = .5;
                            _this.select2.alpha = .5;
                            _this.select3.alpha = 1;
                        }
                    }
                    inputUsed = true;
                }
            }
        });
        this.addArt(apg, sc);
    }
    RacingGame.prototype.addArt = function (apg, sc) {
        var statNames = ["Fuel Cap", "Speed Cap", "Weight", "Suaveness", "Power"];
        function fnt(sz) {
            sz *= sc;
            return '' + sz + 'px Anton';
        }
        new enttx(apg.w, sc * 10, sc * 10, "CAR PERFORMANCE", { font: fnt(20), fill: '#fff' });
        for (var k = 0; k < 5; k++) {
            new enttx(apg.w, sc * 10, sc * (48 + (72 - 48) * k), statNames[k] + ":", { font: fnt(16), fill: '#fff' });
        }
        new enttx(apg.w, sc * 12, sc * 228, "CASING TECH", { font: fnt(20), fill: '#fff' });
        new enttx(apg.w, sc * 15, sc * 256, "Piston Tech:", { font: fnt(16), fill: '#fff' });
        new enttx(apg.w, sc * 15, sc * 275, "Sparkplug Tech:", { font: fnt(16), fill: '#fff' });
        new enttx(apg.w, sc * 152, sc * 10, "OPTIONS", { font: fnt(20), fill: '#fff' });
        this.select1 = new ent(apg.w, sc * 158, sc * 36, "racinggame/selected.png", { alpha: 1 });
        this.select2 = new ent(apg.w, sc * 158, sc * 92, "racinggame/unselected.png", { alpha: .5 });
        this.select3 = new ent(apg.w, sc * 158, sc * 150, "racinggame/unselected.png", { alpha: .5 });
        this.partLabel1 = new enttx(apg.w, sc * 158, sc * 36, "Featherwate", { font: fnt(16), fill: '#0' });
        this.partLabel2 = new enttx(apg.w, sc * 158, sc * 92, "Unguzzler", { font: fnt(16), fill: '#0' });
        this.partLabel3 = new enttx(apg.w, sc * 158, sc * 150, "Hulkite", { font: fnt(16), fill: '#0' });
        var picChangeTick = 0;
        var picFrame = 0;
        this.carPart1 = new ent(apg.w, sc * 220, sc * 40, carParts[this.pitstopID][0][0], { scalex: sc * .4, scaley: sc * .4 });
        this.carPart2 = new ent(apg.w, sc * 220, sc * 40, carParts[this.pitstopID][1][0], { scalex: sc * .4, scaley: sc * .4 });
        this.carPart3 = new ent(apg.w, sc * 220, sc * 40, carParts[this.pitstopID][2][0], { scalex: sc * .4, scaley: sc * .4 });
        this.myPart = this.carPart1;
        new enttx(apg.w, sc * 220, sc * 178, "-1 Weight, +1 Power", { font: fnt(24), fill: '#fff' });
        this.joinBkg = new ent(apg.w, 0, 0, "racinggame/selected.png", { alpha: 1, scalex: sc * 10, scaley: sc * 10 });
        this.joinText = new enttx(apg.w, sc * 40, sc * 178, "Tap Anywhere to Join Game", { font: fnt(18), fill: '#0' });
    };
    RacingGame.prototype.makeHandlers = function (apg) {
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
            console.log("In team");
            console.log("I am " + apg.playerName);
            if (that.mySpot != -1)
                return;
            if (teamInfo.part1 == apg.playerName)
                that.mySpot = 0;
            if (teamInfo.part2 == apg.playerName)
                that.mySpot = 1;
            if (teamInfo.part3 == apg.playerName)
                that.mySpot = 2;
            console.log("my spot is " + that.mySpot);
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
        var handlers = new NetworkMessageHandler();
        handlers.Add("joinawk", JoinAcknowledge);
        handlers.Add("team", Team);
        handlers.AddPeerMessage("select", PlayerChoice);
        apg.SetHandlers(handlers);
    };
    return RacingGame;
}());
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
cacheImages('assets/imgs', ['ClientUI4.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
cacheJSONs(['TestActions.json']);
function MainPlayerInput(apg) {
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['TestActions.json'];
    var endOfRoundSound = apg.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('assets/snds/fx/strokeup.mp3', 1, false);
    function makeButtonSet(baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        return new ButtonCollection(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
    }
    function addActionSet(setToolTip) {
        var o = [];
        for (var j = 0; j < actions.length; j++)
            o.push(new ActionEntry(actions[j].name, ""));
        return makeButtonSet(200, 120, 81, 0, 28, '#F00000', '#200000', setToolTip, function (v) { }, o);
    }
    function addActions(srcChoices, setToolTip) {
        var choiceLeft = 200, choiceUp = 170;
        var curCollection = 0;
        function add(choiceSet) {
            var id = curCollection;
            curCollection++;
            return makeButtonSet(choiceLeft, choiceUp, 0, 40, 22, '#F00000', '#200000', setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
    apg.SetHandlers(new NetworkMessageHandler()
        .Add("time", function (p) {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Add("pl", function (p) {
        if (p.nm != apg.playerName)
            return;
        myStats = p;
    })
        .Add("submit", function (p) {
        apg.WriteToServer("upd", { choices: choices });
    }));
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, choiceLeft = 50, choiceUp = 118, tabButtons, choiceButtons, bkg = new Image();
    bkg.src = 'ClientUI4.png';
    var labelColor = '#608080';
    var roundLabel, toolTipLabel, nextChoiceLabel;
    var lastRoundUpdate = 0;
    new ent(apg.w, 0, 0, 'assets/imgs/ClientUI4.png', {
        upd: function (e) {
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
    roundLabel = new enttx(apg.w, 220, 25, "Choices for Round ", { font: '54px ' + fontName, fill: '#688' });
    toolTipLabel = new enttx(apg.w, 340, 150, "ToolTip", { font: '20px ' + fontName, fill: '#233', wordWrap: true, wordWrapWidth: 330 });
    nextChoiceLabel = new enttx(apg.w, 650, 350, "", { font: '40px ' + fontName, fill: '#688' });
    tabButtons = addActionSet(setToolTip);
    choiceButtons = addActions(choices, setToolTip);
    function category(msg, x, y) {
        new enttx(apg.w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });
    }
    function inCategory(x, y, add, labels) {
        for (var k = 0; k < labels.length; k++) {
            new enttx(apg.w, x, y + k * add, labels[k], { font: '14px ' + fontName, fill: '#211' });
        }
    }
    category("RESOURCES", 40, 100);
    inCategory(50, 120, 16, ["Health:", "Gold:", "Tacos:", "Silver:"]);
    category("STATS", 40, 120 + 64 + 8);
    inCategory(50, 120 + 64 + 8 + 20, 16, ["Defense:", "Action+", "Heal+", "Item Get+", "Work+"]);
    category("SELECTED CHOICES", 40, 300);
    inCategory(50, 320, 16, ["Move:", "Action:", "Stance:", "Item:"]);
}
cacheImages('assets/imgs', ['ClientUI3.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function ShowSubmitted(apg, getRoundNumber) {
    var inputUsed = false;
    var clickSound = apg.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
    apg.SetHandlers(new NetworkMessageHandler());
    new ent(apg.w, 0, 0, 'assets/imgs/ClientUI3.png', {
        upd: function (e) {
            if (apg.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(apg);
                clickSound.play();
            }
        }
    });
    new enttx(apg.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });
}
cacheImages('assets/imgs', ['ClientUI3.png']);
cacheSounds('assets/snds/fx', ['strokeup4.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingForJoinAcknowledement(apg) {
    var endOfRoundSound = apg.g.add.audio('assets/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0, retry = 0;
    apg.SetHandlers(new NetworkMessageHandler()
        .Add("join", function (p) {
        if (p.name != apg.playerName)
            return;
        endSubgame = true;
        endOfRoundSound.play();
        MainPlayerInput(apg);
    }));
    new ent(apg.w, 60, 0, 'assets/imgs/ClientUI3.png', {
        alpha: 0,
        upd: function (e) {
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
    new enttx(apg.w, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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
cacheImages('assets/imgs', ['ClientUI3.png']);
cacheSounds('assets/snds/fx', ['strokeup2.mp3']);
cacheGoogleWebFonts(['Caveat Brush']);
function WaitingToJoin(apg, previousMessage) {
    if (previousMessage === void 0) { previousMessage = ""; }
    var clickSound = apg.g.add.audio('assets/snds/fx/strokeup2.mp3', 1, false);
    apg.SetHandlers(new NetworkMessageHandler());
    var inputUsed = false, endSubgame = false;
    new ent(apg.g.world, 0, 0, 'assets/imgs/ClientUI3.png', {
        upd: function (e) {
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
        new enttx(apg.w, 160, 2 * (50 + 20) + 60, previousMessage, textColor2, {
            upd: function (e) {
                if (endSubgame) {
                    e.x = e.x * .7 + .3 * -50;
                    if (e.x < -47)
                        e.destroy(true);
                    return;
                }
            }
        });
    }
    new enttx(apg.w, 140, 2 * (50 + 20) - 20, "Tap or click to Connect to the Streamer's Game!", textColor, {
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