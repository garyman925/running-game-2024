class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        this.score = data.score;
        this.bugPosition = data.bugPosition;
        this.enemyBugPosition = data.enemyBugPosition;
        this.groundPosition = data.groundPosition;
        this.midGroundPosition = data.midGroundPosition;
        this.questions = data.questions;
        this.answers = data.answers;
        this.userAnswers = data.userAnswers;
    }

    create() {
        // 创建背景
        this.midGround = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.midGroundPosition,
            this.sys.game.config.width,
            200,
            'midGround'
        );
        this.midGround.setOrigin(0.5, 1);
        this.midGround.setScale(1.2);
        this.midGround.setDepth(2);

        // 创建 darkmask
        this.darkMask = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x78276B, 0.7);
        this.darkMask.setOrigin(0, 0);
        this.darkMask.setDepth(1);

        // 创建地面
        this.ground = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.groundPosition,
            this.sys.game.config.width,
            200,
            'ground'
        );
        this.ground.setScale(1.5);
        this.ground.setDepth(3);

        // 创建虫子
        this.bug = this.add.sprite(this.sys.game.config.width * 0.3, this.bugPosition, 'bugbug');
        this.enemyBug = this.add.sprite(this.sys.game.config.width * 0.2, this.enemyBugPosition, 'enemyBug');
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);
        
        // 设置虫子的大小
        this.bug.setScale(0.8);
        this.enemyBug.setScale(0.8);

        // 播放虫子的跑步动画
        this.bug.play('run_bug');
        this.enemyBug.play('run_enemyBug');

        // 创建陨石效果
        this.createMeteors();

        // 显示得分
        this.add.text(this.sys.game.config.width / 2, 50, `Final Score: ${this.score}`, {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(5);

        // 创建滚动文本区域
        this.createScrollableText();

        // 添加重新开始按钮
        const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'Restart', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(5);

        restartButton.on('pointerdown', () => {
            this.scene.start('MainScene');
        });
    }

    update() {
        // 移动背景和地面
        this.midGround.tilePositionX += 0.5;
        this.ground.tilePositionX += 1;

        // 更新陨石效果
        this.updateMeteors();
    }

    createMeteors() {
        this.meteorParticles = this.add.particles('meteor');

        this.meteorEmitter = this.meteorParticles.createEmitter({
            x: { min: 0, max: this.sys.game.config.width },
            y: -50,
            speedX: { min: -150, max: -100 },
            speedY: { min: 100, max: 150 },
            scale: { min: 0.1, max: 0.6 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 4000, max: 8000 },
            quantity: 1,
            frequency: 500,
            blendMode: 'ADD',
            rotate: 0
        });

        this.meteorParticles.setDepth(1);
    }

    updateMeteors() {
        // 可以在这里添加额外的更新逻辑，如果需要的话
    }

    createScrollableText() {
        const textWidth = 1000;
        const textHeight = 400;
        const padding = 0;
        const topMargin = 100;

        // 创建背景
        const background = this.add.rectangle(
            this.sys.game.config.width / 2,
            topMargin + textHeight / 2,
            textWidth + padding * 2,
            textHeight + padding * 2,
            0x000000,
            0.7
        ).setDepth(5);

        // 创建遮罩
        const mask = this.make.graphics();
        mask.fillStyle(0xffffff);
        mask.fillRect(
            this.sys.game.config.width / 2 - textWidth / 2 - padding,
            topMargin,
            textWidth + padding * 2,
            textHeight + padding * 2
        );

        // 创建文本
        const content = this.questions.map((question, index) => {
            const answers = this.answers[index];
            const userAnswer = this.userAnswers[index];
            return `Q${index + 1}: ${question}\n` + 
                   answers.map((answer, i) => {
                       const isCorrect = i === 0;
                       const isUserAnswer = userAnswer === i;
                       const prefix = isCorrect ? '✓' : (isUserAnswer ? '✗' : ' ');
                       return `${prefix} ${answer}`;
                   }).join('\n') + '\n\n';
        }).join('\n');

        const text = this.add.text(
            this.sys.game.config.width / 2 - textWidth / 2,
            topMargin + padding,
            content,
            {
                fontFamily: '"IM Fell DW Pica", serif',
                fontSize: '30px',
                color: '#ffffff',
                wordWrap: { width: textWidth }
            }
        ).setDepth(6);

        text.setMask(mask.createGeometryMask());

        // 创建滚动条
        const scrollBar = this.add.rectangle(
            this.sys.game.config.width / 2 + textWidth / 2 + padding / 2,
            topMargin,
            10,
            textHeight + padding * 2,
            0xcccccc
        ).setOrigin(0.5, 0).setDepth(6);

        const scrollThumb = this.add.rectangle(
            this.sys.game.config.width / 2 + textWidth / 2 + padding / 2,
            topMargin,
            10,
            50,
            0xffffff
        ).setOrigin(0.5, 0).setDepth(7).setInteractive({ draggable: true });

        // 滚动逻辑
        let isDragging = false;
        const maxY = topMargin + textHeight + padding * 2 - scrollThumb.height;
        const minY = topMargin;

        scrollThumb.on('drag', (pointer, dragX, dragY) => {
            isDragging = true;
            scrollThumb.y = Phaser.Math.Clamp(dragY, minY, maxY);
            const scrollPercentage = (scrollThumb.y - minY) / (maxY - minY);
            text.y = topMargin + padding - (text.height - textHeight) * scrollPercentage;
        });

        scrollThumb.on('dragend', () => {
            isDragging = false;
        });

        // 鼠标滚轮滚动
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (!isDragging) {
                text.y -= deltaY;
                text.y = Phaser.Math.Clamp(text.y, -(text.height - textHeight) + topMargin + padding, topMargin + padding);
                const scrollPercentage = (topMargin + padding - text.y) / (text.height - textHeight);
                scrollThumb.y = minY + (maxY - minY) * scrollPercentage;
            }
        });
    }
}
