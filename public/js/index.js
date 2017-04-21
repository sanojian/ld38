


window.onload = function() {


	var width = navigator.isCocoonJS ? window.innerWidth : g_game.baseWidth;
	var height = navigator.isCocoonJS ? window.innerHeight : g_game.baseHeight;

	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, (g_game.baseWidth / g_game.gameWidth) * g_game.gameHeight, Phaser.AUTO, 'game', null, false, false);
	//                                  width, height, renderer,        parent,     state,      transparent,    antialias, physicsConfig
	g_game.phaserGame = new Phaser.Game(width, height, Phaser.AUTO,   '',     null,       false,          false);
	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, g_game.baseHeight, Phaser.AUTO,   '',     null,       false,          false);
	g_game.phaserGame.state.add('Boot', Boot);
	g_game.phaserGame.state.add('Splash', SplashScreen);
	g_game.phaserGame.state.add('game', GameState);
	g_game.phaserGame.state.start('Boot');

};

window.g_game = {
	sounds: {},
	//gameWidth: window.innerWidth * window.devicePixelRatio,
	//gameHeight: window.innerHeight * window.devicePixelRatio,
	baseWidth: 640,
	baseHeight: 480,
	scale: 3,
	masterVolume: 0.3,
	sfx: {}
};

var Boot = function(game) {};

Boot.prototype = {
  preload: function() {

    //this.load.image("background", "assets/gfx/background.png");

  },
  create: function() {

    this.game.stage.smoothed = false;
    this.scale.minWidth = g_game.baseWidth;
    this.scale.minHeight = g_game.baseHeight;
    this.scale.maxWidth = g_game.baseWidth * g_game.scale;
    this.scale.maxHeight = g_game.baseHeight * g_game.scale;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // catch right click mouse
    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    this.state.start('Splash');
  }
};

var GameState = function(game) {
};


GameState.prototype.create = function() {

  console.log('game started');
};

GameState.prototype.update = function() {

};

var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');

	},
	create: function() {
    g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    console.log('waiting for space...');
  },
  update: function() {
    if (g_game.spaceKey.isDown) {
      this.game.state.start('game');
    }
  }

};
