var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
		this.load.image('splashBackground', 'assets/gfx/splashBackground.png');
		this.load.image('background', 'assets/gfx/background.png');

		this.load.image('el', 'assets/gfx/shapes/el.png');
		this.load.image('el_long', 'assets/gfx/shapes/el_long.png');
		this.load.image('box', 'assets/gfx/shapes/box.png');
		this.load.image('I', 'assets/gfx/shapes/I.png');
		this.load.image('zee', 'assets/gfx/shapes/zee.png');
		this.load.image('tee', 'assets/gfx/shapes/tee.png');
		this.load.image('box_half', 'assets/gfx/shapes/box_half.png');
		this.load.image('box_half_good', 'assets/gfx/shapes/box_half_good.png');
		this.load.image('box_flat', 'assets/gfx/shapes/box_flat.png');

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

		// this.load.spritesheet('explosion', 'assets/gfx/explosion.png', 32, 32);
	this.load.spritesheet('splort', 'assets/gfx/splort.png', 64, 64, 4);

    this.load.bitmapFont('titlescreen', 'assets/fonts/titlescreen.png', 'assets/fonts/titlescreen.xml');
    this.load.bitmapFont('digits', 'assets/fonts/digit_8x8.png','assets/fonts/digit_8x8.xml');

    this.load.audio('countdown', ['assets/sounds/countdown.ogg', 'assets/sounds/countdown.wav']);
    this.load.audio('countdown_finished', ['assets/sounds/countdown_finished.ogg', 'assets/sounds/countdown_finished.wav']);
    this.load.audio('hit', ['assets/sounds/hit.ogg', 'assets/sounds/hit.wav']);
    this.load.audio('lose', ['assets/sounds/lose.ogg', 'assets/sounds/lose.wav']);
    this.load.audio('level_start', ['assets/sounds/level_start.ogg', 'assets/sounds/level_start.wav']);
    this.load.audio('throw', ['assets/sounds/throw.ogg', 'assets/sounds/throw.wav']);

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
