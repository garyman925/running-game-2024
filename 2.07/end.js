class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        this.score = data.score;
        console.log("Received score in EndScene:", this.score);  // 添加这行
        this.bugPosition = data.bugPosition;
        this.enemyBugPosition = data.enemyBugPosition;
        this.groundPosition = data.groundPosition;
        this.midGroundPosition = data.midGroundPosition;
        this.questions = data.questions;
        this.answers = data.answers;
        this.userAnswers = data.userAnswers;
        this.bugScore = data.bugScore;
        this.enemyBugScore = data.enemyBugScore;
    }

    create() {
        // 停止 MainScene 的背景音乐
        this.sound.stopByKey('bgm');

        // 停止 dragon roar 音效
        this.sound.stopByKey('dragon_roar');

        // 停止 footstep 音效
        this.sound.stopByKey('footsteps');

        // 播放 EndScene 的背景音乐
        this.sound.play('endscene-bgm', { loop: false });
        //控制音量
        this.sound.setVolume(0.5);
       
 

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

        // 创建城堡图片（放在地面之上）
        const castle = this.add.image(
            this.sys.game.config.width + 50, 
            this.groundPosition,  // 调整 y 坐标，使城堡位于地面之上
            'castle'
        );
        castle.setOrigin(1, 1);  // 设置原点为右下角
        castle.setScale(0.9);  // 保持与 MainScene 相同的缩放比例
        castle.setDepth(4);  // 设置深度比地面（深度为3）高

        // 创建一个遮罩来覆盖城堡的右半部分
        const castleMask = this.add.graphics();
        castleMask.fillStyle(0x000000, 1);
        castleMask.fillRect(this.sys.game.config.width / 2, 0, this.sys.game.config.width / 2, this.sys.game.config.height);
        castle.setMask(castleMask.createGeometryMask());

        // 创建 darkmask
        this.darkMask = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x78276B, 0.7);
        this.darkMask.setOrigin(0, 0);
        this.darkMask.setDepth(1);

        // 创建虫子
        this.bug = this.add.sprite(this.sys.game.config.width * 0.3, this.bugPosition, 'bugbug');
        this.enemyBug = this.add.sprite(this.sys.game.config.width * 0.2, this.enemyBugPosition, 'enemyBug');
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);
        
        // 设置虫子的大小
        this.bug.setScale(0.8);
        this.enemyBug.setScale(0.8);

        // 根据分数决定虫子的行为和播放音效
        if (this.bugScore > this.enemyBugScore) {
            // 主角虫子跑到城堡前
            this.tweens.add({
                targets: this.bug,
                x: this.sys.game.config.width * 0.7,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => {
                    this.bug.play('idle_bug');
                    // 播放胜利音效
                    this.sound.play('you_are_the_winner');
                }
            });
            this.bug.play('run_bug');

            // 对手虫子播放燃烧动画
            this.enemyBug.play('burn_enemyBug');
        } else {
            // 如果主角虫子没赢，两只虫子都播放普通动画
            this.bug.play('run_bug');
            this.enemyBug.play('run_enemyBug');
            // 播放失败音效
            this.sound.play('you_lose');
        }

        // 创建陨石效果
        this.createMeteors();

        // 修改显示得分的位置和样式
        const scoreTextStyle = {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '100px',
            fill: '#ffffff',
            align: 'center'
        };

        const finalScoreTextStyle = {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        };

        // 计算 "Final Score" 文本的宽度
        const finalScoreText = this.add.text(0, 0, 'Final Score', finalScoreTextStyle);
        const finalScoreWidth = finalScoreText.width;
        finalScoreText.destroy(); // 我们只是用来计算宽度，所以现在可以删除它

        // 显示分数，向下和向左移动
        const scoreX = this.sys.game.config.width - 60 - finalScoreWidth / 2;
        const scoreY = 80;  // 向下移动到 50
        this.scoreText = this.add.text(scoreX, scoreY, `${this.score}`, scoreTextStyle)
            .setOrigin(0.5, 0)
            .setDepth(10);

        console.log("Initial score set:", this.score);

        // 显示 "Final Score" 文本，向下和向左移动
        const finalScoreX = this.sys.game.config.width - 60;
        const finalScoreY = 200;  // 向下移动到 110
        this.add.text(finalScoreX, finalScoreY, 'Final Score', finalScoreTextStyle)
            .setOrigin(1, 0)
            .setDepth(10);

        // 添加分数动画
        this.animateScore(0, this.score);

        // 调整滚动文本区域的位置和大小
        const textWidth = 1100;  // 增加文本区域宽度
        const textHeight = 450;  // 增加文本区域高度
        const padding = 20;
        const topMargin = 120;  // 稍微增加顶部边距，为分数显示留出更多空间

        // 创建滚动文本区域
        this.createScrollableText();

        // 添加重新开始按钮
        const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 250, 'Replay', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(5);

        restartButton.on('pointerdown', () => {
            this.scene.start('MainScene');
        });

        // 确保所有他元素的深度小于 10
        this.midGround.setDepth(2);
        this.darkMask.setDepth(1);
        this.ground.setDepth(3);
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);
        this.meteorParticles.setDepth(5);

        // 创建动画
        this.anims.create({
            key: 'run_bug',
            frames: this.anims.generateFrameNames('bugbug', {
                prefix: 'Comp 1_',
                start: 0,
                end: 11,
                zeroPad: 5,
                suffix: '.png'
            }),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: 'idle_bug',
            frames: this.anims.generateFrameNames('bugbug', {
                prefix: 'Comp 1_',
                start: 0,
                end: 0,
                zeroPad: 5,
                suffix: '.png'
            }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'run_enemyBug',
            frames: this.anims.generateFrameNames('enemyBug', {
                prefix: 'Comp 3_',
                start: 0,
                end: 11,
                zeroPad: 5,
                suffix: '.png'
            }),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: 'burn_enemyBug',
            frames: this.anims.generateFrameNames('enemyBugBurn', {
                prefix: 'Comp 4_',
                start: 0,
                end: 13,
                zeroPad: 5,
                suffix: '.png'
            }),
            frameRate: 15,
            repeat: 0
        });
    }

    animateScore(start, end) {
        console.log("Animating score from", start, "to", end);  // 添加这行
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentScore = start;

        const scoreInterval = this.time.addEvent({
            delay: stepDuration,
            callback: () => {
                currentScore = Math.min(currentScore + Math.ceil((end - start) / steps), end);
                this.scoreText.setText(currentScore.toString());
                console.log("Current score:", currentScore);  // 添加这行
                this.scoreText.setScale(1.2);
                this.tweens.add({
                    targets: this.scoreText,
                    scale: 1,
                    duration: stepDuration,
                    ease: 'Bounce.Out'
                });

                if (currentScore >= end) {
                    scoreInterval.remove();
                    console.log("Animation completed");  // 添加这行
                }
            },
            repeat: steps
        });
    }

    update() {
        // 移动背景和地面
        this.midGround.tilePositionX += 0;
        this.ground.tilePositionX += 0;

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

        this.meteorParticles.setDepth(5);
    }

    updateMeteors() {
        // 可以在这里添加额外的更新逻辑，如果需要的话
    }

    createScrollableText() {
        const margin = 50;  // 边距
        const textWidth = this.sys.game.config.width / 2 + 300;  // 增加文本宽度
        const textHeight = this.sys.game.config.height / 2;  // 将高度设置为屏幕高度的一半
        const scrollBarWidth = 20;
        const cornerRadius = 20;
        const leftOffset = 0;  // 向左偏移量
        const topMargin = margin;  // 将顶部边距设置为 margin，使答案框贴在顶部

        // 创建背景
        const background = this.add.graphics();
        background.fillStyle(0x000000, 0.7);
        background.fillRoundedRect(
            margin - leftOffset,
            topMargin,
            textWidth,
            textHeight,
            cornerRadius
        );
        background.setDepth(5);

        // 创建遮罩
        const mask = this.make.graphics();
        mask.fillStyle(0xffffff);
        mask.fillRoundedRect(
            margin - leftOffset,
            topMargin,
            textWidth,
            textHeight,
            cornerRadius
        );

        // 创建文本
        const content = this.questions.map((question, index) => {
            const answers = this.answers[index];
            const userAnswer = this.userAnswers[index];
            return `Q${index + 1}: ${question}\n` + 
                   answers.map((answer, i) => {
                       const isCorrect = i === 0;
                       const isUserAnswer = userAnswer === i;
                       const prefix = isCorrect ? '✓' : '✗';
                       let answerText = `     ${answer} ${prefix}`; // 在答案前添加五个空格
                       if (isUserAnswer) {
                           answerText += ' (Your Answer)';
                       }
                       return answerText;
                   }).join('\n') + '\n';
        }).join('\n');

        const text = this.add.text(
            margin + 10 - leftOffset,
            topMargin + 10,
            content,
            {
                fontFamily: '"Jost", sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                wordWrap: { width: textWidth - 40 },
                lineSpacing: 5,
                align: 'left'
            }
        ).setDepth(6);

        text.setMask(mask.createGeometryMask());

        // 创建滚动条
        const scrollBar = this.add.graphics();
        scrollBar.fillStyle(0xcccccc, 1);
        scrollBar.fillRoundedRect(
            margin + textWidth - scrollBarWidth - leftOffset,
            topMargin,
            scrollBarWidth,
            textHeight,
            scrollBarWidth / 2
        );
        scrollBar.setDepth(6);

        // 创建滚动滑块
        const scrollThumb = this.add.graphics();
        scrollThumb.fillStyle(0xffffff, 1);
        scrollThumb.fillRoundedRect(
            margin + textWidth - scrollBarWidth - leftOffset,
            topMargin,
            scrollBarWidth,
            100,
            scrollBarWidth / 2
        );
        scrollThumb.setDepth(7);

        // 创建一个透明的交互区域，覆盖整个滚动条
        const hitArea = new Phaser.Geom.Rectangle(
            margin - leftOffset,
            topMargin,
            textWidth,
            textHeight
        );
        const hitAreaGraphics = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 } });
        hitAreaGraphics.fillRectShape(hitArea);
        hitAreaGraphics.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // 设置拖动
        this.input.setDraggable(hitAreaGraphics);

        // 创建悬停提示文本
        const hoverText = this.add.text(0, 0, 'Scroll', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        hoverText.setVisible(false);
        hoverText.setDepth(8);

        // 计算滚动条的 X 坐标
        const scrollBarX = margin + textWidth - scrollBarWidth - leftOffset;

        // 添加鼠标悬停效果
        hitAreaGraphics.on('pointerover', (pointer) => {
            this.input.setDefaultCursor('pointer');
            hoverText.setVisible(true);
            hoverText.setPosition(scrollBarX + scrollBarWidth + 10, pointer.y);
        });

        hitAreaGraphics.on('pointermove', (pointer) => {
            if (hoverText.visible) {
                hoverText.setPosition(scrollBarX + scrollBarWidth + 10, pointer.y);
            }
        });

        hitAreaGraphics.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            hoverText.setVisible(false);
        });

        // 滚动逻辑
        let isDragging = false;
        const maxY = topMargin + textHeight - 100;
        const minY = topMargin;

        hitAreaGraphics.on('drag', (pointer, dragX, dragY) => {
            isDragging = true;
            const newY = Phaser.Math.Clamp(dragY, minY, maxY);
            scrollThumb.clear();
            scrollThumb.fillStyle(0xffffff, 1);
            scrollThumb.fillRoundedRect(
                margin + textWidth - scrollBarWidth - leftOffset,
                newY,
                scrollBarWidth,
                100,
                scrollBarWidth / 2
            );
            const scrollPercentage = (newY - minY) / (maxY - minY);
            text.y = topMargin + 10 - (text.height - textHeight) * scrollPercentage;
        });

        hitAreaGraphics.on('dragend', () => {
            isDragging = false;
        });

        // 鼠标滚轮滚动
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (!isDragging) {
                text.y -= deltaY;
                text.y = Phaser.Math.Clamp(text.y, -(text.height - textHeight) + topMargin + 10, topMargin + 10);
                const scrollPercentage = (topMargin + 10 - text.y) / (text.height - textHeight);
                const newY = minY + (maxY - minY) * scrollPercentage;
                scrollThumb.clear();
                scrollThumb.fillStyle(0xffffff, 1);
                scrollThumb.fillRoundedRect(
                    margin + textWidth - scrollBarWidth - leftOffset,
                    newY,
                    scrollBarWidth,
                    100,
                    scrollBarWidth / 2
                );
            }
        });
    }

    shutdown() {
        this.sound.stopByKey('endscene-bgm');
    }
}
