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
