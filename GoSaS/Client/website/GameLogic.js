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
                }
            });
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
    c.images('cartoongame/imgs', ['blueorb.png', 'flag1small.png', 'flag2small.png', 'littleperson.png', 'littleperson2.png', 'bodyleft.png', 'bodyright.png', 'bkg_guide4.png', 'ClientUI9.png', 'tooltip2.png', 'test.png', 'whiteblock.png', 'arrowcap.png', 'arrowmid.png', 'arrowhead.png', 'hudselect.png']);
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
    var roundLength = 15;
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
function MainPlayerInput(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/TestActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var resources = [], foeResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
    var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];
    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
    var ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
    var buildingNames = ['farm', 'pond', 'greenhouse', 'airport', 'police station', 'hospital'];
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
    var headNum = id + 1 + ((team == 2) ? 10 : 0);
    var nameColor = cols[id % 10];
    var foenameColor = cols[7];
    var bodyColor = cols2[id % 10];
    var playerStats = {};
    var timer = 0;
    var buildingPic;
    var headEntLeft, headEntRight;
    var roundNumber = 2;
    var nameLeft, nameRight;
    var healthLeft, foeHealthBk, healthRight;
    var actionLabel;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = {
        nm: "",
        st: [10,
            10,
            0,
            0,
            -1, -1, -1],
        rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    resources = myStats.rs;
    var toolTip = "";
    var choiceButtons, statPicsLeft, statNumsLeft, statPicsRight, statNumsRight;
    var stanceBody, stanceHead, locBody, locHead;
    var item1 = myStats.st[4], item2 = myStats.st[5], item3 = myStats.st[6];
    var playerLabel;
    var lastRoundUpdate = 0;
    var vsLabel;
    var itemLabelLeft;
    var itemLabel2;
    var itemPicsLeft;
    var itemPicsRight, itemLabelRight;
    var healthStat = 10;
    var curBuilding = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow = id < 6 ? 1 : 0;
    var buildingPicName = 'cartoongame/imgs/buildings/building1.png';
    var headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var foeHeadPic = 'cartoongame/imgs/heads/headbig20.png';
    var sfoeheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var accepted = false;
    var curFoe = null;
    var foeHealthStat = 10, foeitem1 = -1, foeitem2 = -1, foeitem3 = -1;
    var roundColors = ['#468', '#846', '#684'];
    var roundx = 80;
    var tipx = 70;
    var tipy = 90;
    var mapRowx = 0;
    var mapRowy = 60;
    var mapBuildingx = 44;
    var mapBuildingy = -160;
    var allStx = -30;
    var allSty = -50;
    var statx = -110 + allStx;
    var staty = -176 + allSty;
    var foestatx = -60 + allStx;
    var foestaty = -176 + allSty;
    var foeAdd = 130;
    var foeActive = false, foeActiveOld = true;
    var forceReset = true;
    var foeNameString = 'xxxFirestormxxx', foeID = 0;
    function addActions(srcChoices, setToolTip) {
        var curCollection = 0;
        function add(isActions, choiceSet) {
            var id = curCollection;
            curCollection++;
            return new ButtonCollection(isActions, w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));
            }
            o.push(add(actions[j].isActions, p));
        }
        return o;
    }
    function reset() {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;
        choices[0] = curBuilding;
        choices[1] = curRow;
        choices[2] = 0;
        buildingPic.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';
        actionLabel.text = "1. Action at " + buildingNames[curBuilding];
        if (team == 1) {
            if (foeActive && !foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x -= 32;
                for (var r in playerRight)
                    playerRight[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x += 32;
                for (var r in playerRight)
                    playerRight[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelLeft.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsLeft[0].visible = false;
                else {
                    itemPicsLeft[0].visible = true;
                    itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsLeft[1].visible = false;
                else {
                    itemPicsLeft[1].visible = true;
                    itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsLeft[2].visible = false;
                else {
                    itemPicsLeft[2].visible = true;
                    itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsLeft[k].tx = "" + resources[k];
                statPicsLeft[k].alpha = statNumsLeft[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthLeft.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameRight.text = foeNameString;
                headEntRight.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelRight.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsRight[0].visible = false;
                    else {
                        itemPicsRight[0].visible = true;
                        itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsRight[1].visible = false;
                    else {
                        itemPicsRight[1].visible = true;
                        itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsRight[2].visible = false;
                    else {
                        itemPicsRight[2].visible = true;
                        itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsRight[k].tx = "" + foeResources[k];
                    statPicsRight[k].alpha = statNumsRight[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthRight.scalex = .67 * (foeHealthStat / 10);
            }
        }
        else {
            if (foeActive && !foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x += 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x -= 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelRight.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsRight[0].visible = false;
                else {
                    itemPicsRight[0].visible = true;
                    itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsRight[1].visible = false;
                else {
                    itemPicsRight[1].visible = true;
                    itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsRight[2].visible = false;
                else {
                    itemPicsRight[2].visible = true;
                    itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsRight[k].tx = "" + resources[k];
                statPicsRight[k].alpha = statNumsRight[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthRight.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameLeft.text = foeNameString;
                headEntLeft.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelLeft.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsLeft[0].visible = false;
                    else {
                        itemPicsLeft[0].visible = true;
                        itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsLeft[1].visible = false;
                    else {
                        itemPicsLeft[1].visible = true;
                        itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsLeft[2].visible = false;
                    else {
                        itemPicsLeft[2].visible = true;
                        itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsLeft[k].tx = "" + foeResources[k];
                    statPicsLeft[k].alpha = statNumsLeft[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthLeft.scalex = .67 * (foeHealthStat / 10);
            }
        }
        stanceBody.y = 30 + 160 + curRow * 64;
        stanceHead.y = 30 + 146 + curRow * 64;
        locBody.x = 30 + 330 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        locHead.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        playerLabel.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
    }
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("startround", function (p) {
        accepted = false;
        endOfRoundSound.play();
        curFoe = null;
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
            foeID = curFoe.st[1];
            foeNameString = curFoe.nm;
            foenameColor = cols[foeID % 10];
            foeHeadPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
            foeHealthStat = curFoe.st[0];
            foeitem1 = curFoe.st[4];
            foeitem2 = curFoe.st[5];
            foeitem3 = curFoe.st[6];
            foeResources = curFoe.rs;
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
        myStats = p;
        healthStat = p.st[0];
        if (p.st[3] != -1)
            curRow = p.st[3];
        if (p.st[2] != -1)
            curBuilding = p.st[2] % 6;
        item1 = p.st[4];
        item2 = p.st[5];
        item3 = p.st[6];
        resources = p.rs;
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
    var toolTime = 0;
    function setToolTip(str) {
        toolTip = str;
        toolTime = 3;
    }
    var tick = 0;
    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI9.png', {
        upd: function (e) {
            tick++;
            if (accepted) {
                w.y = w.y * .9 + .1 * -500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            choiceButtons[2].setParms(curBuilding, item1, item2, item3, resources, forceReset);
            forceReset = false;
            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;
            }
            choiceButtons[0].update(true);
            choiceButtons[1].update(true);
            choiceButtons[2].update(true);
            choiceButtons[3].update(true);
        }
    });
    new ent(w, 0, 0, 'cartoongame/imgs/tooltip2.png', { upd: function (e) { toolTime--; if (toolTime == 0)
            toolTip = ""; e.visible = (toolTip == "") ? false : true; } });
    choiceButtons = addActions(choices, setToolTip);
    new enttx(w, roundx + 260, 16, "Choices for ", { font: '45px ' + fontName, fill: '#444' });
    new enttx(w, roundx + 440, 16, "Round ", { font: '45px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    var nameHeight = 138;
    var healthHeight = 158;
    var playerLeft = [];
    var playerRight = [];
    function a1(e) { console.log(e); playerLeft.push(e); }
    function a2(e) { playerRight.push(e); }
    function a1l(l) { for (var e in l)
        playerLeft.push(l[e]); }
    function a2l(l) { for (var e in l)
        playerRight.push(l[e]); }
    actionLabel = new enttx(w, 60, 210, "1. Action Here", { font: '20px ' + fontName, fill: '#A00' });
    buildingPic = new ent(w, allStx + 140, allSty + 86, buildingPicName, { color: 0xa0a0a0 });
    vsLabel = new enttx(w, allStx + 160, allSty + -90 + 18 + nameHeight, 'VS', { font: '24px ' + fontName });
    headEntLeft = new ent(w, allStx + 50, allSty + ((team == 1) ? 50 : 80), (team == 1) ? headPic : foeHeadPic, { scalex: (team == 1) ? .75 : .5, scaley: (team == 1) ? .75 : .5, color: (team == 1) ? 0xffffff : 0xa0a0a0 });
    a1(headEntLeft);
    nameLeft = new enttx(w, allStx + 50, allSty + nameHeight, (team == 1) ? apg.playerName : foeNameString, { font: '12px ' + fontName, fill: (team == 1) ? nameColor : foenameColor });
    a1(nameLeft);
    a1(new ent(w, allStx + 46, allSty + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthLeft = new ent(w, allStx + 47, allSty + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a1(healthLeft);
    var itemLeft = allStx + 136;
    var itemRight = allStx + 192;
    var itemVert = allSty + 170;
    itemLabelLeft = new enttx(w, itemLeft, itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a1(itemLabelLeft);
    itemPicsLeft = [new ent(w, itemLeft, itemVert, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 16, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 32, 'cartoongame/imgs/sitems/srocket2.png')];
    a1l(itemPicsLeft);
    a1(new enttx(w, allStx + 52, allSty + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    function category(msg, x, y) { return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' }); }
    function inCategory(x, y, add, labels, bump1) {
        if (bump1 === void 0) { bump1 = false; }
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new enttx(w, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' }));
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
    function picCategory(x, y, add, labels) {
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new ent(w, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 }));
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
    a1(new enttx(w, statx + 110 - 30 + 76, staty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsLeft = picCategory(10 + statx + 194 - 50, staty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a1l(statPicsLeft);
    statNumsLeft = inCategory(6 + statx + 214 - 50, staty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a1l(statNumsLeft);
    itemLabelRight = new enttx(w, itemRight, itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a2(itemLabelRight);
    itemPicsRight = [new ent(w, itemRight, itemVert, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 16, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 32, 'cartoongame/imgs/sitems/sbomb.png')];
    a2l(itemPicsRight);
    headEntRight = new ent(w, allStx + 230 + (team == 1 ? 0 : -40), allSty + ((team == 1) ? 80 : 50), (team == 1) ? foeHeadPic : headPic, { scalex: (team == 1) ? .5 : .75, scaley: (team == 1) ? .5 : .75, color: (team == 1) ? 0xa0a0a0 : 0xffffff });
    a2(headEntRight);
    nameRight = new enttx(w, allStx + 210, allSty + nameHeight, (team == 1) ? foeNameString : apg.playerName, { font: '12px ' + fontName, fill: (team == 1) ? foenameColor : nameColor });
    a2(nameRight);
    a2(new ent(w, allStx + 250, allSty + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthRight = new ent(w, allStx + 251, allSty + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a2(healthRight);
    a2(new enttx(w, allStx + 280, allSty + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    a2(new enttx(w, foestatx + 60 + -20 + 240, foestaty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsRight = picCategory(foestatx + foeAdd + 194 - 50, foestaty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a2l(statPicsRight);
    statNumsRight = inCategory(-4 + foestatx + foeAdd + 214 - 50, foestaty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a2l(statNumsRight);
    new enttx(w, 80 + mapBuildingx + 325, 104 + mapBuildingy + 240, "2. Then, Move Here", { font: '20px ' + fontName, fill: '#A00' });
    new ent(w, mapBuildingx + 270, mapBuildingy + 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    new ent(w, mapBuildingx + 680, mapBuildingy + 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    locBody = new ent(w, mapBuildingx + 330 + 64 * curBuilding, mapBuildingy + 16 + 285, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    locHead = new ent(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy + 16 + 271, sheadPic);
    playerLabel = new enttx(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy + 16 + 320 - 6, apg.playerName, { font: '12px ' + fontName, fill: nameColor });
    var moveArrow = [];
    for (var k = 0; k < 6; k++) {
        var art = 'mid';
        if (k == 0)
            art = 'cap';
        if (k == 5)
            art = 'head';
        moveArrow.push(new ent(w, 310 + mapBuildingx + 64 * k, 280 + mapBuildingy, 'cartoongame/imgs/arrow' + art + '.png', { alpha: .5, upd: function (e) { e.alpha = .2 + .2 * Math.cos(tick * .03); } }));
        moveArrow[k].visible = false;
    }
    new enttx(w, mapRowx + 700, mapRowy + 110, "", { font: '24px ' + fontName, fill: '#A00' });
    stanceBody = new ent(w, mapRowx + 740, mapRowy + 160 + curRow * 64, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    stanceHead = new ent(w, mapRowx + 731, mapRowy + 146 + curRow * 64, sheadPic);
    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' });
    requiresLabel.visible = false;
    var resource1 = new ent(w, tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource1.visible = false;
    var resource2 = new ent(w, 32 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource2.visible = false;
    var resource3 = new ent(w, 64 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource3.visible = false;
    var extractx = 48;
    var extracty = 36;
    var extractLabel = new enttx(w, -48 + extractx + tipx + 250, 32 + extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' });
    extractLabel.visible = false;
    var extractIcon1 = new ent(w, extractx + tipx + 266, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon1.visible = false;
    var extractIcon2 = new ent(w, extractx + tipx + 266 + 32, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon2.visible = false;
    var extractIcon3 = new ent(w, extractx + tipx + 266 + 64, extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 });
    extractIcon3.visible = false;
    var ab1x = 16 + 48;
    var ab2x = 26 + 48;
    var aby = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, 32 + aby + 12 + tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' });
    abilitiesLabel.visible = false;
    var skillIcon1 = new ent(w, ab1x + tipx + 250, aby + tipy + 276, 'cartoongame/imgs/abilities/biplane.png', { scalex: .5, scaley: .5 });
    skillIcon1.visible = false;
    var skillIcon1r1 = new ent(w, ab1x + tipx + 250, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon1r1.visible = false;
    var skillIcon1r2 = new ent(w, ab1x + tipx + 250 + 16, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon1r2.visible = false;
    var skillIcon2 = new ent(w, 40 + ab2x + tipx + 250, aby + tipy + 276, 'cartoongame/imgs/abilities/blimp.png', { scalex: .5, scaley: .5 });
    skillIcon2.visible = false;
    var skillIcon2r1 = new ent(w, 40 + ab2x + tipx + 250, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r1.visible = false;
    var skillIcon2r2 = new ent(w, 40 + ab2x + tipx + 250 + 16, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r2.visible = false;
    var skillIcon2r3 = new ent(w, 40 + ab2x + tipx + 250 + 32, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r3.visible = false;
    var lastToolTip = '';
    function doBuildingTip(e, id) {
        var res = 'cartoongame/imgs/resources/';
        e.text = buildingHints[id];
        abilitiesLabel.visible = extractLabel.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
        extractIcon1.tex = res + resourceIcons[extractResources[id][0]];
        extractIcon2.tex = res + resourceIcons[extractResources[id][1]];
        extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[id]] + '.png';
        var alpha1 = (resources[firstAbilityCosts[id][0]] > 0 && resources[firstAbilityCosts[id][1]] > 0) ? 1 : .5;
        skillIcon1.tex = 'cartoongame/imgs/abilities/' + ability1Pics[id] + '.png';
        skillIcon1.alpha = alpha1;
        skillIcon1r1.tex = res + resourceIcons[firstAbilityCosts[id][0]];
        skillIcon1r1.alpha = alpha1;
        skillIcon1r2.tex = res + resourceIcons[firstAbilityCosts[id][1]];
        skillIcon1r2.alpha = alpha1;
        var alpha2 = (resources[secondAbilityCosts[id][0]] > 0 && resources[secondAbilityCosts[id][1]] > 0 && resources[secondAbilityCosts[id][2]] > 0) ? 1 : .5;
        skillIcon2.tex = 'cartoongame/imgs/abilities/' + ability2Pics[id] + '.png';
        skillIcon2.alpha = alpha2;
        skillIcon2r1.tex = res + resourceIcons[secondAbilityCosts[id][0]];
        skillIcon2r1.alpha = alpha2;
        skillIcon2r2.tex = res + resourceIcons[secondAbilityCosts[id][1]];
        skillIcon2r2.alpha = alpha2;
        skillIcon2r3.tex = res + resourceIcons[secondAbilityCosts[id][2]];
        skillIcon2r3.alpha = alpha2;
    }
    new enttx(w, tipx + 260, tipy + 140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 346 }, {
        upd: function (e) {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible = requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'building1') {
                    e.text = buildingAction1Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][1]];
                }
                if (toolTip == 'building2') {
                    e.text = buildingAction2Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource3.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][1]];
                    resource3.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][2]];
                }
                if (toolTip == 'extract') {
                    e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
                    extractLabel.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
                    extractIcon1.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][0]];
                    extractIcon2.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][1]];
                    extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[curBuilding]] + '.png';
                }
                if (toolTip == 'item1') {
                    e.text = itemHints[item1 + 1];
                }
                if (toolTip == 'item2') {
                    e.text = itemHints[item2 + 1];
                }
                if (toolTip == 'item3') {
                    e.text = itemHints[item3 + 1];
                }
                if (toolTip == 'farm')
                    doBuildingTip(e, 0);
                if (toolTip == 'pond')
                    doBuildingTip(e, 1);
                if (toolTip == 'greenhouse')
                    doBuildingTip(e, 2);
                if (toolTip == 'airport')
                    doBuildingTip(e, 3);
                if (toolTip == 'police')
                    doBuildingTip(e, 4);
                if (toolTip == 'hospital')
                    doBuildingTip(e, 5);
            }
        }
    });
    category("Time", -130 + 650 + 200, -360 + 48 + 336);
    new enttx(w, -130 + 650 + 200, -360 + 48 + 354, "", { font: '40px ' + fontName, fill: '#688' }, { upd: function (e) { e.text = "" + timer; e.fill = roundColors[(roundNumber - 1) % roundColors.length]; } });
    if (apg.allowFullScreen) {
        new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });
    }
    reset();
    if (apg.networkTestSequence)
        MainInputTestSequence(apg);
}
function PlayerAction(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/PlayActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var resources = [], foeResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
    var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];
    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
    var ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
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
    var headNum = id + 1 + ((team == 2) ? 10 : 0);
    var nameColor = cols[id % 10];
    var foenameColor = cols[7];
    var bodyColor = cols2[id % 10];
    var playerStats = {};
    var timer = 0;
    var buildingPic;
    var headEntLeft, headEntRight;
    var roundNumber = 2;
    var nameLeft, nameRight;
    var healthLeft, foeHealthBk, healthRight;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = {
        nm: "",
        st: [10,
            10,
            0,
            0,
            -1, -1, -1],
        rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    resources = myStats.rs;
    var toolTip = "";
    var choiceButtons, statPicsLeft, statNumsLeft, statPicsRight, statNumsRight;
    var item1 = myStats.st[4], item2 = myStats.st[5], item3 = myStats.st[6];
    var lastRoundUpdate = 0;
    var vsLabel;
    var itemLabelLeft;
    var itemLabel2;
    var itemPicsLeft;
    var itemPicsRight, itemLabelRight;
    var healthStat = 10;
    var curBuilding = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow = id < 6 ? 1 : 0;
    var buildingPicName = 'cartoongame/imgs/buildings/building1.png';
    var headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var foeHeadPic = 'cartoongame/imgs/heads/headbig20.png';
    var sfoeheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var accepted = false;
    var curFoe = null;
    var foeHealthStat = 10, foeitem1 = -1, foeitem2 = -1, foeitem3 = -1;
    var roundColors = ['#468', '#846', '#684'];
    var roundx = 160;
    var tipx = -170;
    var tipy = -60;
    var infox = 480;
    var infoy = 30;
    var statx = -110 + infox;
    var staty = -176 + infoy;
    var foestatx = -60 + infox;
    var foestaty = -176 + infoy;
    var foeAdd = 130;
    var foeActive = false, foeActiveOld = true;
    var forceReset = true;
    var foeNameString = 'xxxFirestormxxx', foeID = 0;
    function addActions(srcChoices, setToolTip) {
        var curCollection = 0;
        function add(isActions, choiceSet) {
            var id = curCollection;
            curCollection++;
            return new ButtonCollection(isActions, w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));
            }
            o.push(add(actions[j].isActions, p));
        }
        return o;
    }
    function reset() {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;
        choices[0] = curBuilding;
        choices[1] = curRow;
        choices[2] = 0;
        buildingPic.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';
        if (team == 1) {
            if (foeActive && !foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x -= 32;
                for (var r in playerRight)
                    playerRight[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x += 32;
                for (var r in playerRight)
                    playerRight[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelLeft.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsLeft[0].visible = false;
                else {
                    itemPicsLeft[0].visible = true;
                    itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsLeft[1].visible = false;
                else {
                    itemPicsLeft[1].visible = true;
                    itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsLeft[2].visible = false;
                else {
                    itemPicsLeft[2].visible = true;
                    itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsLeft[k].tx = "" + resources[k];
                statPicsLeft[k].alpha = statNumsLeft[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthLeft.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameRight.text = foeNameString;
                headEntRight.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelRight.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsRight[0].visible = false;
                    else {
                        itemPicsRight[0].visible = true;
                        itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsRight[1].visible = false;
                    else {
                        itemPicsRight[1].visible = true;
                        itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsRight[2].visible = false;
                    else {
                        itemPicsRight[2].visible = true;
                        itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsRight[k].tx = "" + foeResources[k];
                    statPicsRight[k].alpha = statNumsRight[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthRight.scalex = .67 * (foeHealthStat / 10);
            }
        }
        else {
            if (foeActive && !foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x += 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x -= 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelRight.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsRight[0].visible = false;
                else {
                    itemPicsRight[0].visible = true;
                    itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsRight[1].visible = false;
                else {
                    itemPicsRight[1].visible = true;
                    itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsRight[2].visible = false;
                else {
                    itemPicsRight[2].visible = true;
                    itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsRight[k].tx = "" + resources[k];
                statPicsRight[k].alpha = statNumsRight[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthRight.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameLeft.text = foeNameString;
                headEntLeft.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelLeft.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsLeft[0].visible = false;
                    else {
                        itemPicsLeft[0].visible = true;
                        itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsLeft[1].visible = false;
                    else {
                        itemPicsLeft[1].visible = true;
                        itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsLeft[2].visible = false;
                    else {
                        itemPicsLeft[2].visible = true;
                        itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsLeft[k].tx = "" + foeResources[k];
                    statPicsLeft[k].alpha = statNumsLeft[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthLeft.scalex = .67 * (foeHealthStat / 10);
            }
        }
    }
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("startround", function (p) {
        accepted = false;
        endOfRoundSound.play();
        curFoe = null;
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
            foeID = curFoe.st[1];
            foeNameString = curFoe.nm;
            foenameColor = cols[foeID % 10];
            foeHeadPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
            foeHealthStat = curFoe.st[0];
            foeitem1 = curFoe.st[4];
            foeitem2 = curFoe.st[5];
            foeitem3 = curFoe.st[6];
            foeResources = curFoe.rs;
        }
        reset();
    })
        .Register("time", function (p) {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6 && !accepted) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Register("pl", function (p) {
        playerStats[p.nm] = p;
        if (p.nm != apg.playerName)
            return;
        myStats = p;
        healthStat = p.st[0];
        if (p.st[3] != -1)
            curRow = p.st[3];
        if (p.st[2] != -1)
            curBuilding = p.st[2] % 6;
        item1 = p.st[4];
        item2 = p.st[5];
        item3 = p.st[6];
        resources = p.rs;
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
    function setToolTip(str) { toolTip = str; }
    var tick = 0;
    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
        upd: function (e) {
            tick++;
            if (accepted) {
                w.y = w.y * .9 + .1 * -500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            choiceButtons[2].setParms(curBuilding, item1, item2, item3, resources, forceReset);
            forceReset = false;
            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;
            }
            choiceButtons[0].update(true);
            choiceButtons[1].update(true);
            choiceButtons[2].update(true);
            choiceButtons[3].update(true);
        }
    });
    choiceButtons = addActions(choices, setToolTip);
    new enttx(w, roundx + 260, 35, "Action for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, roundx + 400, 35, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    var nameHeight = 138;
    var healthHeight = 158;
    var playerLeft = [];
    var playerRight = [];
    function a1(e) { console.log(e); playerLeft.push(e); }
    function a2(e) { playerRight.push(e); }
    function a1l(l) { for (var e in l)
        playerLeft.push(l[e]); }
    function a2l(l) { for (var e in l)
        playerRight.push(l[e]); }
    buildingPic = new ent(w, infox + 140, infoy + 86, buildingPicName, { color: 0xa0a0a0 });
    vsLabel = new enttx(w, infox + 160, infoy + -90 + 18 + nameHeight, 'VS', { font: '24px ' + fontName });
    headEntLeft = new ent(w, infox + 50, infoy + ((team == 1) ? 50 : 80), (team == 1) ? headPic : foeHeadPic, { scalex: (team == 1) ? .75 : .5, scaley: (team == 1) ? .75 : .5, color: (team == 1) ? 0xffffff : 0xa0a0a0 });
    a1(headEntLeft);
    nameLeft = new enttx(w, infox + 50, infoy + nameHeight, (team == 1) ? apg.playerName : foeNameString, { font: '12px ' + fontName, fill: (team == 1) ? nameColor : foenameColor });
    a1(nameLeft);
    a1(new ent(w, infox + 46, infoy + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthLeft = new ent(w, infox + 47, infoy + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a1(healthLeft);
    var itemLeft = 136 + infox;
    var itemRight = 192 + infoy;
    var itemVert = 170;
    itemLabelLeft = new enttx(w, infox + itemLeft, infoy + itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a1(itemLabelLeft);
    itemPicsLeft = [new ent(w, itemLeft, itemVert, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 16, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 32, 'cartoongame/imgs/sitems/srocket2.png')];
    a1l(itemPicsLeft);
    a1(new enttx(w, infox + 52, infoy + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    function category(msg, x, y) { return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' }); }
    function inCategory(x, y, add, labels, bump1) {
        if (bump1 === void 0) { bump1 = false; }
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new enttx(w, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' }));
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
    function picCategory(x, y, add, labels) {
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new ent(w, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 }));
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
    a1(new enttx(w, statx + 110 - 30 + 76, staty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsLeft = picCategory(10 + statx + 194 - 50, staty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a1l(statPicsLeft);
    statNumsLeft = inCategory(6 + statx + 214 - 50, staty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a1l(statNumsLeft);
    itemLabelRight = new enttx(w, infox + itemRight, infoy + itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a2(itemLabelRight);
    itemPicsRight = [new ent(w, itemRight, itemVert, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 16, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 32, 'cartoongame/imgs/sitems/sbomb.png')];
    a2l(itemPicsRight);
    headEntRight = new ent(w, infox + 230 + (team == 1 ? 0 : -40), infoy + ((team == 1) ? 80 : 50), (team == 1) ? foeHeadPic : headPic, { scalex: (team == 1) ? .5 : .75, scaley: (team == 1) ? .5 : .75, color: (team == 1) ? 0xa0a0a0 : 0xffffff });
    a2(headEntRight);
    nameRight = new enttx(w, infox + 210, infoy + nameHeight, (team == 1) ? foeNameString : apg.playerName, { font: '12px ' + fontName, fill: (team == 1) ? foenameColor : nameColor });
    a2(nameRight);
    a2(new ent(w, infox + 250, infoy + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthRight = new ent(w, infox + 251, infoy + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a2(healthRight);
    a2(new enttx(w, infox + 280, infoy + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    a2(new enttx(w, foestatx + 60 + -20 + 240, foestaty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsRight = picCategory(foestatx + foeAdd + 194 - 50, foestaty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a2l(statPicsRight);
    statNumsRight = inCategory(-4 + foestatx + foeAdd + 214 - 50, foestaty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a2l(statNumsRight);
    var tipIconsy = 80;
    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipIconsy + tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' });
    requiresLabel.visible = false;
    var resource1 = new ent(w, tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource1.visible = false;
    var resource2 = new ent(w, 32 + tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource2.visible = false;
    var resource3 = new ent(w, 64 + tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource3.visible = false;
    var extractx = 48;
    var extracty = 36;
    var extractLabel = new enttx(w, -48 + extractx + tipx + 250, tipIconsy + 32 + extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' });
    extractLabel.visible = false;
    var extractIcon1 = new ent(w, extractx + tipx + 266, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon1.visible = false;
    var extractIcon2 = new ent(w, extractx + tipx + 266 + 32, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon2.visible = false;
    var extractIcon3 = new ent(w, extractx + tipx + 266 + 64, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 });
    extractIcon3.visible = false;
    var ab1x = 16 + 48;
    var ab2x = 26 + 48;
    var aby = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, tipIconsy + 32 + aby + 12 + tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' });
    abilitiesLabel.visible = false;
    var lastToolTip = '';
    new enttx(w, tipx + 260, tipy + 140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 250 }, {
        upd: function (e) {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = extractLabel.visible = abilitiesLabel.visible = requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'building1') {
                    e.text = buildingAction1Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][1]];
                }
                if (toolTip == 'building2') {
                    e.text = buildingAction2Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource3.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][1]];
                    resource3.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][2]];
                }
                if (toolTip == 'extract') {
                    e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
                    extractLabel.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
                    extractIcon1.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][0]];
                    extractIcon2.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][1]];
                    extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[curBuilding]] + '.png';
                }
                if (toolTip == 'item1') {
                    e.text = itemHints[item1 + 1];
                }
                if (toolTip == 'item2') {
                    e.text = itemHints[item2 + 1];
                }
                if (toolTip == 'item3') {
                    e.text = itemHints[item3 + 1];
                }
            }
        }
    });
    var timex = 70;
    var timey = -100;
    category("Time", -110 + 650 + timex, 30 + 336 + timey);
    new enttx(w, -110 + 650 + timex, 30 + 354 + timey, "", { font: '40px ' + fontName, fill: '#688' }, { upd: function (e) { e.text = "" + timer; e.fill = roundColors[(roundNumber - 1) % roundColors.length]; } });
    if (apg.allowFullScreen) {
        new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });
    }
    reset();
    if (apg.networkTestSequence)
        MainInputTestSequence(apg);
}
function PlayerActionNew(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/PlayActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var resources = [], foeResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
    var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];
    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
    var ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
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
    var headNum = id + 1 + ((team == 2) ? 10 : 0);
    var nameColor = cols[id % 10];
    var foenameColor = cols[7];
    var bodyColor = cols2[id % 10];
    var playerStats = {};
    var timer = 0;
    var buildingPic;
    var headEntLeft, headEntRight;
    var roundNumber = 2;
    var nameLeft, nameRight;
    var healthLeft, foeHealthBk, healthRight;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = {
        nm: "",
        st: [10,
            10,
            0,
            0,
            -1, -1, -1],
        rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    resources = myStats.rs;
    var toolTip = "";
    var choiceButtons, statPicsLeft, statNumsLeft, statPicsRight, statNumsRight;
    var item1 = myStats.st[4], item2 = myStats.st[5], item3 = myStats.st[6];
    var lastRoundUpdate = 0;
    var vsLabel;
    var itemLabelLeft;
    var itemLabel2;
    var itemPicsLeft;
    var itemPicsRight, itemLabelRight;
    var healthStat = 10;
    var curBuilding = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow = id < 6 ? 1 : 0;
    var buildingPicName = 'cartoongame/imgs/buildings/building1.png';
    var headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var foeHeadPic = 'cartoongame/imgs/heads/headbig20.png';
    var sfoeheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var accepted = false;
    var curFoe = null;
    var foeHealthStat = 10, foeitem1 = -1, foeitem2 = -1, foeitem3 = -1;
    var roundColors = ['#468', '#846', '#684'];
    var roundx = 160;
    var tipx = -170;
    var tipy = -60;
    var infox = 480;
    var infoy = 30;
    var statx = -110 + infox;
    var staty = -176 + infoy;
    var foestatx = -60 + infox;
    var foestaty = -176 + infoy;
    var foeAdd = 130;
    var foeActive = false, foeActiveOld = true;
    var forceReset = true;
    var foeNameString = 'xxxFirestormxxx', foeID = 0;
    function addActions(srcChoices, setToolTip) {
        var curCollection = 0;
        function add(isActions, choiceSet) {
            var id = curCollection;
            curCollection++;
            return new ButtonCollection(isActions, w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));
            }
            o.push(add(actions[j].isActions, p));
        }
        return o;
    }
    function reset() {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;
        choices[0] = curBuilding;
        choices[1] = curRow;
        choices[2] = 0;
        buildingPic.tex = 'cartoongame/imgs/buildings/building' + (curBuilding + 1) + '.png';
        if (team == 1) {
            if (foeActive && !foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x -= 32;
                for (var r in playerRight)
                    playerRight[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerLeft)
                    playerLeft[r].x += 32;
                for (var r in playerRight)
                    playerRight[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelLeft.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsLeft[0].visible = false;
                else {
                    itemPicsLeft[0].visible = true;
                    itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsLeft[1].visible = false;
                else {
                    itemPicsLeft[1].visible = true;
                    itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsLeft[2].visible = false;
                else {
                    itemPicsLeft[2].visible = true;
                    itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsLeft[k].tx = "" + resources[k];
                statPicsLeft[k].alpha = statNumsLeft[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthLeft.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameRight.text = foeNameString;
                headEntRight.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelRight.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsRight[0].visible = false;
                    else {
                        itemPicsRight[0].visible = true;
                        itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsRight[1].visible = false;
                    else {
                        itemPicsRight[1].visible = true;
                        itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsRight[2].visible = false;
                    else {
                        itemPicsRight[2].visible = true;
                        itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsRight[k].tx = "" + foeResources[k];
                    statPicsRight[k].alpha = statNumsRight[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthRight.scalex = .67 * (foeHealthStat / 10);
            }
        }
        else {
            if (foeActive && !foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x += 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = true;
            }
            if (!foeActive && foeActiveOld) {
                for (var r in playerRight)
                    playerRight[r].x -= 32;
                for (var r in playerLeft)
                    playerLeft[r].visible = false;
            }
            foeActiveOld = foeActive;
            for (var k = 0; k < 3; k++) {
                itemLabelRight.alpha = (item1 != -1) ? 1 : .3;
                if (item1 == -1)
                    itemPicsRight[0].visible = false;
                else {
                    itemPicsRight[0].visible = true;
                    itemPicsRight[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[item1] + '.png';
                }
                if (item2 == -1)
                    itemPicsRight[1].visible = false;
                else {
                    itemPicsRight[1].visible = true;
                    itemPicsRight[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[item2] + '.png';
                }
                if (item3 == -1)
                    itemPicsRight[2].visible = false;
                else {
                    itemPicsRight[2].visible = true;
                    itemPicsRight[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[item3] + '.png';
                }
            }
            for (var k = 0; k < 10; k++) {
                statNumsRight[k].tx = "" + resources[k];
                statPicsRight[k].alpha = statNumsRight[k].alpha = (resources[k] == 0) ? .5 : 1;
            }
            healthRight.scalex = .67 * (healthStat / 10);
            if (foeActive) {
                nameLeft.text = foeNameString;
                headEntLeft.tex = foeHeadPic;
                for (var k = 0; k < 3; k++) {
                    itemLabelLeft.alpha = (foeitem1 != -1) ? 1 : .3;
                    if (foeitem1 == -1)
                        itemPicsLeft[0].visible = false;
                    else {
                        itemPicsLeft[0].visible = true;
                        itemPicsLeft[0].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem1] + '.png';
                    }
                    if (foeitem2 == -1)
                        itemPicsLeft[1].visible = false;
                    else {
                        itemPicsLeft[1].visible = true;
                        itemPicsLeft[1].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem2] + '.png';
                    }
                    if (foeitem3 == -1)
                        itemPicsLeft[2].visible = false;
                    else {
                        itemPicsLeft[2].visible = true;
                        itemPicsLeft[2].tex = 'cartoongame/imgs/sitems/' + itemIcons[foeitem3] + '.png';
                    }
                }
                for (var k = 0; k < 10; k++) {
                    statNumsLeft[k].tx = "" + foeResources[k];
                    statPicsLeft[k].alpha = statNumsLeft[k].alpha = (foeResources[k] == 0) ? .5 : 1;
                }
                healthLeft.scalex = .67 * (foeHealthStat / 10);
            }
        }
    }
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("startround", function (p) {
        accepted = false;
        endOfRoundSound.play();
        curFoe = null;
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
            foeID = curFoe.st[1];
            foeNameString = curFoe.nm;
            foenameColor = cols[foeID % 10];
            foeHeadPic = 'cartoongame/imgs/heads/headbig' + (foeID + 1 + ((team == 2) ? 0 : 10)) + '.png';
            foeHealthStat = curFoe.st[0];
            foeitem1 = curFoe.st[4];
            foeitem2 = curFoe.st[5];
            foeitem3 = curFoe.st[6];
            foeResources = curFoe.rs;
        }
        reset();
    })
        .Register("time", function (p) {
        timer = p.time;
        roundNumber = p.round;
        if (timer < 6 && !accepted) {
            warningSound.play('', 0, 1 - (timer * 15) / 100);
        }
    })
        .Register("pl", function (p) {
        playerStats[p.nm] = p;
        if (p.nm != apg.playerName)
            return;
        myStats = p;
        healthStat = p.st[0];
        if (p.st[3] != -1)
            curRow = p.st[3];
        if (p.st[2] != -1)
            curBuilding = p.st[2] % 6;
        item1 = p.st[4];
        item2 = p.st[5];
        item3 = p.st[6];
        resources = p.rs;
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
    function setToolTip(str) { toolTip = str; }
    var tick = 0;
    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
        upd: function (e) {
            tick++;
            if (accepted) {
                w.y = w.y * .9 + .1 * -500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            choiceButtons[2].setParms(curBuilding, item1, item2, item3, resources, forceReset);
            forceReset = false;
            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;
            }
            choiceButtons[0].update(true);
            choiceButtons[1].update(true);
            choiceButtons[2].update(true);
            choiceButtons[3].update(true);
        }
    });
    choiceButtons = addActions(choices, setToolTip);
    new enttx(w, roundx + 260, 35, "Action for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, roundx + 400, 35, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    var nameHeight = 138;
    var healthHeight = 158;
    var playerLeft = [];
    var playerRight = [];
    function a1(e) { console.log(e); playerLeft.push(e); }
    function a2(e) { playerRight.push(e); }
    function a1l(l) { for (var e in l)
        playerLeft.push(l[e]); }
    function a2l(l) { for (var e in l)
        playerRight.push(l[e]); }
    buildingPic = new ent(w, infox + 140, infoy + 86, buildingPicName, { color: 0xa0a0a0 });
    vsLabel = new enttx(w, infox + 160, infoy + -90 + 18 + nameHeight, 'VS', { font: '24px ' + fontName });
    headEntLeft = new ent(w, infox + 50, infoy + ((team == 1) ? 50 : 80), (team == 1) ? headPic : foeHeadPic, { scalex: (team == 1) ? .75 : .5, scaley: (team == 1) ? .75 : .5, color: (team == 1) ? 0xffffff : 0xa0a0a0 });
    a1(headEntLeft);
    nameLeft = new enttx(w, infox + 50, infoy + nameHeight, (team == 1) ? apg.playerName : foeNameString, { font: '12px ' + fontName, fill: (team == 1) ? nameColor : foenameColor });
    a1(nameLeft);
    a1(new ent(w, infox + 46, infoy + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthLeft = new ent(w, infox + 47, infoy + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a1(healthLeft);
    var itemLeft = 136 + infox;
    var itemRight = 192 + infoy;
    var itemVert = 170;
    itemLabelLeft = new enttx(w, infox + itemLeft, infoy + itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a1(itemLabelLeft);
    itemPicsLeft = [new ent(w, itemLeft, itemVert, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 16, 'cartoongame/imgs/sitems/srocket2.png'),
        new ent(w, itemLeft, itemVert + 32, 'cartoongame/imgs/sitems/srocket2.png')];
    a1l(itemPicsLeft);
    a1(new enttx(w, infox + 52, infoy + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    function category(msg, x, y) { return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' }); }
    function inCategory(x, y, add, labels, bump1) {
        if (bump1 === void 0) { bump1 = false; }
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new enttx(w, curx, cury, labels[k], { font: '14px ' + fontName, fill: '#211' }));
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
    function picCategory(x, y, add, labels) {
        var labelEnts = [];
        var curx = x;
        var cury = y;
        for (var k = 0; k < labels.length; k++) {
            labelEnts.push(new ent(w, curx, cury, 'cartoongame/imgs/resources/' + labels[k], { scalex: .5, scaley: .5 }));
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
    a1(new enttx(w, statx + 110 - 30 + 76, staty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsLeft = picCategory(10 + statx + 194 - 50, staty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a1l(statPicsLeft);
    statNumsLeft = inCategory(6 + statx + 214 - 50, staty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a1l(statNumsLeft);
    itemLabelRight = new enttx(w, infox + itemRight, infoy + itemVert - 14, 'Items', { font: '10px ' + fontName, fill: '#555' });
    a2(itemLabelRight);
    itemPicsRight = [new ent(w, itemRight, itemVert, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 16, 'cartoongame/imgs/sitems/sbomb.png'),
        new ent(w, itemRight, itemVert + 32, 'cartoongame/imgs/sitems/sbomb.png')];
    a2l(itemPicsRight);
    headEntRight = new ent(w, infox + 230 + (team == 1 ? 0 : -40), infoy + ((team == 1) ? 80 : 50), (team == 1) ? foeHeadPic : headPic, { scalex: (team == 1) ? .5 : .75, scaley: (team == 1) ? .5 : .75, color: (team == 1) ? 0xa0a0a0 : 0xffffff });
    a2(headEntRight);
    nameRight = new enttx(w, infox + 210, infoy + nameHeight, (team == 1) ? foeNameString : apg.playerName, { font: '12px ' + fontName, fill: (team == 1) ? foenameColor : nameColor });
    a2(nameRight);
    a2(new ent(w, infox + 250, infoy + healthHeight, 'cartoongame/imgs/whiteblock.png', { color: 0, scaley: .5, scalex: .7 }));
    healthRight = new ent(w, infox + 251, infoy + healthHeight + 1, 'cartoongame/imgs/whiteblock.png', { color: 0xff0000, scaley: .4, scalex: .67 });
    a2(healthRight);
    a2(new enttx(w, infox + 280, infoy + healthHeight - 3, 'Life', { font: '10px ' + fontName, fill: '#222' }));
    a2(new enttx(w, foestatx + 60 + -20 + 240, foestaty + 186 + 158, 'Resources', { font: '12px ' + fontName, fill: '#222' }));
    statPicsRight = picCategory(foestatx + foeAdd + 194 - 50, foestaty + 360, 13, ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png']);
    a2l(statPicsRight);
    statNumsRight = inCategory(-4 + foestatx + foeAdd + 214 - 50, foestaty + 360, 13, ["5", "0", "0", "0", "0", "10", "0", "0", "0", "0"]);
    a2l(statNumsRight);
    var tipIconsy = 80;
    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipIconsy + tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' });
    requiresLabel.visible = false;
    var resource1 = new ent(w, tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource1.visible = false;
    var resource2 = new ent(w, 32 + tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource2.visible = false;
    var resource3 = new ent(w, 64 + tipx + 250, tipIconsy + tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource3.visible = false;
    var extractx = 48;
    var extracty = 36;
    var extractLabel = new enttx(w, -48 + extractx + tipx + 250, tipIconsy + 32 + extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' });
    extractLabel.visible = false;
    var extractIcon1 = new ent(w, extractx + tipx + 266, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon1.visible = false;
    var extractIcon2 = new ent(w, extractx + tipx + 266 + 32, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon2.visible = false;
    var extractIcon3 = new ent(w, extractx + tipx + 266 + 64, tipIconsy + extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 });
    extractIcon3.visible = false;
    var ab1x = 16 + 48;
    var ab2x = 26 + 48;
    var aby = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, tipIconsy + 32 + aby + 12 + tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' });
    abilitiesLabel.visible = false;
    var lastToolTip = '';
    new enttx(w, tipx + 260, tipy + 140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 250 }, {
        upd: function (e) {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = extractLabel.visible = abilitiesLabel.visible = requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'building1') {
                    e.text = buildingAction1Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[firstAbilityCosts[curBuilding][1]];
                }
                if (toolTip == 'building2') {
                    e.text = buildingAction2Hints[curBuilding];
                    requiresLabel.visible = true;
                    resource1.visible = true;
                    resource2.visible = true;
                    resource3.visible = true;
                    resource1.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][0]];
                    resource2.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][1]];
                    resource3.tex = 'cartoongame/imgs/resources/' + resourceIcons[secondAbilityCosts[curBuilding][2]];
                }
                if (toolTip == 'extract') {
                    e.text = "EXTRACT: Randomly extract a resource or item from the building you're at.  This won't work if the building is already in use this turn.  What you get depends on the quirk of the building.  You might dodge airbourne attacks sometmies when you're doing this.";
                    extractLabel.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
                    extractIcon1.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][0]];
                    extractIcon2.tex = 'cartoongame/imgs/resources/' + resourceIcons[extractResources[curBuilding][1]];
                    extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[curBuilding]] + '.png';
                }
                if (toolTip == 'item1') {
                    e.text = itemHints[item1 + 1];
                }
                if (toolTip == 'item2') {
                    e.text = itemHints[item2 + 1];
                }
                if (toolTip == 'item3') {
                    e.text = itemHints[item3 + 1];
                }
            }
        }
    });
    var timex = 70;
    var timey = -100;
    category("Time", -110 + 650 + timex, 30 + 336 + timey);
    new enttx(w, -110 + 650 + timex, 30 + 354 + timey, "", { font: '40px ' + fontName, fill: '#688' }, { upd: function (e) { e.text = "" + timer; e.fill = roundColors[(roundNumber - 1) % roundColors.length]; } });
    if (apg.allowFullScreen) {
        new enttx(w, 100, 700, "Your actions were submitted just fine!  Now just relax until the next round.", { font: '18px ' + fontName, fill: '#433' });
    }
    reset();
    if (apg.networkTestSequence)
        MainInputTestSequence(apg);
}
function PlayerMovement(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    var actions = apg.JSONAssets['cartoongame/json/MoveActions.json'];
    var endOfRoundSound = apg.g.add.audio('cartoongame/snds/fx/strokeup4.mp3', 1, false);
    var warningSound = apg.g.add.audio('cartoongame/snds/fx/strokeup.mp3', 1, false);
    var itemIcons = ['stennisball', 'sbomb', 'shammer2', 'sscarymask', 'srocket2', 'sshield'];
    var itemIcons2 = ['ball', 'bomb', 'hammer', 'mask', 'rocket', 'shield'];
    var cols = ['#369', '#693', '#936', '#963', '#639', '#396', '#888', '#933', '#393', '#339'];
    var cols2 = [0x306090, 0x609030, 0x903060, 0x906030, 0x603090, 0x309060, 0x808080, 0x903030, 0x309030, 0x303090];
    var resources = [], foeResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var extractResources = [[Resource.TBone, Resource.Corn], [Resource.Acid, Resource.Goo], [Resource.Corn, Resource.Beans], [Resource.FrothyDrink, Resource.Burger], [Resource.FrothyDrink, Resource.Bribe], [Resource.Fries, Resource.Taco]];
    var extractItems = [ItemIds.Hammer, ItemIds.ScaryMask, ItemIds.Bomb, ItemIds.TennisBall, ItemIds.Rocket, ItemIds.Shield];
    var resourceIcons = ['beer.png', 'burger.png', 'canofbeans.png', 'chemicals.png', 'chemicals2.png', 'corn.png', 'dollar2.png', 'fries.png', 'taco1.png', 'tbone_steak.png'];
    var firstAbilityCosts = [[Resource.Goo, Resource.Beans], [Resource.Goo, Resource.Corn], [Resource.Goo, Resource.Fries], [Resource.FrothyDrink, Resource.Beans], [Resource.Bribe, Resource.Burger], [Resource.FrothyDrink, Resource.TBone]];
    var secondAbilityCosts = [[Resource.Bribe, Resource.Burger, Resource.Fries], [Resource.Acid, Resource.Beans, Resource.TBone], [Resource.Acid, Resource.Burger, Resource.Taco], [Resource.Bribe, Resource.Corn, Resource.TBone],
        [Resource.FrothyDrink, Resource.Fries, Resource.Taco], [Resource.Acid, Resource.Corn, Resource.Taco]];
    var ability1Pics = ['cow', 'fish', 'flowers', 'biplane', 'policecopter', 'meds'];
    var ability2Pics = ['broccoli', 'turtles', 'sun', 'blimp', 'policecar', 'fairyability'];
    var buildingHints = [
        "FARM - A rustic farm, soothing with pastoral delights.  These produce the finest in organic free-range broccoli and cage free cows.  Family owned for millenia, they're certified organic by the ATF.",
        "POND - A simple fishing hole of no note.  Local rumors say deep in the bowels of this very shallow pond drift massive tentacles, and burbling from the murk rises the odd sound Ph'nglui mglw'nafh....",
        "GREENHOUSE - A state of the art plant nurturing facility.  Contrary to claims spread by the valued team members of local fast food shops, this greenhouse only grows licit, nonmedical plants, man.",
        "AIRPORT - A cozy commuter airport with 3 gates.  A cinnamon bun shops sells icing blobs with bits of bun, security takes all of 3 minutes, and all flights require 3 connecting flights to get anywhere.",
        "POLICE STATION - The local constabulary.  They keep the peace, but owing to increasing civil forfeiture laws, the piece they keep is getting to be rather large.",
        "HOSPITAL - A local clinic."
    ];
    var headNum = id + 1 + ((team == 2) ? 10 : 0);
    var nameColor = cols[id % 10];
    var foenameColor = cols[7];
    var bodyColor = cols2[id % 10];
    var playerStats = {};
    var timer = 0;
    var roundNumber = 2;
    var foeHealthBk;
    var choices = [1, 1, 1, 1, 1, 1];
    var myStats = {
        nm: "",
        st: [10,
            10,
            0,
            0,
            -1, -1, -1],
        rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    resources = myStats.rs;
    var toolTip = "";
    var choiceButtons;
    var stanceBody, stanceHead, locBody, locHead;
    var playerLabel;
    var lastRoundUpdate = 0;
    var curBuilding = (team == 2) ? (5 - id % 6) : id % 6;
    var curRow = id < 6 ? 1 : 0;
    var headPic = 'cartoongame/imgs/heads/headbig' + headNum + '.png';
    var sheadPic = 'cartoongame/imgs/sheads/shead' + headNum + '.png';
    var bodyPic = 'cartoongame/imgs/body' + (team == 1 ? 'right' : 'left') + '.png';
    var accepted = false;
    var roundColors = ['#468', '#846', '#684'];
    var roundx = 100;
    var tipx = -170;
    var tipy = -60;
    var mapRowx = -150;
    var mapRowy = 60 - 32 - 16;
    var mapBuildingx = 44;
    var mapBuildingy = -160 - 32;
    var forceReset = true;
    function addActions(srcChoices, setToolTip) {
        var curCollection = 0;
        function add(isActions, choiceSet) {
            var id = curCollection;
            curCollection++;
            return new ButtonCollection(isActions, w, apg, 22, setToolTip, function (v) { return srcChoices[id] = v; }, choiceSet);
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
                p.push(new ActionEntry(r.name, r.tip, r.pic, actions[j].x + xv, actions[j].y + r.y, r.specialID));
            }
            o.push(add(actions[j].isActions, p));
        }
        return o;
    }
    function reset() {
        choiceButtons[0].selected = curBuilding;
        choiceButtons[1].selected = curRow;
        choiceButtons[2].selected = 0;
        choiceButtons[3].selected = -1;
        choices[0] = curBuilding;
        choices[1] = curRow;
        choices[2] = 0;
        stanceBody.x = mapRowx + 740 + (curRow - 1) * 40;
        stanceHead.x = mapRowx + 731 + (curRow - 1) * 40;
        stanceBody.y = 30 + 160 + curRow * 40;
        stanceHead.y = 30 + 146 + curRow * 40;
        locBody.x = 30 + 330 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        locHead.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
        playerLabel.x = 30 + 320 + 64 * (team == 1 ? curBuilding : 5 - curBuilding);
    }
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("startround", function (p) {
        accepted = false;
        endOfRoundSound.play();
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
        myStats = p;
        if (p.st[3] != -1)
            curRow = p.st[3];
        if (p.st[2] != -1)
            curBuilding = p.st[2] % 6;
        resources = p.rs;
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
    function setToolTip(str) { toolTip = str; }
    var tick = 0;
    new ent(w, 0, 0, 'cartoongame/imgs/bkg_guide4.png', {
        upd: function (e) {
            tick++;
            if (accepted) {
                w.y = w.y * .9 + .1 * -500;
            }
            else {
                w.y = w.y * .9 + .1 * 0;
            }
            forceReset = false;
            if (choiceButtons[3].selected == 0) {
                endOfRoundSound.play();
                accepted = true;
                choiceButtons[3].selected = -1;
            }
            choiceButtons[0].update(true);
            choiceButtons[1].update(true);
            choiceButtons[2].update(true);
            choiceButtons[3].update(true);
        }
    });
    choiceButtons = addActions(choices, setToolTip);
    new enttx(w, roundx + 260, 25, "Position for ", { font: '36px ' + fontName, fill: '#444' });
    new enttx(w, roundx + 420, 25, "Round ", { font: '36px ' + fontName, fill: roundColors[1] }, {
        upd: function (e) {
            if (roundNumber != lastRoundUpdate) {
                e.text = "Round " + (roundNumber);
                e.fill = roundColors[(roundNumber - 1) % roundColors.length];
                lastRoundUpdate = roundNumber;
            }
        }
    });
    function category(msg, x, y) { return new enttx(w, x, y, msg, { font: '18px ' + fontName, fill: '#433' }); }
    new ent(w, mapBuildingx + 270, mapBuildingy + 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    new ent(w, mapBuildingx + 680, mapBuildingy + 265, 'cartoongame/imgs/flag' + (team == 1 ? 1 : 2) + 'small.png');
    locBody = new ent(w, mapBuildingx + 330 + 64 * curBuilding, mapBuildingy + 16 + 285, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    locHead = new ent(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy + 16 + 271, sheadPic);
    playerLabel = new enttx(w, mapBuildingx + 320 + 64 * curBuilding, mapBuildingy + 16 + 320, apg.playerName, { font: '12px ' + fontName, fill: nameColor });
    var moveArrow = [];
    for (var k = 0; k < 6; k++) {
        var art = 'mid';
        if (k == 0)
            art = 'cap';
        if (k == 5)
            art = 'head';
        moveArrow.push(new ent(w, 310 + mapBuildingx + 64 * k, 280 + mapBuildingy, 'cartoongame/imgs/arrow' + art + '.png', { alpha: .5, upd: function (e) { e.alpha = .2 + .2 * Math.cos(tick * .03); } }));
        moveArrow[k].visible = false;
    }
    new enttx(w, mapRowx + 700, mapRowy + 110, "", { font: '24px ' + fontName, fill: '#A00' });
    stanceBody = new ent(w, mapRowx + 740 + (curRow - 1) * 40, mapRowy + 160 + curRow * 40, bodyPic, { scalex: 1, scaley: 1, color: bodyColor });
    stanceHead = new ent(w, mapRowx + 731 + (curRow - 1) * 40, mapRowy + 146 + curRow * 40, sheadPic);
    new enttx(w, tipx + 250, tipy + 110, "Tip", { font: '18px ' + fontName, fill: '#433' }, { upd: function (e) { e.visible = (toolTip == "") ? false : true; } });
    var requiresLabel = new enttx(w, tipx + 250, tipy + 260, "Cost", { font: '18px ' + fontName, fill: '#433' });
    requiresLabel.visible = false;
    var resource1 = new ent(w, tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource1.visible = false;
    var resource2 = new ent(w, 32 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource2.visible = false;
    var resource3 = new ent(w, 64 + tipx + 250, tipy + 280, 'cartoongame/imgs/resources/beer.png');
    resource3.visible = false;
    var extractx = 48;
    var extracty = 36;
    var extractLabel = new enttx(w, -48 + extractx + tipx + 250, 32 + extracty + tipy + 190, "Extract", { font: '18px ' + fontName, fill: '#433' });
    extractLabel.visible = false;
    var extractIcon1 = new ent(w, extractx + tipx + 266, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon1.visible = false;
    var extractIcon2 = new ent(w, extractx + tipx + 266 + 32, extracty + tipy + 210, 'cartoongame/imgs/resources/beer.png');
    extractIcon2.visible = false;
    var extractIcon3 = new ent(w, extractx + tipx + 266 + 64, extracty + tipy + 210, 'cartoongame/imgs/items/ball.png', { scalex: .5, scaley: .5 });
    extractIcon3.visible = false;
    var ab1x = 16 + 48;
    var ab2x = 26 + 48;
    var aby = 8;
    var abilitiesLabel = new enttx(w, tipx + 250, 32 + aby + 12 + tipy + 240, "Abilities", { font: '18px ' + fontName, fill: '#433' });
    abilitiesLabel.visible = false;
    var skillIcon1 = new ent(w, ab1x + tipx + 250, aby + tipy + 276, 'cartoongame/imgs/abilities/biplane.png', { scalex: .5, scaley: .5 });
    skillIcon1.visible = false;
    var skillIcon1r1 = new ent(w, ab1x + tipx + 250, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon1r1.visible = false;
    var skillIcon1r2 = new ent(w, ab1x + tipx + 250 + 16, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon1r2.visible = false;
    var skillIcon2 = new ent(w, 40 + ab2x + tipx + 250, aby + tipy + 276, 'cartoongame/imgs/abilities/blimp.png', { scalex: .5, scaley: .5 });
    skillIcon2.visible = false;
    var skillIcon2r1 = new ent(w, 40 + ab2x + tipx + 250, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r1.visible = false;
    var skillIcon2r2 = new ent(w, 40 + ab2x + tipx + 250 + 16, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r2.visible = false;
    var skillIcon2r3 = new ent(w, 40 + ab2x + tipx + 250 + 32, aby + tipy + 310, 'cartoongame/imgs/resources/beer.png', { scalex: .5, scaley: .5 });
    skillIcon2r3.visible = false;
    var lastToolTip = '';
    function doBuildingTip(e, id) {
        var res = 'cartoongame/imgs/resources/';
        e.text = buildingHints[id];
        abilitiesLabel.visible = extractLabel.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = true;
        extractIcon1.tex = res + resourceIcons[extractResources[id][0]];
        extractIcon2.tex = res + resourceIcons[extractResources[id][1]];
        extractIcon3.tex = 'cartoongame/imgs/items/' + itemIcons2[extractItems[id]] + '.png';
        var alpha1 = (resources[firstAbilityCosts[id][0]] > 0 && resources[firstAbilityCosts[id][1]] > 0) ? 1 : .5;
        skillIcon1.tex = 'cartoongame/imgs/abilities/' + ability1Pics[id] + '.png';
        skillIcon1.alpha = alpha1;
        skillIcon1r1.tex = res + resourceIcons[firstAbilityCosts[id][0]];
        skillIcon1r1.alpha = alpha1;
        skillIcon1r2.tex = res + resourceIcons[firstAbilityCosts[id][1]];
        skillIcon1r2.alpha = alpha1;
        var alpha2 = (resources[secondAbilityCosts[id][0]] > 0 && resources[secondAbilityCosts[id][1]] > 0 && resources[secondAbilityCosts[id][2]] > 0) ? 1 : .5;
        skillIcon2.tex = 'cartoongame/imgs/abilities/' + ability2Pics[id] + '.png';
        skillIcon2.alpha = alpha2;
        skillIcon2r1.tex = res + resourceIcons[secondAbilityCosts[id][0]];
        skillIcon2r1.alpha = alpha2;
        skillIcon2r2.tex = res + resourceIcons[secondAbilityCosts[id][1]];
        skillIcon2r2.alpha = alpha2;
        skillIcon2r3.tex = res + resourceIcons[secondAbilityCosts[id][2]];
        skillIcon2r3.alpha = alpha2;
    }
    new enttx(w, tipx + 260, tipy + 140, "", { font: '17px ' + fontName, fill: '#455', wordWrap: true, wordWrapWidth: 250 }, {
        upd: function (e) {
            if (toolTip != lastToolTip) {
                e.text = toolTip;
                lastToolTip = toolTip;
                extractIcon1.visible = extractIcon2.visible = extractIcon3.visible = skillIcon2r1.visible = skillIcon2r2.visible = skillIcon2r3.visible = skillIcon2.visible = skillIcon1r1.visible = skillIcon1r2.visible = skillIcon1.visible = extractLabel.visible = abilitiesLabel.visible = requiresLabel.visible = resource1.visible = resource2.visible = resource3.visible = false;
                if (toolTip == 'farm')
                    doBuildingTip(e, 0);
                if (toolTip == 'pond')
                    doBuildingTip(e, 1);
                if (toolTip == 'greenhouse')
                    doBuildingTip(e, 2);
                if (toolTip == 'airport')
                    doBuildingTip(e, 3);
                if (toolTip == 'police')
                    doBuildingTip(e, 4);
                if (toolTip == 'hospital')
                    doBuildingTip(e, 5);
            }
        }
    });
    var timex = 70;
    var timey = -100;
    category("Time", -110 + 650 + timex, 30 + 336 + timey);
    new enttx(w, -110 + 650 + timex, 30 + 354 + timey, "", { font: '40px ' + fontName, fill: '#688' }, { upd: function (e) { e.text = "" + timer; e.fill = roundColors[(roundNumber - 1) % roundColors.length]; } });
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
    apg.WriteLocalAsServer(.1, "join", { name: apg.playerName, started: true, playerID: 2, team: 1 });
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
    new enttx(apg.g.world, 140, 380, "A", textColor, {
        upd: function (e) { e.x = vx; e.y = vy; }
    });
}
//# sourceMappingURL=GameLogic.js.map