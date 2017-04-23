g_game.shapeDefs = {
	el: [
		{ x: g_game.blockSize/4, y: -g_game.blockSize/4, w: g_game.blockSize/2, h: g_game.blockSize/2 },
		{ x: 0, y: g_game.blockSize/4, w: g_game.blockSize, h: g_game.blockSize/2 }
		//{ x: 0, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
		//{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
	],
	el_long: [
		{ x: -g_game.blockSize/2, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
		{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
	],
	I: [
		{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
	],
	tee: [
		{ x: 0, y: 0, w: g_game.blockSize/2, h: g_game.blockSize/2 },
		{ x: 0, y: g_game.blockSize/2, w: 3*g_game.blockSize/2, h: g_game.blockSize/2 }
	],
	zee: [
		{ x: g_game.blockSize/4, y: 0, w: g_game.blockSize, h: g_game.blockSize/2 },
		{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
	],
	box_flat: [
		{ x: 0, y: g_game.blockSize/4, w: g_game.blockSize, h: g_game.blockSize/2 },
		//{ x: -g_game.blockSize/4, y: g_game.blockSize/2, w: g_game.blockSize, h: g_game.blockSize/2 }
	]
};

g_game.shapes = [
	{
		name: 'el',
		pattern: { angle:   0, matrix: [0,0,0,0,1,0,1,1,0] }
	},
	{
		name: 'el',
		pattern: { angle:  90, matrix: [0,0,0,1,0,0,1,1,0] }
	},
	{
		name: 'el',
		pattern: { angle: 180, matrix: [0,0,0,1,1,0,1,0,0] }
	},
	{
		name: 'el',
		pattern: { angle: 270, matrix: [0,0,0,1,1,0,0,1,0] }
	},
	{
		name: 'el_long',
		pattern: { angle: 0, matrix: [0,0,0,1,0,0,1,1,1] }
	},
	{
		name: 'el_long',
		pattern: { angle: 90, matrix: [1,1,0,1,0,0,1,0,0] }
	},
	{
		name: 'el_long',
		pattern: { angle: 180, matrix: [1,1,1,0,0,1,0,0,0] }
	},
	{
		name: 'el_long',
		pattern: { angle: 270, matrix: [0,0,1,0,0,1,0,1,1] }
	},
	{
		name: 'box',
		pattern: { angle:   0, matrix: [0,0,0,1,1,0,1,1,0] }
	},
	{
		name: 'I',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,1,1] }
	},
	{
		name: 'I',
		pattern: { angle:  90, matrix: [1,0,0,1,0,0,1,0,0] }
	},
	{
		name: 'zee',
		pattern: { angle:   0, matrix: [0,0,0,0,1,1,1,1,0] }
	},
	{
		name: 'zee',
		pattern: { angle:  90, matrix: [1,0,0,1,1,0,0,1,0] }
	},
	{
		name: 'tee',
		pattern: { angle:   0, matrix: [0,0,0,0,1,0,1,1,1] }
	},
	{
		name: 'tee',
		pattern: { angle:  90, matrix: [1,0,0,1,1,0,1,0,0] }
	},
	{
		name: 'tee',
		pattern: { angle:  180, matrix: [1,1,1,0,1,0,0,0,0] }
	},
	{
		name: 'tee',
		pattern: { angle:  270, matrix: [0,0,1,0,1,1,0,0,1] }
	},
	{
		name: 'box_half',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,0,0] }
	},
	{
		name: 'box_flat',
		pattern: { angle:   0, matrix: [0,0,0,0,0,0,1,1,0] }
	},
	{
		name: 'box_flat',
		pattern: { angle:  90, matrix: [0,0,0,1,0,0,1,0,0] }
	}
];

function stackBoxes(game, boxes, walls, balls, columns, rows, ground, stack) {
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
    //box.body.debug = true;
    box.body.kinematic = true;
    box.body.velocity.y = ground.body.velocity.y;
    box.body.setCollisionGroup(boxes);
    box.body.collides([walls, balls, boxes]);
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
