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
        var metadataInfo = null;
        apg.ResetServerMessageRegistry();
        apg.Register("firework", function (p) {
            metadataInfo = p;
        });
        var lastClickDelay = 0;
        var ID = 0;
        this.highlighter = new Phaser.Sprite(apg.g, 0, 0, 'assets/hudselect.png');
        this.highlighter.blendMode = PIXI.blendModes.ADD;
        this.highlighter.anchor = new Phaser.Point(.5, .5);
        this.highlighter.scale = new Phaser.Point(1, 1);
        this.highlighter.update = function () {
            if (metadataInfo != null) {
                _this.highlighter.x = metadataInfo.items[ID].x * 1024 / 10000;
                _this.highlighter.y = (1 - metadataInfo.items[ID].y / 10000) * (768 - 96 - 96);
            }
            lastClickDelay--;
            if (apg.g.input.activePointer.isDown && lastClickDelay <= 0) {
                ID = (ID + 1) % 8;
                lastClickDelay = 20;
            }
        };
        apg.g.world.addChild(this.highlighter);
    }
    return BasicGame;
}());
function InitializeGame(apg) {
    new BasicGame(apg);
}
//# sourceMappingURL=GameLogic.js.map