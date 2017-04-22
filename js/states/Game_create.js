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
