function add_text(game,x,y,text,anchorX,anchorY){
	if (anchorX === undefined) { anchorX = 0; }
	if (anchorY === undefined) { anchorX = 0; }
	var bitmapText = game.add.bitmapText(x, y, 'titlescreen', text, 8);
	bitmapText.anchor.set(anchorX, anchorY);
	bitmapText.fixedToCamera = true;
	return bitmapText;
}



function add_digit_text(game,x,y,text,anchorX,anchorY){
  if (anchorX === undefined) {
    anchorX = 0;
  }
	if (anchorY === undefined) {
    anchorX = 0;
  }
	var bitmapText = game.add.bitmapText(x, y, 'digits', text, 32);
	bitmapText.anchor.set(anchorX, anchorY);
	bitmapText.fixedToCamera = true;
	return bitmapText;
}

function initReset(reset_game, balls, boxes, ground, game) {

  var countdown = 3;
  g_game.countdown = countdown;
  var countdown_text = add_digit_text(game, Math.round(game.width / 2), Math.round(game.height/2),"3", 0.5, 0.5);
  g_game.countdown_text = countdown_text;
  var lose_counter = 0;
  var lose_text = add_text(game, Math.round(game.width / 2), Math.round(game.height/2), "TRY AGAIN!", 0.5, 0.5);
  lose_text.visible = false;
  g_game.lose_text = lose_text;

  reset_game.add(function() {
    lose_counter+=1;
    g_game.ground.reset(game.width/2, 500);
    g_game.score = 0;
    g_game.level = 0;
    g_game.boxes.removeAll(true);

    lose_text.visible = false;
    g_game.ground.body.velocity.y = g_game.ground_velocity;
    g_game.boxes.removeAll(true);
    if (lose_counter > 1) {
      lose_text.visible = true;
      game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        lose_text.visible = false;
        g_game.ground.body.velocity.y = g_game.ground_velocity;

        var stack = initalizeStack(g_game.box_row_height, g_game.box_row_width);
        stackBoxes(game, balls, boxes, g_game.box_row_height, g_game.box_row_width, ground, stack);

        g_game.boxes.setAll('body.velocity.y', g_game.ground.body.velocity.y);
      }, this);
    } else {
      //first time playing
      countdown=3;
      game.time.events.repeat(Phaser.Timer.SECOND, 3, function() {
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
  add_score.add(function() {
    g_game.score += g_game.SCORE_INTERVAL;
  }, true);
  g_game.add_score = add_score;

  //its a new level! make everything harder >:D
  var naggers = ["AMAZING!","NICE!","MARVELOUS!","GOOD!"];
  var win_text = add_text(game,Math.round(game.width / 2),Math.round(game.height/2),naggers[game.rnd.integerInRange(0,naggers.length-1)],0.5,0.5);
  win_text.visible = false;
  var next_level = new Phaser.Signal();
  next_level.add(function() {
    g_game.ground_starting_pos += 64;
    g_game.ground.reset(game.width/2, g_game.ground_starting_pos);
    g_game.ground_velocity -= 4;
    g_game.ground.body.velocity.y = g_game.ground_velocity;
    g_game.boxes.removeAll(true);
    g_game.box_row_height += 1;
    g_game.level += 1;

    var stack = initalizeStack(g_game.box_row_height, g_game.box_row_width);
    stackBoxes(game, balls, boxes, g_game.box_row_height, g_game.box_row_width, ground, stack);

    win_text.text = naggers[game.rnd.integerInRange(0,naggers.length-1)];
    win_text.visible = true;
    game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
      win_text.visible = false;
    }, this);

  }, this);

  g_game.next_level = next_level;

}
