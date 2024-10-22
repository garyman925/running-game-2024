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
        // 移除这行，因为背景图片应该已经在 LoadScene 中加载
        // this.load.image('bg', '../assets/bg-world-1.png');
    }

    create() {
        // 创建背景
        this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
        
        // 计算缩放比例
        const scaleX = this.cameras.main.width / 2400;
        const scaleY = this.cameras.main.height / 1350;
        const scale = Math.min(scaleX, scaleY);
        
        this.bg.setScale(scale);
        
        // 调整背景位置以确保覆盖整个屏幕
        this.bg.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);

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

        // 添加提示文本
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Click Anywhere to Start', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 使整个场景可点击
        this.input.on('pointerdown', () => this.startGame());
    }

    startGame() {
        this.scene.start('MainScene');
    }
}
