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

  var ground_starting_pos = 460;
  var ground_velocity = -15;
  //var box_row_width = 4;
  //var box_row_height = 1;
  var box_row_width = 8;
  var box_row_height = 3;

  var ground = this.game.add.sprite(this.game.width/2, ground_starting_pos, 'ground');
  ground.anchor.set(0.5);
  this.game.physics.p2.enable(ground, false);
  ground.body.kinematic = true;
  ground.body.velocity.y = ground_velocity;
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
      g_game.ground.body.velocity.y = ground_velocity;
      g_game.boxes.removeAll(true);
      if(lose_counter > 1) {
        lose_text.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
          lose_text.visible = false;
          g_game.ground.body.velocity.y = ground_velocity;

          var stack = initalizeStack(box_row_height, box_row_width);
          stackBoxes(this.game, boxes, walls, box_row_height, box_row_width, ground, stack);

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
            g_game.ground.body.velocity.y = ground_velocity;
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
     ground_starting_pos+= 64;
     g_game.ground.reset(this.game.width/2, ground_starting_pos);
     ground_velocity-=4;
     g_game.ground.body.velocity.y = ground_velocity;
     g_game.boxes.removeAll(true);
     box_row_height+=1;
     g_game.level+=1;

     var stack = initalizeStack(box_row_height, box_row_width);
     stackBoxes(this.game, boxes, walls, box_row_height, box_row_width, ground, stack);

      win_text.text = naggers[this.game.rnd.integerInRange(0,naggers.length-1)];
      win_text.visible = true;
      this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
        win_text.visible = false;
      }, this);

    }, this);

    g_game.next_level = next_level;



  function addBox(x, y, index, game) {
    var color = g_game.colors[index];
    var box = game.add.sprite(x, y, 'box' + color);
    box.anchor.set(0.5);
    box.colorIndex = index;
    game.physics.p2.enable(box, false);
    box.body.collideWorldBounds = true;
    box.body.outOfBoundsKill = true;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    g_game.boxes.add(box);
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

function stackBoxes(game, boxes, walls, columns, rows, ground, stack) {
  for (var y = 0; y < stack.length; y++) {
    var box = game.add.sprite(0, 0, stack[y].name);
    box.x = ground.x - (columns * g_game.blockSize/2) + box.width/2 + stack[y].x * g_game.blockSize/2;
    box.y = ground.y - ground.height/2 - box.height/2 - stack[y].y * g_game.blockSize/2;
    game.physics.p2.enable(box, false);
    var rects = g_game.shapeDefs[stack[y].name];
    if (rects) {
      box.body.clearShapes();
      for (var i = 0; i < rects.length; i++) {
        box.body.addRectangle(rects[i].w, rects[i].h, rects[i].x, rects[i].y);
      }
    }
    if (stack[y].angle) {
      box.body.angle = stack[y].angle;
    }
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    box.body.debug = true;
    box.body.kinematic = true;
    box.body.velocity.y = ground.body.velocity.y;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, boxes]);
    g_game.boxes.add(box);
  }
}

function initalizeStack(rows, columns) {
  var grid = [];
  var x, y;
  for (y = 0; y < rows; y++) {
    grid[y] = [];
    for (x = 0; x < columns; x++) {
      grid[y][x] = 0;
    }
  }

  var stack = [];
  for (y = 0; y < grid.length; y++) {
    for (x = 0; x < grid[y].length; x++) {

      if (grid[y][x] !== 1) {
        var shape = findFittingShape(x, y, grid);
        stack.push({ name: shape.name, angle: shape.pattern.angle , x: x, y: y, dx: shape.pattern.dx, dy: shape.pattern.dy });
      }
    }
  }
  return stack;
}

function findFittingShape(x, y, grid) {
  var fits = false;
  var shapes = g_game.shapes;
  var i, j;

  while (!fits) {
    var idx = Math.floor(Math.random() * shapes.length);
    var shape = shapes[idx];
    fits = true;
    for (j = 0; j < 3; j++) {
      for (i = 0; i < 3; i++) {
        if (shape.pattern.matrix[j*3 + i] === 1) {
          if (i + x >= grid[y].length) {
            fits = false;
          }
          else if (y + 2-j >= grid.length) {
            fits = false;
          }
          else if (grid[y + 2-j][i + x] === 1) {
            fits = false;
          }
        }
      }
    }

    if (fits) {
      // fill in grid
      for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
          if ((i + x < grid[y].length) && (y + 2-j < grid.length)) {
            grid[y + 2-j][i + x] = grid[y + 2-j][i + x] || shape.pattern.matrix[j*3 + i];
          }
        }
      }

      return shape;
    }
  }
}

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
