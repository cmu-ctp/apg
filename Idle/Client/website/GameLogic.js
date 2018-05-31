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
    ent.prototype.inBounds = function (x, y) {
        if (x > this.world.x && y > this.world.y && x < this.world.x + this.width * this.worldScale.x && y < this.world.y + this.height * this.worldScale.y)
            return true;
        return false;
    };
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
    c.images('cartoongame/imgs', ['ClientUI11.png']);
    c.images('cartoongame/imgs/plantidle', ['flow2.png', 'flow3.png', 'flow4.png', 'flow6.png', 'flow15.png', 'grass1.png', 'bricks.png', 'rocks.png', 'dirt.png', 'button2.png', 'button3.png', 'divider.png', 'fillbar.png', 'numberbubble.png']);
    c.sounds('cartoongame/snds/fx', ['strokeup4.mp3']);
    WaitingToJoinCache(c);
    JoinAcknowledgeCache(c);
    ButtonCache(c);
}
function MainInputTestSequence(apg) {
    apg.ClearLocalMessages();
    var roundLength = 45;
    for (var j = 1; j <= 10; j++) {
        var roundTimeOffset = (j - 1) * roundLength;
        apg.WriteLocalAsServer(roundTimeOffset + roundLength, "submit", { choices: [] });
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
var fontName = "Caveat Brush";
var extraText = "";
var extraText2 = "";
var buttonsSet = (function () {
    function buttonsSet() {
        this.buttons = [];
        this.mouseLatch = false;
    }
    buttonsSet.prototype.addTip = function (b, tip) { b.text = tip; b.use = null; this.buttons.push(b); };
    buttonsSet.prototype.addButton = function (b, use) { b.use = use; this.buttons.push(b); };
    buttonsSet.prototype.addTipButton = function (b, tip, use) { b.text = tip; b.use = use; this.buttons.push(b); };
    buttonsSet.prototype.remove = function (b) { };
    buttonsSet.prototype.update = function (mx, my, isDown) {
        this.tip = "meh";
        this.activeButton = null;
        for (var k = 0; k < this.buttons.length; k++) {
            var b = this.buttons[k];
            if (b.inBounds(mx, my) == true) {
                this.tip = b.text;
                this.activeButton = b;
            }
        }
        if (isDown) {
            if (this.mouseLatch == false) {
                if (this.activeButton != null && this.activeButton.use != null)
                    this.activeButton.use(this.activeButton);
            }
            this.mouseLatch = true;
        }
        else
            this.mouseLatch = false;
    };
    buttonsSet.prototype.click = function () { };
    buttonsSet.prototype.clearAll = function () { };
    return buttonsSet;
}());
var singleResource = (function () {
    function singleResource() {
        this.level = 0;
        this.amount = 0;
    }
    return singleResource;
}());
var resources = (function () {
    function resources() {
        this.money = 100;
        this.res = [];
        for (var k = 0; k < resources.numResources; k++) {
            this.res.push(new singleResource());
        }
    }
    resources.numResources = 10;
    return resources;
}());
function addButton(apg, buttons, statGroup, pic, id, buttonsPerRow, bs, res) {
    var artDir = "cartoongame/imgs/plantidle/";
    var filling = 0;
    var upgradeScale = (1 + id);
    var upgradeCost = 1;
    var r = res.res[id];
    var fillSpeed = .04 / Math.pow(2, id);
    var g = new Phaser.Group(apg.g);
    buttons.add(g);
    g.x = Math.floor(id / buttonsPerRow) * 224;
    g.y = (id % buttonsPerRow) * 80;
    var resourceButton = new ent(g, 0, 0, artDir + 'button2.png', {
        upd: function (e) {
            if (filling == 0)
                return;
            filling += fillSpeed;
            fillingBar.scalex = .8 * filling;
            if (filling >= 1) {
                fillingBar.scalex = 0;
                filling = 0;
                r.amount += r.level;
                statAmount.text = "" + r.amount;
            }
        }
    });
    bs.addTipButton(resourceButton, "" + id, function () {
        if (filling > 0 || r.level < 1) {
            return;
        }
        filling = .01;
    });
    new ent(g, 0, 0, artDir + pic);
    new ent(g, 8, 52, artDir + 'numberbubble.png');
    var levelButton = new enttx(g, 24, 48, "0", { font: '20px ' + fontName, fill: '#fff' });
    new ent(g, 64, 8, artDir + 'fillbar.png', { scalex: .8, scaley: .8 });
    var fillingBar = new ent(g, 64, 8, artDir + 'fillbar.png', { scalex: 0, scaley: .8 });
    var buyPic = new ent(g, 72, 36, artDir + 'button3.png');
    bs.addTipButton(buyPic, "" + id + " A", function () {
        if (res.money < upgradeCost * upgradeScale) {
            return;
        }
        res.money -= upgradeCost * upgradeScale;
        upgradeCost += r.level;
        r.level++;
        levelButton.text = "" + r.level;
        cost.text = "" + upgradeCost * upgradeScale;
    });
    new enttx(g, 88, 40, "Buy", { font: '20px ' + fontName, fill: '#fff' });
    var cost = new enttx(g, 128, 40, "" + (upgradeCost * upgradeScale), { font: '20px ' + fontName, fill: '#fff' });
    var stat = new Phaser.Group(apg.g);
    statGroup.add(stat);
    stat.x = 0;
    stat.y = id * 80;
    var statPic = new ent(stat, 0, 0, artDir + pic);
    bs.addTip(statPic, "" + id + " S");
    var statAmount = new enttx(stat, 120, 12, "0", { font: '64px ' + fontName, fill: '#fff' });
}
function makeButtons(apg, bs, res) {
    var buttons = new Phaser.Group(apg.g);
    bs.group.add(buttons);
    buttons.x = 450;
    buttons.y = 120;
    buttons.scale = new Phaser.Point(.7, .7);
    var stats = new Phaser.Group(apg.g);
    bs.group.add(stats);
    stats.x = 350;
    stats.y = 150;
    stats.scale = new Phaser.Point(.3, .3);
    var pics = ['flow2.png', 'flow3.png', 'flow4.png', 'flow6.png', 'grass1.png', 'bricks.png', 'rocks.png', 'dirt.png'];
    for (var k = 0; k < pics.length; k++)
        addButton(apg, buttons, stats, pics[k], k, 4, bs, res);
}
function MainPlayerInput(apg, id, team) {
    var w = new Phaser.Group(apg.g);
    apg.g.world.add(w);
    var fontName = "Caveat Brush";
    apg.ResetServerMessageRegistry()
        .SetKeepAliveStatus(true)
        .RegisterDisconnect(function () {
        ent.clearAll();
        enttx.clearAll();
        WaitingToJoin(apg, "Something went wrong - no response from the streamer's game...  Make sure the streamer is online and still playing this game, then connect again!");
    })
        .Register("submit", function (p) {
    });
    var bs = new buttonsSet();
    bs.group = w;
    new ent(w, 0, 0, 'cartoongame/imgs/ClientUI11.png', {
        upd: function (e) {
            bs.update(apg.g.input.activePointer.x, apg.g.input.activePointer.y, apg.g.input.activePointer.isDown);
        }
    });
    new enttx(w, 20, 20, "?", { font: '20px ' + fontName, fill: '#fff' }, {
        upd: function (e) {
            e.tx = "" + bs.tip + " : " + res.money;
        }
    });
    var res = new resources();
    makeButtons(apg, bs, res);
    if (apg.networkTestSequence)
        MainInputTestSequence(apg);
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
    c.images('cartoongame/imgs/tutorial', ['clientHowToPlay.jpg', 'clientIngameScreen.jpg', 'clientMainTitle.jpg', 'clientPickAction.jpg', 'clientPickMove.jpg', 'clientWatchStats.jpg', 'clientPlayerAction.jpg', 'clientFinalClick.jpg']);
    c.sounds('cartoongame/snds/fx', ['strokeup2.mp3']);
    c.googleWebFonts(['Caveat Brush']);
}
function TutorialFlipbook(apg, pageNames) {
    function makeTutorialPage(label) {
        return new ent(apg.g.world, 240, 0, 'cartoongame/imgs/tutorial/' + label + '.jpg', {
            health: 2,
            upd: function (e) {
                if (e.health == 1) {
                    e.y = e.y * .7 + .3 * -240;
                    if (e.y < -230)
                        e.eliminate();
                }
            }
        });
    }
    var pageEnt = makeTutorialPage(pageNames[0]);
    var pointerDownLatch = false, curPage = 0;
    return function () {
        var doneWithTutorial = false;
        if (apg.g.input.activePointer.isDown) {
            if (pointerDownLatch == false) {
                pageEnt.health = 1;
                curPage++;
                if (curPage < pageNames.length)
                    pageEnt = makeTutorialPage(pageNames[curPage]);
                else {
                    doneWithTutorial = true;
                }
            }
            pointerDownLatch = true;
        }
        else {
            pointerDownLatch = false;
        }
        return doneWithTutorial;
    };
}
function WaitingToJoinTestSequence(apg) { apg.ClearLocalMessages(); }
function WaitingToJoin(apg, previousMessage) {
    if (previousMessage === void 0) { previousMessage = ""; }
    apg.ResetServerMessageRegistry().SetKeepAliveStatus(false);
    apg.WriteToServer("debugAppLaunch", {});
    var updateTutorial = TutorialFlipbook(apg, ['clientMainTitle']);
    var clickSound = apg.g.add.audio('cartoongame/snds/fx/strokeup2.mp3', .4, false);
    var inputUsed = false, endSubgame = false;
    function tryEnd(e, x) { if (endSubgame) {
        e.x = e.x * .7 + .3 * x;
        if (e.x < x + 3)
            e.eliminate();
        return true;
    } return false; }
    new ent(apg.g.world, 0, 0, 'cartoongame/imgs/ClientUI3.png', {
        scalex: 0, scaley: 0,
        upd: function (e) {
            if (tryEnd(e, -30))
                return;
            var doneWithTutorial = updateTutorial();
            if (apg.g.input.activePointer.isDown && doneWithTutorial && !inputUsed) {
                inputUsed = true;
                clickSound.play();
                WaitingForJoinAcknowledement(apg);
                apg.WriteToServer("join", {});
                endSubgame = true;
            }
        }
    });
    if (apg.networkTestSequence)
        WaitingToJoinTestSequence(apg);
}
//# sourceMappingURL=GameLogic.js.map