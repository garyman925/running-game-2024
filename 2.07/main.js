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
        this.load.image('button', '../assets/button.png');
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
        this.bug = this.physics.add.sprite(50, this.sys.game.config.height - 150, 'bug');
        this.enemyBug = this.physics.add.sprite(50, this.sys.game.config.height - 150, 'enemyBug');

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
        this.questionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, '', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        // 创建答案按钮和文本
        this.button1 = this.add.image(this.cameras.main.width * 0.3, this.cameras.main.height * 0.75, 'button')
            .setInteractive();
        this.button2 = this.add.image(this.cameras.main.width * 0.7, this.cameras.main.height * 0.75, 'button')
            .setInteractive();

        this.answer1Text = this.add.text(this.button1.x, this.button1.y, '', {
            fontSize: '20px',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: this.button1.displayWidth * 0.8 }
        }).setOrigin(0.5);

        this.answer2Text = this.add.text(this.button2.x, this.button2.y, '', {
            fontSize: '20px',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: this.button2.displayWidth * 0.8 }
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

        // 添加得分显示
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        console.log('Button1 size:', this.button1.width, this.button1.height);
        console.log('Button1 scale:', this.button1.scaleX, this.button1.scaleY);
        console.log('Button1 position:', this.button1.x, this.button1.y);

        console.log('Question Text:', this.questionText);
        console.log('Answer1 Text:', this.answer1Text);
        console.log('Answer2 Text:', this.answer2Text);
    }

    setupBugs() {
        [this.bug, this.enemyBug].forEach(bug => {
            bug.setCollideWorldBounds(true);
            bug.setBounce(0.2);
            bug.setGravityY(1000);

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
            bug.setScale(0.8); // 将缩放从 0.5 调整为 0.8
            bug.setOrigin(0.5, 1);
        });

        // 将敌人虫子放在稍微靠后的位置
        this.enemyBug.x = 30;
    }

    createButtons() {
        // 创按钮和问题文本
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
        this.correct = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'correct').setVisible(false).setOrigin(0.5);
        this.wrong = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wrong').setVisible(false).setOrigin(0.5);
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
        if (!this.questionText || !this.answer1Text || !this.answer2Text) {
            console.error('Text objects not initialized');
            return;
        }

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

        // 确保文本可见
        this.questionText.setVisible(true);
        this.answer1Text.setVisible(true);
        this.answer2Text.setVisible(true);

        console.log('Question:', question);
        console.log('Answers:', answers);
        console.log('Answer1Text:', this.answer1Text.text);
        console.log('Answer2Text:', this.answer2Text.text);
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
            this.bug.play('run_bug');
        }
        if (!this.enemyBug.anims.isPlaying) {
            this.enemyBug.play('run_enemyBug');
        }

        // ... 其他更新逻辑 ...

        // 移除不必要的控制台日志，以提高性能
        // 只在调试时使用控制台日志
        // console.log('Answer1 visible:', this.answer1Text.visible, 'text:', this.answer1Text.text);
        // console.log('Answer2 visible:', this.answer2Text.visible, 'text:', this.answer2Text.text);

        // 添加调试信息
        if (this.questionText && this.answer1Text && this.answer2Text) {
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
