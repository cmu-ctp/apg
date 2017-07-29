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
function ButtonCache(c) {
    c.images('cartoongame/imgs', ['blueorb.png', 'buttontest.png', 'middle.png', 'activate.png', 'assist.png', 'bag1.png', 'bag2.png', 'bag3.png', 'build.png', 'defend.png', 'harvest.png', 'heal.png', 'leftarrow.png', 'moveback.png', 'movein.png', 'rightarrow.png', 'accept.png', 'redo.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
}
var ActionEntry = (function () {
    function ActionEntry(label, tooltip, pic, x, y) {
        this.label = label;
        this.tooltip = tooltip;
        this.pic = pic;
        this.x = x;
        this.y = y;
    }
    return ActionEntry;
}());
var ButtonCollection = (function () {
    function ButtonCollection(w, apg, size, setToolTip, setOption, buttonsInit) {
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var big = this;
        this.selected = -1;
        this.update = function (active) {
            updateActive = active;
        };
        var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
        var fontName = "Caveat Brush";
        var highlightTime = 0;
        function addOption(id, str, x, y, toolTip, pic) {
            var highlighted = false, highlightVertical = 56, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + 56, y1 = y - highlightVertical / 2 + 8, y2 = y + highlightVertical / 2 + 8, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var bkg = new ent(w, x, y - 20, 'cartoongame/imgs/' + pic, {});
            if (str === '')
                bkg.visible = false;
            new enttx(w, 60, 50 + 20, "", {}, {
                upd: function (e) {
                    mul = mul * (1 - spd) + spd * (updateActive ? 1 : 0);
                    e.x = x + 10 + 10 * 1.5 * (1 - mul);
                    e.y = y + 35 - 14 * 1.5 + 20 * 1.5 * (1 - mul);
                    e.alpha = mul;
                    e.scx = e.scy = size * mul * .05;
                    bkg.scalex = bkg.scaley = mul;
                    if (e.alpha < .01) {
                        if (e.visible == true)
                            e.visible = false;
                        return;
                    }
                    if (e.visible == false)
                        e.visible = true;
                    lastHighlight = highlighted;
                    if (apg.g.input.activePointer.isDown == false)
                        inputUsed = false;
                    if (!updateActive) {
                        return;
                    }
                    highlighted = true;
                    if (apg.g.input.x < x1 || apg.g.input.x > x2 || apg.g.input.y < y1 || apg.g.input.y > y2 || str == "")
                        highlighted = false;
                    if (highlighted) {
                        setToolTip(toolTip);
                        highlightTime = 2;
                        fx1 = x1;
                        fx2 = x2;
                        fy1 = y1;
                        fy2 = y2;
                    }
                    if (highlighted && (sysTick - lastMouseUpTime < 5) && !apg.g.input.activePointer.isDown && inputUsed == false) {
                        lastMouseUpTime = -1000;
                        clickSound.play();
                        big.selected = id;
                        big.selectedName = str;
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
            addOption(k, b.label, b.x, b.y, b.tooltip, b.pic + '.png');
        }
        var sysTick = 0;
        var lastMouseUpTime = -1000;
        var mouseDown = false;
        function addSelector() {
            var goalx = 0, goaly = 0, mul = 1, tick = Math.random() * Math.PI * 2, tickScale = Math.random() * .8 + .4;
            new ent(w, 50, 50, 'cartoongame/imgs/blueorb.png', { scalex: .3, scaley: .3,
                upd: function (e) {
                    e.x = goalx;
                    e.y = goaly;
                    e.alpha = mul * (.3 + .1 * Math.cos(tick * tickScale));
                    tick += .05;
                    mul = mul * .8 + .2 * (updateActive ? 1 : 0);
                    if (updateActive) {
                        sysTick++;
                        if (apg.g.input.activePointer.isDown == false) {
                            if (mouseDown == true) {
                                lastMouseUpTime = sysTick;
                            }
                            mouseDown = false;
                        }
                        else {
                            mouseDown = true;
                        }
                    }
                    else {
                        lastMouseUpTime = -1000;
                        mouseDown = false;
                    }
                    if (e.alpha < .01) {
                        if (e.visible)
                            e.visible = false;
                    }
                    if (!e.visible)
                        e.visible = true;
                    highlightTime--;
                    if (highlightTime < 0)
                        e.visible = false;
                    if (mul < .05)
                        return;
                    goalx = goalx * .6 + .4 * ((fx1 + fx2) / 2 - 16);
                    goaly = goaly * .6 + .4 * ((fy1 + fy2) / 2 - 12);
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
    ent.prototype.update = function () {
        if (this.upd != null)
            this.upd(this);
    };
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
    Object.defineProperty(ent.prototype, "color", {
        set: function (value) { this.tint = value; },
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
    Object.defineProperty(enttx.prototype, "tx", {
        set: function (value) { this.text = value; },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(enttx.prototype, "verticalSpacing", {
        set: function (value) { this.lineSpacing = value; },
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
    c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png']);
    c.images('cartoongame/imgs/buildings', ['building1.png', 'building2.png', 'building3.png', 'building4.png', 'building5.png', 'building6.png']);
    c.images('cartoongame/imgs/heads', ['headbig1.png', 'headbig2.png', 'headbig3.png', 'headbig4.png', 'headbig5.png', 'headbig6.png', 'headbig7.png', 'headbig8.png', 'headbig9.png', 'headbig10.png', 'headbig11.png', 'headbig12.png', 'headbig13.png', 'headbig14.png', 'headbig15.png', 'headbig16.png', 'headbig17.png', 'headbig18.png', 'headbig19.png', 'headbig20.png']);
    c.images('cartoongame/imgs/sheads', ['shead1.png', 'shead2.png', 'shead3.png', 'shead4.png', 'shead5.png', 'shead6.png', 'shead7.png', 'shead8.png', 'shead9.png', 'shead10.png', 'shead11.png', 'shead12.png', 'shead13.png', 'shead14.png', 'shead15.png', 'shead16.png', 'shead17.png', 'shead18.png', 'shead19.png', 'shead20.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
    c.json(['cartoongame/json/TestActions.json']);
    WaitingToJoinCache(c);
    JoinAcknowledgeCache(c);
    ShowSubmittedCache(c);
    ButtonCache(c);
}
function MainInputTestSequence(apg) {
    apg.ClearLocalMessages();
    var roundLength = 15;
    for (var j = 1; j <= 10; j++) {
        var roundTimeOffset = (j - 1) * roundLength;
        for (var k = 0; k < roundLength + 5; k += 5)
            apg.WriteLocalAsServer(roundTimeOffset + k, "time", { round: j + 1, time: roundLength - k });
        apg.WriteLocalAsServer(roundTimeOffset + roundLength, "submit", { choices: [] });
        apg.WriteLocalAsServer(roundTimeOffset + roundLength + .5, "pl", {
            nm: apg.playerName, st: [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 10) + 1, -1, -1],
            rs: [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1]
        });
        apg.WriteLocalAsServer(roundTimeOffset + roundLength + 1, "startround", { choices: [] });
    }
}
function MainPlayerInput(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/TestActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var headNum = id + 1 + ((team == 2) ? 10 : 0);
    var nameColor = cols[id % 10];
    var bodyColor = cols2[id % 10];
    var actionChoices = [0, 0, 0];
    function addActions(srcChoices, setToolTip) {
        var curCollection = 0;
        function add(choiceSet) {
            var id = curCollection;
            curCollection++;
            return new ButtonCollection(w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
        }
        var o = [];
        for (var j = 0; j < actions.length; j++) {
            var p = [];
            for (var k2 = 0; k2 < actions[j].choices.length; k2++) {
                var k = k2;
                var r = actions[j].choices[k];
                var xv = r.x;
                if (j == 0 && team == 2)
                    xv = 320 - xv;
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y));
            }
            o.push(add(p));
        }
        return o;
    }
    var timer = 0;
    var roundNumber = 2;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = { nm: "", st: [10, 10, 0, 0], rs: [0, 0, 0, 0, 0, 0, 0, 0] };
    var locationChoice = -1;
    var stanceChoice = -1;
    function reset() {
        choiceButtons[0].selected = locationChoice = -1;
        choiceButtons[1].selected = stanceChoice = -1;
        choiceButtons[2].selected = -1;
        choiceButtons[3].selected = -1;
        choiceButtons[4].selected = -1;
        selected = 0;
        actionChoices = [-1, -1, -1];
        choices[0] = -1;
        choices[1] = -1;
        actionLabel.tx = "Action:";
        actionLabels[0].tx = "Location:";
        actionLabels[1].tx = "Row:";
        for (var j = 0; j < 1; j++) {
            actionLabels[j + 2].tx = "Action: ";
        }
    }
    apg.ResetServerMessageRegistry()
        .Register("startround", function (p) {
        accepted = false;
        endOfRoundSound.play();
    })
        .Register("time", function (p) {
        timer = p.time;
        console.log("time " + timer);
        roundNumber = p.round;
        if (timer < 6 && !accepted) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Register("pl", function (p) {
        if (p.nm != apg.playerName)
            return;
        myStats = p;
        if (p.st[3] != -1)
            lastStance = p.st[3];
        if (p.st[2] != -1)
            lastLocationPos = p.st[2];
        stanceBody.y = 160 + lastStance * 64;
        stanceHead.y = 146 + lastStance * 64;
        locBody.x = 330 + 64 * lastLocationPos;
        locHead.x = 320 + 64 * lastLocationPos;
        playerLabel.x = 320 + 64 * lastLocationPos;
        nstatLabels[0].tx = "" + p.st[0];
        nstatLabels[1].tx = "" + p.rs[0];
        nstatLabels[2].tx = "" + p.rs[1];
        nstatLabels[3].tx = "" + p.rs[2];
        nstatLabels[4].tx = "" + p.rs[3];
        nstatLabels2[0].tx = "" + p.st[1];
        nstatLabels2[1].tx = "" + p.rs[4];
        nstatLabels2[2].tx = "" + p.rs[5];
        nstatLabels2[3].tx = "" + p.rs[6];
        nstatLabels2[4].tx = "" + p.rs[7];
        reset();
    })
        .Register("submit", function (p) {
        for (var k = 0; k < 3; k++)
            choices[k + 2] = actionChoices[k];
        if (choices[0] == -1)
            choices[0] = Math.floor(Math.random() * 6);
        if (choices[1] == -1)
            choices[1] = Math.floor(Math.random() * 3);
        if (choices[2] == -1)
            choices[2] = Math.floor(Math.random() * 6);
        if (choices[3] == -1)
            choices[3] = Math.floor(Math.random() * 6);
        if (choices[4] == -1)
            choices[4] = Math.floor(Math.random() * 6);
        if (accepted == false) {
            accepted = true;
            endOfRoundSound.play();
        }
        lastLocationPos = choices[0];
        lastStance = choices[1];
        apg.WriteToServer("upd", { choices: choices });
    });
    var toolTip = "";
    function setToolTip(str) { toolTip = str; }
    var tick = 0, tabButtons, choiceButtons, statLabels, statLabels2, nstatLabels, nstatLabels2, actionLabels;
    var stanceBody, stanceHead, locBody, locHead;
    var actionLabel, playerLabel;
    var lastRoundUpdate = 0;
    var lastLocationPos = (team == 2) ? (5 - id % 6) : id % 6;
    var lastStance = id < 6 ? 1 : 0;
    var headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var selected = 0;
    var accepted = false;
    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
        upd: function (e) {
            if (accepted) {
                w.y = w.y * .9 + .1 * 500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            if (choiceButtons[0].selected != -1) {
                if (locationChoice == -1) {
                    var labels = ['Dance Club', 'Fishing Pond', 'Bed and Breakfast', 'Commuter Airport', 'Day Spa', 'Office Park'];
                    actionLabels[0].tx = "Location: " + labels[choiceButtons[0].selected];
                    ;
                }
                locationChoice = choiceButtons[0].selected;
            }
            if (choiceButtons[1].selected != -1) {
                if (stanceChoice == -1) {
                    var labels = ['Back Row', 'Middle Row', 'Front Row'];
                    actionLabels[1].tx = "Row: " + labels[choiceButtons[1].selected];
                }
                stanceChoice = choiceButtons[1].selected;
            }
            choiceButtons[0].update(locationChoice == -1);
            choiceButtons[1].update(stanceChoice == -1);
            choiceButtons[2].update(selected < 1);
            choiceButtons[3].update(true);
            choiceButtons[4].update(locationChoice > -1 && stanceChoice > -1 && selected >= 1);
            if (choiceButtons[3].selected == 0) {
                reset();
            }
            if (choiceButtons[4].selected != -1) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[4].selected = -1;
            }
            if (choiceButtons[2].selected != -1) {
                actionChoices[selected] = choiceButtons[2].selected;
                if (selected < 1) {
                    actionLabels[selected + 2].tx = "Action: " + choiceButtons[2].selectedName;
                }
                actionLabel.tx = "";
                choiceButtons[2].selected = -1;
                selected++;
            }
        }
    });
    var roundColors = ['#468', '#846', '#684'];
    new enttx(w, 260, 25, "Action for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, 420, 25, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    new ent(w, 70, 10, headPic);
    new enttx(w, 260, 140, "ToolTip", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 440 }, { upd: function (e) { e.text = toolTip; } });
    new enttx(w, 650, 354, "", { font: '40px ' + fontName, fill: '#688' }, {
        upd: function (e) {
            e.text = "" + timer;
            e.fill = roundColors[(roundNumber - 1) % roundColors.length];
        }
    });
    choiceButtons = addActions(choices, setToolTip);
    new enttx(w, 250, 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (toolTip == "") ? false : true; } });
    actionLabel = new enttx(w, 40, 110, "Action", { font: '24px ' + fontName, fill: '#A00' });
    new enttx(w, 700, 110, "Row", { font: '24px ' + fontName, fill: '#A00' }, { upd: function (e) { e.visible = choiceButtons[1].selected == -1; } });
    stanceBody = new ent(w, 740, 160 + lastStance * 64, bodyPic, { scalex: 1, scaley: 1, color: bodyColor, upd: function (e) { e.visible = choiceButtons[1].selected == -1; } });
    stanceHead = new ent(w, 731, 146 + lastStance * 64, sheadPic, { upd: function (e) { e.visible = choiceButtons[1].selected == -1; } });
    new enttx(w, 305, 260, "Location", { font: '24px ' + fontName, fill: '#A00' }, { upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    new ent(w, 270, 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png', { scalex: 1, scaley: 1, upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    new ent(w, 680, 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png', { scalex: 1, scaley: 1, upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    locBody = new ent(w, 330 + 64 * lastLocationPos, 16 + 285, bodyPic, { scalex: 1, scaley: 1, color: bodyColor, upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    locHead = new ent(w, 320 + 64 * lastLocationPos, 16 + 271, sheadPic, { upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    playerLabel = new enttx(w, 320 + 64 * lastLocationPos, 16 + 320, apg.playerName, { font: '12px ' + fontName, fill: nameColor }, { upd: function (e) { e.visible = choiceButtons[0].selected == -1; } });
    if (apg.allowFullScreen) {
        new enttx(w, 100, -400, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });
    }
    function category(msg, x, y) {
        new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' });
    }
    function inCategory(x, y, add, labels) {
        var labelEnts = [];
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new enttx(w, x, y + k * add, labels[k], { font: '14px ' + fontName, fill: '#211' }));
        }
        return labelEnts;
    }
    category("Stats", 144, 336);
    statLabels = inCategory(154, 360, 13, ["Health: ", "Wire: ", "Stone: ", "Wood: ", "Oil: "]);
    statLabels2 = inCategory(254, 360, 13, ["Stamina: ", "Plastic: ", "Fur: ", "Metal: ", "Rubber: "]);
    nstatLabels = inCategory(214, 360, 13, ["5", "0", "0", "0", "0"]);
    nstatLabels2 = inCategory(314, 360, 13, ["10", "0", "0", "0", "0"]);
    category("Choices", 370, 336);
    actionLabels = inCategory(380, 360, 13, ["Location:", "Row:", "Action:"]);
    if (apg.networkTestSequence)
        MainInputTestSequence(apg);
}
function ShowSubmittedCache(c) {
    c.images('cartoongame/imgs', ['ClientUI3.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function ShowSubmitted(apg, playerID, team, getRoundNumber) {
    var inputUsed = false;
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
    apg.ResetServerMessageRegistry();
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        upd: function (e) {
            if (apg.g.input.activePointer.isDown && !inputUsed) {
                inputUsed = true;
                MainPlayerInput(apg, playerID, team);
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
function WaitingForJoinAcknowledgeTestSequence(apg) {
    apg.ClearLocalMessages();
    apg.WriteLocalAsServer(.1, "join", { name: apg.playerName, started: true, playerID: 2, team: 1 });
}
function WaitingForJoinAcknowledement(apg) {
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0, retry = 0;
    var playerID = -1, team = -1, connected = false;
    apg.ResetServerMessageRegistry()
        .Register("join", function (p) {
        if (p.name != apg.playerName)
            return;
        if (p.started) {
            endSubgame = true;
            endOfRoundSound.play();
            MainPlayerInput(apg, p.playerID, p.team);
        }
        else {
            connected = true;
            playerID = p.playerID;
            team = p.team;
            msg.tx = "Connected!  Waiting for streamer to start playing!";
        }
    })
        .Register("start", function (p) {
        endSubgame = true;
        endOfRoundSound.play();
        MainPlayerInput(apg, playerID, team);
    });
    if (apg.networkTestSequence) {
        WaitingForJoinAcknowledgeTestSequence(apg);
    }
    new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', {
        alpha: 0,
        upd: function (e) {
            if (!connected) {
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
    var msg = new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, {
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
function WaitingToJoinTestSequence(apg) {
    apg.ClearLocalMessages();
}
function WaitingToJoin(apg, previousMessage) {
    if (previousMessage === void 0) { previousMessage = ""; }
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
    apg.ResetServerMessageRegistry();
    var inputUsed = false, endSubgame = false;
    var curRound = { round: 1, time: 45 };
    apg.ResetServerMessageRegistry()
        .Register("time", function (p) {
    })
        .Register("pl", function (p) {
    });
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
    new enttx(apg.g.world, 140, 60, "Thanks for helping with the first Gods of Socks and Spoons game test!", textColor2, {
        upd: function (e) {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -50;
                if (e.x < -47)
                    e.destroy(true);
                return;
            }
        }
    });
    new enttx(apg.g.world, 140, 160, "Here's how you'll play - each round (about a minute long), pick where to move and 3 actions to perform.  While you do, your choices from the previous round will be happening in the streamer's video.  Try to stay alive, build your city, and help your team!  (This demo is incomplete, so most actions don't do anything yet)", textColor2, {
        upd: function (e) {
            if (endSubgame) {
                e.x = e.x * .7 + .3 * -50;
                if (e.x < -47)
                    e.destroy(true);
                return;
            }
        }
    });
    new enttx(apg.g.world, 140, 380, "Tap or click to Connect to the Streamer's Game!", textColor, {
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
    if (apg.networkTestSequence)
        WaitingToJoinTestSequence(apg);
}
//# sourceMappingURL=CartoonGame.js.map