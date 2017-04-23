


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
	gravity: 2500,
	colors: ['Red', 'Green', 'Blue', 'Yellow', 'Orange']
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

  var world = this.game.add.sprite(this.game.width/2, -160, 'world');
  world.anchor.set(0.5);
  this.game.physics.p2.enable(world, false);
  world.body.setCircle(world.width/2);
  world.body.collideWorldBounds = false;
  world.body.data.gravityScale = 0;
  g_game.world = world;

  var ground_starting_pos = 500;
  var ground_velocity = -15; 
  var box_row_width = 4;
  var box_row_height = 1;

  var ground = this.game.add.sprite(this.game.width/2, ground_starting_pos, 'ground');
  ground.anchor.set(0.5);
  this.game.physics.p2.enable(ground, false);
  ground.body.kinematic = true;
  ground.body.velocity.y = ground_velocity;
  ground.body.setCollisionGroup(walls);
  ground.body.collides([boxes]);
  ground.initFlag = false;
  g_game.ground = ground;

  

  g_game.boxes = this.game.add.group();

var countdown = 3;
g_game.countdown = countdown;
var countdown_text = add_digit_text(this.game,Math.round(this.game.width / 2),Math.round(this.game.height/2),"3",0.5,0.5);
g_game.countdown_text = countdown_text;
  var lose_counter = 0;
  var lose_text = add_text(this.game,Math.round(this.game.width / 2),Math.round(this.game.height/2),"TRY AGAIN!",0.5,0.5);
  lose_text.visible = false;
  g_game.lose_text = lose_text;
  var reset_game = new Phaser.Signal();
  reset_game.add(function(){
  	lose_counter+=1;
    g_game.ground.reset(this.game.width/2, 500);
    g_game.score = 0;
    g_game.level = 0;
    g_game.boxes.removeAll(true); 
  for (var i = 0; i < box_row_width; i++) {
    for (var j = 0; j < box_row_height; j++) {
      var colorIndex = Math.floor(Math.random() * g_game.colors.length);
       addBox(this.game.width/2 - 96 + i*64, ground.y - 64 - j*64, colorIndex, this.game);
    }
  }
  if(lose_counter > 1){
  lose_text.visible = true;
  this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
  lose_text.visible = false;
   g_game.ground.body.velocity.y = ground_velocity;
  }, this);
}else{
	//first time playing
	countdown=3;
    this.game.time.events.repeat(Phaser.Timer.SECOND, 3, function(){
    if(countdown > 0){
    countdown-=1;
    g_game.countdown = countdown;
    

     }
     if(countdown == 0)
     {
      g_game.ground.body.velocity.y = ground_velocity;
     }

    }, this);

    }
  },this);

  g_game.SCORE_INTERVAL = 20;
  g_game.reset_game = reset_game;
  reset_game.dispatch();
  var add_score = new Phaser.Signal();
  add_score.add(function(){
  	g_game.score+=g_game.SCORE_INTERVAL;
  },true);
  g_game.add_score = add_score;
   
   //its a new level! make everything harder >:D 
   var naggers = ["AMAZING!","NICE!","MARVELOUS!","GOOD!"];
  var win_text = add_text(this.game,Math.round(this.game.width / 2),Math.round(this.game.height/2),naggers[this.game.rnd.integerInRange(0,naggers.length)],0.5,0.5);
  win_text.visible = false;
  var next_level = new Phaser.Signal();
  next_level.add(function(){
   ground_starting_pos+= 64;
   g_game.ground.reset(this.game.width/2, ground_starting_pos);
   ground_velocity-=4;
   g_game.ground.body.velocity.y = ground_velocity;
   g_game.boxes.removeAll(true);
   box_row_height+=1;
   g_game.level+=1;
   for (var i = 0; i < box_row_width; i++) {
   for (var j = 0; j < box_row_height; j++) {
   var colorIndex = Math.floor(Math.random() * g_game.colors.length);
   addBox(this.game.width/2 - 96 + i*64, ground.y - 64 - j*64, colorIndex, this.game);
   }
  }
  win_text.text = naggers[this.game.rnd.integerInRange(0,naggers.length)];
  win_text.visible = true;
  this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function(){
  win_text.visible = false;
  }, this);

  },this);
  g_game.next_level = next_level;



  function addBox(x, y, index, game) {
    var color = g_game.colors[index];
    var box = game.add.sprite(x, y, 'box' + color);
    box.anchor.set(0.5);
    box.colorIndex = index;
    game.physics.p2.enable(box, false);
    box.body.collideWorldBounds = true;
    box.body.outOfBoundsKill = true;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    g_game.boxes.add(box);
  }


  // for (var i = 0; i < box_row_width; i++) {
  //   for (var j = 0; j < box_row_height; j++) {
  //     var colorIndex = Math.floor(Math.random() * g_game.colors.length);
  //      addBox(this.game.width/2 - 96 + i*64, ground.y - 64 - j*64, colorIndex, this.game);
  //   }
  // }
  g_game.balls = this.game.add.group();

  function addBall(index, game) {
    var color = g_game.colors[index];
    var ball = game.add.sprite(0, 0, 'ball' + color);
    ball.colorIndex = index;
    ball.anchor.set(0.5);
    game.physics.p2.enable(ball, false);
    ball.body.setCircle(ball.width/2);
    ball.body.collideWorldBounds = false;
    g_game.balls.add(ball);
    resetBall(game, ball);
  }

  addBall(0, this.game);
  addBall(1, this.game);
  addBall(2, this.game);
  addBall(3, this.game);
  addBall(4, this.game);

  // add events to check for swipe
  this.game.input.onDown.add(start_swipe, this);
  this.game.input.onUp.add(end_swipe, this);

  console.log('game started');

  var level = 0;
  var score = 0;
  var score_flag = false;
  g_game.score_flag = score_flag;
  var lvl_dis_text = add_text(this.game,0,Math.round(this.game.height/2),"LEVEL");
  var score_dis_text = add_text(this.game,Math.round(this.game.width - 4),Math.round(this.game.height/2),"SCORE",1,0);
  var score_text = add_digit_text(this.game,Math.round(0),Math.round(score_dis_text.height),score.toString(),1,0);
  var lvl_text = add_digit_text(this.game,0,Math.round(lvl_dis_text.height),level.toString(),0,0);
  lvl_dis_text.addChild(lvl_text);
  score_dis_text.addChild(score_text);
 
  g_game.level = level;
  g_game.score = score;
  g_game.lvl_text = lvl_text;
  g_game.score_text = score_text;




};


function resetBall(game, ball) {

  ball.canBeShot = true;
  ball.body.x = game.width/2 - 128 + ball.colorIndex * 64;
  ball.body.y = 550;
  ball.body.velocity.x = 0;
  ball.body.velocity.y = 0;
  ball.body.data.gravityScale = 0;
  ball.body.rotation = 0;
  ball.falling = false;
  ball.body.rotateRight(0);
  ball.scale.set(1);

  ball.alpha = 1;

}

function start_swipe(pointer) {

  g_game.balls.forEach(function(ball) {
    if (Math.abs(pointer.x - ball.x) < ball.width/2 && Math.abs(pointer.y - ball.y) < ball.width/2) {
      g_game.ball = ball;
      g_game.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
    }

  });

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



function add_text(game,x,y,text,anchorX,anchorY){
   	if (anchorX === undefined) { anchorX = 0; }
	if (anchorY === undefined) { anchorX = 0; }
	var bitmapText = game.add.bitmapText(x, y, 'titlescreen', text, 8);
	bitmapText.anchor.set(anchorX, anchorY);
	bitmapText.fixedToCamera = true;
	return bitmapText;
}



function add_digit_text(game,x,y,text,anchorX,anchorY){
   	if (anchorX === undefined) { anchorX = 0; }
	if (anchorY === undefined) { anchorX = 0; }
	var bitmapText = game.add.bitmapText(x, y, 'digits', text, 32);
	bitmapText.anchor.set(anchorX, anchorY);
	bitmapText.fixedToCamera = true;
	return bitmapText;
}


GameState.prototype.update = function() {

  var self = this;

  if (g_game.swipe && g_game.ball.canBeShot && g_game.lose_text.visible == false && g_game.countdown == 0) {

    var currentBall = g_game.ball;
    //game.elements.shootSound.play();

    // shot assist
    //var angleToMakeBasket = game.physics.arcade.angleToXY	game.elements.bball, game.elements.rim.x + (game.elements.bball.body.x - game.elements.rim.x)/2,	game.elements.rim.y - 300

    // avg perfect shot and players shot
    //shotAngle = (game.elements.swipe.angle + angleToMakeBasket) / 2
    shotAngle = g_game.swipe.angle;

    //g_game.ball.body.velocity.x = 1300 * Math.cos(shotAngle);
    //g_game.ball.body.velocity.y = 1300 * Math.sin(shotAngle);
    var strength = 600 + g_game.swipe.length*2;
    currentBall.body.velocity.x = strength * Math.cos(shotAngle);
    currentBall.body.velocity.y = strength * Math.sin(shotAngle);

    currentBall.body.data.gravityScale = 1;
    currentBall.canBeShot = false;
    // shrinking as it moves away
    this.add.tween(currentBall.scale)
    	.to({ x: 0.3, y: 0.3 }, 500, "Linear", true);

    // give ball random spin
    currentBall.mySpin = 20 - Math.random() * 40;
    currentBall.body.rotateRight(currentBall.mySpin);

    // timer tells when the ball reaches distance
    this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function() { checkCollision(currentBall, g_game.boxes, this); });

    // reset the ball to be thrown again
    this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function() { resetBall(self.game, currentBall, this); });

    delete g_game.swipe;
  }

  checkWorldBoxesCollision();
  update_text();
  check_boxes();

};

function checkWorldBoxesCollision() {
  var boundsA = g_game.world.getBounds();
  g_game.boxes.forEach(function(box) {
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      g_game.reset_game.dispatch();
      
    }
  });
}

function checkCollision(ball, boxes) {
  var boundsA = ball.getBounds();

  boxes.forEach(function(box) {
    if (box.colorIndex !== ball.colorIndex) {
      // wrong color
      return;
    }
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      box.destroy();
      if(g_game.score_flag == false){
      	g_game.add_score.dispatch();

      } 
    }
  });
}

function update_text(){
	g_game.score_text.text = g_game.score;
    g_game.lvl_text.text = g_game.level;
    g_game.countdown_text.text = g_game.countdown;
    if(g_game.countdown == 0){
    	g_game.countdown_text.visible = false;
    }
}

function check_boxes(){
	if(g_game.boxes.countLiving() < 1){
		g_game.next_level.dispatch();
	}
}

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

    this.load.image('eye_open','assets/gfx/eye_open.png');
    this.load.image('eye_closed','assets/gfx/eye_closed.png');
    this.load.image('mouth_open','assets/gfx/mouth_open.png');
    this.load.image('mouth_closed','assets/gfx/mouth_closed.png');
    
		this.load.image('ground', 'assets/gfx/ground.png');
		this.load.image('world', 'assets/gfx/world.png');

		this.load.spritesheet('explosion', 'assets/gfx/explosion.png', 32, 32);
    
    this.load.bitmapFont('titlescreen', 'assets/fonts/titlescreen.png', 'assets/fonts/titlescreen.xml');
    this.load.bitmapFont('digits', 'assets/fonts/digit_8x8.png','assets/fonts/digit_8x8.xml');
  
    
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
