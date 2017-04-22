


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
	baseWidth: 480,
	baseHeight: 640,
	scale: 1,
	masterVolume: 0.3,
	sfx: {},
	gravity: 2500
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

  this.game.add.image(0, 0, 'background');

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.restitution = 0.4;
  this.game.physics.p2.setImpactEvents(true);
  // turn off world bounds
  // left=false, right=false, top=true, bottom=true
  this.game.physics.p2.setBoundsToWorld(false, false, false, false);
  this.game.physics.p2.gravity.y = g_game.gravity;

  var boxes = this.game.physics.p2.createCollisionGroup();
  var walls = this.game.physics.p2.createCollisionGroup();

  var world = this.game.add.sprite(this.game.width/2, 0, 'world');
  world.anchor.set(0.5);
  this.game.physics.p2.enable(world, false);
  world.body.collideWorldBounds = false;
  world.body.data.gravityScale = 0;


  g_game.boxes = this.game.add.group();

  function addBox(x, y, game) {
    var box = game.add.sprite(x, y, 'box');
    box.anchor.set(0.5);
    game.physics.p2.enable(box, false);
    box.body.collideWorldBounds = false;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    g_game.boxes.add(box);
  }

  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 5; j++) {
      addBox(this.game.width/2 - 32 + i*64, 400 - j*100, this.game);
    }
  }

  var ground = this.game.add.sprite(0, 0, 'ground');
  ground.anchor.set(0.5);
  ground.x = this.game.width/2;
  ground.y = 500;
  this.game.physics.p2.enable(ground, false);
  ground.body.kinematic = true;
  ground.body.velocity.y = -15;
  ground.body.setCollisionGroup(walls);
  ground.body.collides([boxes]);

  var ball = this.game.add.sprite(0, 0, 'ball');
  ball.anchor.set(0.5);
  this.game.physics.p2.enable(ball, false);
  ball.body.setCircle(ball.width/2);
  ball.body.collideWorldBounds = false;
  //game.elements.bball.body.setCollisionGroup game.elements.noCollisionGroup
  g_game.ball = ball;
  resetBall(this.game, ball);

  // add events to check for swipe
  this.game.input.onDown.add(start_swipe, this);
  this.game.input.onUp.add(end_swipe, this);

  console.log('game started');
};


function resetBall(game, ball) {

  ball.canBeShot = true;
  ball.body.x = game.width/2;
  ball.body.y = 550;
  ball.body.velocity.x = 0;
  ball.body.velocity.y = 0;
  ball.body.data.gravityScale = 0;
  ball.body.rotation = 0;
  ball.falling = false;
  ball.body.rotateRight(0);
  ball.scale.set(0.9);

  ball.alpha = 1;

}

function start_swipe(pointer) {

  g_game.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);

}

function end_swipe(pointer) {

  var MINIMUM_SWIPE_LENGTH = 50;

  if (!g_game.start_swipe_point) {
    return;
  }

  var swipe_length = Phaser.Point.distance(pointer, g_game.start_swipe_point);
  // if the swipe length is greater than the minimum, a swipe is detected
  if (swipe_length >= MINIMUM_SWIPE_LENGTH) {
    // create a new line as the swipe and check for collisions
    g_game.swipe = new Phaser.Line(g_game.start_swipe_point.x, g_game.start_swipe_point.y, pointer.x, pointer.y);
  }

  delete g_game.start_swipe_point;
}

GameState.prototype.update = function() {

  var self = this;

  if (g_game.ball.canBeShot && g_game.swipe) {


    //game.elements.shootSound.play();

    // shot assist
    //var angleToMakeBasket = game.physics.arcade.angleToXY	game.elements.bball, game.elements.rim.x + (game.elements.bball.body.x - game.elements.rim.x)/2,	game.elements.rim.y - 300

    // avg perfect shot and players shot
    //shotAngle = (game.elements.swipe.angle + angleToMakeBasket) / 2
    shotAngle = g_game.swipe.angle;

    //g_game.ball.body.velocity.x = 1300 * Math.cos(shotAngle);
    //g_game.ball.body.velocity.y = 1300 * Math.sin(shotAngle);
    var strength = 600 + g_game.swipe.length*2;
    g_game.ball.body.velocity.x = strength * Math.cos(shotAngle);
    g_game.ball.body.velocity.y = strength * Math.sin(shotAngle);

    g_game.ball.body.data.gravityScale = 1;
    g_game.ball.canBeShot = false;
    // shrinking as it moves away
    this.add.tween(g_game.ball.scale)
    	.to({ x: 0.3, y: 0.3 }, 700, "Linear", true);

    // give ball random spin
    g_game.ball.mySpin = 20 - Math.random() * 40;
    g_game.ball.body.rotateRight(g_game.ball.mySpin);

    // timer tells when the ball reaches distance
    this.game.time.events.add(Phaser.Timer.SECOND * 0.75, function() { checkCollision(g_game.ball, g_game.boxes, this); });

    // reset the ball to be thrown again
    this.game.time.events.add(Phaser.Timer.SECOND * 0.75, function() { resetBall(self.game, g_game.ball, this); });

    delete g_game.swipe;
  }

  
};

function checkCollision(ball, boxes) {
  var boundsA = ball.getBounds();

  boxes.forEach(function(box) {
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      //box.tint = 0xff9999;
      //box.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() { box.tint = 0xffffff; });
      box.destroy();
    }

  });

}

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
