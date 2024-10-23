class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.questions = [
            "What is the capital of France?"
        ];
        this.answers = [
            ["Paris", "London"]
        ];
        this.qIds = [1];
        this.initialMidGroundSpeed = 0.8;  // 增加初始速度
        this.maxMidGroundSpeed = 3.0;  // 增加最大速度
        this.initialGroundSpeed = 1;  // 初始地面速度
        this.maxGroundSpeed = 4;  // 最大地面速度
        this.currentQuestionIndex = 0;
        this.meteorEmitter = null;
    }

    create() {
        // 设置物理系统
        this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // 创建背景
        // this.bg = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg');
        // this.bg.setScale(Math.max(this.sys.game.config.width / this.bg.width, this.sys.game.config.height / this.bg.height));
        // this.bg.setDepth(0);

        // 创建变暗的遮罩
        this.darkMask = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x78276B, 0.7);
        this.darkMask.setOrigin(0, 0);
        this.darkMask.setDepth(1);

        // 创建中背景
        this.midGround = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - 180,
            this.sys.game.config.width,
            200,
            'midGround'
        );
        this.midGround.setOrigin(0.5, 1);
        this.midGround.setScale(1.2);
        this.midGround.setDepth(2);

        // 创建城堡图片（放在 midGround 之前）
        const castle = this.add.image(
            this.sys.game.config.width + 50, 
            this.sys.game.config.height / 2 - 170,  // 将 y 坐标向上移动 50 像素
            'castle'
        );
        castle.setOrigin(1, 0.5);  // 设置原点为右侧中心
        castle.setScale(0.9);  // 保持缩放比例为 1
        castle.setDepth(1.5);  // 设置深度在 midGround (深度为2) 之前

        // 创建一个遮罩来覆盖城堡的右半部分
        const castleMask = this.add.graphics();
        castleMask.fillStyle(0x000000, 1);
        castleMask.fillRect(this.sys.game.config.width / 2, 0, this.sys.game.config.width / 2, this.sys.game.config.height);
        castle.setMask(castleMask.createGeometryMask());

        // 创建飞龙
        this.createDragon();

        // 创建地面
        const groundHeight = 200;
        this.ground = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - groundHeight / 2,
            this.sys.game.config.width,
            groundHeight,
            'ground'
        );
        this.ground.setScale(1.5);
        this.ground.setDepth(3);
        this.physics.add.existing(this.ground, true);

        // 调整地面的物体积大小以匹配视觉大小
        this.ground.body.setSize(this.ground.width, this.ground.height / 1.5);
        this.ground.body.setOffset(0, this.ground.height / 3);

        // 创建虫子
        const groundTop = this.sys.game.config.height - groundHeight * 1.5;
        const bugOffset = 120; // 增加偏移量以适应更大的 bug
        const bugStartX = this.sys.game.config.width * 0.2; // 將虫子的初始 X 坐標設置為屏幕寬度的 20%
        this.bug = this.physics.add.sprite(bugStartX, groundTop + bugOffset - 40, 'bug'); // 將主角虫子稍微提高
        this.enemyBug = this.physics.add.sprite(bugStartX - 50, groundTop + bugOffset + 20, 'enemyBug'); // 保持敌人虫子稍低，稍微靠左
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);

        // 设置虫子性
        this.setupBugs();

        // 创建钮和文本
        this.createButtons();
 
        // 初始化游戏数据
        this.initializeGame();

        // 创建音频
        this.bgm = this.sound.add('bgm');
        this.fail = this.sound.add('fail');
        this.running = this.sound.add('running');
        this.yeah = this.sound.add('yeah');
        this.step = this.sound.add('step');

        // 播放背景音乐
        this.bgm.play({ loop: true });

        // 创建反馈图标
        this.createFeedbackIcons();

        // 添加得分显示
        this.scoreText = this.add.text(this.sys.game.config.width / 2, 60, 'Your Score: 0', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '30px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);  // 设置原点为中心
        this.scoreText.setDepth(6);
        this.scoreText.setPadding(0, 15, 0, 0);

        // 添加碰撞
        this.physics.add.collider(this.bug, this.ground);
        this.physics.add.collider(this.enemyBug, this.ground);

        // 确保问题文本和按钮在最上层
        this.questionText.setDepth(5);
        this.button1.setDepth(5);
        this.button2.setDepth(5);
        this.answer1Text.setDepth(6);
        this.answer2Text.setDepth(6);
        this.scoreText.setDepth(6);
        this.wrong.setDepth(7);  // 将 "you are wrong" 显示设置为最高深度

        // 创建陨石粒子系统
        this.createMeteors();

        // 创建玩家旗子，但初始设置为不可见
        this.createPlayerFlag();
        this.playerFlag.setVisible(false);

        this.midGroundSpeed = this.initialMidGroundSpeed;
        this.groundSpeed = this.initialGroundSpeed;

        // 創建龍的動畫（只保留一個動畫，命名為dragon_fly）
        this.anims.create({
            key: 'dragon_fly',
            frames: this.anims.generateFrameNames('dragon', {
                prefix: 'dragon_',
                start: 1,
                end: 4,
                zeroPad: 1,
                suffix: '.png'
            }),
            frameRate: 8,  // 可以根據需要調整幀率
            repeat: -1
        });

        // 創建龍（確保這裡只調用一次）
        this.createDragon();

        // 創建火球動畫
        this.anims.create({
            key: 'fireball_anim',
            frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // 设置 midGroundSpeed 为 0
        this.midGroundSpeed = 0;
    }

    setupBugs() {
        // 设置 bug 的画
        this.bug.setCollideWorldBounds(true);
        this.bug.setBounce(0.2);
        this.bug.setGravityY(800);

        // 创建跑步动画
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

        // 创建跌倒动画
        this.anims.create({
            key: 'fall_bug',
            frames: this.anims.generateFrameNames('bugbug', {
                prefix: 'Comp 2_',
                start: 0,
                end: 6,
                zeroPad: 5,
                suffix: '.png'
            }),
            frameRate: 15,
            repeat: 0
        });

        this.bug.play('run_bug');
        this.bug.setScale(0.8);
        this.bug.setOrigin(0.5, 0.4);

        // 更新 enemyBug 的设置
        this.enemyBug.setCollideWorldBounds(true);
        this.enemyBug.setBounce(0.2);
        this.enemyBug.setGravityY(800);

        // 创建 enemyBug 的跑步动画
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

        // 创建 enemyBug 的失败动画（如果需要的话）
        this.anims.create({
            key: 'fail_enemyBug',
            frames: [{ key: 'enemyBug', frame: 'Comp 3_00006.png' }],  // 使用适当的帧
            frameRate: 15
        });

        this.enemyBug.play('run_enemyBug');
        this.enemyBug.setScale(0.8);  // 调整大小，可能需要根据新sprite的尺寸进行调整
        this.enemyBug.setOrigin(0.5, 0.5);

        // 添加 enemyBug 的燃烧动画
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

    createButtons() {
        // 创建问题文本
        this.questionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 150, '', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        // 添加阴影效果
        this.questionText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 10);

        // 创建答案按钮和文本
        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonY = this.cameras.main.height * 0.55;  // 将按钮位置从 0.75 调整到 0.65

        // 创建阴影
        this.button1Shadow = this.add.graphics();
        this.button2Shadow = this.add.graphics();

        this.button1Shadow.fillStyle(0x000000, 0.3);
        this.button2Shadow.fillStyle(0x000000, 0.3);

        this.button1Shadow.fillRoundedRect(this.cameras.main.width * 0.3 - buttonWidth / 2 + 5, buttonY - buttonHeight / 2 + 5, buttonWidth, buttonHeight, 15);
        this.button2Shadow.fillRoundedRect(this.cameras.main.width * 0.7 - buttonWidth / 2 + 5, buttonY - buttonHeight / 2 + 5, buttonWidth, buttonHeight, 15);

        this.button1 = this.add.graphics();
        this.button2 = this.add.graphics();

        this.button1.fillStyle(0xffffff, 1);
        this.button2.fillStyle(0xffffff, 1);

        this.button1.fillRoundedRect(this.cameras.main.width * 0.3 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 15);
        this.button2.fillRoundedRect(this.cameras.main.width * 0.7 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 15);

        this.answer1Text = this.add.text(this.cameras.main.width * 0.3, buttonY, '', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '30px',
            fontWeight: 'bold',
            fill: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        this.answer2Text = this.add.text(this.cameras.main.width * 0.7, buttonY, '', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '30px',
            fontWeight: 'bold',
            fill: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        // 设置按钮交互
        this.button1.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width * 0.3 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        this.button2.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width * 0.7 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // 设置按钮点击事件
        this.button1.on('pointerdown', () => this.answer(this.button1));
        this.button2.on('pointerdown', () => this.answer(this.button2));

        // 设置深度
        this.button1Shadow.setDepth(4);
        this.button2Shadow.setDepth(4);
        this.button1.setDepth(5);
        this.button2.setDepth(5);
        this.answer1Text.setDepth(6);
        this.answer2Text.setDepth(6);
    }

    initializeGame() {
        this.totalQuestion = 0;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        this.collectResult = [];
        this.showNextQuestion();
    }

    showNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            let q = this.questions[this.currentQuestionIndex];
            let a = this.answers[this.currentQuestionIndex];
            if (q && a) {
                this.showQuestion(q, a);
                this.currentQuestionIndex++;
                this.updateGameSpeed();
            } else {
                console.error('Question or answer is undefined', this.currentQuestionIndex);
            }
        } else {
            this.endGame();
        }
    }

    showQuestion(question, answers) {
        // 确保问题以问号结尾
        if (!question.endsWith('?')) {
            question += '?';
        }

        // 清空问题文本
        this.questionText.setText('');
        
        // 隐藏答案按钮和文本
        this.hideAnswers();
        
        // 使用打字机效果显示问题
        this.typewriterEffect(this.questionText, question);
        
        // 延迟显示答案，等待问题完全显示
        this.time.delayedCall(question.length * 50 + 500, () => {
            if (Math.random() < 0.5) {
                this.answer1Text.setText(answers[0]);
                this.answer2Text.setText(answers[1]);
                this.correctAnswer = this.button1;
            } else {
                this.answer1Text.setText(answers[1]);
                this.answer2Text.setText(answers[0]);
                this.correctAnswer = this.button2;
            }
            
            // 调整文本行
            this.answer1Text.setWordWrapWidth(280);
            this.answer2Text.setWordWrapWidth(280);
            
            // 显答案按钮和文本
            this.showAnswers();
        });
    }

    endGame() {
        console.log("Game Over. Score: " + score);
        console.log("Questions: " + JSON.stringify(this.qIds));
        console.log("User Answers: " + JSON.stringify(this.collectResult));
        
        this.scene.start('EndScene', { 
            score: score, 
            bugPosition: this.bug.y,
            enemyBugPosition: this.enemyBug.y,
            groundPosition: this.ground.y,
            midGroundPosition: this.midGround.y,
            questions: this.questions,
            answers: this.answers,
            userAnswers: this.collectResult
        });
    }

    update() {
        // 确终部穿过地面
        const groundTop = this.sys.game.config.height - this.ground.height * 1.5;
        const bugOffset = 120; // 与创建虫子时使用相同的值
        const maxYBug = groundTop + bugOffset - 40;
        const maxYEnemyBug = groundTop + bugOffset + 20;

        if (this.bug.y > maxYBug) {
            this.bug.y = maxYBug;
            this.bug.setVelocityY(0);
        }
        if (this.enemyBug.y > maxYEnemyBug) {
            this.enemyBug.y = maxYEnemyBug;
            this.enemyBug.setVelocityY(0);
        }

        // 注释掉或删除移动中层背景的代码
        // this.midGround.tilePositionX += this.midGroundSpeed;

        // 移动地面
        this.ground.tilePositionX += this.groundSpeed;

        // 持续检查问题文的可见性
        if (this.questionText) {
            //console.log('Question text visibility:', this.questionText.visible, 'Text:', this.questionText.text);
        }

        // 更新陨石效果
        this.updateMeteors();

        // 更新旗子位置（仅当旗子可见时
        if (this.playerFlag && this.playerFlag.visible) {
            this.playerFlag.x = this.bug.x;
            // y坐标由补间动画处理
        }

        // 移除或註釋掉這部分代碼
        /*
        // 讓龍緩慢向右移動
        if (this.dragon) {
            this.dragon.x += 0.5; // 每幀向右移動 0.5 像素，可以根據需要調整

            // 如果龍移出畫面，將其重置到左側
            if (this.dragon.x > this.sys.game.config.width + this.dragon.width / 2) {
                this.dragon.x = -this.dragon.width / 2;
            }
        }
        */
    }

    createFeedbackIcons() {
        this.tick = this.add.image(0, 0, 'tick').setVisible(false).setScale(0.2);
        this.cross = this.add.image(0, 0, 'cross').setVisible(false).setScale(0.2);
        this.correct = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'correct').setVisible(false).setOrigin(0.5);
        this.wrong = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wrong').setVisible(false).setOrigin(0.5);
        
        // 设置反馈图标的深度
        this.tick.setDepth(6);
        this.cross.setDepth(6);
        this.correct.setDepth(7);
        this.wrong.setDepth(7);  // 确保 "you are wrong" 显示在最上层
    }

    answer(button) {
        // 禁用按钮，防止多次点击
        this.button1.disableInteractive();
        this.button2.disableInteractive();

        if (button === this.correctAnswer) {
            // 正确答案的处理
            console.log("正确答案！");
            this.updateScore(score + 1);
            this.showCorrectFeedback(button);
            this.moveBugForward();
            this.createStarEffect();
            
            // 播放 enemyBug 的燃烧动画
            this.enemyBug.play('burn_enemyBug');
            
            // 在动画结束后重置为跑步动画
            this.enemyBug.once('animationcomplete', () => {
                this.enemyBug.play('run_enemyBug');
            });
        } else {
            // 错误答案的处理
            console.log("错误答案！");
            this.showWrongFeedback(button);
            this.shootMeteor();  // 這裡改為 shootMeteor
            this.moveEnemyBugForward();
        }

        // 显示旗子
        this.showFlag();

        // 记录答案
        this.collectResult.push(button === this.correctAnswer ? 0 : 1);

        // 隐藏答案按钮和文本
        this.hideAnswers();

        // 延迟后显示下一个问题
        this.time.delayedCall(2000, () => {
            this.showNextQuestion();
        });
    }

    showCorrectFeedback(button) {
        this.tick.setPosition(button.x, button.y).setVisible(true);
        this.correct.setVisible(true);
        this.yeah.play();

        // 2秒后隐藏反馈
        this.time.delayedCall(2000, () => {
            this.tick.setVisible(false);
            this.correct.setVisible(false);
        });
    }

    showWrongFeedback(button) {
        this.cross.setPosition(button.x, button.y).setVisible(true);
        this.wrong.setVisible(true);
        this.fail.play();

        // 显示正确答案
        const correctButton = (button === this.button1) ? this.button2 : this.button1;
        this.tick.setPosition(correctButton.x, correctButton.y).setVisible(true);

        // 2秒后隐藏反馈
        this.time.delayedCall(2000, () => {
            this.cross.setVisible(false);
            this.tick.setVisible(false);
            this.wrong.setVisible(false);
        });
    }

    moveBugForward() {
        // 创建一个复合动画，包括向前移动、轻跳和下落
        const jumpHeight = 50; // 跳跃高度
        const moveDuration = 500; // 总移动时间
        const jumpDuration = moveDuration / 1.5; // 上升时间
        const fallDuration = moveDuration / 2; // 下落时间

        // 向前移动和向上跳
        this.tweens.add({
            targets: this.bug,
            x: this.bug.x + 80,
            y: this.bug.y - jumpHeight,
            duration: jumpDuration,
            ease: 'Sine.easeOut',
            onComplete: () => {
                // 下落
                this.tweens.add({
                    targets: this.bug,
                    y: this.bug.y + jumpHeight,
                    duration: fallDuration,
                    ease: 'Sine.easeIn'
                });
            }
        });

        // 播放跑步音效
        this.running.play();

        // 可选：添加一个轻微的旋转效果
        this.tweens.add({
            targets: this.bug,
            angle: {from: -5, to: 5},
            duration: moveDuration / 2,
            yoyo: true,
            repeat: 1
        });
    }

    moveEnemyBugForward() {
        this.tweens.add({
            targets: this.enemyBug,
            x: this.enemyBug.x + 40,
            y: this.enemyBug.y + 5, // 稍微向下移动，但幅度减小
            duration: 1000,
            ease: 'Power2'
        });
        this.running.play();
    }

    typewriterEffect(text, targetText) {
        const length = targetText.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                text.setText(targetText.slice(0, i + 1));  // 改为 i + 1
                ++i;
            },
            repeat: length - 1,
            delay: 50 // 你可以调整这个改变打字速度
        });
    }

    updateScore(newScore) {
        score = newScore;
        this.scoreText.setText('Your Score: ' + score);
        
        // 添加缩放动画
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                this.scoreText.setScale(1);
            }
        });

        // 添加颜色变化动画
        this.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 200,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                this.scoreText.setColor(`rgb(255, ${255 - value}, ${255 - value})`);
            },
            onComplete: () => {
                this.scoreText.setColor('#ffffff');
            }
        });

        // 添加上下移动动画
        this.tweens.add({
            targets: this.scoreText,
            y: 50,  // 稍微向上移动
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut'
        });
    }

    createMeteors() {
        this.meteorParticles = this.add.particles('meteor');

        this.meteorEmitter = this.meteorParticles.createEmitter({
            x: { min: 0, max: this.sys.game.config.width },
            y: -50,
            speedX: { min: -150, max: -100 },  // 固定的水平速度
            speedY: { min: 100, max: 150 },    // 固定的垂直度
            scale: { min: 0.1, max: 0.6 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 4000, max: 8000 },
            quantity: 1,
            frequency: 500,  // 固定的生成频率
            blendMode: 'ADD',
            rotate: 0
        });

        this.meteorParticles.setDepth(1);
    }

    updateMeteors() {
        // 可以在这里添加额外的更新逻辑，如果需要的话
    }

    createStarEffect() {
        const star = this.add.image(this.bug.x, this.bug.y + 50, 'star').setScale(0);
        star.setDepth(10);  // 确保星星在最上层
        star.setBlendMode(Phaser.BlendModes.ADD);  // 设置混合模式为ADD

        // 第一阶段：星星从角色底部升起
        this.tweens.add({
            targets: star,
            y: this.bug.y - 70,  // 升到头顶略高位置
            scale: 1.5,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // 第二阶段：星星在头顶停留并轻微放大缩小
                this.tweens.add({
                    targets: star,
                    scale: 2,
                    duration: 500,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // 第三阶段：星星飞向得分文本
                        this.tweens.add({
                            targets: star,
                            x: this.scoreText.x,
                            y: this.scoreText.y,
                            scale: 0.1,
                            alpha: { from: 1, to: 0.6 },
                            duration: 1000,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                star.destroy();
                                // 添加得分本的缩放效果
                                this.tweens.add({
                                    targets: this.scoreText,
                                    scale: 1.2,
                                    duration: 200,
                                    yoyo: true
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    createPlayerFlag() {
        this.playerFlag = this.add.image(this.bug.x, this.bug.y - 30, 'flag');
        this.playerFlag.setScale(1);  // 调整大小
        this.playerFlag.setOrigin(0.5, 1);  // 设置原点为部中心
        this.playerFlag.setDepth(this.bug.depth + 1);  // 确保旗子在虫子上方

        // 添加上下移动的动画
        this.flagTween = this.tweens.add({
            targets: this.playerFlag,
            y: '+=10',  // 向下移动10像素
            duration: 500,  // 动画持续0.5秒
            yoyo: true,  // 动画会来回进行
            repeat: -1,  // 无限重复
            ease: 'Sine.easeInOut'  // 使用弦曲线使动画更平滑
        });
    }

    showFlag() {
        // 设置旗子位置并示
        this.playerFlag.setPosition(this.bug.x, this.bug.y - 30);
        this.playerFlag.setVisible(true);

        // 3秒后隐藏旗子
        this.time.delayedCall(3000, () => {
            this.playerFlag.setVisible(false);
        });
    }

    updateGameSpeed() {
        // 用指函数来计算中的层背景速度和地面速度
        let progress = this.currentQuestionIndex / this.questions.length;
        this.midGroundSpeed = this.initialMidGroundSpeed + (this.maxMidGroundSpeed - this.initialMidGroundSpeed) * Math.pow(progress, 5);
        this.groundSpeed = this.initialGroundSpeed + (this.maxGroundSpeed - this.initialGroundSpeed) * Math.pow(progress, 5);

        // 更频繁地显示速度提示
        if (this.currentQuestionIndex > 1 && this.currentQuestionIndex % 2 === 0) {  // 每两个问题显示一次
            this.showSpeedUpText();
        }

        // 陨石速度和频率保持不变
        // 如果你想在游戏开始时设置陨石的速度和频率，可以在 createMeteors 方法中进行设置
    }

    showSpeedUpText() {
        let speedUpText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Speed Up!', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '40px',
            fill: '#ff0000'
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this.tweens.add({
            targets: speedUpText,
            alpha: 1,
            y: this.sys.game.config.height / 2 - 50,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                speedUpText.destroy();
            }
        });
    }

    createDragon() {
        // 如果已經存在，先毀它
        if (this.dragon) {
            this.dragon.destroy();
        }

        // 設置飛龍的位置在畫左邊
        const dragonX = this.sys.game.config.width * 1 / 8; // 將龍移到屏幕寬度的1/8處
        const dragonY = this.sys.game.config.height * 1 / 2; // 將龍移到屏幕高度中間
        
        this.dragon = this.add.sprite(dragonX, dragonY, 'dragon');
        this.dragon.setScale(1.2);  // 調整大小，可能需要根據實際情況調整
        this.dragon.setDepth(2.5);  // 設置深度在中層背景之後，但在地面之前

        // 播放飛行動畫
        this.dragon.play('dragon_fly');

        // 添加飛龍的上下動動畫
        this.tweens.add({
            targets: this.dragon,
            y: '+=30',  // 增加浮動範圍
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 將龍翻轉向右
        this.dragon.setFlipX(true);

        // 添加這行來檢查龍的大小
        console.log('Dragon size:', this.dragon.width, this.dragon.height);
    }

    // 新增方法：隐藏答案按钮和文本
    hideAnswers() {
        this.answer1Text.setVisible(false);
        this.answer2Text.setVisible(false);
        this.button1.setVisible(false);
        this.button2.setVisible(false);
        this.button1Shadow.setVisible(false);
        this.button2Shadow.setVisible(false);
    }

    // 新增方法：显示答案按钮和文本
    showAnswers() {
        // 首先设置所有元素为可见，但透明度为0
        this.answer1Text.setVisible(true).setAlpha(0);
        this.answer2Text.setVisible(true).setAlpha(0);
        this.button1.setVisible(true).setAlpha(0);
        this.button2.setVisible(true).setAlpha(0);
        this.button1Shadow.setVisible(true).setAlpha(0);
        this.button2Shadow.setVisible(true).setAlpha(0);

        // 创建一个稍微延迟的效果，让按钮一个接一个地出现
        this.tweens.add({
            targets: [this.button1Shadow, this.button1, this.answer1Text, this.button2Shadow, this.button2, this.answer2Text],
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            delay: this.tweens.stagger(100), // 个元素之间100ms的迟
            onComplete: () => {
                // 启用按钮交互
                this.button1.setInteractive();
                this.button2.setInteractive();
            }
        });

        // 添加轻微的上移效果
        this.tweens.add({
            targets: [this.button1Shadow, this.button1, this.answer1Text, this.button2Shadow, this.button2, this.answer2Text],
            y: '-=10',
            duration: 500,
            ease: 'Power2',
            delay: this.tweens.stagger(100)
        });
    }

    // 新增方法：播放fall_bug动画
    playFallBugAnimation() {
        console.log('Starting fall_bug animation');
        this.bug.play('fall_bug');
        
        this.bug.once('animationcomplete', () => {
            console.log('fall_bug animation completed');
            // 设置动画停在最后一帧
            this.bug.anims.stopOnFrame(this.bug.anims.currentAnim.frames[this.bug.anims.currentAnim.frames.length - 1]);
            
            // 在最后一帧停留约1秒
            this.time.delayedCall(1000, () => {
                console.log('Resetting to run_bug animation');
                // 1秒后重置为run_bug动画
                this.bug.play('run_bug');
            });
        });

        // 添加一些视觉反馈
        this.cameras.main.shake(250, 0.02);
        this.bug.setTint(0xff0000);  // 将 bug 变红
        this.time.delayedCall(250, () => {
            this.bug.clearTint();  // 250ms 后恢复正常颜色
        });
    }

    shootMeteor() {
        // 計算陨石的起始位置（在畫面右上角）
        const startX = this.sys.game.config.width - 50;
        const startY = 50;

        const meteor = this.physics.add.sprite(startX, startY, 'meteor');
        meteor.setScale(0.3);  // 調整大小，可能需要根據 meteor 圖片的實際大小進行調整
        meteor.setOrigin(0.5, 0.5);  // 設置原點為中心
        meteor.setDepth(5);
        meteor.setBlendMode(Phaser.BlendModes.ADD);  // 添加混合模式

        // 設置火球的初始目標為 bug
        let targetX = this.bug.x;
        let targetY = this.bug.y - this.bug.height / 2;

        // 計算初始角度和速度
        let angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
        const speed = 600;

        // 設置火球的初始速度
        meteor.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // 設置陨石的初始旋轉角度，使其頭部指向目標
        //meteor.setRotation(angle);  // 添加 π/2（90度）使頭部指向目標

        // 添加更新邏輯，確保火球會追蹤並擊中 bug
        this.time.addEvent({
            delay: 16, // 約60fps
            callback: () => {
                if (!meteor.active) return;

                // 重新計算目標位置
                targetX = this.bug.x;
                targetY = this.bug.y - this.bug.height / 2;

                // 計算新的角度
                angle = Phaser.Math.Angle.Between(meteor.x, meteor.y, targetX, targetY);

                // 調整火球的速度向量
                meteor.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );

                // 更新陨石的旋轉角度，使其頭部始終指向目標
                meteor.setRotation(angle + Math.PI + Math.PI / 4);  // 調整為 225 度（π + π/4）

                // 檢查是否足夠接近 bug
                const distance = Phaser.Math.Distance.Between(meteor.x, meteor.y, targetX, targetY);
                console.log('Distance to bug:', distance); // 輸出距離以進行調試

                if (distance < 20) { // 如果距離小於 20 像素
                    this.playFallBugAnimation();
                    meteor.destroy();
                }
            },
            loop: true
        });

        // 如果火球在 3 秒後仍未擊中目標，銷毀它
        this.time.delayedCall(3000, () => {
            if (meteor.active) {
                meteor.destroy();
            }
        });

        console.log('Meteor shot!');
    }
}

// 全局变量
var score = 0;
var mid = "test_user_123";
var article_id = "game_domain_001";
var gcenter_id = "center_domain_001";
var limit = 10;

var questions = [
    "What is the capital of France?",
    "Which planet is known as the Red Planet?",
    "What is the largest mammal in the world?"
];
var qIds = [1, 2, 3];
var answers = [
    ["Paris", "London"],
    ["Mars", "Venus"],
    ["Blue Whale", "African Elephant"]
];

