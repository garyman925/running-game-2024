class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.questions = [
            "What is the capital of France?",
            "Which planet is known as the Red Planet?",
            "What is the largest mammal in the world?"
        ];
        this.answers = [
            ["Paris", "London"],
            ["Mars", "Venus"],
            ["Blue Whale", "African Elephant"]
        ];
        this.qIds = [1, 2, 3];
    }

    create() {
        // 设置物理系统
        this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // 创建背景
        this.bg = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg');
        this.bg.setScale(Math.max(this.sys.game.config.width / this.bg.width, this.sys.game.config.height / this.bg.height));
        this.bg.setDepth(0);

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
        const bugOffset = 100; // 增加虫子穿过地面的程度
        this.bug = this.physics.add.sprite(50, groundTop + bugOffset, 'bug');
        this.enemyBug = this.physics.add.sprite(30, groundTop + bugOffset, 'enemyBug');
        this.bug.setDepth(4);
        this.enemyBug.setDepth(4);

        // 设置虫子属性
        this.setupBugs();

        // 创建按钮和文本
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
    }

    setupBugs() {
        // 设置虫子的物理属性和动画
        [this.bug, this.enemyBug].forEach(bug => {
            bug.setCollideWorldBounds(true);
            bug.setBounce(0.2);
            bug.setGravityY(800); // 增加重力，使虫子更快落到地面

            this.anims.create({
                key: 'run_' + bug.texture.key,
                frames: this.anims.generateFrameNumbers(bug.texture.key, { start: 1, end: 4 }),
                frameRate: 15,
                repeat: -1
            });

            this.anims.create({
                key: 'fail_' + bug.texture.key,
                frames: [{ key: bug.texture.key, frame: 9 }],
                frameRate: 15
            });

            bug.play('run_' + bug.texture.key);
            bug.setScale(1); // 稍微缩小虫子
            bug.setOrigin(0.5, 0.4); // 调整原点，使虫子更多部分穿过地面
        });
    }

    createButtons() {
        // 创建问题文本
        this.questionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, '', {
            fontFamily: '"IM Fell DW Pica", serif',
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        // 添加阴影效果
        this.questionText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 10);

        // 创建答案按钮背景和文本
        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonY = this.cameras.main.height * 0.75;

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
    }

    initializeGame() {
        this.totalQuestion = 0;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        this.collectResult = [];
        this.showNextQuestion();
    }

    showNextQuestion() {
        if (this.totalQuestion < this.questions.length) {
            let q = this.questions[this.totalQuestion];
            let a = this.answers[this.totalQuestion];
            if (q && a) {
                this.showQuestion(q, a);
                this.totalQuestion++;
            } else {
                console.error('Question or answer is undefined', this.totalQuestion);
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
            
            // 调整文本换行
            this.answer1Text.setWordWrapWidth(280);
            this.answer2Text.setWordWrapWidth(280);
            
            // 启用按钮交互
            this.button1.setInteractive();
            this.button2.setInteractive();
        });
    }

    endGame() {
        console.log("Game Over. Score: " + score);
        console.log("Questions: " + JSON.stringify(this.qIds));
        console.log("User Answers: " + JSON.stringify(this.collectResult));
        this.scene.start('EndScene');
    }

    update() {
        // 确保虫子始终部分穿过地面
        const groundTop = this.sys.game.config.height - this.ground.height * 1.5;
        const bugOffset = 100; // 与创建虫子时使用相同的值
        const maxY = groundTop + bugOffset;

        if (this.bug.y > maxY) {
            this.bug.y = maxY;
            this.bug.setVelocityY(0);
        }
        if (this.enemyBug.y > maxY) {
            this.enemyBug.y = maxY;
            this.enemyBug.setVelocityY(0);
        }

        // 移动中层背景以创造视差效果
        this.midGround.tilePositionX += 0.5; // 调整这个值以改变移动速度

        // 持续检查问题文的可见性
        if (this.questionText) {
            console.log('Question text visibility:', this.questionText.visible, 'Text:', this.questionText.text);
        }

        // 更新陨石效果
        this.updateMeteors();

        // ... 其他更新逻辑 ...
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
        } else {
            // 错误答案的处理
            console.log("错误案！");
            this.showWrongFeedback(button);
            this.moveEnemyBugForward();
        }

        // 记录答案
        this.collectResult.push(button === this.correctAnswer ? 0 : 1);

        // 延迟后显下一个问题
        this.time.delayedCall(2000, () => {
            this.showNextQuestion();
            this.button1.setInteractive();
            this.button2.setInteractive();
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
        this.tweens.add({
            targets: this.bug,
            x: this.bug.x + 50,
            duration: 1000,
            ease: 'Power2'
        });
        this.running.play();
    }

    moveEnemyBugForward() {
        this.tweens.add({
            targets: this.enemyBug,
            x: this.enemyBug.x + 50,
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
            delay: 50 // 你可以调整这个值来改变打字速度
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
            x: { min: 0, max: this.sys.game.config.width },  // 在整个屏幕宽度范围内生成
            y: -50,  // 从屏幕顶部稍微上方开始
            speedX: { min: -150, max: -100 },  // 向左移动，速度稍微减小
            speedY: { min: 100, max: 150 },    // 向下移动
            scale: { min: 0.1, max: 0.6 },     // 随机大小，范围从0.2到0.5
            alpha: { start: 1, end: 0 },     // 保持透明度变化
            lifespan: { min: 4000, max: 8000 },// 增加生命周期，确保陨石有足够时间穿过屏幕
            quantity: 1,
            frequency: 500,  // 每0.5秒生成一个陨石
            blendMode: 'ADD',
            rotate: 0  // 保持固定角度，不旋转
        });

        this.meteorParticles.setDepth(1);  // 保持深度设置
    }

    updateMeteors() {
        // 可以在这里添加额外的更新逻辑，如果需要的话
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

