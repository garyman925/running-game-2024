// 主游戏状态代码
var main_state = {
    preload: function() {
        // 移动所有预加载资源到这里
        this.game.load.image('bird','../assets/bird.png');
        this.game.load.spritesheet('bug','../assets/bug.png',190,170);
        this.game.load.spritesheet('enemyBug','../assets/enemyBug.png',190,170);
        this.game.load.spritesheet('tree','../assets/tree3.png',158,199);
        this.game.load.image('button','../assets/button1.png',150,70);
        this.game.load.image('tick','../assets/tick.png');
        this.game.load.image('cross','../assets/cross.png');
        this.game.load.image('correct','../assets/correct.png');
        this.game.load.image('wrong','../assets/wrong.png');
        this.game.load.audio('fail','../audio/felldown2.wav');
        this.game.load.audio('endbgm','../audio/complete2.mp3');
        this.game.load.audio('running','../audio/run.wav');
        this.game.load.audio('yeah','../audio/yeah.mp3');
        this.game.load.audio('step','../audio/step.wav');
    },

    create: function() {
        // 移动 create 函数的内容到这里
        // ...
    },

    update: function() {
        // 加更新逻辑
        // 添加碰撞检测
        this.game.physics.arcade.collide(this.bug, this.ground);
        this.game.physics.arcade.collide(this.enemyBug, this.ground);
        
        // ... 其他更新逻辑 ...
    },

    // 添加其他必要的函数
};

// 定义全局变量
var score = 0;
var mid = "test_user_123";  // 这里使用硬编码的测试值
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

var main_state = {
    preload: function() {
        // 保留原有的预加载代码
        this.game.load.image('bird','../assets/bird.png');
        this.game.load.spritesheet('bug','../assets/bug.png',190,170);
        this.game.load.spritesheet('enemyBug','../assets/enemyBug.png',190,170);
        this.game.load.spritesheet('ground','../assets/ground.png', 128 , 128);
        this.game.load.spritesheet('tree','../assets/tree3.png',158,199);
        this.game.load.spritesheet('grass','../assets/grass.png',512,128);
        
        this.game.load.image('bg','../assets/bg4.png');
        this.game.load.image('button','../assets/button1.png',150,70);

        this.game.load.image('tick','../assets/tick.png');
        this.game.load.image('cross','../assets/cross.png');
        this.game.load.image('correct','../assets/correct.png');
        this.game.load.image('wrong','../assets/wrong.png');

        this.game.load.audio('bgm','../audio/bgm1.mp3');
        this.game.load.audio('fail','../audio/felldown2.wav');
        this.game.load.audio('endbgm','../audio/complete2.mp3');
        this.game.load.audio('running','../audio/run.wav');
        this.game.load.audio('aruready','../audio/aruready.wav');
        this.game.load.audio('yeah','../audio/yeah.mp3');
        this.game.load.audio('step','../audio/step.wav');
    },

    create: function() {
        // 保留原有的创建代码
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // 创建背景、地面、草地等
        this.bg = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg');
        this.ground = this.game.add.tileSprite(0, this.game.world.height - 100, this.game.world.width, 100, 'ground');
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;
        this.grass = this.game.add.tileSprite(0, 0, this.game.world.width, 128, 'grass');
        this.grass.autoScroll(-500,0);

        // 创建树、鸟等元素
        this.tree = this.game.add.sprite(550, this.game.world.height - 300, 'tree', 0);
        this.game.physics.enable(this.tree, Phaser.Physics.ARCADE);
        this.tree.body.allowGravity = false;
        this.tree.body.immovable = true;
        
        this.bird = this.game.add.sprite(50,50,'bird');    
        this.game.add.tween(this.bird).to({y:100},1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);

        // 创建音频
        bgm = this.game.add.audio('bgm');
        fail = this.game.add.audio('fail');
        running = this.game.add.audio('running');
        yeah = this.game.add.audio('yeah');
        step = this.game.add.audio('step');

        // 创建虫子
        this.enemyBug = this.game.add.sprite(150, 100, 'enemyBug', 0);
        this.bug = this.game.add.sprite(0, 100, 'bug', 0);

        // 设置物理系统
        this.game.physics.arcade.gravity.y = 900;

        // 设置虫子属性
        this.setupBugs();

        // 创建按钮和文本
        this.createButtons();

        // 初始化游戏数据
        this.initializeGame();

        this.detectMobile();

        this.game.world.setBounds(0, 0, this.game.world.width, this.game.world.height);

        // 初始化反馈图标
        this.tick = this.game.add.sprite(0, 0, 'tick');
        this.tick.anchor.setTo(0.5, 0.5);
        this.tick.scale.setTo(0.2, 0.2);
        this.tick.visible = false;

        this.cross = this.game.add.sprite(0, 0, 'cross');
        this.cross.anchor.setTo(0.5, 0.5);
        this.cross.scale.setTo(0.2, 0.2);
        this.cross.visible = false;

        this.correct = this.game.add.sprite(0, 0, 'correct');
        this.correct.anchor.setTo(0.5, 0.5);
        this.correct.visible = false;

        this.wrong = this.game.add.sprite(0, 0, 'wrong');
        this.wrong.anchor.setTo(0.5, 0.5);
        this.wrong.visible = false;
    },

    setupBugs: function() {
        this.game.physics.enable([this.bug, this.enemyBug], Phaser.Physics.ARCADE);
        
        this.bug.body.collideWorldBounds = true;
        this.bug.body.gravity.y = 1000;
        this.bug.body.bounce.y = 0.2;
        
        this.enemyBug.body.collideWorldBounds = true;
        this.enemyBug.body.gravity.y = 1000;
        this.enemyBug.body.bounce.y = 0.2;

        // 设置虫子的动画
        this.bug.animations.add('run', [1, 2, 3, 4], 15, true);
        this.bug.animations.add('fail', [9], 15, false);
        this.bug.play('run');

        this.enemyBug.animations.add('run', [1, 2, 3, 4], 15, true);
        this.enemyBug.animations.add('fail', [9], 15, false);
        this.enemyBug.play('run');

        // 设置虫子的大小和锚点
        this.bug.scale.setTo(0.9);
        this.bug.anchor.setTo(0.5, 0.5);
        this.bug.angle = 10;

        this.enemyBug.scale.setTo(0.9);
        this.enemyBug.anchor.setTo(0.5, 0.5);
        this.enemyBug.angle = 10;
    },

    createButtons: function() {
        // 创建按钮
        this.button1 = this.game.add.button(this.game.world.width * 0.3, this.game.world.height - 100, 'button', this.answer, this, 1, 1, 1);
        this.button2 = this.game.add.button(this.game.world.width * 0.7, this.game.world.height - 100, 'button', this.answer, this, 1, 1, 1);

        // 设置按钮属性
        this.button1.anchor.setTo(0.5, 0.5);
        this.button2.anchor.setTo(0.5, 0.5);
        this.button1.scale.setTo(0.8, 0.8);
        this.button2.scale.setTo(0.8, 0.8);

        // 创建问题和答案文本
        var textStyle = { font: '20px Arial', fill: '#ffffff', align: 'center', wordWrap: true, wordWrapWidth: 280 };
        
        this.q = this.game.add.text(this.game.world.width / 2, this.game.world.height - 180, '', textStyle);
        this.q.anchor.setTo(0.5, 0.5);

        this.a1 = this.game.add.text(this.button1.x, this.button1.y, '', textStyle);
        this.a2 = this.game.add.text(this.button2.x, this.button2.y, '', textStyle);
        
        this.a1.anchor.setTo(0.5, 0.5);
        this.a2.anchor.setTo(0.5, 0.5);
    },

    initializeGame: function() {
        this.totalQuestion = 0;
        this.bugScore = 0;
        this.enemyBugScore = 0;
        collectResult = [];
        this.showNextQuestion();
    },

    showNextQuestion: function() {
        // 隐藏反馈图标
        if (this.tick) this.tick.visible = false;
        if (this.cross) this.cross.visible = false;
        if (this.correct) this.correct.visible = false;
        if (this.wrong) this.wrong.visible = false;

        // 重置虫子的透明度
        this.bug.alpha = 1;
        this.enemyBug.alpha = 1;

        // 启用按钮
        this.button1.inputEnabled = true;
        this.button2.inputEnabled = true;

        // 显示下一个问题的逻辑
        if (this.totalQuestion < questions.length) {
            var q = questions[this.totalQuestion];
            var a = answers[this.totalQuestion];
            this.showQuestion(q, a);
        } else {
            this.endGame();
        }
    },

    showQuestion: function(question, answers) {
        this.q.text = question;

        if (Math.random() < 0.5) {
            this.a1.text = answers[0];
            this.a2.text = answers[1];
            this.correctAnswer = this.button1;
        } else {
            this.a1.text = answers[1];
            this.a2.text = answers[0];
            this.correctAnswer = this.button2;
        }

        // 确保文本更新
        this.q.updateText();
        this.a1.updateText();
        this.a2.updateText();
    },

    answer: function(button) {
        // 禁用按钮，防止多次点击
        this.button1.inputEnabled = false;
        this.button2.inputEnabled = false;

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
        collectResult.push(button === this.correctAnswer ? 0 : 1);

        // 增加题目计数
        this.totalQuestion++;

        // 延迟后显示下一个问题
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showNextQuestion, this);
    },

    showCorrectFeedback: function(button) {
        if (this.tick && this.correct) {
            this.tick.x = button.x;
            this.tick.y = button.y;
            this.tick.visible = true;

            this.correct.x = this.game.world.width * 0.5;
            this.correct.y = this.game.world.height * 0.2;
            this.correct.visible = true;
            this.game.add.tween(this.correct.scale).to({x: 1.2, y: 1.2}, 200, Phaser.Easing.Linear.None, true, 0, 1, true);
        }

        yeah.play('', 0, 1, false);
    },

    showWrongFeedback: function(button) {
        if (this.cross && this.wrong) {
            this.cross.x = button.x;
            this.cross.y = button.y;
            this.cross.visible = true;

            this.wrong.x = this.game.world.width * 0.5;
            this.wrong.y = this.game.world.height * 0.2;
            this.wrong.visible = true;
            this.game.add.tween(this.wrong.scale).to({x: 1.2, y: 1.2}, 200, Phaser.Easing.Linear.None, true, 0, 1, true);
        }

        fail.play('', 0, 1, false);
    },

    moveBugForward: function() {
        this.game.add.tween(this.bug).to({x: '+150'}, 1000, Phaser.Easing.Linear.None, true);
        this.bug.body.velocity.y = -350;
        this.game.add.tween(this.enemyBug).to({x: '-50'}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.enemyBug).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0, 1, true);
    },

    moveEnemyBugForward: function() {
        this.game.add.tween(this.enemyBug).to({x: '+150'}, 1000, Phaser.Easing.Linear.None, true);
        this.enemyBug.body.velocity.y = -350;
        this.game.add.tween(this.bug).to({x: '-50'}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.bug).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0, 1, true);
    },

    endGame: function() {
        console.log("Game Over. Score: " + score);
        console.log("Questions: " + JSON.stringify(qIds));
        console.log("User Answers: " + JSON.stringify(collectResult));
        this.game.state.start('end');
    },

    detectMobile: function() {
        // 移动设备检测和适配逻辑
    },

    update: function() {
        // 游戏更新逻辑
        this.game.physics.arcade.collide(this.bug, this.ground);
        this.game.physics.arcade.collide(this.enemyBug, this.ground);
        
        // 确保虫子始终在运行动画
        if (!this.bug.animations.isPlaying) {
            this.bug.play('run');
        }
        if (!this.enemyBug.animations.isPlaying) {
            this.enemyBug.play('run');
        }

        // ... 其他更新逻辑 ...
    }
};
