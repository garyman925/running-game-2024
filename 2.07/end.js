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
        console.log("EndScene create method called");
        console.log("In create - Bug Score:", this.bugScore);
        console.log("In create - Enemy Bug Score:", this.enemyBugScore);
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

        // // 显示玩家分数
        // this.add.text(20, 20, `Your Score: ${this.bugScore}`, scoreTextStyle)
        //     .setOrigin(0, 0)
        //     .setDepth(10);

        // // 显示敌人分数
        // this.add.text(20, 60, `Enemy Score: ${this.enemyBugScore}`, scoreTextStyle)
        //     .setOrigin(0, 0)
        //     .setDepth(10);

        // 移除之前的分数动画代码
        // this.animateScore(0, this.score);

        // 调整滚动文本区域的位置和大小
        const textWidth = 1100;  // 增加文本区域宽度
        const textHeight = 650;  // 增加文本区域高度
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

        // 如果玩家分数高于对手，显示 "You Win!"
        if (this.bugScore > this.enemyBugScore) {
            const winText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 300, 'You Win!', {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '36px',
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
            const loseText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 300, 'You Lose!', {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '36px',
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
        
        // 创建圆形遮罩
        const enemyMask = this.make.graphics().fillCircle(enemyIconX, enemyIconY, enemyIconSize / 2);
        enemyIcon.setMask(enemyMask.createGeometryMask());
        
        // 调整图标大小以填满圆形
        enemyIcon.setDisplaySize(enemyIconSize, enemyIconSize);

        // 在创建分数文本之前再次检查分数值
        console.log("Before creating score text - Bug Score:", this.bugScore);
        console.log("Before creating score text - Enemy Bug Score:", this.enemyBugScore);


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
                fontSize: '30px',
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

        // 创建一个透明的交互区，覆盖整个滚动条
        const hitArea = new Phaser.Geom.Rectangle(
            margin - leftOffset,
            topMargin,
            textWidth,
            textHeight
        );
        const hitAreaGraphics = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 } });
        hitAreaGraphics.fillRectShape(hitArea);
        hitAreaGraphics.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // 置拖动
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

    stopDragonAnimation() {
        if (this.dragon) {
            this.dragon.anims.pause(); // 暂停龙的动画
        }
    }
}
