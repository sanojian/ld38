var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
		this.load.image('splashBackground', 'assets/gfx/splashBackground.png');
		this.load.image('background', 'assets/gfx/background.png');

		this.load.image('ball', 'assets/gfx/ball.png');
		this.load.image('box', 'assets/gfx/box.png');
		this.load.image('ground', 'assets/gfx/ground.png');
		this.load.image('world', 'assets/gfx/world.png');

		this.load.spritesheet('explosion', 'assets/gfx/explosion.png', 32, 32);

	},
	create: function() {
    g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.game.add.image(0, 0, 'splashBackground');

    console.log('waiting for space...');

  },
  update: function() {
    if (g_game.spaceKey.isDown) {
      this.game.state.start('game');
    }
  }

};
