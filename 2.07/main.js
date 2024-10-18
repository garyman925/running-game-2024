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

    preload() {
        this.load.image('bird', '../assets/bird.png');
        this.load.spritesheet('bug', '../assets/bug.png', { frameWidth: 190, frameHeight: 170 });
        this.load.spritesheet('enemyBug', '../assets/enemyBug.png', { frameWidth: 190, frameHeight: 170 });
        this.load.spritesheet('ground', '../assets/ground.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('tree', '../assets/tree3.png', { frameWidth: 158, frameHeight: 199 });
        this.load.spritesheet('grass', '../assets/grass.png', { frameWidth: 512, frameHeight: 128 });
        this.load.image('bg', '../assets/bg4.png');
        this.load.image('button', '../assets/button1.png');
        this.load.image('tick', '../assets/tick.png');
        this.load.image('cross', '../assets/cross.png');
        this.load.image('correct', '../assets/correct.png');
        this.load.image('wrong', '../assets/wrong.png');
        this.load.audio('bgm', '../audio/bgm1.mp3');
        this.load.audio('fail', '../audio/felldown2.wav');
        this.load.audio('endbgm', '../audio/complete2.mp3');
        this.load.audio('running', '../audio/run.wav');
        this.load.audio('aruready', '../audio/aruready.wav');
        this.load.audio('yeah', '../audio/yeah.mp3');
        this.load.audio('step', '../audio/step.wav');
    }

    create() {
        // 设置物理系统
        this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // 创建背景
        this.bg = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg').setOrigin(0);

        // 创建地面
        this.ground = this.physics.add.staticImage(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'ground');
        this.ground.setDisplaySize(this.sys.game.config.width, 100);

        // 创建草地
        this.grass = this.add.tileSprite(0, this.sys.game.config.height - 150, this.sys.game.config.width, 128, 'grass').setOrigin(0);

        // 创建树
        this.tree = this.physics.add.staticImage(550, this.sys.game.config.height - 250, 'tree');

        // 创建鸟
        this.bird = this.add.image(50, 50, 'bird');
        this.tweens.add({
            targets: this.bird,
            y: 100,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // 创建虫子
        this.bug = this.physics.add.sprite(0, 100, 'bug');
        this.enemyBug = this.physics.add.sprite(150, 100, 'enemyBug');

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

        // 创建问题文本
        this.questionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        // 创建答案按钮
        this.button1 = this.add.image(this.cameras.main.width * 0.3, this.cameras.main.height * 0.75, 'button')
            .setInteractive()
            .setScale(0.5);
        this.button2 = this.add.image(this.cameras.main.width * 0.7, this.cameras.main.height * 0.75, 'button')
            .setInteractive()
            .setScale(0.5);

        // 创建答案文本
        this.answer1Text = this.add.text(this.button1.x, this.button1.y, '', {
            fontSize: '20px',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: this.button1.width * 0.8 }
        }).setOrigin(0.5);

        this.answer2Text = this.add.text(this.button2.x, this.button2.y, '', {
            fontSize: '20px',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: this.button2.width * 0.8 }
        }).setOrigin(0.5);

        // 确保文本在按钮之上
        this.answer1Text.setDepth(1);
        this.answer2Text.setDepth(1);

        // 设置按钮点击事件
        this.button1.on('pointerdown', () => this.answer(this.button1));
        this.button2.on('pointerdown', () => this.answer(this.button2));

        // 初始化游戏
        this.initializeGame();

        console.log('Answer1 Text:', this.answer1Text);
        console.log('Answer2 Text:', this.answer2Text);
    }

    setupBugs() {
        // 设虫子的物理属性和动画
        [this.bug, this.enemyBug].forEach(bug => {
            bug.setCollideWorldBounds(true);
            bug.setBounce(0.2);
            bug.setGravityY(1000);

            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNumbers(bug.texture.key, { start: 1, end: 4 }),
                frameRate: 15,
                repeat: -1
            });

            this.anims.create({
                key: 'fail',
                frames: [{ key: bug.texture.key, frame: 9 }],
                frameRate: 15
            });

            bug.play('run');
            bug.setScale(0.9);
            bug.setAngle(10);
        });
    }

    createButtons() {
        // 创建按钮和问题文本
        // ... (保持原有的按钮创建逻辑，但使用 Phaser 3 的方法)
    }

    initializeGame() {
        this.totalQuestion = 0;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        this.collectResult = [];
        this.showNextQuestion();
    }

    createFeedbackIcons() {
        this.tick = this.add.image(0, 0, 'tick').setVisible(false).setScale(0.2);
        this.cross = this.add.image(0, 0, 'cross').setVisible(false).setScale(0.2);
        this.correct = this.add.image(0, 0, 'correct').setVisible(false);
        this.wrong = this.add.image(0, 0, 'wrong').setVisible(false);
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
        if (this.questionText) {
            this.questionText.setText(question);
        } else {
            console.error('questionText is not defined');
        }

        if (this.answer1Text && this.answer2Text) {
            if (Math.random() < 0.5) {
                this.answer1Text.setText(answers[0]);
                this.answer2Text.setText(answers[1]);
                this.correctAnswer = this.button1;
            } else {
                this.answer1Text.setText(answers[1]);
                this.answer2Text.setText(answers[0]);
                this.correctAnswer = this.button2;
            }

            // 确保文本更新并可见
            this.answer1Text.setVisible(true);
            this.answer2Text.setVisible(true);
        } else {
            console.error('answer1Text or answer2Text is not defined');
        }

        console.log('Question:', question);
        console.log('Answers:', answers);
        console.log('Answer1Text:', this.answer1Text ? this.answer1Text.text : 'undefined');
        console.log('Answer2Text:', this.answer2Text ? this.answer2Text.text : 'undefined');
    }

    answer(button) {
        // 禁用按钮，防止多次点击
        this.button1.disableInteractive();
        this.button2.disableInteractive();

        if (button === this.correctAnswer) {
            // 正确答案的处理
            console.log("Correct answer!");
            score++;
            this.showCorrectFeedback(button);
            this.moveBugForward();
        } else {
            // 错误答案的处理
            console.log("Wrong answer!");
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
        // ... (保持原有的逻辑，但使用 Phaser 3 的方法)
    }

    showWrongFeedback(button) {
        // ... (保持原有的逻辑，但使用 Phaser 3 的方法)
    }

    moveBugForward() {
        // ... (保持原有的逻辑，但使用 Phaser 3 的方法)
    }

    moveEnemyBugForward() {
        // ... (保持原有的逻辑，但使用 Phaser 3 的方法)
    }

    endGame() {
        console.log("Game Over. Score: " + score);
        console.log("Questions: " + JSON.stringify(qIds));
        console.log("User Answers: " + JSON.stringify(this.collectResult));
        this.scene.start('EndScene');
    }

    update() {
        // 游戏更新逻辑
        this.physics.collide(this.bug, this.ground);
        this.physics.collide(this.enemyBug, this.ground);

        // 确保虫子始终在运行动画
        if (!this.bug.anims.isPlaying) {
            this.bug.play('run');
        }
        if (!this.enemyBug.anims.isPlaying) {
            this.enemyBug.play('run');
        }

        // ... 其他更新逻辑 ...

        // 添加调试信息
        if (this.answer1Text && this.answer2Text) {
            console.log('Answer1 visible:', this.answer1Text.visible, 'text:', this.answer1Text.text);
            console.log('Answer2 visible:', this.answer2Text.visible, 'text:', this.answer2Text.text);
        }
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
