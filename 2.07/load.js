class LoadScene extends Phaser.Scene {
	constructor() {
		super('LoadScene');
	}

	preload() {
		this.load.image('bird', '../assets/bird.png');
		this.load.spritesheet('bugRun', '../assets/bugbug-running.png', { 
			frameWidth: 170, 
			frameHeight: 247, 
			startFrame: 0, 
			endFrame: 10 
		});
		this.load.spritesheet('bugAction', '../assets/bug.png', { 
			frameWidth: 240, 
			frameHeight: 247, 
			startFrame: 13, 
			endFrame: 19 
		});
		// 加载 bugbug 精灵图集
		this.load.atlas('bugbug', '../assets/bugbug-sprite.png', '../assets/bugbug-sprite.json');
		this.load.atlas('enemyBug', '../assets/enemy-sprite.png', '../assets/enemy-sprite.json');
		this.load.spritesheet('ground', '../assets/space-map-ground.png', { frameWidth: 128, frameHeight: 190 });
		this.load.spritesheet('tree', '../assets/tree3.png', { frameWidth: 158, frameHeight: 199 });
		this.load.spritesheet('grass', '../assets/grass.png', { frameWidth: 512, frameHeight: 128 });
		this.load.image('bg', '../assets/bg-world-1.png');
		this.load.image('midGround', '../assets/space-map-mid-ground.png');
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
		this.load.image('meteor', '../assets/meteor-3.png');
		this.load.image('star', '../assets/star.png');  // 确保你有一个星星的图片资源
		this.load.image('flag', '../assets/flag.png');  // 确保路径正确
		// 加载新的dragon sprite sheet
		this.load.atlas('dragon', '../assets/dragon-sprite.png', '../assets/dragon-sprite.json');
		this.load.spritesheet('fireball', '../assets/fireball.png', { 
			frameWidth: 176, // 根据你的实际图片调整
			frameHeight: 147 // 根据你的实际图片调整
		});
		//this.load.image('fireball', '../assets/fireball.png');
		
		// 加载 enemyBug 的燃烧 sprite sheet
		this.load.atlas('enemyBugBurn', '../assets/enemy-burn-sprite.png', '../assets/enemy-burn-sprite.json');
		this.load.image('castle', '../assets/castle.png');  // 确保路径正确
	}

	create() {
		this.scene.start('MenuScene');
	}
}
