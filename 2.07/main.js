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

        // 创建地面
        const groundHeight = 200;
        this.ground = this.add.tileSprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - groundHeight / 2,
            this.sys.game.config.width,
            groundHeight,
            'ground'
        );
        this.ground.setScale(1.5); // 将地面放大 1.5 倍
        this.physics.add.existing(this.ground, true);

        // 调整地面的物理体积大小以匹配视觉大小
        this.ground.body.setSize(this.ground.width, this.ground.height / 1.5);
        this.ground.body.setOffset(0, this.ground.height / 3);

        // 创建虫子
        const groundTop = this.sys.game.config.height - groundHeight * 1.5;
        const bugOffset = 100; // 增加虫子穿过地面的程度
        this.bug = this.physics.add.sprite(50, groundTop + bugOffset, 'bug');
        this.enemyBug = this.physics.add.sprite(30, groundTop + bugOffset, 'enemyBug');

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
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // 添加碰撞
        this.physics.add.collider(this.bug, this.ground);
        this.physics.add.collider(this.enemyBug, this.ground);
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
        // 创建按钮和问题文本
        this.questionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, '', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        this.button1 = this.add.image(this.cameras.main.width * 0.3, this.cameras.main.height * 0.75, 'button')
            .setInteractive();
        this.button2 = this.add.image(this.cameras.main.width * 0.7, this.cameras.main.height * 0.75, 'button')
            .setInteractive();

        this.answer1Text = this.add.text(this.button1.x, this.button1.y, '', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.button1.displayWidth * 0.8 }
        }).setOrigin(0.5);

        this.answer2Text = this.add.text(this.button2.x, this.button2.y, '', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.button2.displayWidth * 0.8 }
        }).setOrigin(0.5);

        // 确保文本在按钮之上
        this.answer1Text.setDepth(1);
        this.answer2Text.setDepth(1);

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
        this.questionText.setText(question);
        
        if (Math.random() < 0.5) {
            this.answer1Text.setText(answers[0]);
            this.answer2Text.setText(answers[1]);
            this.correctAnswer = this.button1;
        } else {
            this.answer1Text.setText(answers[1]);
            this.answer2Text.setText(answers[0]);
            this.correctAnswer = this.button2;
        }
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

        // ... 其他更新逻辑 ...
    }

    createFeedbackIcons() {
        this.tick = this.add.image(0, 0, 'tick').setVisible(false).setScale(0.2);
        this.cross = this.add.image(0, 0, 'cross').setVisible(false).setScale(0.2);
        this.correct = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'correct').setVisible(false).setOrigin(0.5);
        this.wrong = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wrong').setVisible(false).setOrigin(0.5);
    }

    answer(button) {
        // 禁用按钮，防止多次点击
        this.button1.disableInteractive();
        this.button2.disableInteractive();

        if (button === this.correctAnswer) {
            // 正确答案的处理
            console.log("正确答案！");
            score++;
            this.scoreText.setText('得分: ' + score);
            this.showCorrectFeedback(button);
            this.moveBugForward();
        } else {
            // 错误答案的处理
            console.log("错误答案！");
            this.showWrongFeedback(button);
            this.moveEnemyBugForward();
        }

        // 记录答案
        this.collectResult.push(button === this.correctAnswer ? 0 : 1);

        // 延迟后显示下一个问题
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
