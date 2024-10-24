class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        console.log("EndScene init method called with data:", data);
        this.bugScore = data.bugScore;
        this.enemyBugScore = data.enemyBugScore;
        this.score = data.score; // 确保这行存在
        console.log("After assignment in init - Bug Score:", this.bugScore);
        console.log("After assignment in init - Enemy Bug Score:", this.enemyBugScore);
        console.log("After assignment in init - Score:", this.score);
        this.bugPosition = data.bugPosition;
        this.enemyBugPosition = data.enemyBugPosition;
        this.groundPosition = data.groundPosition;
        this.midGroundPosition = data.midGroundPosition;
        this.questions = data.questions;
        this.answers = data.answers;
        this.userAnswers = data.userAnswers;
    }

    create() {
        //console.log("EndScene create method called");
        //console.log("In create - Bug Score:", this.bugScore);
        //console.log("In create - Enemy Bug Score:", this.enemyBugScore);
        // 停止 MainScene 的景音乐
        this.sound.stopByKey('bgm');

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

        // 建 darkmask
        this.darkMask = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x78276B, 0.7);
        this.darkMask.setOrigin(0, 0);
        this.darkMask.setDepth(1);

        // 创建虫子
        this.bug = this.add.sprite(this.sys.game.config.width * 0.3, this.bugPosition, 'bugbug');
        this.enemyBug = this.add.sprite(this.sys.game.config.width * 0.2, this.enemyBugPosition, 'enemyBug');
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);
        
        // 设置虫子的大小
        this.bug.setScale(1.5);
        this.enemyBug.setScale(1.5);

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
            fontSize: '40px',
            fill: '#ffffff',
            align: 'left'
        };


        // 调整滚动文本区域的位置和大小
        const textWidth = 1100;  // 增加文本区域宽度
        const textHeight = 650;  // 增加文本区域高度
        const padding = 30;
        const topMargin = 120;  // 稍微增加顶部边距，为分数显示留出更多空间

        // 创建滚动文本区域
        this.createScrollableText();

        // 添加重新开始按钮
        const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 150, 'Retry', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '60px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(5);

        // 如果玩家分数高于对手，显示 "You Win!"
        if (this.bugScore > this.enemyBugScore) {
            const winText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 200, 'You Win!', {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '45px',
                fill: '#00ff00',  // 绿色文字
                stroke: '#000000', // 黑色描边
                strokeThickness: 6 // 描边厚度
            }).setOrigin(0.5).setDepth(5);

            // 添加闪烁动画
            this.tweens.add({
                targets: winText,
                alpha: { from: 1, to: 0.5 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        }

        // 如果玩家分数低于对手，显示 "You Lose!"
        if (this.bugScore < this.enemyBugScore) {
            const loseText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 200, 'You Lose!', {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '45px',
                fill: '#ff0000',  // 红色文字
                stroke: '#000000', // 黑色描边
                strokeThickness: 6 // 描边厚度
            }).setOrigin(0.5).setDepth(5);

            // 添加闪烁动画
            this.tweens.add({
                targets: loseText,
                alpha: { from: 1, to: 0.5 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        }

        // 设置按钮为交互式
        restartButton.setInteractive({ useHandCursor: true });

        // 添加鼠标悬停效果
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ff0' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#ffffff' });
        });

        // 修改点击事件
        restartButton.on('pointerdown', () => {
            // 停止当前场景的音乐
            this.sound.stopAll();

            // 重置全局分数
            score = 0;

            // 返回到 MenuScene
            this.scene.start('MenuScene');
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

        // 创建敌人图标和分数显示
        const enemyIconSize = 130;  // 图标的直径
        const enemyIconX = this.sys.game.config.width - 200;
        const enemyIconY = 60 + enemyIconSize / 2;
        const enemyIcon = this.add.image(enemyIconX, enemyIconY, 'enemy-icon').setOrigin(0.5).setDepth(6);
        
        // 创建圆形罩
        const enemyMask = this.make.graphics().fillCircle(enemyIconX, enemyIconY, enemyIconSize / 2);
        enemyIcon.setMask(enemyMask.createGeometryMask());
        
        // 调整图标大小以填满圆形
        enemyIcon.setDisplaySize(enemyIconSize, enemyIconSize);

        // 在创建分数文本之前再次检查分数值
        //console.log("Before creating score text - Bug Score:", this.bugScore);
        //console.log("Before creating score text - Enemy Bug Score:", this.enemyBugScore);


        // 创建玩家图标和分数显示，放在敌人图标下方
        const userIconSize = 130;  // 图标的直径
        const userIconX = enemyIconX;  // 与敌人图标的 X 坐标相同
        const userIconY = enemyIconY + enemyIconSize + 150;  // 在敌人图标下方，留出一些间距
        const userIcon = this.add.image(userIconX, userIconY, 'user-icon').setOrigin(0.5).setDepth(6);
        
        // 创建圆形遮罩
        const userMask = this.make.graphics().fillCircle(userIconX, userIconY, userIconSize / 2);
        userIcon.setMask(userMask.createGeometryMask());
        
        // 调整图标大小以填满圆形
        userIcon.setDisplaySize(userIconSize, userIconSize);

        // 创建分数文本并置于图标下方中央
        this.add.text(userIconX, userIconY + userIconSize / 2 + 30, 'Your Score:\n' + this.bugScore, {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 10  // 添加行间距
        }).setOrigin(0.5, 0).setDepth(7);

        // 创建敌人分数文本并置于图标下方中央
        this.add.text(enemyIconX, enemyIconY + enemyIconSize / 2 + 30, 'Enemy Score:\n' + this.enemyBugScore, {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 10  // 添加行间距
        }).setOrigin(0.5, 0).setDepth(7);

        // 停止龙的动画
        this.stopDragonAnimation();
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
        const margin = 30;  // 边距
        const textWidth = this.sys.game.config.width / 2 + 500;  // 文本区域宽度
        const textHeight = this.sys.game.config.height / 2 + 200;  // 文本区域高度
        const scrollBarWidth = 50;
        const cornerRadius = 50;
        const leftOffset = 0;
        const topMargin = margin;

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

        // 创建一个容器来存放所有文本
        const textContainer = this.add.container(margin + 10 - leftOffset, topMargin + 10);
        textContainer.setDepth(6);

        // 获取所有行
        const lines = this.questions.map((question, index) => {
            const answers = this.answers[index];
            const userAnswer = this.userAnswers[index];
            return [`Q${index + 1}: ${question}`].concat(
                answers.map((answer, i) => {
                    const isCorrect = i === 0;
                    const isUserAnswer = userAnswer === i;
                    const prefix = isCorrect ? '✓' : '✗';
                    let answerText = `       ${answer} ${prefix}`;
                    if (isUserAnswer) {
                        answerText += ' (Your Answer)';
                    }
                    return {
                        text: answerText,
                        isCorrect: isCorrect,
                        isUserAnswer: isUserAnswer
                    };
                })
            );
        }).flat();

        // 创建文本对象
        let currentY = 0;
        const lineHeight = 80;

        lines.forEach((line, index) => {
            let color = '#ffffff';  // 默认白色
            
            if (typeof line === 'object') {
                if (line.isCorrect) {
                    color = '#00FF00';  // 正确答案为绿色
                } else if (line.isUserAnswer) {
                    color = '#FF0000';  // 错误的用户答案为红色
                }
            }

            const text = this.add.text(0, currentY, typeof line === 'string' ? line : line.text, {
                fontFamily: '"Jost", sans-serif',
                fontSize: '48px',
                color: color,
                wordWrap: { 
                    width: textWidth - 60
                }
            });
            textContainer.add(text);
            currentY += lineHeight + 5;
        });

        // 设置遮罩
        textContainer.setMask(mask.createGeometryMask());

        // 创建滚动条背景
        const scrollBarBg = this.add.graphics();
        scrollBarBg.fillStyle(0x666666, 0.6);
        scrollBarBg.fillRoundedRect(
            margin - leftOffset + textWidth - scrollBarWidth,
            topMargin,
            scrollBarWidth,
            textHeight,
            5
        );
        scrollBarBg.setDepth(6);

        // 创建滚动条滑块并设置为可交互
        const scrollThumb = this.add.graphics();
        scrollThumb.fillStyle(0xffffff, 1);
        const thumbHeight = Math.max((textHeight / currentY) * textHeight, 50);
        scrollThumb.fillRoundedRect(0, 0, scrollBarWidth - 4, thumbHeight, 3);
        scrollThumb.setDepth(7);
        scrollThumb.x = margin - leftOffset + textWidth - scrollBarWidth + 2;
        scrollThumb.y = topMargin + 2;

        // 使滑块可交互
        scrollThumb.setInteractive(new Phaser.Geom.Rectangle(0, 0, scrollBarWidth - 4, thumbHeight), Phaser.Geom.Rectangle.Contains);
        this.input.setDraggable(scrollThumb);

        // 处理拖拽
        let isDragging = false;
        let startY = 0;

        scrollThumb.on('pointerdown', function (pointer) {
            isDragging = true;
            startY = pointer.y - scrollThumb.y;
        });

        this.input.on('pointermove', function (pointer) {
            if (isDragging) {
                // 计算新的滑块位置
                let newY = Phaser.Math.Clamp(
                    pointer.y - startY,
                    topMargin + 2,
                    topMargin + textHeight - thumbHeight - 2
                );
                scrollThumb.y = newY;

                // 计算内容的滚动位置
                const scrollProgress = (newY - (topMargin + 2)) / (textHeight - thumbHeight - 4);
                const contentY = topMargin + 10 - (maxScroll * scrollProgress);
                textContainer.y = contentY;
            }
        });

        this.input.on('pointerup', function () {
            isDragging = false;
        });

        // 创建滚动区域的交互区域
        const hitAreaGraphics = this.add.graphics();
        hitAreaGraphics.setInteractive(new Phaser.Geom.Rectangle(
            margin - leftOffset,
            topMargin,
            textWidth,
            textHeight
        ), Phaser.Geom.Rectangle.Contains);

        // 计算最大滚动距离
        const maxScroll = Math.max(0, currentY - textHeight);

        // 更新滚动条位置
        hitAreaGraphics.on('wheel', (pointer, deltaX, deltaY, deltaZ) => {
            const newY = Phaser.Math.Clamp(
                textContainer.y - deltaY,
                topMargin + 10 - maxScroll,
                topMargin + 10
            );
            textContainer.y = newY;

            // 更新滑块位置
            const scrollProgress = (newY - (topMargin + 10)) / (-maxScroll);
            const thumbY = topMargin + 2 + (scrollProgress * (textHeight - thumbHeight - 4));
            scrollThumb.y = thumbY;
        });
    }

    shutdown() {
        this.sound.stopByKey('endscene-bgm');
    }

    stopDragonAnimation() {
        if (this.dragon) {
            this.dragon.anims.pause(); // 暂停龙的动画
        }
    }
}
