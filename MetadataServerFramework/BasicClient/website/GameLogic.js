function CacheGameAssets(c) {
    c.images('assets', ['hudselect.png']);
}
var ServerFireworksInst = (function () {
    function ServerFireworksInst() {
    }
    return ServerFireworksInst;
}());
var BasicGame = (function () {
    function BasicGame(apg) {
        var _this = this;
        this.highlighter = null;
        this.metadataInfo = null;
        this.registerServerMessages(apg);
        if (apg.networkTestSequence) {
            this.runTestSequence(apg);
        }
        var lastClickDelay = 0;
        var ID = 0;
        this.highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
        this.highlighter.blendMode = PIXI.blendModes.ADD;
        this.highlighter.anchor = new Phaser.Point(.5, .5);
        this.highlighter.scale = new Phaser.Point(1, 1);
        this.highlighter.update = function () {
            if (_this.metadataInfo != null) {
                _this.highlighter.x = _this.metadataInfo.items[ID].x;
                _this.highlighter.y = _this.metadataInfo.items[ID].y;
            }
            lastClickDelay--;
            if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                ID = (ID + 1) % 8;
                lastClickDelay = 20;
            }
        };
        apg.g.world.addChild(this.highlighter);
    }
    BasicGame.prototype.runTestSequence = function (apg) {
        apg.ClearLocalMessages();
        for (var k = 0; k < 60 * 60 * 5; k++) {
            var fireworks = new ServerFireworksInst();
            fireworks.items = [];
            for (var j = 0; j < 8; j++) {
                fireworks.items.push({ x: (400 + 300 * Math.cos(k * .02 - j * .2)) / 800 * 1024, y: (225 - 175 * Math.sin(k * .02 - j * .2)) / 450 * 768 });
            }
            apg.WriteLocalAsServer(k / 60, "serverFirework", fireworks);
        }
    };
    BasicGame.prototype.registerServerMessages = function (apg) {
        var _this = this;
        apg.ResetServerMessageRegistry();
        apg.Register("serverFirework", function (data) { return _this.metadataInfo = data; });
    };
    return BasicGame;
}());
function InitializeGame(apg) {
    new BasicGame(apg);
}
//# sourceMappingURL=GameLogic.js.map