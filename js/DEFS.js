window.g_game = {
	sounds: {},
	//gameWidth: window.innerWidth * window.devicePixelRatio,
	//gameHeight: window.innerHeight * window.devicePixelRatio,
	baseWidth: 480,
	baseHeight: 640,
	scale: 1,
	masterVolume: 0.3,
	sfx: {},
	gravity: 2500,
	blockSize: 32*2,
	colors: ['Red', 'Green', 'Blue', 'Yellow', 'Orange']
};

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
