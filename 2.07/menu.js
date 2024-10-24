class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {

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

        // 创建飞龙
        this.createDragon();

        // 添加 logo 文本，使用 Mountains of Christmas 字体
        const logoText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'Run! BUG BUG!', {
            fontFamily: '"Mountains of Christmas", cursive',
            fontSize: '120px',
            fontStyle: 'bold',
            fill: '#e73d79',
            strokeThickness: 10
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
        const startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Click Anywhere to Start', {
            fontFamily: 'sans-serif',
            fontSize: '60px',
            fontStyle: 'bold',
            fill: '#fff'
        }).setOrigin(0.5);

        // 添加闪烁效果
        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power1',
            yoyo: true, 
            repeat: -1
        });

        // 使整个场景可点击
        this.input.on('pointerdown', () => this.startGame());
    }

    createDragon() {
        // 设置飞龙的位置，例如屏幕右侧
        const dragonX = this.cameras.main.width * 0.8;
        const dragonY = this.cameras.main.height * 0.4;
        
        this.dragon = this.add.image(dragonX, dragonY, 'dragon');
        this.dragon.setScale(1.6);  // 调整大小
        this.dragon.setDepth(0);  // 确保飞龙在背景之上

        // 添加飞龙的上下浮动动画
        this.tweens.add({
            targets: this.dragon,
            y: dragonY + 30,  // 上下浮动30像素
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 添加飞龙的轻微旋转动画
        this.tweens.add({
            targets: this.dragon,
            angle: 5,  // 轻微旋转5度
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startGame() {
        this.scene.start('MainScene');
    }
}
