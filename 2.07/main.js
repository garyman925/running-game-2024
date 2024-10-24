class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.questions = [
            "What is the capital of France?",
            "What is the capital of Japan?",
            "What is the capital of China?",
            "What is the capital of Korea?",
            "What is the capital of Vietnam?",
            "What is the capital of Thailand?",
            "What is the capital of Indonesia?",
            "What is the capital of Malaysia?"
        ];
        this.answers = [
            ["Paris", "London"],
            ["Tokyo", "Seoul"],
            ["Beijing", "Shanghai"],
            ["Seoul", "Tokyo"],
            ["Hanoi", "Bangkok"],
            ["Jakarta", "Bandung"],
            ["Bangkok", "Phuket"],
            ["Jakarta", "Bandung"]
        ];
        this.qIds = [1,2,3,4,5,6,7,8];
        this.initialMidGroundSpeed = 0.8;  // 增加初始速度
        this.maxMidGroundSpeed = 3.0;  // 增加最大速度
        this.initialGroundSpeed = 1;  // 初始地面速度
        this.maxGroundSpeed = 4;  // 最大地面速度
        this.currentQuestionIndex = 0;
        this.meteorEmitter = null;
        this.footstepsSound = null;
        this.dragonRoarSound = null;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        this.dragon = null; // 添加这行
    }

    create() {
        // 重置游戏状态
        this.currentQuestionIndex = 0;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        
        // 设置物理系统
        this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // 创建背景
        // this.bg = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg');
        // this.bg.setScale(Math.max(this.sys.game.config.width / this.bg.width, this.sys.game.config.height / this.bg.height));
        // this.bg.setDepth(0);

        // 创建变暗的遮罩
        this.darkMask = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x78276B, 0.5);
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
            this.sys.game.config.height / 2 - 120,  // 将 y 坐标向上移动 50 像素
            'castle'
        );
        castle.setOrigin(1, 0.5);  // 设置原点为右侧中心
        castle.setScale(1.3);  // 保持缩放比例为 1
        castle.setDepth(1.5);  // 设置深度在 midGround (深度为2) 之前

        // 创建一个遮罩来覆盖城堡的右半部分
        const castleMask = this.add.graphics();
        castleMask.fillStyle(0x000000, 1);
        castleMask.fillRect(this.sys.game.config.width / 2, 0, this.sys.game.config.width / 2, this.sys.game.config.height);
        castle.setMask(castleMask.createGeometryMask());

        // 创建飞龙
        this.createDragon();

        // 创建地面
        const groundHeight = 100;  // 改为实际图片高度
        this.ground = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - groundHeight / 2,
            this.sys.game.config.width,
            groundHeight,  // 使用实际图片高度
            'new-ground'
        );
        this.ground.setScale(3.3);  // 不需要缩放，使用原始大小
        this.ground.setDepth(3);
        this.physics.add.existing(this.ground, true);

        // 调整地面的物理体积大小以匹配视觉大小
        this.ground.body.setSize(this.ground.width, groundHeight);
        this.ground.body.setOffset(0, 0);  // 不需要偏移

        // 创建虫子
        const groundTop = this.sys.game.config.height - groundHeight * 1.5;
        const bugOffset = 120;
        const bugStartX = this.sys.game.config.width * 0.2;
        
        // 调整虫子的 Y 坐标，使其更高
        this.bug = this.physics.add.sprite(bugStartX, groundTop + bugOffset - 300, 'bug');  // 从 -300 改为 -400
        this.enemyBug = this.physics.add.sprite(bugStartX - 50, groundTop + bugOffset - 120, 'enemyBug');  // 保持不变

        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);

        // 设虫子性
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


        // 创建玩家图标和分数显示
        const userIconSize = 130;  // 图标的直径
        const userIconX = 150;
        const userIconY = 30 + userIconSize / 2;
        const userIcon = this.add.image(userIconX, userIconY, 'user-icon').setOrigin(0.5).setDepth(6);
        
        // 创建圆形遮罩
        const userMask = this.make.graphics().fillCircle(userIconX, userIconY, userIconSize / 2);
        userIcon.setMask(userMask.createGeometryMask());
        
        // 调整图标大小以填满圆形
        userIcon.setDisplaySize(userIconSize, userIconSize);

        // 创建分数标题文本
        this.scoreTitleText = this.add.text(userIconX, userIconY + userIconSize / 2 + 30, 'Your Score', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(7);

        // 创建分数数值文本（放在标题下方）
        this.scoreText = this.add.text(userIconX, userIconY + userIconSize / 2 + 70, '0', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '36px', // 分数字体可以大一些
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(7);


        // 创建敌人图标和分数显示
        const enemyIconSize = 130;  // 图标的直径
        const enemyIconX = this.sys.game.config.width - 200;
        const enemyIconY = 30 + enemyIconSize / 2;
        const enemyIcon = this.add.image(enemyIconX, enemyIconY, 'enemy-icon').setOrigin(0.5).setDepth(6);
        
        // 创建圆形遮罩
        const enemyMask = this.make.graphics().fillCircle(enemyIconX, enemyIconY, enemyIconSize / 2);
        enemyIcon.setMask(enemyMask.createGeometryMask());
        
        // 调整图标大小以填满圆形
        enemyIcon.setDisplaySize(enemyIconSize, enemyIconSize);

        // 创建敌人分数标题文本
        this.enemyScoreTitleText = this.add.text(enemyIconX, enemyIconY + enemyIconSize / 2 + 30, 'Enemy Score', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(7);

        // 创建敌人分数数值文本（放在标题下方）
        this.enemyScoreText = this.add.text(enemyIconX, enemyIconY + enemyIconSize / 2 + 70, '0', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '36px', // 分数字体可以大一些
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(7);

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
        this.wrong.setDepth(7);  //  "you are wrong" 显示设置为最高深度

        // 创建陨石粒子系统
        this.createMeteors();
        this.startMeteors(); // 启动

        // 创建玩旗子，但初始设置为不可见
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
            frameRate: 6,  // 从 8 降到 6
            repeat: -1
        });

        // 創建龍（確保這裡只調用一次）
        this.createDragon();

        // 創火球動畫
        this.anims.create({
            key: 'fireball_anim',
            frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // 设置 midGroundSpeed 为 0
        this.midGroundSpeed = 0;

        // 添加键盘监听器
        // 只用於Debug , 完成後請移除
        this.input.keyboard.on('keydown-D', () => {
            this.debugEndScene();
        });

        // 加并播脚步声音效
        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.5 });
        this.footstepsSound.play();

        // 删除或注释掉以下两行
        // this.playDragonRoar();
        // console.log('Dragon roar timer set');

        // // 创建玩家图标和分数显示
        // const userIconSize = 130;  // 图标的直径
        // const userIconX = 100;
        // const userIconY = 30 + userIconSize / 2;
        // const userIcon = this.add.image(userIconX, userIconY, 'user-icon').setOrigin(0.5).setDepth(6);
        
        // // 创建圆形遮罩
        // const userMask = this.make.graphics().fillCircle(userIconX, userIconY, userIconSize / 2);
        // userIcon.setMask(userMask.createGeometryMask());
        
        // // 调整图标大小以填满圆形
        // userIcon.setDisplaySize(userIconSize, userIconSize);

        // 创建分数文本并置于图标下方中央
        // this.scoreText = this.add.text(userIconX, userIconY + userIconSize / 2 + 30, '0', {
        //     fontFamily: '"Press Start 2P", cursive',
        //     fontSize: '36px',
        //     fill: '#ffffff'
        // }).setOrigin(0.5, 0).setDepth(7);

        // // 建敌人图标和分数显示
        // const enemyIconSize = 130;  // 图标的直径
        // const enemyIconX = this.sys.game.config.width - 100;
        // const enemyIconY = 30 + enemyIconSize / 2;
        // const enemyIcon = this.add.image(enemyIconX, enemyIconY, 'enemy-icon').setOrigin(0.5).setDepth(6);
        
        // // 创建圆形遮罩
        // const enemyMask = this.make.graphics().fillCircle(enemyIconX, enemyIconY, enemyIconSize / 2);
        // enemyIcon.setMask(enemyMask.createGeometryMask());
        
        // // 调整图标大小以填满圆形
        // enemyIcon.setDisplaySize(enemyIconSize, enemyIconSize);

        // 创建敌人分数文本并置于图标下方中央
        // this.enemyScoreText = this.add.text(enemyIconX, enemyIconY + enemyIconSize / 2 + 30, '0', {
        //     fontFamily: '"Press Start 2P", cursive',
        //     fontSize: '24px',
        //     fill: '#ffffff'
        // }).setOrigin(0.5, 0).setDepth(7);

        // 停止龙的动画
        this.stopDragonAnimation();

        // 移除这两行
        // this.createMeteors();
        // this.startMeteors();

        // 延迟加载陨石效果
        this.time.delayedCall(500, () => {
            this.createMeteors();
            this.startMeteors();
        });

        // 删除或释掉这段代码
        /*
        // 添加随机跳跃的定时器
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: this.randomJump,
            callbackScope: this,
            loop: true
        });
        */
    }

    setupBugs() {
        // 设置 bug 的物理属性
        this.bug.setCollideWorldBounds(true);
        this.bug.setBounce(0.2);
        this.bug.setGravityY(400);  // 从 800 降到 400，减轻重力

        // 设置 enemyBug 的物理属性
        this.enemyBug.setCollideWorldBounds(true);
        this.enemyBug.setBounce(0.2);
        this.enemyBug.setGravityY(400);  // 从 800 降到 400，减轻重力

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
            frameRate: 30,  // 从 60 降到 30
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
            frameRate: 30,  // 从 15 降到 12
            repeat: 0
        });

        // 增加主角虫子的大小
        this.bug.play('run_bug');
        this.bug.setScale(1.4);  // 从 0.8 增加到 1.2
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
            frameRate: 30,  // 从 60 降到 30
            repeat: -1
        });

        // 创建 enemyBug 的失败动画（如果需要的话）
        this.anims.create({
            key: 'fail_enemyBug',
            frames: [{ key: 'enemyBug', frame: 'Comp 3_00006.png' }],  // 使用适当的帧
            frameRate: 30
        });

        // 增加敌人虫子的大小
        this.enemyBug.play('run_enemyBug');
        this.enemyBug.setScale(1.4);  // 从 0.8 增加到 1.2
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
            frameRate: 10,  // 从 12 降到 10
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
        const buttonHeight = 100;
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
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        this.answer2Text = this.add.text(this.cameras.main.width * 0.7, buttonY, '', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '70px',
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
        // 确保问题以问结尾
        if (!question.endsWith('?')) {
            question += '?';
        }

        // 清空问题文本
        this.questionText.setText('');
        
        // 隐藏答案按钮和文本
        this.hideAnswers();
        
        // 使用淡入效果显示问题
        this.fadeInText(this.questionText, question);
        
        // 延迟显示答案
        this.time.delayedCall(500, () => {  // 等待淡入完成
            if (Math.random() < 0.5) {
                this.answer1Text.setText(answers[0]);
                this.answer2Text.setText(answers[1]);
                this.correctAnswer = this.button1;
            } else {
                this.answer1Text.setText(answers[1]);
                this.answer2Text.setText(answers[0]);
                this.correctAnswer = this.button2;
            }
            
            // 调整文本换行
            this.answer1Text.setWordWrapWidth(280);
            this.answer2Text.setWordWrapWidth(280);
            
            // 显示答案按钮和文本
            this.showAnswers();
        });

        // 播放音效
        this.sound.play('dang');
    }

    endGame() {
        console.log("Game Over. Bug Score:", this.bugScore);
        console.log("Game Over. Enemy Bug Score:", this.enemyBugScore);
        
        const endSceneData = { 
            bugScore: this.bugScore,
            enemyBugScore: this.enemyBugScore,
            score: this.bugScore, // 添加这行，确保与 EndScene 中的 this.score 对应
            bugPosition: this.bug.y,
            enemyBugPosition: this.enemyBug.y,
            groundPosition: this.ground.y,
            midGroundPosition: this.midGround.y,
            questions: this.questions,
            answers: this.answers,
            userAnswers: this.collectResult
        };
        
        console.log("Data being passed to EndScene:", endSceneData);
        
        this.scene.start('EndScene', endSceneData);
    }

    update() {
        // 确保虫子不会穿过地面
        const groundTop = this.sys.game.config.height - this.ground.height * 1.5;
        const bugOffset = 120;
        const maxYBug = groundTop + bugOffset - 300;  // 从 -300 改为 -400
        const maxYEnemyBug = groundTop + bugOffset - 120;  // 保持不变

        if (this.bug.y > maxYBug) {
            this.bug.y = maxYBug;
            this.bug.setVelocityY(0);
            this.bug.setVelocityX(0);
        }
        if (this.enemyBug.y > maxYEnemyBug) {
            this.enemyBug.y = maxYEnemyBug;
            this.enemyBug.setVelocityY(0);
        }

        // 注释掉或删除移动中层背景的代码
        // this.midGround.tilePositionX += this.midGroundSpeed;

        // 动地面
        this.ground.tilePositionX += this.groundSpeed;

        // 持续检查问题文的可见性
        if (this.questionText) {
            //console.log('Question text visibility:', this.questionText.visible, 'Text:', this.questionText.text);
        }

        // 更新陨石效果
        //this.updateMeteors();

        // 更新旗子位置（仅当旗子可见时
        if (this.playerFlag && this.playerFlag.visible) {
            this.playerFlag.x = this.bug.x;
            // y坐标由补间动画处理
        }

        // 移除或註釋掉這部分代碼
        /*
        // 讓龍緩慢向右動
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
        
        // 设置馈图标的深度
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
            this.bugScore++;
            this.updateScore(this.bugScore);
            this.showCorrectFeedback(button);
            this.moveBugForward();
            this.createStarEffect();
            
            // 播放正确答案音效
            this.sound.play('you_are_correct');
            
            // 播放 enemyBug 的燃烧动画
            this.enemyBug.play('burn_enemyBug');
            
            // 在动画结束后重置为跑步动画
            this.enemyBug.once('animationcomplete', () => {
                this.enemyBug.play('run_enemyBug');
            });
        } else {
            // 错误答案的处理
            this.enemyBugScore++;
            this.updateEnemyScore(this.enemyBugScore);
            this.showWrongFeedback(button);
            this.pauseFootsteps();  // 暂停脚步声
            this.playFallBugAnimation();
            this.moveEnemyBugForward();
            
            // 播放错误答案音效
            this.sound.play('you_are_wrong');

            // 启动陨石动画
            this.startMeteors(); // 恢复陨石动画
            this.stopDragonAnimation(); // 停止龙的画
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
        //this.yeah.play();

        // 2秒后隐藏反馈
        this.time.delayedCall(2000, () => {
            this.tick.setVisible(false);
            this.correct.setVisible(false);
        });
    }

    showWrongFeedback(button) {
        this.cross.setPosition(button.x, button.y).setVisible(true);
        this.wrong.setVisible(true);
        //this.fail.play();

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
        // 增加移动距离
        const moveDistance = 200;  // 前进距离
        const returnDistance = moveDistance * 0.3;  // 返回距离（原距离的30%）
        //const jumpHeight = -100;  // 跳跃高度

        // 创建移动和跳跃动画
        this.tweens.add({
            targets: this.bug,
            x: this.bug.x + moveDistance,  // 向前移动
            y: this.bug.y,    // 向上跳跃
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // 在移动完成后，返回一小段距离并落回原来的高度
                this.tweens.add({
                    targets: this.bug,
                    x: this.bug.x - returnDistance,  // 返回30%的距离
                    y: this.bug.y,      // 落回原来的高度
                    duration: 1000,
                    ease: 'Power1'
                });
            }
        });
    }

    moveEnemyBugForward() {
        // 增加移动距离
        const moveDistance = 200;  // 前进距离
        const returnDistance = moveDistance * 0.3;  // 返回距离（原距离的30%）

        // 创建移动动画
        this.tweens.add({
            targets: this.enemyBug,
            x: this.enemyBug.x + moveDistance,  // 向前移动
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // 在移动完成后，只返回一小段距离
                this.tweens.add({
                    targets: this.enemyBug,
                    x: this.enemyBug.x - returnDistance,  // 只返回30%的距离
                    duration: 1000,
                    ease: 'Power2'
                });
            }
        });

        this.running.play();
    }

    fadeInText(text, targetText) {
        // 直接设置完整文本
        text.setText(targetText);
        // 初始设置为完全透明
        text.setAlpha(0);
        
        // 创建淡入动画
        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 500,  // 500ms 的淡入时间
            ease: 'Linear'
        });
    }

    updateScore(score) {
        this.scoreText.setText(score.toString());
    }

    updateEnemyScore(score) {
        this.enemyScoreText.setText(score.toString());
    }

    createMeteors() {
        this.meteorParticles = this.add.particles('meteor');

        this.meteorEmitter = this.meteorParticles.createEmitter({
            x: { min: 0, max: this.sys.game.config.width },
            y: -50,
            speedX: { min: -100, max: -80 },
            speedY: { min: 80, max: 120 },
            scale: { min: 0.1, max: 0.4 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 3000, max: 6000 },
            quantity: 1,
            frequency: 2000,  // 从 1000 增加到 2000，减少生成频率
            blendMode: 'ADD',
            maxParticles: 5,  // 限制最大粒子数量
            rotate: 0
        });
    }

    // 启动陨石发射
    startMeteors() {
        if (this.meteorEmitter) {
            this.meteorEmitter.start();
        }
    }

    // 暂停陨石发射
    stopMeteors() {
        if (this.meteorEmitter) {
            this.meteorEmitter.stop();
        }
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
        this.playerFlag.setScale(1);  // 整小
        this.playerFlag.setOrigin(0.5, 1);  // 设置原点为部中心
        this.playerFlag.setDepth(this.bug.depth + 1);  // 确保旗子在虫子上方

        // 添加上下移动的动画
        this.flagTween = this.tweens.add({
            targets: this.playerFlag,
            y: '+=10',  // 向下移动10像素
            duration: 500,  // 动画持续0.5秒
            yoyo: true,  // 动画会来回进行
            repeat: -1,  // 无限重复
            ease: 'Sine.easeInOut'  // 使用弦线使动画更平滑
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
        // 如果你想在游戏开始时设置陨石速度和频率，可以 createMeteors 方法中进行设置
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

        // 创建一个微延迟的效果，让按钮一个接一个地出现
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
            // 设置动画停最后
            this.bug.anims.stopOnFrame(this.bug.anims.currentAnim.frames[this.bug.anims.currentAnim.frames.length - 1]);
            
            // 在最后一帧停留约1秒
            this.time.delayedCall(1000, () => {
                console.log('Resetting to run_bug animation');
                // 1秒后重置为run_bug画
                this.bug.play('run_bug');
                this.resumeFootsteps();  // 恢复脚步声
            });
        });

        // 一些视觉反馈
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

                // 調整火球的度向量
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

    // 新增方法即跳转到 EndScene 进行调试
    debugEndScene() {
        // 停止所有声音
        //this.sound.stopAll();

        // 准备一些模拟数据
        const debugData = {
            score: 5,  // 模拟分
            bugPosition: this.bug.y,
            enemyBugPosition: this.enemyBug.y,
            groundPosition: this.ground.y,
            midGroundPosition: this.midGround.y,
            questions: this.questions,
            answers: this.answers,
            userAnswers: [0, 1, 0, 1, 0]  // 模拟用户答案
        };

        // 立即跳转到 EndScene
        this.scene.start('EndScene', debugData);
    }

    pauseFootsteps() {
        if (this.footstepsSound) {
            this.footstepsSound.pause();
        }
    }

    resumeFootsteps() {
        if (this.footstepsSound) {
            this.footstepsSound.resume();
        }
    }

    shutdown() {
        if (this.footstepsSound) {
            this.footstepsSound.stop();
        }
        // 可能的其他清理代码
    }

    stopDragonAnimation() {
        if (this.dragon && this.dragon.anims) {
            this.dragon.anims.pause(); // 暂停龙的动画
        }
    }

    resumeDragonAnimation() {
        if (this.dragon && this.dragon.anims) {
            this.dragon.anims.resume(); // 恢复龙的动画
        }
    }

    // 删除或注释掉整个 randomJump 方法
    /*
    randomJump() {
        // ... 跳跃相关的代码 ...
    }
    */
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

