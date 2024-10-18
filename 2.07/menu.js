var menu_state = {
    preload: function() {
        // 移除重复的音频加载
        this.game.load.image('grass','../assets/grass.png');
        this.game.load.image('logo2','../assets/logo2.png');
        this.game.load.spritesheet('startBtn','../assets/start_btn.png',224,76);
        this.game.load.image('bg','../assets/bg4.png');
        this.game.load.image('ground','../assets/ground.jpg');
        
        this.game.load.audio('bgm','../audio/bgm1.mp3');
        this.game.load.audio('ding','../audio/ding.mp3');
        this.game.load.audio('aruready','../audio/aruready.wav');
    },

    create: function() {
        this.setupAudio();
        this.createGameElements();
        this.setupScreen();
    },

    setupAudio: function() {
        this.bgm = this.game.add.audio('bgm');
        this.ding = this.game.add.audio('ding');
        this.aruready = this.game.add.audio('aruready');
        this.bgm.addMarker('bgm', 14, 15.6, 1, true);
        this.bgm.play('bgm', 0, 1, true);
    },

    createGameElements: function() {
        this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');
        this.bg.autoScroll(-1000, 0);

        this.ground = this.game.add.tileSprite(0, window.innerHeight-100, this.game.width, this.game.height, 'ground');
        this.grass = this.game.add.tileSprite(0, window.innerHeight-220, this.game.world.width, 128, 'grass');

        this.start_btn = this.game.add.button(window.innerWidth/2, window.innerHeight/2+50, 'startBtn', this.start, this, 1, 1, 1);
        this.start_btn.anchor.setTo(0.5, 0.5);
        this.start_btn.scale.setTo(0.9);

        this.logo = this.game.add.sprite(window.innerWidth/2, 200, 'logo2');
        this.logo.anchor.setTo(0.5, 0.5);
        this.logo.scale.setTo(0.9);
        this.game.add.tween(this.logo).to({ x: window.innerWidth/2 + 150 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        
    },

    start: function() {
        console.log("Start function called");
        this.bgm.stop();
        this.aruready.play('', 0, 1, false);
        this.ding.play('', 0, 1, false);
        this.game.state.start('main');
    },

    setupScreen: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.game.scale.parentIsWindow = true;

        this.game.scale.enterIncorrectOrientation.add(this.handleIncorrect, this);
        this.game.scale.leaveIncorrectOrientation.add(this.handleCorrect, this);

        this.detectMobile();
    },

    detectMobile: function() {
        if (this.game.device.iPhone || this.game.device.android || this.game.device.iPhone4) {
            var ratio = window.innerWidth / window.innerHeight;
            var actualRatio = ratio / 3;
            var refPos = window.innerHeight * 0.5;

            this.logo.scale.setTo(actualRatio);
            this.logo.y = refPos * 0.6;

            this.start_btn.scale.setTo(actualRatio);
            this.start_btn.y = refPos + 80;
        }
    },

    handleIncorrect: function() {
        if (this.game.device.iPhone || this.game.device.android || this.game.device.iPhone4) {
            document.getElementById("turn").style.display = "block";
        }
    },

    handleCorrect: function() {
        if (this.game.device.iPhone || this.game.device.android || this.game.device.iPhone4) {
            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.scale.refresh();
        }
        document.getElementById("turn").style.display = "none";
    },

    update: function() {
        // 更新逻辑如果需要的话
    }
};
