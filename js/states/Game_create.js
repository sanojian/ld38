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

  var ground = this.game.add.sprite(this.game.width/2, 500, 'ground');
  ground.anchor.set(0.5);
  this.game.physics.p2.enable(ground, false);
  ground.body.kinematic = true;
  ground.body.velocity.y = -15;
  ground.body.setCollisionGroup(walls);
  ground.body.collides([boxes]);


  g_game.boxes = this.game.add.group();

  function addBox(x, y, index, game) {
    var color = g_game.colors[index];

    var box = game.add.sprite(x, y, 'box' + color);
    box.anchor.set(0.5);
    box.colorIndex = index;
    game.physics.p2.enable(box, false);
    box.body.collideWorldBounds = false;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    g_game.boxes.add(box);
  }

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var colorIndex = Math.floor(Math.random() * g_game.colors.length);
      addBox(this.game.width/2 - 96 + i*64, ground.y - 64 - j*64, colorIndex, this.game);
    }
  }

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
