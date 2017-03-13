var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ent = (function (_super) {
    __extends(Ent, _super);
    function Ent(t, x, y, key, fields) {
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
    Ent.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(Ent.prototype, "scalex", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ent.prototype, "scaley", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ent.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ent.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    Ent.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    Ent.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    Ent.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    Ent.prototype.iscaley = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    Ent.prototype.ialpha = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    Ent.prototype.irotation = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    return Ent;
}(Phaser.Sprite));
var EntTx = (function (_super) {
    __extends(EntTx, _super);
    function EntTx(t, x, y, text, style, fields) {
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
    EntTx.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    Object.defineProperty(EntTx.prototype, "scx", {
        set: function (value) { this.scale.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntTx.prototype, "scy", {
        set: function (value) { this.scale.y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntTx.prototype, "anchorx", {
        set: function (value) { this.anchor.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntTx.prototype, "anchory", {
        set: function (value) { this.anchor.y = value; },
        enumerable: true,
        configurable: true
    });
    EntTx.prototype.ix = function (value, speed) { this.x = this.x * (1 - speed) + speed * value; return this; };
    EntTx.prototype.iy = function (value, speed) { this.y = this.y * (1 - speed) + speed * value; return this; };
    EntTx.prototype.ixy = function (x, y, speed) { this.x = this.x * (1 - speed) + speed * x; this.y = this.y * (1 - speed) + speed * y; return this; };
    EntTx.prototype.iscx = function (value, speed) { this.scale.x = this.scale.x * (1 - speed) + speed * value; return this; };
    EntTx.prototype.iscy = function (value, speed) { this.scale.y = this.scale.y * (1 - speed) + speed * value; return this; };
    EntTx.prototype.ial = function (value, speed) { this.alpha = this.alpha * (1 - speed) + speed * value; return this; };
    EntTx.prototype.irot = function (value, speed) { this.rotation = this.rotation * (1 - speed) + speed * value; return this; };
    return EntTx;
}(Phaser.Text));
function StartGame(sys) {
    WaitingToJoin(sys);
}
var APGSys = (function () {
    function APGSys(g, gameActions, logicIRCChannelName, playerName, chat) {
        var _this = this;
        this.g = g;
        this.w = g.world;
        this.gameActions = gameActions;
        this.network = APGSys.makeNetworking(g.world, logicIRCChannelName, playerName, chat, function () { return _this.messages; });
    }
    APGSys.makeNetworking = function (w, logicIRCChannelName, playerName, chat, messages) {
        if (chat == null) {
            return new NullNetwork(messages, w);
        }
        return new IRCNetwork(messages, playerName, logicIRCChannelName, chat);
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
function addCache(cacheFunction) {
    if (phaserAssetCacheList == undefined) {
        phaserAssetCacheList = [];
    }
    phaserAssetCacheList.push(cacheFunction);
}
function ApgSetup(gameWidth, gameHeight, logicIRCChannelName, playerName, chat, APGInputWidgetDivName, allowFullScreen) {
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
    if (chat == undefined) {
        ConsoleOutput.debugWarn("ApgSetup: chat is not set.  Defaulting to null networking.  chat should be intialized to a tmi cilent.", "sys");
    }
    if (APGInputWidgetDivName == undefined || APGInputWidgetDivName == "") {
        ConsoleOutput.debugError("ApgSetup: APGInputWidgetDivName is not set.  The game cannot work without this.  This should be the name of a valid div to contain the PhaserJS canvas.", "sys");
        return;
    }
    $.getJSON(actionList, function (data) {
        var _this = this;
        var gameActions = data.all;
        var phaserGame = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, APGInputWidgetDivName, {
            preload: function () {
                phaserGame.stage.disableVisibilityChange = true;
                if (allowFullScreen) {
                    phaserGame.input.onDown.add(goFull, _this);
                }
                if (phaserAssetCacheList.length == 0) {
                    ConsoleOutput.debugWarn("ApgSetup: phaserAssetCacheList.length is 0, so no assets are being cached.  This is probably an error.", "sys");
                }
                for (var k = 0; k < phaserAssetCacheList.length; k++) {
                    phaserAssetCacheList[k](phaserGame.load);
                }
            },
            create: function () {
                phaserGame.input.mouse.capture = true;
                StartGame(new APGSys(phaserGame, gameActions, logicIRCChannelName, playerName, chat));
            }
        });
        function goFull() {
            phaserGame.scale.pageAlignHorizontally = true;
            phaserGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            if (phaserGame.scale.isFullScreen) {
            }
            else {
                phaserGame.scale.startFullScreen(true);
            }
        }
    });
}
var ActionEntry = (function () {
    function ActionEntry(label, tooltip) {
        this.label = label;
        this.tooltip = tooltip;
    }
    return ActionEntry;
}());
addCache(function (l) {
    l.image('blueorb', 'assets/imgs/blueorb.png');
    l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});
var ButtonCollection = (function () {
    function ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var big = this;
        this.selected = 0;
        this.update = function (active) {
            updateActive = active;
        };
        var clickSound = sys.g.add.audio('clickThrough', 1, false);
        function addOption(id, str, x, y, toolTip) {
            var highlighted = false, highlightVertical = size * 3 / 4, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + str.length * highlightHorizontal, y1 = y - highlightVertical, y2 = y, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var textColor = { font: '20px Calibri', fill: '#222' };
            new EntTx(sys.w, 60, 50 + 20, str, textColor, {
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
            new Ent(sys.w, 50, 50, 'blueorb', { scalex: .24, scaley: .24,
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
    return ConsoleOutput;
}());
var IRCNetwork = (function () {
    function IRCNetwork(messages, player, logicChannelName, chat) {
        this.lastMessageTime = 0;
        this.messageQueue = [];
        var waitingForJoinAcknowledgement = true;
        this.channelName = '#' + logicChannelName;
        var src = this;
        chat.on("chat", function (channel, userstate, message, self) {
            if (self)
                return;
            if (debugLogIncomingIRCChat) {
                ConsoleOutput.debugLog(channel + " " + userstate.username + " " + message, "network");
            }
            if (userstate.username == logicChannelName) {
                var msg = message.split(' ');
                if (msg[0] == 'join') {
                    var joinName = msg[1];
                    if (waitingForJoinAcknowledgement && joinName == player) {
                        waitingForJoinAcknowledgement = false;
                        messages().onJoin();
                    }
                }
                else if (msg[0] == 't') {
                    messages().timeUpdate(parseInt(msg[2]), parseInt(msg[1]));
                }
                else if (msg[0] == 's') {
                    var m = messages();
                    m.startInputSubmission();
                    var choiceMsg = "upd ";
                    for (var k = 0; k < m.getParmCount(); k++)
                        choiceMsg += " " + m.getParm(k);
                    src.writeToChat(choiceMsg);
                }
                else if (msg[0] == 'u') {
                }
            }
            else {
            }
        });
        this.chat = chat;
    }
    IRCNetwork.prototype.join = function () { this.writeToChat("join"); };
    IRCNetwork.prototype.debugChat = function (s) { this.writeToChat(s); };
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
var NullNetwork = (function () {
    function NullNetwork(messages, w) {
        var _this = this;
        this.tick = secondsPerChoice * ticksPerSecond;
        this.round = 1;
        this.waitingForJoinAcknowledgement = true;
        this.messages = messages;
        new Ent(w, 0, 0, '', { upd: function (e) { _this.update(); } });
    }
    NullNetwork.prototype.join = function () { };
    NullNetwork.prototype.debugChat = function (s) { };
    NullNetwork.prototype.update = function () {
        this.tick--;
        var m = this.messages();
        if (this.waitingForJoinAcknowledgement) {
            if (m.onJoin() == true) {
                this.waitingForJoinAcknowledgement = false;
            }
            return;
        }
        if (this.tick == 0) {
            this.tick = secondsPerChoice * ticksPerSecond;
            this.round++;
            m.startInputSubmission();
            m.clientUpdate();
        }
        else if (this.tick <= (5 * ticksPerSecond) && this.tick % ticksPerSecond == 0) {
            m.timeUpdate(this.round, this.tick / ticksPerSecond);
        }
        else if (this.tick % (ticksPerSecond * 5) == 0) {
            m.timeUpdate(this.round, this.tick / ticksPerSecond);
        }
    };
    return NullNetwork;
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
addCache(function (l) {
    l.image('clientbkg', 'assets/imgs/ClientUI.png');
    l.image('blueorb', 'assets/imgs/blueorb.png');
    l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
    l.audio('warning', 'assets/snds/fx/strokeup.mp3');
    l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function RacingInput(sys) {
    function makeButtonSet(baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
    }
    function addActionSet(setToolTip) {
        var o = [];
        for (var j = 0; j < sys.gameActions.length; j++)
            o.push(new ActionEntry(sys.gameActions[j].name, ""));
        return makeButtonSet(40, 80, 70, 0, 18, '#F00000', '#200000', setToolTip, function (v) { }, o);
    }
    function addActions(srcChoices, setToolTip) {
        var choiceLeft = 50, choiceUp = 118;
        var curCollection = 0;
        function add(choices) {
            var id = curCollection;
            curCollection++;
            return makeButtonSet(choiceLeft, choiceUp, 0, 20, 14, '#F00000', '#200000', setToolTip, function (v) { return srcChoices[id] = v; }, choices);
        }
        function st(name, tip) { return new ActionEntry(name, tip); }
        var o = [];
        for (var j = 0; j < sys.gameActions.length; j++) {
            var p = [];
            for (var k = 0; k < sys.gameActions[j].choices.length; k++) {
                var r = sys.gameActions[j].choices[k];
                p.push(st(r.name, r.tip));
            }
            o.push(add(p));
        }
        return o;
    }
    var timer = 0;
    var roundNumber = 1;
    var choices = [1, 1, 1, 1, 1, 1];
    var endOfRoundSound = sys.g.add.audio('endOfRound', 1, false);
    var warningSound = sys.g.add.audio('warning', 1, false);
    sys.messages = new APGSubgameMessageHandler({
        timeUpdate: function (round, time) {
            timer = time;
            roundNumber = round;
            if (timer < 6) {
                warningSound.play('', 0, 1 - (timer * 15) / 100);
            }
        },
        clientUpdate: function () { },
        startSubmitInput: function () {
            ShowSubmitted(sys, function () { return roundNumber; });
            endOfRoundSound.play();
        },
        getParmCount: function () { return choices.length; },
        getParm: function (id) { return choices[id]; }
    });
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, choiceLeft = 50, choiceUp = 118, tabButtons, choiceButtons, bkg = new Image();
    bkg.src = 'ClientUI.png';
    var labelColor = '#608080';
    var roundLabel, toolTipLabel, nextChoiceLabel;
    var lastRoundUpdate = 0;
    new Ent(sys.w, 0, 0, 'clientbkg', {
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
    roundLabel = new EntTx(sys.w, 120, 30, "Actions for Round ", { font: '28px Calbrini', fill: '#688' });
    toolTipLabel = new EntTx(sys.w, choiceLeft + 80, 118, "ToolTip", { font: '10px Calbrini', fill: '#688' });
    nextChoiceLabel = new EntTx(sys.w, 120, 260, "Actions Selected in", { font: '14px Calbrini', fill: '#688' });
    tabButtons = addActionSet(setToolTip);
    choiceButtons = addActions(choices, setToolTip);
}
var secondsPerChoice = 60;
var ticksPerSecond = 60;
var actionList = 'TestActions.json';
var IRCWriteDelayInSeconds = 1;
var maxBufferedIRCWrites = 5;
var debugErrorsAsAlerts = false;
var debugPrintMessages = false;
var debugLogIncomingIRCChat = false;
var debugLogOutgoingIRCChat = false;
var APGSubgameMessageHandler = (function () {
    function APGSubgameMessageHandler(fields) {
        this.onJoin = function () { return false; };
        this.timeUpdate = function (round, time) { };
        this.clientUpdate = function () { };
        this.startInputSubmission = function () { };
        this.getParmCount = function () { return 0; };
        this.getParm = function (id) { return 0; };
        if (fields)
            Object.assign(this, fields);
    }
    return APGSubgameMessageHandler;
}());
addCache(function (l) {
    l.image('clientbkg', 'assets/imgs/ClientUI.png');
    l.image('blueorb', 'assets/imgs/blueorb.png');
    l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
    l.audio('warning', 'assets/snds/fx/strokeup.mp3');
    l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function MainPlayerInput(sys) {
    function makeButtonSet(baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        return new ButtonCollection(sys, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit);
    }
    function addActionSet(setToolTip) {
        var o = [];
        for (var j = 0; j < sys.gameActions.length; j++)
            o.push(new ActionEntry(sys.gameActions[j].name, ""));
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
        for (var j = 0; j < sys.gameActions.length; j++) {
            var p = [];
            for (var k = 0; k < sys.gameActions[j].choices.length; k++) {
                var r = sys.gameActions[j].choices[k];
                p.push(st(r.name, r.tip));
            }
            o.push(add(p));
        }
        return o;
    }
    var timer = 0;
    var roundNumber = 1;
    var choices = [1, 1, 1, 1, 1, 1];
    var endOfRoundSound = sys.g.add.audio('endOfRound', 1, false);
    var warningSound = sys.g.add.audio('warning', 1, false);
    sys.messages = new APGSubgameMessageHandler({
        timeUpdate: function (round, time) {
            timer = time;
            roundNumber = round;
            if (timer < 6) {
                warningSound.play('', 0, 1 - (timer * 15) / 100);
            }
        },
        clientUpdate: function () { },
        startSubmitInput: function () {
            ShowSubmitted(sys, function () { return roundNumber; });
            endOfRoundSound.play();
        },
        getParmCount: function () { return choices.length; },
        getParm: function (id) { return choices[id]; }
    });
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, choiceLeft = 50, choiceUp = 118, tabButtons, choiceButtons, bkg = new Image();
    bkg.src = 'ClientUI.png';
    var labelColor = '#608080';
    var roundLabel, toolTipLabel, nextChoiceLabel;
    var lastRoundUpdate = 0;
    new Ent(sys.w, 0, 0, 'clientbkg', {
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
    roundLabel = new EntTx(sys.w, 120, 30, "Actions for Round ", { font: '28px Calbrini', fill: '#688' });
    toolTipLabel = new EntTx(sys.w, choiceLeft + 80, 118, "ToolTip", { font: '10px Calbrini', fill: '#688' });
    nextChoiceLabel = new EntTx(sys.w, 120, 260, "Actions Selected in", { font: '14px Calbrini', fill: '#688' });
    tabButtons = addActionSet(setToolTip);
    choiceButtons = addActions(choices, setToolTip);
}
addCache(function (l) {
    l.image('clientbkg', 'assets/imgs/ClientUI.png');
    l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});
function ShowSubmitted(sys, getRoundNumber) {
    var inputUsed = false;
    var clickSound = sys.g.add.audio('clickThrough', 1, false);
    sys.messages = new APGSubgameMessageHandler({});
    new Ent(sys.w, 0, 0, 'clientbkg', {
        upd: function (e) {
            if (sys.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(sys);
                clickSound.play();
            }
        }
    });
    new EntTx(sys.w, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Arial', fill: '#222' });
}
addCache(function (l) {
    l.image('clientbkg', 'assets/imgs/ClientUI.png');
    l.audio('endOfRound', 'assets/snds/fx/strokeup4.mp3');
});
function WaitingForJoinAcknowledement(sys) {
    var endOfRoundSound = sys.g.add.audio('endOfRound', 1, false);
    var endSubgame = false, timeOut = 0;
    sys.messages = new APGSubgameMessageHandler({
        onJoin: function () {
            endSubgame = true;
            endOfRoundSound.play();
            MainPlayerInput(sys);
            return true;
        }
    });
    new Ent(sys.w, 60, 0, 'clientbkg', {
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
    new EntTx(sys.w, 160, 50 + 20, "Waiting to Connect...", { font: '16px Arial', fill: '#222' }, {
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
addCache(function (l) {
    l.image('clientbkg', 'assets/imgs/ClientUI.png');
    l.audio('clickThrough', 'assets/snds/fx/strokeup2.mp3');
});
function WaitingToJoin(sys) {
    var clickSound = sys.g.add.audio('clickThrough', 1, false);
    sys.messages = new APGSubgameMessageHandler({});
    var inputUsed = false, endSubgame = false;
    new Ent(sys.g.world, 0, 0, 'clientbkg', {
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
                sys.network.join();
                endSubgame = true;
            }
        }
    });
    var tc = 0, textColor = { font: '16px Arial', fill: '#222' };
    new EntTx(sys.w, 60, 50 + 20, "Click to Join Game!", textColor, {
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