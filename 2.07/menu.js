class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // 加载 startBtn 作为精灵表
        this.load.spritesheet('startBtn', '../assets/start_btn.png', { 
            frameWidth: 224,  // 假设按钮宽度为224像素
            frameHeight: 76   // 假设按钮高度为152像素，每帧高度为76像素
        });
        this.load.image('bg', '../assets/bg4.png');
    }

    create() {
        // 添加背景
        this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg').setOrigin(0);
        
        // 添加 logo 文本
        const logoText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'Runrun Bug', {
            fontSize: '64px',
            fontStyle: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 为 logo 文本添加简单的动画效果
        this.tweens.add({
            targets: logoText,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // 添加开始按钮
        let startButton = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'startBtn', 0)
            .setInteractive()
            .on('pointerover', () => startButton.setFrame(1))
            .on('pointerout', () => startButton.setFrame(0))
            .on('pointerdown', () => this.scene.start('MainScene'));

        // 调整按钮大小（如果需要）
        startButton.setScale(0.5);  // 根据需要调整缩放比例

        // 添加文本（可选）
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'Click to Start', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 添加调试信息
        console.log('Texture exists:', this.textures.exists('startBtn'));
        if (!this.textures.exists('startBtn')) {
            console.error('startBtn texture not found');
            // 使用一个占位图像
            let placeholder = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 200, 100, 0xff0000);
            placeholder.setInteractive().on('pointerdown', () => this.scene.start('MainScene'));
        }
    }
}
