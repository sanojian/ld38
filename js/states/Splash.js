var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
		this.load.image('splashBackground', 'assets/gfx/splashBackground.png');
		this.load.image('background', 'assets/gfx/background.png');

		this.load.image('boxRed', 'assets/gfx/boxRed.png');
		this.load.image('boxGreen', 'assets/gfx/boxGreen.png');
		this.load.image('boxBlue', 'assets/gfx/boxBlue.png');
		this.load.image('boxYellow', 'assets/gfx/boxYellow.png');
		this.load.image('boxOrange', 'assets/gfx/boxOrange.png');

		this.load.image('ballRed', 'assets/gfx/ballRed.png');
		this.load.image('ballGreen', 'assets/gfx/ballGreen.png');
		this.load.image('ballBlue', 'assets/gfx/ballBlue.png');
		this.load.image('ballYellow', 'assets/gfx/ballYellow.png');
		this.load.image('ballOrange', 'assets/gfx/ballOrange.png');

		this.load.image('ground', 'assets/gfx/ground.png');
		this.load.image('world', 'assets/gfx/world.png');

		this.load.spritesheet('explosion', 'assets/gfx/explosion.png', 32, 32);

	},
	create: function() {
    g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.game.add.image(0, 0, 'splashBackground');

		this.game.input.onDown.add(this.startGame, this);

    console.log('waiting for space...');

  },
  update: function() {
    if (g_game.spaceKey.isDown) {
      this.startGame();
    }
  },
	startGame: function() {
		this.game.state.start('game');
	}

};
