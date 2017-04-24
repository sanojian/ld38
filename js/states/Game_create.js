var GameState = function(game) {
};


GameState.prototype.create = function() {

  g_game.readyForRestart = false;

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

  g_game.boxes = this.game.add.group();

  var reset_game = new Phaser.Signal();

  initReset(reset_game, balls, boxes, this.game);

  g_game.pillBackground = this.game.add.sprite(this.game.width/2, 550, 'pillBackground');
  g_game.pillBackground.anchor.set(0.5);


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
      if (ball.colorIndex === target.sprite.colorIndex) {
        target.sprite.kill();
        //ball.alpha = 0;
        //resetBall(this, ball);
        if(g_game.score_flag === false){
          g_game.add_score.dispatch();
        }
      }
    }, game);
  }

  addBall(0, this.game);
  addBall(1, this.game);
  addBall(2, this.game);
  addBall(3, this.game);
  addBall(4, this.game);

  g_game.elasticBand = this.game.add.graphics(0, 0);

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

  ball.alpha = 1;

}
