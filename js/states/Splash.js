var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
		this.load.image('splashBackground', 'assets/gfx/splashBackground.png');
		this.load.image('background', 'assets/gfx/background.png');

		this.load.spritesheet('el', 'assets/gfx/shapes/el.png',64,64);
		this.load.spritesheet('el_long', 'assets/gfx/shapes/el_long.png',96,96);
		this.load.spritesheet('box', 'assets/gfx/shapes/box.png',64,64);
		this.load.spritesheet('I', 'assets/gfx/shapes/I.png',96,96);
		this.load.spritesheet('zee', 'assets/gfx/shapes/zee.png',96,96);
		this.load.spritesheet('tee', 'assets/gfx/shapes/tee.png',96,96);
		this.load.spritesheet('box_half', 'assets/gfx/shapes/box_half.png',32,32);
		this.load.spritesheet('box_half_good', 'assets/gfx/shapes/box_half_good.png',32,32);
		this.load.spritesheet('box_flat', 'assets/gfx/shapes/box_flat.png',64,64);

		this.load.image('pillBackground', 'assets/gfx/pillBackground.png');

		this.load.image('ballRed', 'assets/gfx/ballRed.png');
		this.load.image('ballGreen', 'assets/gfx/ballGreen.png');
		this.load.image('ballBlue', 'assets/gfx/ballBlue.png');
		this.load.image('ballYellow', 'assets/gfx/ballYellow.png');
		this.load.image('ballOrange', 'assets/gfx/ballOrange.png');

    this.load.image('eye_open','assets/gfx/eye_open.png');
    this.load.image('eye_closed','assets/gfx/eye_closed.png');
    this.load.image('mouth_open','assets/gfx/mouth_open.png');
    this.load.image('mouth_closed','assets/gfx/mouth_closed.png');

		this.load.spritesheet('explosion', 'assets/gfx/explosion.png', 32, 32);

    this.load.bitmapFont('titlescreen', 'assets/fonts/titlescreen.png', 'assets/fonts/titlescreen.xml');
    this.load.bitmapFont('digits', 'assets/fonts/digit_8x8.png','assets/fonts/digit_8x8.xml');

    this.load.audio('countdown', 'assets/sounds/countdown.ogg');
    this.load.audio('countdown_finished', 'assets/sounds/countdown_finished.ogg');
    this.load.audio('hit', 'assets/sounds/hit.ogg');
    this.load.audio('lose', 'assets/sounds/lose.ogg');
    this.load.audio('level_start', 'assets/sounds/level_start.ogg');
    this.load.audio('throw', 'assets/sounds/throw.ogg');

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
