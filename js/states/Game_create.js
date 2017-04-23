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
  var balls = this.game.physics.p2.createCollisionGroup();
  var walls = this.game.physics.p2.createCollisionGroup();

  var world = this.game.add.sprite(this.game.width/2, -160, 'world');
  world.anchor.set(0.5);
  this.game.physics.p2.enable(world, false);
  world.body.setCircle(world.width/2);
  world.body.collideWorldBounds = false;
  world.body.data.gravityScale = 0;
  g_game.world = world;

  var ground = this.game.add.sprite(this.game.width/2, g_game.ground_starting_pos, 'ground');
  ground.anchor.set(0.5);
  this.game.physics.p2.enable(ground, false);
  ground.body.kinematic = true;
  ground.body.velocity.y = g_game.ground_velocity;
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
  reset_game.add(function() {
  	lose_counter+=1;
    g_game.ground.reset(this.game.width/2, 500);
    g_game.score = 0;
    g_game.level = 0;
    g_game.boxes.removeAll(true);

      lose_text.visible = false;
      g_game.ground.body.velocity.y = g_game.ground_velocity;
      g_game.boxes.removeAll(true);
      if(lose_counter > 1) {
        lose_text.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
          lose_text.visible = false;
          g_game.ground.body.velocity.y = g_game.ground_velocity;

          var stack = initalizeStack(g_game.box_row_height, g_game.box_row_width);
          stackBoxes(this.game, boxes, walls, balls, g_game.box_row_height, g_game.box_row_width, ground, stack);

          g_game.boxes.setAll('body.velocity.y', g_game.ground.body.velocity.y);
        }, this);
      } else {
      	//first time playing
      	countdown=3;
        this.game.time.events.repeat(Phaser.Timer.SECOND, 3, function() {
          if(countdown > 0) {
            countdown-=1;
            g_game.countdown = countdown;
          }
          if(countdown === 0) {
            g_game.ground.body.velocity.y = g_game.ground_velocity;
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
    }, true);
    g_game.add_score = add_score;

    //its a new level! make everything harder >:D
    var naggers = ["AMAZING!","NICE!","MARVELOUS!","GOOD!"];
    var win_text = add_text(this.game,Math.round(this.game.width / 2),Math.round(this.game.height/2),naggers[this.game.rnd.integerInRange(0,naggers.length-1)],0.5,0.5);
    win_text.visible = false;
    var next_level = new Phaser.Signal();
    next_level.add(function() {
     g_game.ground_starting_pos+= 64;
     g_game.ground.reset(this.game.width/2, g_game.ground_starting_pos);
     g_game.ground_velocity-=4;
     g_game.ground.body.velocity.y = g_game.ground_velocity;
     g_game.boxes.removeAll(true);
     g_game.box_row_height+=1;
     g_game.level+=1;

     var stack = initalizeStack(g_game.box_row_height, g_game.box_row_width);
     stackBoxes(this.game, boxes, walls, balls, g_game.box_row_height, g_game.box_row_width, ground, stack);

      win_text.text = naggers[this.game.rnd.integerInRange(0,naggers.length-1)];
      win_text.visible = true;
      this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
        win_text.visible = false;
      }, this);

    }, this);

    g_game.next_level = next_level;


  g_game.balls = this.game.add.group();

  function addBall(index, game) {
    var color = g_game.colors[index];
    var ball = game.add.sprite(0, 0, 'ball' + color);
    ball.colorIndex = index;
    ball.anchor.set(0.5);
    game.physics.p2.enable(ball, false);
    ball.body.setCircle(ball.width/2);
    ball.body.collideWorldBounds = false;
    ball.body.setCollisionGroup(balls);
    ball.body.collides([boxes]);
    g_game.balls.add(ball);
    resetBall(game, ball);
    ball.body.onBeginContact.add(function(target) {
      target.sprite.kill();
      if(g_game.score_flag === false){
      	g_game.add_score.dispatch();
      }
    }, game);
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
