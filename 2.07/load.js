class LoadScene extends Phaser.Scene {
	constructor() {
		super('LoadScene');
	}

	preload() {
		this.load.image('bird', '../assets/bird.png');
		this.load.spritesheet('bug', '../assets/bug.png', { frameWidth: 190, frameHeight: 170 });
		this.load.spritesheet('enemyBug', '../assets/enemyBug.png', { frameWidth: 190, frameHeight: 170 });
		this.load.spritesheet('ground', '../assets/space-map-ground.png', { frameWidth: 128, frameHeight: 190 });
		this.load.spritesheet('tree', '../assets/tree3.png', { frameWidth: 158, frameHeight: 199 });
		this.load.spritesheet('grass', '../assets/grass.png', { frameWidth: 512, frameHeight: 128 });
		this.load.image('bg', '../assets/space-map-bg.png');
		this.load.image('button', '../assets/button.png');
		this.load.image('tick', '../assets/tick.png');
		this.load.image('cross', '../assets/cross.png');
		this.load.image('correct', '../assets/correct.png');
		this.load.image('wrong', '../assets/wrong.png');
		this.load.audio('bgm', '../audio/bgm1.mp3');
		this.load.audio('fail', '../audio/felldown2.wav');
		this.load.audio('endbgm', '../audio/complete2.mp3');
		this.load.audio('running', '../audio/run.wav');
		this.load.audio('aruready', '../audio/aruready.wav');
		this.load.audio('yeah', '../audio/yeah.mp3');
		this.load.audio('step', '../audio/step.wav');
	}

	create() {
		this.scene.start('MenuScene');
	}
}
