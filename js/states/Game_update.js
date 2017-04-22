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
