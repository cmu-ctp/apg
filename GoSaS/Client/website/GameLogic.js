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
var APGHelper = (function () {
    function APGHelper() {
    }
    APGHelper.ScreenX = function (val) { return val / 10000 * 1024; };
    APGHelper.ScreenY = function (val) { return (1 - val / 10000) * (768 - 96 - 96); };
    return APGHelper;
}());
function ButtonCache(c) {
    c.images('cartoongame/imgs', ['blueorb.png', 'buttontest.png', 'middle.png', 'activate.png', 'assist.png', 'bag1.png', 'bag2.png', 'bag3.png', 'build.png', 'defend.png', 'harvest.png', 'heal.png', 'leftarrow.png', 'moveback.png', 'movein.png', 'rightarrow.png', 'accept.png', 'redo.png', 'strikeback.png', 'slash.png', 'recklessability.png', 'hudselect.png']);
    c.images('cartoongame/imgs/items', ['ball.png', 'baseballbat.png', 'bomb.png', 'broom.png', 'clock.png', 'computer.png', 'hammer.png', 'helmet.png', 'mask.png', 'mask2.png', 'rocket.png', 'scissors.png', 'shield.png', 'teeth.png']);
    c.images('cartoongame/imgs/abilities', ['biplane.png', 'blimp.png', 'broccoli.png', 'cow.png', 'policecar.png', 'policecopter.png', 'fairyability.png', 'fish.png', 'flowers.png', 'meds.png', 'sun.png', 'turtles.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
}
var ActionEntry = (function () {
    function ActionEntry(label, tooltip, pic, x, y, specialID) {
        this.specialID = 0;
        this.label = label;
        this.tooltip = tooltip;
        this.pic = pic;
        this.x = x;
        this.y = y;
        this.specialID = specialID;
    }
    return ActionEntry;
}());
var ButtonCollection = (function () {
    function ButtonCollection(isActions, w, apg, size, setToolTip, setOption, buttonsInit) {
        this.item1 = -2;
        this.item2 = -2;
        this.item3 = -2;
        this.building = -1;
        this.buttons = [];
        this.itemPics = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
        this.ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
        this.ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
        this.building1Active = true;
        this.building2Active = true;
        var fx1 = 0, fx2 = 0, fy1 = 0, fy2 = 0, updateActive = false;
        var big = this;
        this.selected = -1;
        this.update = function (active) { updateActive = active; };
        var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
        var fontName = "Caveat Brush";
        var highlightTime = 0;
        var selx = -150;
        var sely = -150;
        var buts = this.buttons;
        var that = this;
        function addOption(id, str, x, y, toolTip, pic, specialID) {
            var highlighted = false, highlightVertical = 56, highlightHorizontal = size * 16 / 40, x1 = x, x2 = x + 56, y1 = y - highlightVertical / 2 + 8, y2 = y + highlightVertical / 2 + 8, mul = 1, spd = .07 + .26 * Math.random(), lastHighlight = false, inputUsed = false;
            if (id == 0) {
                fx1 = x1;
                fx2 = x2;
                fy1 = y1;
                fy2 = y2;
            }
            var bkg = new ent(w, x, y - 20, 'cartoongame/imgs/' + pic, {});
            buts.push(bkg);
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
                    if (that.selected == id) {
                        selx = (x1 + x2) / 2 - 32;
                        sely = (y1 + y2) / 2 - 32;
                    }
                    if (isActions && id == 4 && that.building1Active == false)
                        return;
                    if (isActions && id == 5 && that.building2Active == false)
                        return;
                    if (isActions && id == 6 && that.item1 == -1)
                        return;
                    if (isActions && id == 7 && that.item2 == -1)
                        return;
                    if (isActions && id == 8 && that.item3 == -1)
                        return;
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
            addOption(k, b.label, b.x, b.y, b.tooltip, b.pic + '.png', b.specialID);
        }
        var seltick = 0;
        var selected = new ent(w, -150, -150, 'cartoongame/imgs/hudselect.png', { alpha: .3, upd: function (e) { e.x = e.x * .8 + .2 * selx; e.y = e.y * .8 + .2 * sely; seltick++; e.visible = (seltick % 120 > 10) ? true : false; } });
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
                } });
        }
        addSelector();
    }
    ButtonCollection.prototype.setParms = function (building, item1, item2, item3, resources, forceReset) {
        var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
        var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
            [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
        if (this.item1 != item1) {
            this.item1 = item1;
            if (item1 == -1) {
                this.buttons[6].alpha = .2;
                this.buttons[6].tex = 'cartoongame/imgs/bag1.png';
            }
            else {
                this.buttons[6].alpha = 1;
                this.buttons[6].tex = 'cartoongame/imgs/items/' + this.itemPics[item1] + '.png';
            }
        }
        if (this.item2 != item2) {
            this.item2 = item2;
            if (item2 == -1) {
                this.buttons[7].alpha = .2;
                this.buttons[7].tex = 'cartoongame/imgs/bag2.png';
            }
            else {
                this.buttons[7].alpha = 1;
                this.buttons[7].tex = 'cartoongame/imgs/items/' + this.itemPics[item2] + '.png';
            }
        }
        if (this.item3 != item3) {
            this.item3 = item3;
            if (item3 == -1) {
                this.buttons[8].alpha = .2;
                this.buttons[8].tex = 'cartoongame/imgs/bag3.png';
            }
            else {
                this.buttons[8].alpha = 1;
                this.buttons[8].tex = 'cartoongame/imgs/items/' + this.itemPics[item3] + '.png';
            }
        }
        if (this.building != building || forceReset) {
            this.building = building;
            this.buttons[4].tex = 'cartoongame/imgs/abilities/' + this.ability1Pics[building] + '.png';
            this.buttons[5].tex = 'cartoongame/imgs/abilities/' + this.ability2Pics[building] + '.png';
            this.building1Active = (resources[firstAbilityCosts[building][0]] == 0 || resources[firstAbilityCosts[building][1]] == 0) ? false : true;
            this.building2Active = (resources[secondAbilityCosts[building][0]] == 0 || resources[secondAbilityCosts[building][1]] == 0 || resources[secondAbilityCosts[building][2]] == 0) ? false : true;
            this.buttons[4].alpha = this.building1Active ? 1 : .2;
            this.buttons[5].alpha = this.building2Active ? 1 : .2;
        }
    };
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
        _this.use = null;
        _this.visible = true;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
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
    ent.clearAll = function () {
        for (var k = 0; k < ent.entList.length; k++) {
            if (ent.entList[k] != null)
                ent.entList[k].eliminate();
        }
        ent.entList = [];
    };
    ent.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    ent.prototype.eliminate = function () { ent.entList[this.id] = null; this.destroy(true); this.id = -1; };
    Object.defineProperty(ent.prototype, "color", {
        set: function (value) { this.tint = value; },
        enumerable: true,
        configurable: true
    });
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
    ent.entList = [];
    return ent;
}(Phaser.Sprite));
var enttx = (function (_super) {
    __extends(enttx, _super);
    function enttx(t, x, y, text, style, fields) {
        var _this = _super.call(this, t.game, x, y, text, style) || this;
        _this.upd = null;
        _this.use = null;
        _this.visible = true;
        if (fields)
            Object.assign(_this, fields);
        _this.exists = true;
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
    enttx.clearAll = function () {
        for (var k = 0; k < enttx.entList.length; k++) {
            if (enttx.entList[k] != null)
                enttx.entList[k].eliminate();
        }
        enttx.entList = [];
    };
    enttx.prototype.update = function () { if (this.upd != null)
        this.upd(this); };
    enttx.prototype.eliminate = function () { enttx.entList[this.id] = null; this.destroy(true); this.id = -1; };
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
    enttx.entList = [];
    return enttx;
}(Phaser.Text));
function CartoonAssetCache(c) {
    c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png', 'ClientUI11.png', 'tooltip2.png', 'test.png', 'whiteblock.png', 'arrowcap.png', 'arrowmid.png', 'arrowhead.png', 'hudselect.png']);
    c.images('cartoongame/imgs/buildings', ['building1.png', 'building2.png', 'building3.png', 'building4.png', 'building5.png', 'building6.png']);
    c.images('cartoongame/imgs/heads', ['headbig1.png', 'headbig2.png', 'headbig3.png', 'headbig4.png', 'headbig5.png', 'headbig6.png', 'headbig7.png', 'headbig8.png', 'headbig9.png', 'headbig10.png', 'headbig11.png', 'headbig12.png', 'headbig13.png', 'headbig14.png', 'headbig15.png', 'headbig16.png', 'headbig17.png', 'headbig18.png', 'headbig19.png', 'headbig20.png']);
    c.images('cartoongame/imgs/sheads', ['shead1.png', 'shead2.png', 'shead3.png', 'shead4.png', 'shead5.png', 'shead6.png', 'shead7.png', 'shead8.png', 'shead9.png', 'shead10.png', 'shead11.png', 'shead12.png', 'shead13.png', 'shead14.png', 'shead15.png', 'shead16.png', 'shead17.png', 'shead18.png', 'shead19.png', 'shead20.png']);
    c.images('cartoongame/imgs/resources', ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    c.images('cartoongame/imgs/sitems', ['stennisball.png', 'sbaseballbat.png', 'sbomb.png', 'sbroom.png', 'sclock.png', 'scomputer.png', 'shammer2.png', 'sknighthelmet.png', 'sscarymask.png', 'svacanteyemask.png', 'srocket2.png', 'sscissors2.png', 'sshield.png', 'sfalseteeth.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3', 'strokeup.mp3', 'strokeup4.mp3']);
    c.json(['cartoongame/json/TestActions.json', 'cartoongame/json/MoveActions.json', 'cartoongame/json/PlayActions.json']);
    WaitingToJoinCache(c);
    JoinAcknowledgeCache(c);
    ShowSubmittedCache(c);
    ButtonCache(c);
}
function MainInputTestSequence(apg) {
    var names = ["npc1", "npc2", "npc3", "npc4", "npc5", "npc6", "npc7", "npc8", "npc9", "npcr1", "npcr2", "npcr3", "npcr4", "npcr5", "npcr6", "npcr7", "npcr8", "npcr9"];
    apg.ClearLocalMessages();
    var roundLength = 7;
    function mr() { if (Math.random() < .6)
        return 0; return Math.floor(Math.random() * 3) + 1; }
    for (var j = 1; j <= 10; j++) {
        var roundTimeOffset = (j - 1) * roundLength;
        for (var k = 0; k < roundLength + 5; k += 5)
            apg.WriteLocalAsServer(roundTimeOffset + k, "time", { round: j + 1, time: roundLength - k });
        apg.WriteLocalAsServer(roundTimeOffset + roundLength, "submit", { choices: [] });
        apg.WriteLocalAsServer(roundTimeOffset + roundLength + .5, "pl", {
            nm: apg.playerName,
            st: [Math.floor(Math.random() * 10) + 1,
                Math.floor(Math.random() * 10) + 1,
                -1,
                -1,
                -1, -1, -1],
            rs: [mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr()]
        });
        for (var k = 0; k < names.length; k++) {
            var spot = (k < 9) ? Math.floor(k / 3) : 6 + Math.floor((k - 9) / 3);
            var row = (k < 9) ? k % 3 : (k - 9) % 3;
            apg.WriteLocalAsServer(roundTimeOffset + roundLength + .5, "pl", {
                nm: names[k],
                st: [Math.floor(Math.random() * 10) + 1, (k % 10), spot, row, Math.floor(Math.random() * 6), -1, -1],
                rs: [mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr(), mr()]
            });
        }
        apg.WriteLocalAsServer(roundTimeOffset + roundLength + 1, "startround", { team1Health: Math.floor(Math.random() * 30), team2Health: Math.floor(Math.random() * 30) });
    }
}
var Resource;
(function (Resource) {
    Resource[Resource["FrothyDrink"] = 0] = "FrothyDrink";
    Resource[Resource["Burger"] = 1] = "Burger";
    Resource[Resource["Beans"] = 2] = "Beans";
    Resource[Resource["Goo"] = 3] = "Goo";
    Resource[Resource["Acid"] = 4] = "Acid";
    Resource[Resource["Corn"] = 5] = "Corn";
    Resource[Resource["Bribe"] = 6] = "Bribe";
    Resource[Resource["Fries"] = 7] = "Fries";
    Resource[Resource["Taco"] = 8] = "Taco";
    Resource[Resource["TBone"] = 9] = "TBone";
})(Resource || (Resource = {}));
var ItemIds;
(function (ItemIds) {
    ItemIds[ItemIds["TennisBall"] = 0] = "TennisBall";
    ItemIds[ItemIds["Bomb"] = 1] = "Bomb";
    ItemIds[ItemIds["Hammer"] = 2] = "Hammer";
    ItemIds[ItemIds["ScaryMask"] = 3] = "ScaryMask";
    ItemIds[ItemIds["Rocket"] = 4] = "Rocket";
    ItemIds[ItemIds["Shield"] = 5] = "Shield";
})(ItemIds || (ItemIds = {}));
var Player = (function () {
    function Player(name, headNum) {
        this.healthStat = 10;
        this.items = [-1, -1, -1];
        this.resources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.name = name;
        this.headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
        this.smallHeadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    }
    ;
    return Player;
}());
var StatPanel = (function () {
    function StatPanel() {
    }
    return StatPanel;
}());
var ToolTip = (function () {
    function ToolTip() {
        this.toolTip = "";
        this.toolTime = 0;
    }
    return ToolTip;
}());
function addActions(apg, w, team, srcChoices, setToolTip) {
    var curCollection = 0;
    function add(isActions, choiceSet) {
        var id = curCollection;
        curCollection++;
        return new ButtonCollection(isActions, w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
    }
    var o = [];
    var actions = apg.JSONAssets['cartoongame/json/TestActions.json'];
    for (var j = 0; j < actions.length; j++) {
        var p = [];
        for (var k2 = 0; k2 < actions[j].choices.length; k2++) {
            var k = k2;
            var r = actions[j].choices[k];
            var xv = r.x;
            if (j == 0 && team == 2)
                xv = 320 - xv;
            p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));
        }
        o.push(add(actions[j].isActions, p));
    }
    return o;
}
function MakeToolTip(apg, w, player, fontName, tip, getBuilding) {
    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
    var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];
    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
    var itemHints = [
        "This button will use and use up an item... eventually.  But you need an item to use first!",
        "TENNIS BALL - Collect a handful of tennis balls and send them hurtling towards the enemy streamer in low, fast arcs.",
        "BOMB - Toss a bomb lazily at the enemy streamer.  It's tricky to hit with, but it will do a ton of damage.",
        "HAMMER - Take a handful of hammers and lob them in slow, high arcs up into the sky, possibly landing annoyingly on the head of the enemy streamer.",
        "SCARY MASK - Incomplete",
        "BOTTLE ROCKET - Grab a bunch of small rockets and throw them up at the enemy streamer.  They'll track the streamer for a while.",
        "SHIELD - Use the shield, and you can absorb one Retaliate without taking any damage.  Incomplete"
    ];
    var buildingAction1Hints = [
        "RUDE COWS - These nonplussed cows idly munch grass all day, the lazy things, and one thing leads to another.  Use this ability to steer their revolting emisions at the enemy streamer to gag and damage them.",
        "FLYING FISH - Use this, and cheerful fish will hop and glide out of the pond and sail through the skies.  A lucky streamer who grabs a fish whlie in mid flight will be healed a bit.",
        "FLOWER CANOPY - Collect the fertile haul of the greenhouse and loft it into the sky at the enemy streamer, damaging them.",
        "TIPSY BIPLANES - Call in a squadron of extremely irresponsible and entirely unpraiseworthy tipsy biplane pilots, and send them hurtling at the enemy streamer.",
        "POLICE HELICOPTERS - Call in a helpful troop of police helicopters to guard the local skies, blocking airborne attacks against your friends for a while.",
        "ANTIBIOTIC OVERPRESCRIPTION PARTY - Get the hospital to throw its doors open, recklessly overprescribing their antibiotics and tempting the rise of resistant superbugs.  But hey, it will heal up your friends in the process."
    ];
    var buildingAction2Hints = [
        "BROCCOLI HARVEST - Collect the bounteous harvest of the verdant farm lands and shower your friends in broccoli.  ",
        "TURTLE PARADE - Incomplete",
        "SHIMMERING SUN - Incomplete",
        "BLIMP - Let loose a mighty blimp.  It is hardy but full of useful items.  If the streamer blasts it several times, it will pop, raining down some handy tools.",
        "POLICE CARS - Incomplete",
        "DR. FAIRY, MD - Call in the doctor!  A friendly fairy will drift up into the sky, pulsing with healing energy, which will soothe your friendly streamer if they stay close to the pulses."
    ];
    var buildingHints = [
        "FARM - A rustic farm, soothing with pastoral delights.  These produce the finest in organic free-range broccoli and cage free cows.  Family owned for millenia, they're certified organic by the ATF.",
        "POND - A simple fishing hole of no note.  Local rumors say deep in the bowels of this very shallow pond drift massive tentacles, and burbling from the murk rises the odd sound Ph'nglui mglw'nafh....",
        "GREENHOUSE - A state of the art plant nurturing facility.  Contrary to claims spread by the valued team members of local fast food shops, this greenhouse only grows licit, nonmedical plants, man.",
        "AIRPORT - A cozy commuter airport with 3 gates.  A cinnamon bun shops sells icing blobs with bits of bun, security takes all of 3 minutes, and all flights require 3 connecting flights to get anywhere.",
        "POLICE STATION - The local constabulary.  They keep the peace, but owing to increasing civil forfeiture laws, the piece they keep is getting to be rather large.",
        "HOSPITAL - A local clinic."
    ];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    var ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
    var k;
    var tooltipSet = new Phaser.Group(apg.g);
    tooltipSet.x = 10;
    tooltipSet.y = 100;
    w.add(tooltipSet);
    var lastTip = "";
    var onTipTime = 0;
    new ent(tooltipSet, -320, -200, 'cartoongame/imgs/tooltip2.png', {
        upd: function (e) {
            tip.toolTime--;
            if (tip.toolTime == 0)
                tip.toolTip = "";
            if (tip.toolTip == lastTip && tip.toolTip != "") {
                onTipTime++;
            }
            else {
                onTipTime = 0;
                lastTip = tip.toolTip;
            }
            if (tip.toolTip == "" || onTipTime < 45)
                tooltipSet.alpha = tooltipSet.alpha * .7;
            else
                tooltipSet.alpha = tooltipSet.alpha * .85 + .15 * 1.;
        }
    });
    new enttx(tooltipSet, 0, 4, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (tip.toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(tooltipSet, 0, 150, "Cost", { font: '18px ' + fontName, fill: '#433' }, { visible: false });
    var resources = [];
    for (k = 0; k < 3; k++)
        resources.push(new ent(tooltipSet, 32 * k, 170, 'cartoongame/imgs/resources/beer.png', { visible: false }));
    var extractSet = new Phaser.Group(apg.g);
    tooltipSet.add(extractSet);
    extractSet.x = 64;
    extractSet.y = 136;
    var extractLabel = new enttx(extractSet, -64, 12, "Extract", { font: '18px ' + fontName, fill: '#433' }, { visible: false });
    var extracts = [];
    for (k = 0; k < 3; k++)
        extracts.push(new ent(extractSet, 32 * k, 0, 'cartoongame/imgs/resources/beer.png', { visible: false }));
    extracts[2].scalex = extracts[2].scaley = .5;
    var aby = 174;
    var abilitiesLabel = new enttx(tooltipSet, 0, aby + 8, "Abilities", { font: '18px ' + fontName, fill: '#433' }, { visible: false });
    var skill1Set = new Phaser.Group(apg.g);
    tooltipSet.add(skill1Set);
    skill1Set.x = 64;
    var skillIcon1 = new ent(skill1Set, 0, aby, 'cartoongame/imgs/abilities/biplane.png', { scalex: .5, scaley: .5, visible: false });
    var skillIcons1 = [];
    for (k = 0; k < 2; k++)
        skillIcons1.push(new ent(skill1Set, k * 16, aby + 34, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5, visible: false }));
    var ab2x = 0;
    var skill2Set = new Phaser.Group(apg.g);
    tooltipSet.add(skill2Set);
    skill2Set.x = 114;
    var skillIcon2 = new ent(skill2Set, 0, aby, 'cartoongame/imgs/abilities/blimp.png', { scalex: .5, scaley: .5, visible: false });
    skillIcon2.visible = false;
    var skillIcons2 = [];
    for (k = 0; k < 3; k++)
        skillIcons2.push(new ent(skill2Set, k * 16, aby + 34, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5, visible: false }));
    var lastToolTip = '';
    function doBuildingTip(e, id) {
        var k;
        var res = 'cartoongame/imgs/resources/';
        e.text = buildingHints[id];
        abilitiesLabel.visible = extractLabel.visible = skillIcons1[0].visible = skillIcons1[1].visible = skillIcon1.visible = skillIcons2[0].visible = skillIcons2[1].visible = skillIcons2[2].visible = skillIcon2.visible = extracts[0].visible = extracts[1].visible = extracts[2].visible = true;
        for (k = 0; k < 2; k++)
            extracts[k].tex = res + resourceIcons[extractResources[id][k]];
        extracts[2].tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[id]] + '.png';
        var alpha1 = (player.resources[firstAbilityCosts[id][0]] > 0 && player.resources[firstAbilityCosts[id][1]] > 0) ? 1 : .5;
        skillIcon1.tex = 'cartoongame/imgs/abilities/' + ability1Pics[id] + '.png';
        skillIcon1.alpha = alpha1;
        for (k = 0; k < 2; k++) {
            skillIcons1[k].tex = res + resourceIcons[firstAbilityCosts[id][k]];
            skillIcons1[k].alpha = alpha1;
        }
        var alpha2 = (player.resources[secondAbilityCosts[id][0]] > 0 && player.resources[secondAbilityCosts[id][1]] > 0 && player.resources[secondAbilityCosts[id][2]] > 0) ? 1 : .5;
        skillIcon2.tex = 'cartoongame/imgs/abilities/' + ability2Pics[id] + '.png';
        skillIcon2.alpha = alpha2;
        for (k = 0; k < 3; k++) {
            skillIcons2[k].tex = res + resourceIcons[secondAbilityCosts[id][k]];
            skillIcons2[k].alpha = alpha2;
        }
    }
    new enttx(tooltipSet, 10, 30, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 346 }, {
        upd: function (e) {
            tooltipSet.x = tooltipSet.x * .93 + .07 * (apg.g.input.activePointer.x < 420 ? 20 : apg.g.input.activePointer.x - 400);
            tooltipSet.y = tooltipSet.y * .93 + .07 * (apg.g.input.activePointer.y < 240 ? 0 : apg.g.input.activePointer.y - 240);
            if (tip.toolTip != lastToolTip) {
                var buildingID = getBuilding();
                e.text = tip.toolTip;
                lastToolTip = tip.toolTip;
                extracts[0].visible = extracts[1].visible = extracts[2].visible = skillIcons2[0].visible = skillIcons2[1].visible = skillIcons2[2].visible = skillIcon2.visible = skillIcons1[0].visible = skillIcons1[1].visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible = requiresLabel.visible = resources[0].visible = resources[1].visible = resources[2].visible = false;
                if (tip.toolTip == 'building1') {
                    e.text = buildingAction1Hints[buildingID];
                    requiresLabel.visible = true;
                    resources[0].visible = true;
                    resources[1].visible = true;
                    resources[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[buildingID][0]];
                    resources[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[buildingID][1]];
                }
                if (tip.toolTip == 'building2') {
                    e.text = buildingAction2Hints[buildingID];
                    requiresLabel.visible = true;
                    resources[0].visible = true;
                    resources[1].visible = true;
                    resources[2].visible = true;
                    resources[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][0]];
                    resources[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][1]];
                    resources[2].tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[buildingID][2]];
                }
                if (tip.toolTip == 'extract') {
                    e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
                    extractLabel.visible = extracts[0].visible = extracts[1].visible = extracts[2].visible = true;
                    extracts[0].tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[buildingID][0]];
                    extracts[1].tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[buildingID][1]];
                    extracts[2].tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[buildingID]] + '.png';
                }
                if (tip.toolTip == 'item1') {
                    e.text = itemHints[player.items[0] + 1];
                }
                if (tip.toolTip == 'item2') {
                    e.text = itemHints[player.items[1] + 1];
                }
                if (tip.toolTip == 'item3') {
                    e.text = itemHints[player.items[2] + 1];
                }
                if (tip.toolTip == 'farm')
                    doBuildingTip(e, 0);
                if (tip.toolTip == 'pond')
                    doBuildingTip(e, 1);
                if (tip.toolTip == 'greenhouse')
                    doBuildingTip(e, 2);
                if (tip.toolTip == 'airport')
                    doBuildingTip(e, 3);
                if (tip.toolTip == 'police')
                    doBuildingTip(e, 4);
                if (tip.toolTip == 'hospital')
                    doBuildingTip(e, 5);
            }
        }
    });
}
function MakeStats(apg, player, foe, fontName, team, w, buildingPicName, actionLabelTextProps, getCurBuilding, getFoeActive) {
    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var nameHeight = 138;
    var actionLabel = new enttx(w, 334, 92, "1. Action Here", actionLabelTextProps, {});
    var statsSet = new Phaser.Group(apg.g);
    w.add(statsSet);
    statsSet.x = 540;
    statsSet.y = 50;
    var building = new ent(statsSet, 90, 86, buildingPicName, { color: 0xa0a0a0 });
    var vsLabel = new enttx(statsSet, 110, -72 + nameHeight, 'VS', { font: '24px ' + fontName });
    function MakePanel(panel, teamTest, basex, headx, headoffset, namex, healthlabx, healthx, itemx, resx, rexlabx, resnumx) {
        function inCategory(src, x, y, add, labels, bump1) {
            if (bump1 === void 0) { bump1 = false; }
            var labelEnts = [];
            var curx = x;
            var cury = y;
            for (var k = 0; k < labels.length; k++) {
                labelEnts.push(new enttx(src, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' }));
                if (bump1 && k == 0)
                    cury += 28;
                cury += add;
                if (k == 2 || k == 5) {
                    curx += 28;
                    cury = y;
                }
                if (k == 5)
                    cury -= add;
            }
            return labelEnts;
        }
        function picCategory(src, x, y, add, labels) {
            var labelEnts = [];
            var curx = x;
            var cury = y;
            for (var k = 0; k < labels.length; k++) {
                labelEnts.push(new ent(src, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 }));
                cury += add;
                if (k == 2 || k == 5) {
                    curx += 28;
                    cury = y;
                }
                if (k == 5)
                    cury -= add;
            }
            return labelEnts;
        }
        var coreSet = panel.panelGroup = new Phaser.Group(apg.g);
        statsSet.add(coreSet);
        coreSet.x = basex;
        coreSet.y = 0;
        panel.headEnt = new ent(coreSet, headx + (team == teamTest ? headoffset : 0), ((team == teamTest) ? 50 : 80), (team == teamTest) ? player.headPic : foe.headPic, { scalex: (team == teamTest) ? .75 : .5, scaley: (team == teamTest) ? .75 : .5, color: (team == teamTest) ? 0xffffff : 0xa0a0a0 });
        panel.name = new enttx(coreSet, namex, nameHeight, (team == teamTest) ? player.name : foe.name, { font: '12px ' + fontName, fill: (team == teamTest) ? player.nameColor : foe.nameColor });
        var healthHeight = 158;
        new enttx(coreSet, healthlabx, healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' });
        new ent(coreSet, healthx, healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 });
        panel.health = new ent(coreSet, healthx + 1, healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
        var itemSet = new Phaser.Group(apg.g);
        coreSet.add(itemSet);
        itemSet.x = itemx;
        itemSet.y = 170;
        panel.itemLabel = new enttx(itemSet, 0, -14, 'Items', { font: '10px ' + fontName, fill: '#555' });
        panel.itemPics = [new ent(itemSet, 0, 0, 'cartoongame/imgs/sitems/srocket2.png'),
            new ent(itemSet, 0, 16, 'cartoongame/imgs/sitems/srocket2.png'),
            new ent(itemSet, 0, 32, 'cartoongame/imgs/sitems/srocket2.png')];
        var resSet = new Phaser.Group(apg.g);
        coreSet.add(resSet);
        resSet.x = resx;
        resSet.y = 184;
        new enttx(resSet, rexlabx, -16, 'Resources', { font: '12px ' + fontName, fill: '#222' });
        panel.statPics = picCategory(resSet, resnumx, 0, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
        panel.statNums = inCategory(resSet, resnumx + 16, 0, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    }
    var left = new StatPanel, right = new StatPanel();
    MakePanel(left, 1, 0, 0, 0, 0, 2, -4, 86, -10, 6, 4);
    MakePanel(right, 2, 150, 30, -40, 10, 80, 50, -8, 20, 0, -6);
    var foeActiveOld = true;
    return function () {
        var buildingNames = ['farm', 'pond', 'greenhouse', 'airport', 'police station', 'hospital'];
        var curBuilding = getCurBuilding();
        building.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';
        actionLabel.text = "1. Action at " + buildingNames[curBuilding];
        var me, other;
        var panelx, panelsidex;
        var foeActive = getFoeActive();
        if (team == 1) {
            me = left;
            other = right;
            panelx = 0;
            panelsidex = 32;
        }
        else {
            me = right;
            other = left;
            panelx = 150;
            panelsidex = -32;
        }
        if (foeActive && !foeActiveOld) {
            me.panelGroup.x = panelx;
            other.panelGroup.visible = true;
        }
        if (!foeActive && foeActiveOld) {
            me.panelGroup.x = panelx + panelsidex;
            other.panelGroup.visible = false;
        }
        foeActiveOld = foeActive;
        me.itemLabel.alpha = (player.items[0] != -1) ? 1 : .3;
        for (var k = 0; k < 3; k++) {
            if (player.items[k] == -1)
                me.itemPics[k].visible = false;
            else {
                me.itemPics[k].visible = true;
                me.itemPics[k].tex = 'cartoongame/imgs/sitems/' + itemIcons[player.items[k]] + '.png';
            }
        }
        for (var k = 0; k < 10; k++) {
            me.statNums[k].tx = "" + player.resources[k];
            me.statPics[k].alpha = me.statNums[k].alpha = (player.resources[k] == 0) ? .5 : 1;
        }
        me.health.scalex = .67 * (player.healthStat / 10);
        if (foeActive) {
            other.name.text = foe.name;
            other.headEnt.tex = foe.headPic;
            other.itemLabel.alpha = (foe.items[0] != -1) ? 1 : .3;
            for (var k = 0; k < 3; k++) {
                if (foe.items[k] == -1)
                    other.itemPics[k].visible = false;
                else {
                    other.itemPics[k].visible = true;
                    other.itemPics[k].tex = 'cartoongame/imgs/sitems/' + itemIcons[foe.items[k]] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                other.statNums[k].tx = "" + foe.resources[k];
                other.statPics[k].alpha = other.statNums[k].alpha = (foe.resources[k] == 0) ? .5 : 1;
            }
            other.health.scalex = .67 * (foe.healthStat / 10);
        }
    };
}
;
function MakeLocation(apg, w, id, team, fontName, actionLabelTextProps, bodyPic, player, getBuilding) {
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var bodyColor = cols2[id % 10];
    var buildingSet = new Phaser.Group(apg.g);
    w.add(buildingSet);
    buildingSet.x = 344;
    buildingSet.y = 300;
    new enttx(buildingSet, 85, 94, "2. Then, Move Here", actionLabelTextProps);
    new ent(buildingSet, -44, 15, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    new ent(buildingSet, 340, 15, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    var building = getBuilding();
    var locBody = new ent(buildingSet, 64 * building, 51, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    var locHead = new ent(buildingSet, 64 * building, 37, player.smallHeadPic);
    var playerLabel = new enttx(buildingSet, 64 * building, 80, player.name, { font: '12px ' + fontName, fill: player.nameColor });
    return function () {
        var curBuilding = getBuilding();
        locBody.x = 16 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        locHead.x = 6 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        playerLabel.x = 6 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
    };
}
function MakeRoundPlaque(apg, player, foe, fontName, isShowPlaque, endShow) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    new ent(w, 0, 0, 'cartoongame/imgs/tooltip2.png', {
        upd: function (e) {
            w.y = w.y * .8 + .2 * (isShowPlaque() ? 0 : -500);
            if (!isShowPlaque())
                return;
            if (apg.g.input.activePointer.isDown)
                endShow();
        }
    });
    new enttx(w, 8, 8, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
}
function MainPlayerInput(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var timer = 0;
    var choices = [1, 1, 1, 1, 1, 1];
    var choiceButtons;
    var curBuilding = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow = id < 6 ? 1 : 0;
    var player = new Player(apg.playerName, id + 1 + ((team == 2) ? 10 : 0));
    player.nameColor = cols[id % 10];
    var foe = new Player('xxxFirestormxxx', 20);
    foe.nameColor = cols[7];
    var accepted = false;
    var showRoundPlaque = false;
    var roundNumber = 2;
    var foeActive = false;
    var forceReset = true;
    function reset() {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;
        choices[0] = curBuilding;
        choices[1] = curRow;
        choices[2] = 0;
        updateStats();
        updateLocation();
    }
    var playerStats = {};
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("startround", function (p) {
        showRoundPlaque = true;
        endOfRoundSound.play();
        var curFoe = null;
        for (var k in playerStats) {
            var f = playerStats[k];
            if (f.nm == apg.playerName)
                continue;
            if (f.st[0] > 0 && (f.st[2] % 6) == curBuilding && f.st[3] == curRow) {
                curFoe = f;
                break;
            }
        }
        if (curFoe == null) {
            foeActive = false;
        }
        else {
            foeActive = true;
            var foeID = curFoe.st[1];
            foe.name = curFoe.nm;
            foe.nameColor = cols[foeID % 10];
            foe.headPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
            foe.healthStat = curFoe.st[0];
            foe.items[0] = curFoe.st[4];
            foe.items[1] = curFoe.st[5];
            foe.items[2] = curFoe.st[6];
            foe.resources = curFoe.rs;
        }
        reset();
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
        playerStats[p.nm] = p;
        if (p.nm != apg.playerName)
            return;
        player.healthStat = p.st[0];
        if (p.st[3] != -1)
            curRow = p.st[3];
        if (p.st[2] != -1)
            curBuilding = p.st[2] % 6;
        player.items[0] = p.st[4];
        player.items[1] = p.st[5];
        player.items[2] = p.st[6];
        player.resources = p.rs;
        forceReset = true;
    })
        .Register("submit", function (p) {
        if (accepted == false) {
            accepted = true;
            endOfRoundSound.play();
        }
        curBuilding = choices[0];
        curRow = choices[1];
        playerStats = {};
        apg.WriteToServer("upd", { choices: choices });
    });
    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI11.png', {
        upd: function (e) {
            if (accepted) {
                w.y = w.y * .9 + .1 * -500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            choiceButtons[2].setParms(curBuilding, player.items[0], player.items[1], player.items[2], player.resources, forceReset);
            forceReset = false;
            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;
            }
            choiceButtons[0].update(true);
            choiceButtons[2].update(true);
            choiceButtons[3].update(true);
        }
    });
    var tip = new ToolTip();
    choiceButtons = addActions(apg, w, team, choices, function (str) { tip.toolTip = str; tip.toolTime = 3; });
    var roundColors = ['#468', '#846', '#684'];
    var lastRoundUpdate = 0;
    new enttx(w, 404, 8, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
    new enttx(w, 584, 8, "Round ", { font: '45px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    var actionLabelTextProps = { font: '20px ' + fontName, fill: '#A00' };
    var updateStats = MakeStats(apg, player, foe, fontName, team, w, 'cartoongame/imgs/buildings/building1.png', actionLabelTextProps, function () { return curBuilding; }, function () { return foeActive; });
    var updateLocation = MakeLocation(apg, w, id, team, fontName, actionLabelTextProps, 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png', player, function () { return curBuilding; });
    MakeToolTip(apg, w, player, fontName, tip, function () { return curBuilding; });
    var timeSet = new Phaser.Group(apg.g);
    w.add(timeSet);
    timeSet.x = 760;
    timeSet.y = 24;
    new enttx(timeSet, 0, 0, "Time", { font: '18px ' + fontName, fill: '#433' });
    new enttx(timeSet, 0, 18, "", { font: '40px ' + fontName, fill: '#688' }, { upd: function (e) { e.text = "" + timer; e.fill = roundColors[(roundNumber - 1) % roundColors.length]; } });
    MakeRoundPlaque(apg, player, foe, fontName, function () { return showRoundPlaque; }, function () { showRoundPlaque = false; accepted = false; });
    if (apg.allowFullScreen) {
        new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });
    }
    reset();
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
    apg.WriteLocalAsServer(.1, "join", { name: apg.playerName, started: true, playerID: 2, team: 2 });
}
function WaitingForJoinAcknowledement(apg) {
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var endSubgame = false, timeOut = 0, retry = 0;
    var playerID = -1, team = -1, connected = false;
    var gameLaunchFunc = MainPlayerInput;
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .Register("join", function (p) {
        if (p.name.toLowerCase() != apg.playerName.toLowerCase())
            return;
        if (p.started) {
            endSubgame = true;
            endOfRoundSound.play();
            gameLaunchFunc(apg, p.playerID, p.team);
        }
        else {
            connected = true;
            playerID = p.playerID;
            team = p.team;
            msg.tx = "Connected!  Waiting for streamer to start playing!";
        }
    })
        .Register("start", function (p) { endSubgame = true; endOfRoundSound.play(); gameLaunchFunc(apg, playerID, team); });
    if (apg.networkTestSequence) {
        WaitingForJoinAcknowledgeTestSequence(apg);
    }
    function tryEnd(e, x) { if (endSubgame) {
        e.x = e.x * .7 + .3 * x;
        e.alpha = e.alpha * .8 + .2 * -.1;
        if (e.x < x + 3) {
            e.eliminate();
        }
        return;
    } }
    function slideFade(e, x, alpha) { if (!endSubgame) {
        e.x = e.x * .7 + .3 * x;
        e.alpha = e.alpha * .8 + .2 * alpha;
    } }
    new ent(apg.g.world, 60, 0, 'cartoongame/imgs/ClientUI3.png', { alpha: 0,
        upd: function (e) {
            if (!connected && !endSubgame) {
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
            tryEnd(e, -30);
            slideFade(e, 0, 1);
        } });
    var tick = 0;
    var msg = new enttx(apg.g.world, 320, 100 + 60, "Trying to Connect to Streamer's Game - Hold on a Second...", { font: '32px Caveat Brush', fill: '#222' }, { alpha: 0,
        upd: function (e) {
            tryEnd(e, -50);
            tick++;
            slideFade(e, 60, (.5 + .5 * Math.cos(tick * .01)));
        } });
}
function WaitingToJoinCache(c) {
    c.images('cartoongame/imgs', ['ClientUI3.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function WaitingToJoinTestSequence(apg) { apg.ClearLocalMessages(); }
function WaitingToJoin(apg, previousMessage) {
    if (previousMessage === void 0) { previousMessage = ""; }
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
    var inputUsed = false, endSubgame = false;
    var curRound = { round: 1, time: 45 };
    function tryEnd(e, x) { if (endSubgame) {
        e.x = e.x * .7 + .3 * x;
        if (e.x < x + 3)
            e.eliminate();
        return true;
    } return false; }
    apg.ResetServerMessageRegistry().SetKeepAliveStatus(false);
    apg.WriteToServer("debugAppLaunch", {});
    var vx = 0, vy = 0;
    apg.Register("frame", function (p) {
        vx = p.x;
        vy = p.y;
    });
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        upd: function (e) {
            if (tryEnd(e, -30))
                return;
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
        new enttx(apg.g.world, 200, 60, previousMessage, textColor2, { upd: function (e) { if (tryEnd(e, -50))
                return; } });
    }
    else {
        new enttx(apg.g.world, 140, 60, "Thanks for helping playtest Gods of Socks and Spoons!", textColor2, { upd: function (e) { if (tryEnd(e, -50))
                return; } });
        new enttx(apg.g.world, 140, 160, "Two streamers face off.  Help one beat the other.  Each round, perform an action and then move - then the streamer will protect you in an action phase.  Only you can hurt and defeat the foe streamer (with items and special abilities) and win!  ", textColor2, {
            upd: function (e) { if (tryEnd(e, -50))
                return; }
        });
    }
    new enttx(apg.g.world, 140, 380, "Tap or click to Connect to the Streamer's Game!", textColor, {
        upd: function (e) { if (tryEnd(e, -50))
            return; tc++; e.visible = (tc % 120 < 60) ? false : true; }
    });
    if (apg.networkTestSequence)
        WaitingToJoinTestSequence(apg);
}
//# sourceMappingURL=GameLogic.js.map