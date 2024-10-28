<!DOCTYPE html>
<html>
    
<head>
  	<meta charset="utf-8" />
 	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui" />

	  <!-- Allow fullscreen mode on iOS devices. (These are Apple specific meta tags.) -->	
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon" sizes="256x256" href="icon-256.png" />
	<meta name="HandheldFriendly" content="true" />
	
	<!-- Chrome for Android web app tags -->
	<meta name="mobile-web-app-capable" content="yes" />


  	<title>Runrun Bug</title>

  <style>
  body {margin: 0 auto;}
  
    #turn{
	width:100%;
	height:100%;
	position:fixed;
	top:0px;
	left:0px;
	background-color: rgba(255,255,255,0.7);
	background-image:url('../assets/playportrait.png');
	background-size: contain;
	background-repeat:no-repeat;
	background-position: center center;
	display:none;
	}

  </style>

  <script type="text/javascript" src="jquery-2.0.3.min.js"></script>
  <!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.6.2/phaser.min.js"></script> -->
  <script type="text/javascript" src="phaser-ce.min.js"></script>
  <script type="text/javascript" src="phaser-scroll.js"></script>  
  <!-- <script type="text/javascript" src="phaser-ui-tools.js"></script> -->
  <script type="text/javascript" src="load.js"></script>

  <script type="text/javascript" src="menu.js?<?=uniqid()?>"></script>  
  <script type="text/javascript" src="end.js?<?=uniqid()?>"></script>



</head>

<body>
<?php
    // 模拟session数据
    $member_id = "test_user_123";
    $domain_id = "game_domain_001";
    $centerdomain = "center_domain_001";
    $limit = 10;
    $level = 5;

    // 模拟数据库查询结果
    $questions = [
        "'What is the capital of France?'",
        "'Which planet is known as the Red Planet?'",
        "'What is the largest mammal in the world?'"
    ];
    $qIds = [1, 2, 3];
    $answers = [
        "['Paris','London']",
        "['Mars','Venus']",
        "['Blue Whale','African Elephant']"
    ];

    $questions = implode(",", $questions);
    $qIds = implode(",", $qIds);
    $answers = implode(",", $answers);
?>

  <div id="game_div"></div>
  <div id="turn"></div>

</body>

<script>

var score = 0;
var mid = "<?php echo $member_id; ?>";
var article_id = "<?php echo $domain_id; ?>";
var gcenter_id = "<?php echo $centerdomain; ?>";
var limit = "<?php echo $limit; ?>";

var main_state = {

	preload: function() { 
		//this.game.stage.backgroundColor = '#71c5cf';
		this.game.load.image('bird','../assets/bird.png');
		this.game.load.spritesheet('bug','../assets/bug.png',190,170);
		this.game.load.spritesheet('enemyBug','../assets/enemyBug.png',190,170);
		this.game.load.spritesheet('ground','../assets/ground.png', 128 , 128);
		this.game.load.spritesheet('tree','../assets/tree3.png',158,199);
		this.game.load.spritesheet('grass','../assets/grass.png',512,128);
		
		this.game.load.image('bg','../assets/bg4.png');
		this.game.load.image('button','../assets/button1.png',150,70)

		this.game.load.image('tick','../assets/tick.png');
		this.game.load.image('cross','../assets/cross.png');
		this.game.load.image('correct','../assets/correct.png');
		this.game.load.image('wrong','../assets/wrong.png');

		this.game.load.audio('bgm','../audio/bgm1.mp3')
		this.game.load.audio('fail','../audio/felldown2.wav')
		this.game.load.audio('endbgm','../audio/complete2.mp3')
		this.game.load.audio('running','../audio/run.wav')
		this.game.load.audio('aruready','../audio/aruready.wav')
		this.game.load.audio('yeah','../audio/yeah.mp3')
		this.game.load.audio('step','../audio/step.wav')

	},

	create: function(){

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	
		//background size must be power of 2
		this.bg = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg' );
		
		//tilemap(posX,posY,width,Height)
		this.ground = this.game.add.tileSprite(0, 300, this.game.world.width , this.game.world.height/3, 'ground')
		this.grass = this.game.add.tileSprite(0, 0, this.game.world.width, 128, 'grass' );
		this.grass.autoScroll(-500,0);

		//tree
		this.tree = this.game.add.sprite(550,0,'tree',0);

		//this.ground.autoScroll(-200,0);
		//Bird		
		this.bird = this.game.add.sprite(50,50,'bird');	
		this.game.add.tween(this.bird).to({y:100},1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);

	
		//audio import		
		bgm     = this.game.add.audio('bgm');
		fail    = this.game.add.audio('fail');
		running = this.game.add.audio('running');
		yeah    = this.game.add.audio('yeah');
		step    = this.game.add.audio('step');

		//Sprite Import
		this.enemyBug = this.game.add.sprite(150, 100 ,'enemyBug',0);
		this.bug 	 =  this.game.add.sprite(0, 100 ,'bug',0);				

		//Physics
		this.game.physics.arcade.gravity.y = 900;

		//Sprite Setting
		this.enemyBug.scale.x = 0.9;
		this.enemyBug.scale.y = 0.9;
		this.enemyBug.anchor.setTo(0.5,0.5);
		this.enemyBug.angle = 10;

		this.bug.scale.setTo(1);
		this.bug.anchor.setTo(0.5,0.5);
		this.bug.angle = 10;
		
		//Sprite Physics
		this.game.physics.enable(this.bug);
		this.game.physics.enable(this.enemyBug);
		this.game.physics.enable(this.ground);
		this.game.physics.enable(this.tree);
		this.game.physics.enable(this.grass);

		//collideWorld
		this.bug.body.collideWorldBounds = true ;
		this.enemyBug.body.collideWorldBounds = true ;
		this.tree.body.collideWorldBounds = true;
		this.grass.body.collideWorldBounds = true;

		//bounce
		this.bug.body.bounce.set(0.5);
		this.enemyBug.body.bounce.set(0.5);
		this.bug.body.mass = 1;
		this.enemyBug.body.mass = 1;
		
		this.ground.body.collideWorldBounds = true;
		this.ground.body.bounce.set(1);
		this.ground.body.immoveable = true;

		// button	
		this.button1  = game.add.button( this.game.world.width*0.3 , this.game.world.height-100, 'button', this.answer, this, 1, 1, 1);
		this.button2  = game.add.button( this.game.world.width*0.7 , this.game.world.height-100,  'button', this.answer, this, 1, 1, 1);
		//this.button3  = game.add.button( this.game.world.width*0.85 , this.game.world.height-100,  'button', this.answer, this, 1, 1, 1);

		this.button1.anchor.setTo(0.5,0.5);
		this.button2.anchor.setTo(0.5,0.5);
		//this.button3.anchor.setTo(0.5,0.5);


		this.button1.scale.x = window.innerWidth*0.001;
		this.button1.scale.y = window.innerWidth*0.001;
		this.button2.scale.x = window.innerWidth*0.001;
		this.button2.scale.y = window.innerWidth*0.001;

        var questStyle = {
        	font: '30px Arial', 
			fill:'#ffffff',
			fontWeight: 'bold',
			wordWrapWidth: window.innerWidth-15,
			wordWrap: true,
			align: 'center'

        }

	 	this.q = this.game.add.text(this.game.world.width/2,this.game.world.height-180,'',questStyle);
	 
		this.q.anchor.setTo(0.5);

		this.q.shadowBlur = 5; 

		var ansStyle = {
			font: '30px Arial', 
			fill:'#ffffff',
			wordWrapWidth: 350,
			wordWrap: true
		}

	 	this.a1 = this.game.add.text(this.game.world.width*0.3,this.game.world.height-100,'',ansStyle);
	  	this.a1.anchor.setTo(0.5,0.5);

	 
	 	this.a2 = this.game.add.text(this.game.world.width*0.7 ,this.game.world.height-100,'',ansStyle);
	 	this.a2.anchor.setTo(0.5,0.5);


		var runFrame  = [1,2,3,4]; 
		var failFrame = [9];

		//bug
		this.bug.animations.add('run',runFrame);
		this.bug.animations.add('fail',failFrame);
		this.bug.play('run',15,true);
		this.bug.alpha = 1;

		step.addMarker('step',0,0.2,1,true);
		step.play('step',0,1,true);

		//enemy
		this.enemyBug.animations.add('run',runFrame);
		this.enemyBug.animations.add('fail',failFrame);
		this.enemyBug.play('run',15,true);
		this.enemyBug.alpha = 1;

		//scroe
		score = 0;
		style = { font: '30px Arial' , fill:'#ffffff' };
		label_score = this.game.add.text(20, 20, "0", style);
		var basket = [''];

		this.totalQuestion = 0 ;        
		this. bugScore      = 0 ;         
		this. enemyBugScore = 0 ;


		questions = [<?=$questions?>];
		qIds = [<?=$qIds?>];
		answers = [<?=$answers?>];
		


		collectResult = [];
		this.showNextQuestion();

		this.tick = this.game.add.sprite(200, 200 ,'tick');
		this.tick.anchor.setTo(0.5,0.5);
		this.tick.scale.setTo(0.2,0.2);
		this.tick.visible = false;

		this.cross = this.game.add.sprite(200, 200 ,'cross');
		this.cross.anchor.setTo(0.5,0.5);
		this.cross.scale.setTo(0.2,0.2);
		this.cross.visible = false;

		this.correct = this.game.add.sprite(0, 0 ,'correct');
		this.correct.anchor.setTo(0.5,0.5);
		this.correct.visible = false;

		this.wrong = this.game.add.sprite(0, 0 ,'wrong');
		this.wrong.anchor.setTo(0.5,0.5);
		this.wrong.visible = false;


		this.detectMobile();

	},

    // randomNum: function(){
    // 	return(Math.random());
    // },

    showNextQuestion: function(){
        // ... 保持原有代码 ...
        if(q && a) {
            this.showQuestion(q, a);
        } else {
            // 模拟保存分数
            console.log("Game Over. Score: " + score);
            console.log("Questions: " + JSON.stringify(qIds));
            console.log("User Answers: " + JSON.stringify(collectResult));
            this.restart();
            step.stop();
        }
    },

	showQuestion: function(question,answers){

		this.q.text = question;
		this.q.dirty = true;

		
	    if(Math.random() <0.5)

	    {

	    	this.a1.text = answers[0];

	    	this.a2.text = answers[1];

	    	correctAnswer = this.button1;
	    	
	    }

	    else

	    {
	    	this.a1.text = answers[1];

	    	this.a2.text = answers[0];


	    	correctAnswer = this.button2;

	    }

		//console.log("zf:"+correctAnswer+"--"+answers[0]);
		
	    // collectResult += 'Q' + [this.totalQuestion + 1] + '.' + questions[this.totalQuestion] + '  ' + answers[0]+ '\n';
		this.a1.dirty = true;
		this.a2.dirty = true;


	},

	answer: function(button) {


		
		if( button === correctAnswer ) //right answer
		
		{
			
			//console.log("zq:"+correctAnswer+"---correct"+"--"+answers[0]);
			var status ="correct";
			score++;
			label_score.text = score;

			this.game.add.tween(this.bug).to({x:'+150'},1000, Phaser.Easing.Linear.None, true, 0, 0, false);

			this.bug.body.velocity.y = -350;
			//this.enemyBug.x = this.bug.x - 30;

			this.game.add.tween(this.enemyBug).to({x:'-50'},1000, Phaser.Easing.Linear.None, true, 0, 0, false);	
			this.game.add.tween(this.enemyBug).to( {alpha:0},100, Phaser.Easing.Linear.None, true, 0, 1, true);
			this.bugScore ++;
			yeah.play('',0,1,false);

			this.tick.x = button.x ;
			this.tick.y = button.y ; 
			this.tick.visible = true;

			this.correct.x = this.game.world.width*0.5;
			this.correct.y = this.game.world.height*0.2;
			this.game.add.tween(this.correct).to( {height: 0},100, Phaser.Easing.Linear.None, true, 0, 0, true); 
			this.correct.visible = true;

			// Record User Answer
			collectResult.push(0);
		}
		
		else // wrong answer
		
		{
			var status ="correct";
			//console.log("zs:"+button+"---wrong"+"---"+answers[0]);	
			//this.bug.play('fail',15,false);
			//this.bug.x = this.enemyBug.x - 30; //slip outside
			this.game.add.tween(this.bug).to({x:'-50'},1000, Phaser.Easing.Linear.None, true, 0, 0, false);
			
			//var s = {x: score/this.totalQuestion*window.innerWidth};
			//this.game.add.tween(this.enemyBug).to(s,1000, Phaser.Easing.Linear.None, true, 0, 0, false);

			this.game.add.tween(this.bug).to( {alpha:0},100, Phaser.Easing.Linear.None, true, 0, 1, true);
			this.enemyBugScore++;
			this.enemyBug.body.velocity.y = -350;
			//this.enemyBug.x += this.totalQuestion*50;
			this.game.add.tween(this.enemyBug).to({x:'+150'},1000, Phaser.Easing.Linear.None, true, 0, 0, false);
			fail.play('',0,1,false);

			// this.answerWrong = game.add.text(window.innerWidth/2,window.innerHeight/5,'Wrong!');
   //  		this.answerWrong.anchor.setTo(0.5,0.5);
			// this.answerWrong.font = 'Lucida Console';
			// this.answerWrong.fontSize = window.innerWidth *0.05;
			// this.answerWrong.fill = 'white';

			this.cross.x = button.x ;
			this.cross.y = button.y ; 
			this.cross.visible = true;

			this.wrong.x = this.game.world.width*0.5;
			this.wrong.y = this.game.world.height*0.2; 
			this.wrong.visible = true;
			this.game.add.tween(this.wrong).to( {height: 0},100, Phaser.Easing.Linear.None, true, 0, 0, true); 

			// Record User Answer
			collectResult.push(1);
		}
				
		//this.game.add.tween(this.button1).to( {x:0, alpha: 0 },100, Phaser.Easing.Linear.None, true, 0, 0, true);
    	//this.game.add.tween(this.button2).to( {x:0, alpha: 0},100, Phaser.Easing.Linear.None, true, 0, 0, true);
    	//this.game.add.tween(this.button3).to( {x:0, alpha: 0},100, Phaser.Easing.Linear.None, true, 0, 0, true);

		this.totalQuestion++;
		this.input.disabled = true;
		this.bird.x += 10;
		this.basket = button[0];
		this.bug.angle += 1;
		this.enemyBug.angle += 1;
		

		var self = this;
		
		setTimeout(function(){
			self.input.disabled = false;
			self.showNextQuestion();
			self.tick.visible = false;
			self.cross.visible = false;
			self.correct.visible = false;
			self.wrong.visible = false;
		}, 1000);
		
	/*	
		$.ajax({
				type: "POST",
				url: "ajax.php",
				data: "act=user_record&member_id=<?=$id?>&article_id=<?=$aid?>&ques="+question+"&ans="+answer[0]+"&cor="+status,
				success: function(result){
				//alert("ha:"+score);
				}
		});
	*/

	},

	treefadeaway: function()
	{
		this.tree.visible=false;
	},

 	restart: function()
 	{
 		game.state.start('end');
 		bgm.stop();
 	},

	//loop everything inside the section
	update: function() 
	{
		// this.gameSpeed();	
		this.bg.tilePosition.x -= 10 ;
		
		//this.reborn();
		this.game.physics.arcade.collide(this.bug,this.ground,null,null,this);
		this.game.physics.arcade.collide(this.enemyBug,this.ground,null,null,this);
		this.game.physics.arcade.collide(this.tree,this.ground,null,null,this);
		this.game.physics.arcade.collide(this.grass,this.ground,null,null,this)
		this.game.physics.arcade.collide(this.tree,this.bug,this.treefadeaway,null,this);

	},    

   detectMobile: function(){
    
   

      if(game.device.iPhone || game.device.android || game.device.iPhone4){


          this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
          this.game.scale.forceOrientation(true, false);

          ratio = window.innerWidth/window.innerHeight,
          atualRatio = ratio/3;

          refPos = window.innerHeight*0.5;

          this.bug.scale.setTo(atualRatio);
          this.enemyBug.scale.setTo(atualRatio);
          
          this.button1.y = refPos*1.8;
          this.button2.y = refPos*1.8;

          this.q.y = refPos*1.5;
          this.q.scale.setTo(atualRatio);

          this.a1.y = refPos*1.8;
          this.a2.y = refPos*1.8;
          this.a1.scale.setTo(atualRatio);
          this.a2.scale.setTo(atualRatio);

          this.correct.scale.setTo(atualRatio);
          this.wrong.scale.setTo(atualRatio);

      }
    }
                                                                                                                                                                                                                                                                                                                               

};

//-----------------------------------------
// Initialize Phaser, and creates a 800x600px game
//var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game_div');
// var width =  window.innerWidth, 
// 	height = window.innerHeight ;

var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, 'game_div',true,true);

// Define all the states

game.state.add('load', load_state); 
game.state.add('menu', menu_state);
game.state.add('main', main_state); 
game.state.add('end',  end_state);

// Start with the 'main' state
game.state.start('load'); 


</script>

</html>
