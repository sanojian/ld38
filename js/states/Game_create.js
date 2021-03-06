var GameState = function(game) {
};


GameState.prototype.create = function() {

  g_game.readyForRestart = false;
  g_game.ground_velocity = g_game.STARTING_VELOCITY;
	g_game.box_row_width = g_game.STARTING_ROWS;
	g_game.box_row_height = g_game.STARTING_COLUMNS;

  //sounds
  init_sounds(this.game);

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
      function killBug(bug) {
        if (bug) {
          cx = bug.sprite.x - bug.sprite.anchor.x * bug.sprite.width  + bug.sprite.data.center.x;
          cy = bug.sprite.y - bug.sprite.anchor.y * bug.sprite.height + bug.sprite.data.center.y;
          var splort = game.add.sprite(cx, cy, 'splort');
          splort.anchor.set(0.5, 0.5);
          var anim = splort.animations.add('animation');
          splort.animations.play('animation', 10, false);
          splort.animations.currentAnim.onComplete.add(function(){
            splort.kill();
          }, this);
          bug.sprite.kill();
        }
      }
      if (target.sprite.colorIndex === -1) {
        // nice bug
        killBug(target);
        play_sound(g_game.sfx.hit);
      }
      else if (ball.colorIndex === target.sprite.colorIndex) {
        // bug color match
        killBug(target);
        play_sound(g_game.sfx.hit);
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
  ball.scale.setTo(1,1);
  ball.alpha = 1;

}

function init_sounds(game){
g_game.sfx.lose = game.add.sound('lose');
g_game.sfx.countdown = game.add.sound('countdown');
g_game.sfx.countdown_finished = game.add.sound('countdown_finished');
g_game.sfx.hit = game.add.sound('hit');
g_game.sfx.level_start = game.add.sound('level_start');
g_game.sfx.throw = game.add.sound('throw');
}

function play_sound(sound){
if(!sound.isPlaying){
    sound.play();
    sound.volume = g_game.masterVolume;
}
}
