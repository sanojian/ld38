GameState.prototype.update = function() {

  if (g_game.lost) {
    if (g_game.readyForRestart && this.game.input.activePointer.isDown) {
      this.game.state.start('game');
    }
    return;
  }

  var self = this;

  if (g_game.swipe && g_game.ball.canBeShot && g_game.lose_text.visible === false && g_game.countdown === 0) {

    var currentBall = g_game.ball;
    //game.elements.shootSound.play();

    shotAngle = g_game.swipe.angle;

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

    // reset the ball to be thrown again
    this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function() { resetBall(self.game, currentBall, this); });

    delete g_game.swipe;
  }

  // draw elastic shooting band
  g_game.elasticBand.clear();
  if (g_game.start_swipe_point) {
    g_game.elasticBand.lineStyle(6, 0xff00ff, 0.7);
    g_game.elasticBand.moveTo(g_game.ball.x, g_game.ball.y);
    g_game.elasticBand.lineTo(this.game.input.activePointer.x, this.game.input.activePointer.y);
  }


  checkWorldBoxesCollision();
  update_text();
  check_boxes();

};

function checkWorldBoxesCollision() {
  var boundsA = g_game.pillBackground.getBounds();
  g_game.boxes.forEach(function(box) {
    var boundsB = box.getBounds();

    var collide = Phaser.Rectangle.intersects(boundsA, boundsB);
    if (collide) {
      g_game.lost = true;
      console.log('game lost');
      add_text(box.game, box.game.width/2, box.game.height/2, 'INFECTION', 0.5, 0.5);
      g_game.boxes.setAll('body.velocity.y', 0);
      box.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        add_text(box.game, box.game.width/2, box.game.height/2 + 24, 'CLICK TO RESTART', 0.5, 0.5);
        g_game.readyForRestart = true;
      });
      //box.game.state.start('game');
      //g_game.reset_game.dispatch();
    }
  });
}


function update_text(){
	g_game.score_text.text = g_game.score;
    g_game.lvl_text.text = g_game.level;
    g_game.countdown_text.text = g_game.countdown;
    if(g_game.countdown === 0) {
      g_game.countdown_text.visible = false;
    }
}

function check_boxes(){
	if (g_game.boxes.countLiving() < 1) {
		g_game.next_level.dispatch();
	}
}
