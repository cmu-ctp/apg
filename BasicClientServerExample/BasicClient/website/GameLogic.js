function CacheGameAssets(c) {
    c.images('assets', ['bkg.png']);
    c.googleWebFonts(['Anton']);
}
var BasicGame = (function () {
    function BasicGame(apg) {
        this.registerServerMessages(apg);
        var background = new Phaser.Sprite(apg.g, 0, 0, 'assets/bkg.png');
        apg.g.world.addChild(background);
    }
    BasicGame.prototype.registerServerMessages = function (apg) {
        var that = this;
        function JoinAcknowledge(joinInfo) {
        }
        apg.ResetServerMessageRegistry();
        apg.Register("joinawk", JoinAcknowledge);
    };
    return BasicGame;
}());
function InitializeGame(apg) {
    new BasicGame(apg);
}
//# sourceMappingURL=GameLogic.js.map