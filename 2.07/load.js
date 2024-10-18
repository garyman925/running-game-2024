class LoadScene extends Phaser.Scene {
	constructor() {
		super('LoadScene');
	}

	preload() {
		this.load.image('bird', '../assets/bird.png');
		this.load.spritesheet('bug', '../assets/bug.png', { frameWidth: 190, frameHeight: 174 });
		this.load.image('ground', '../assets/ground.jpg');
		this.load.image('bg', '../assets/bg4.png');
		this.load.spritesheet('button', '../assets/button.png', { frameWidth: 310, frameHeight: 70 });
		// Load other assets...
	}

	create() {
		this.scene.start('MenuScene');
	}
}
