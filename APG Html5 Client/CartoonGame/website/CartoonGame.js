var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function ButtonCache(c) {
    c.images('cartoongame/imgs', ['blueorb.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
}
var ActionEntry = (function () {
    function ActionEntry(label, tooltip) {
        this.label = label;
        this.tooltip = tooltip;
    }
    return ActionEntry;
}());
var ButtonCollection = (function () {
    function ButtonCollection(apg, baseX, baseY, xAdd, yAdd, size, highlightColor, baseColor, setToolTip, setOption, buttonsInit) {
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var w = apg.g.world;
        var big = this;
        this.selected = 0;
        this.update = function (active) {
            updateActive = active;
        };
        var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
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
            new enttx(w, 60, 50 + 20, str, textColor, {
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
            new ent(w, 50, 50, 'cartoongame/imgs/blueorb.png', { scalex: .24, scaley: .24,
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
function CartoonAssetCache(c) {
    c.images('cartoongame/imgs', ['ClientUI4.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
    c.json(['cartoongame/json/TestActions.json']);
    WaitingToJoinCache(c);
    JoinAcknowledgeCache(c);
    ShowSubmittedCache(c);
    ButtonCache(c);
}
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
    apg.ResetServerMessageRegistry()
        .Register("time", function (p) {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Register("pl", function (p) {
        if (p.nm != apg.playerName)
            return;
        myStats = p;
    })
        .Register("submit", function (p) {
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
function ShowSubmittedCache(c) {
    c.images('cartoongame/imgs', ['ClientUI3.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function ShowSubmitted(apg, getRoundNumber) {
    var inputUsed = false;
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
    apg.ResetServerMessageRegistry();
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        upd: function (e) {
            if (apg.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(apg);
                clickSound.play();
            }
        }
    });
    new enttx(apg.g.world, 60, 50 + 20, "Chosen For Round " + getRoundNumber() + ":", { font: '16px Caveat Brush', fill: '#222' });
}
function JoinAcknowledgeCache(c) {
    c.images('cartoongame/imgs', ['ClientUI3.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup4.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function WaitingForJoinAcknowledement(apg) {
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0, retry = 0;
    apg.ResetServerMessageRegistry()
        .Register("join", function (p) {
        if (p.name != apg.playerName)
            return;
        endSubgame = true;
        endOfRoundSound.play();
        MainPlayerInput(apg);
    });
    new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', {
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
    new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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
function WaitingToJoinCache(c) {
    c.images('cartoongame/imgs', ['ClientUI3.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function WaitingToJoin(apg, previousMessage) {
    if (previousMessage === void 0) { previousMessage = ""; }
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', 1, false);
    apg.ResetServerMessageRegistry();
    var inputUsed = false, endSubgame = false;
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
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
        new enttx(apg.g.world, 160, 2 * (50 + 20) + 60, previousMessage, textColor2, {
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
    new enttx(apg.g.world, 140, 2 * (50 + 20) - 20, "Tap or click to Connect to the Streamer's Game!", textColor, {
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
//# sourceMappingURL=CartoonGame.js.map