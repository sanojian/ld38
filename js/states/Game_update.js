GameState.prototype.update = function() {

  var self = this;

  if (g_game.swipe && g_game.ball.canBeShot) {

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
};

function checkWorldBoxesCollision() {
  var boundsA = g_game.world.getBounds();

  g_game.boxes.forEach(function(box) {
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      g_game.world.game.state.start('game');
    }
  });
}

function checkCollision(ball, boxes) {
  var boundsA = ball.getBounds();

  boxes.forEach(function(box) {
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      box.destroy();
    }
  });
}
