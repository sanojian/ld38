g_game.shapeDefs = {
	el: {
		center: { x: 48, y: 48 },
		rects: [
			{ x: g_game.blockSize/4, y: -g_game.blockSize/4, w: g_game.blockSize/2, h: g_game.blockSize/2 },
			{ x: 0, y: g_game.blockSize/4, w: g_game.blockSize, h: g_game.blockSize/2 }
			//{ x: 0, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
			//{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
		]
	},
	el_long: {
		center: { x: 32, y: 64 },
		rects: [
			{ x: -g_game.blockSize/2, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
			{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
		]
	},
	I: {
		center: { x: 48, y: 72 },
		rects: [
			{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
		]
	},
	tee: {
		center: { x: 48, y: 64 },
		rects: [
			{ x: 0, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
			{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
		]
	},
	zee: {
		center: { x: 48, y: 64 },
		rects: [
			{ x: g_game.blockSize/4, y: 0, w: g_game.blockSize, h: g_game.blockSize/2 },
			{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
		]
	},
	box_flat: {
		center: { x: g_game.blockSize/2, y: g_game.blockSize*3/4 },
		rects: [
			{ x: 0, y: g_game.blockSize/4, w: g_game.blockSize, h: g_game.blockSize/2 },
			//{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
		]
	},
};

g_game.shapes = [
	{
		name: 'el',
		pattern: { angle:   0, matrix: [0,0,0,0,1,0,1,1,0] },
    colorIndex: 2
	},
	{
		name: 'el',
		pattern: { angle:  90, matrix: [0,0,0,1,0,0,1,1,0] },
    colorIndex: 2
	},
	{
		name: 'el',
		pattern: { angle: 180, matrix: [0,0,0,1,1,0,1,0,0] },
    colorIndex: 2
	},
	{
		name: 'el',
		pattern: { angle: 270, matrix: [0,0,0,1,1,0,0,1,0] },
    colorIndex: 2
	},
	{
		name: 'el_long',
		pattern: { angle: 0, matrix: [0,0,0,1,0,0,1,1,1] },
    colorIndex: 4
	},
	{
		name: 'el_long',
		pattern: { angle: 90, matrix: [1,1,0,1,0,0,1,0,0] },
    colorIndex: 4
	},
	{
		name: 'el_long',
		pattern: { angle: 180, matrix: [1,1,1,0,0,1,0,0,0] },
    colorIndex: 4
	},
	{
		name: 'el_long',
		pattern: { angle: 270, matrix: [0,0,1,0,0,1,0,1,1] },
    colorIndex: 4
	},
	{
		name: 'box',
		pattern: { angle:   0, matrix: [0,0,0,1,1,0,1,1,0] },
    colorIndex: 3
	},
	{
		name: 'I',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,1,1] },
    colorIndex: 0
	},
	{
		name: 'I',
		pattern: { angle:  90, matrix: [1,0,0,1,0,0,1,0,0] },
    colorIndex: 0
	},
	{
		name: 'zee',
		pattern: { angle:   0, matrix: [0,0,0,0,1,1,1,1,0] },
    colorIndex: 1
	},
	{
		name: 'zee',
		pattern: { angle:  90, matrix: [1,0,0,1,1,0,0,1,0] },
    colorIndex: 1
	},
	{
		name: 'tee',
		pattern: { angle:   0, matrix: [0,0,0,0,1,0,1,1,1] },
    colorIndex: 1
	},
	{
		name: 'tee',
		pattern: { angle:  90, matrix: [1,0,0,1,1,0,1,0,0] },
    colorIndex: 1
	},
	{
		name: 'tee',
		pattern: { angle:  180, matrix: [1,1,1,0,1,0,0,0,0] },
    colorIndex: 1
	},
	{
		name: 'tee',
		pattern: { angle:  270, matrix: [0,0,1,0,1,1,0,0,1] },
    colorIndex: 1
	},
	{
		name: 'box_half',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,0,0] },
    colorIndex: 3
	},
	{
		name: 'box_half_good',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,0,0] },
    colorIndex: -1
	},
	{
		name: 'box_flat',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,1,0] },
    colorIndex: 4
	},
	{
		name: 'box_flat',
		pattern: { angle:  90, matrix: [0,0,0,1,0,0,1,0,0] },
    colorIndex: 4
	}
];

function stackBoxes(game, balls, boxes, columns, rows, stack) {
  for (var y = 0; y < stack.length; y++) {
    var box = game.add.sprite(game.width/2, game.height/2, stack[y].name);
    //var anim_loop = box.animations.add('loop').play('loop',1,true);
    box.x = game.width/2 - (columns * g_game.blockSize/4) + box.width/2 + stack[y].x * g_game.blockSize/2;
    box.y = 200 - box.height/2 - stack[y].y * g_game.blockSize/2;
    game.physics.p2.enable(box, false);
    var def = g_game.shapeDefs[stack[y].name];
    if (def) {
      box.data.center = new Phaser.Point(def.center.x, def.center.y);
      var rects = def.rects;
      box.body.clearShapes();
      for (var i = 0; i < rects.length; i++) {
        box.body.addRectangle(rects[i].w, rects[i].h, rects[i].x, rects[i].y);
      }
    } else {
      box.data.center = new Phaser.Point(box.width/2, box.height/2);
    }
    if (stack[y].angle) {
      box.data.center = Phaser.Point.rotate(box.data.center, box.width/2, box.height/2, stack[y].angle, true);
      box.body.angle = stack[y].angle;
    }
    box.colorIndex = stack[y].colorIndex;
    //box.body.debug = true;
    box.body.kinematic = true;
    box.body.setCollisionGroup(boxes);
    box.body.collides([balls]);
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
        stack.push({ name: shape.name, angle: shape.pattern.angle , colorIndex: shape.colorIndex, x: x, y: y, dx: shape.pattern.dx, dy: shape.pattern.dy });
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
