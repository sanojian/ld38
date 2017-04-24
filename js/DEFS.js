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
	colors: ['Red', 'Green', 'Blue', 'Yellow', 'Orange'],

	ground_starting_pos: 0,
	ground_velocity: 15,
	box_row_width: 2,
	box_row_height: 1
};
