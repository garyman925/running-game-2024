var endposX = 700;


var end_state = {

	preload: function() {
	this.game.load.image('answerpaper','../assets/answerpaper.png'); 
	this.game.load.image('scoreTag','../assets/scoreTag.png');
	this.game.load.image('restartBtn','../assets/playAgain_btn.png');

	this.game.load.spritesheet("arrow-down", "../assets/arrow-down-sprite.png", 512, 512);

	},

	create: function(){
	
    this.bg = game.add.tileSprite(0, 0, game.width, game.cache.getImage('bg').height, 'bg' );
    this.bg.autoScroll(-500,0);
    
    this.ground = game.add.tileSprite(0, window.innerHeight-100 , window.innerWidth, window.innerHeight*0.8, 'ground');

	this.grass = this.game.add.tileSprite(0, window.innerHeight-220, this.game.world.width, 128, 'grass' );
	
	// Result
	// Backgroud
	this.answerpaper = this.game.add.sprite(window.innerWidth/2, window.innerHeight/1.8, 'answerpaper', 0);
	this.answerpaper.anchor.setTo(0.5, 0.5);
	this.answerpaper.width = Math.min(window.innerWidth * 0.8, this.answerpaper.width * 2);
	// this.answerpaper.height = Math.min(window.innerHeight * 0.75, this.answerpaper.height * 2);
	this.answerpaper.height = window.innerHeight * 0.75;

	// Title
	let resultTitleStyle = {font: 'bold 32pt Arial', fill: '#fff03d', stroke: '#0081c5', strokeThickness: 15};
	let resultTitle = this.game.add.text(this.answerpaper.x, this.answerpaper.y - this.answerpaper.height/2 - 20, 'Result', resultTitleStyle);
	resultTitle.anchor.setTo(0.5, 0.5);

	// Scroll
	this.scrollArrow = this.game.add.sprite(this.answerpaper.x + this.answerpaper.width/2.4, this.answerpaper.y + this.answerpaper.height/2.5, "arrow-down");
	this.scrollArrow.anchor.setTo(0.5, 0.5);
	this.scrollArrow.originX = this.scrollArrow.x;
	this.scrollArrow.scale.x = 0.07;
	this.scrollArrow.scale.y = 0.07;
	this.game.add.tween(this.scrollArrow).from({ y: this.scrollArrow.y - 10 }, 300, Phaser.Easing.Linear.Bounce, true, 0, -1, true);

	this.scroller = game.add.existing(new ScrollableArea(this.answerpaper.x - this.answerpaper.width/2 + this.answerpaper.width*0.05, this.answerpaper.y - this.answerpaper.height/2 + this.answerpaper.height*0.1, this.answerpaper.width * 0.9, this.answerpaper.height * 0.8, this.scrollArrow));
	// Question
	let quesGameObjs = [];
	const quesTextStyle = {font: 'bold 12pt Arial', fill: 'black', align: 'left', wordWrap: true, wordWrapWidth: this.answerpaper.width};
	const correctAnsTextStyle = JSON.parse(JSON.stringify(quesTextStyle));
	correctAnsTextStyle.fill = 'green';
	const wrongAnsTextStyle = JSON.parse(JSON.stringify(quesTextStyle));
	wrongAnsTextStyle.fill = 'red';
	// let quesX = this.answerpaper.x - this.answerpaper.width/2 + this.answerpaper.width * 1/17;
	// let quesY = this.answerpaper.y - this.answerpaper.height/2 + this.answerpaper.height * 1/12;
	let quesX = 0;
	let quesY = 0;
	for(let i = 0; i < questions.length; i++){
		let quesGameObj = this.game.add.text(quesX, quesY, questions[i], quesTextStyle);
		// quesGameObjs.push(quesGameObj);
		this.scroller.addChild(quesGameObj);

		quesY = quesGameObj.y + quesGameObj.height + 12;	// offset
		// // Check if the answer is wrong or not
		let ansTextObject = this.game.add.text(quesGameObj.x + quesGameObj.width + 12, quesGameObj.y, answers[i][collectResult[i]], collectResult[i] === 0? correctAnsTextStyle: wrongAnsTextStyle );
		this.scroller.addChild(ansTextObject);
		// // Correct/Wrong Sign
		let sign = this.game.add.sprite(ansTextObject.x + ansTextObject.width + 5, ansTextObject.y - (collectResult[i] === 0? ansTextObject.height/4: 0), collectResult[i] === 0?'tick':'cross');
		sign.scale.x = 0.07;
		sign.scale.y = 0.07;
		this.scroller.addChild(sign);


		// Show Correct Answer if wrong
		if(collectResult[i] === 1){
			let correctAnsTextObject = this.game.add.text(sign.x + sign.width + 12, sign.y, answers[i][0], correctAnsTextStyle);
			this.scroller.addChild(correctAnsTextObject);
		}
	}
	this.scroller.start();

	var score_background = this.game.add.graphics(this.answerpaper.x + this.answerpaper.width/2, this.answerpaper.y - this.answerpaper.height/2);
	score_background.anchor.setTo(0.5, 0.5);
	score_background.beginFill(0x004254, 1);
    score_background.drawCircle(0, 0, Math.min(window.innerWidth * 0.15, 200));
	
	// var score_label = this.game.add.text (window.innerWidth/2, 200, score, { fontSize:'10',align: 'center' , fill:'white' });
	var score_label = this.game.add.text (score_background.x, score_background.y + window.innerWidth * 0.015, score, { fontSize:'10',align: 'center' , fill:'white' });

	// var scoreTag = game.add.sprite(window.innerWidth/2,window.innerHeight/7,'scoreTag');
	var scoreTag = game.add.sprite(score_background.x, score_background.y +  score_background.height/2, 'scoreTag');
	scoreTag.anchor.setTo(0.5,0.5);
	scoreTag.width = Math.min(scoreTag.width, window.innerWidth * 0.15);
	scoreTag.height = scoreTag.width * (86/181);

	this.game.add.tween(score_label).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
	score_label.anchor.setTo(0.5,0.5);
	score_label.fontSize = window.innerWidth*0.1;
	score_label.font ='Lucida Console, Monaco5, monospace';

	// Answer Result
	let answerResultText = "";
	// for(let i = 0; i < questions.length; i++){
	// 	answerResultText += questions[i] + " " + ((collectResult[i]===0)? answers[i][0]+" Correct": answers[i][1] + " Wrong " + answers[i][0]) + "\n";
	// 	if(collectResult[i]===0){
			
	// 	}else{
			
	// 	}
	// }
	var answersResult = this.game.add.text(window.innerWidth/2,window.innerHeight/1.6, answerResultText, { wordWrap: true, wordWrapWidth: 450 });
  	answersResult.anchor.setTo(0.5);
	answersResult.fontSize = 15; 
	answersResult.font = 'Arial';
	answersResult.lineSpacing = 8;
	// answersResult.fill = 'black';
	answersResult.fill = '#0081C5';
	answersResult.backgroundColor = "white";

	this.restartBtn = this.game.add.button( window.innerWidth/2 ,window.innerHeight-30, 'restartBtn', this.start , this, 1, 1,1);
	this.restartBtn.anchor.setTo(0.5,0.5);
	this.restartBtn.scale.x = 1;
	this.restartBtn.scale.y = 1;

   	endbgm = game.add.audio('endbgm');
   	endbgm.play('',0,1,false);
   	bgm.stop();

   	//(x,y,bug)
	this.enemyBug = this.game.add.sprite(0,window.innerHeight - 180,'enemyBug',0);
	this.enemyBug.anchor.setTo(0.5,0.5);
	this.enemyBug.scale.x = 0.9;
	this.enemyBug.scale.y = 0.9;

	this.bug = this.game.add.sprite(0,window.innerHeight - 180,'bug',0);
	this.game.add.tween(this.bug).to({x:window.innerWidth - 100},2000, Phaser.Easing.Linear.None, true, score < 6?150: 0, 0, false);		

	this.bug.anchor.setTo(0.5,0.5);
	this.bug.scale.x = 0.9;
	this.bug.scale.y = 0.9;
	
	//bug
	this.bug.animations.add('run',[1,2,3,4]);
	this.bug.animations.add('fail',[9]);
	this.bug.play('run',15,true);

	//enemy
	this.enemyBug.animations.add('run',[1,2,3,4]);
	this.enemyBug.animations.add('fail',[9]);
	this.enemyBug.play('run',15,true);

	tween = this.game.add.tween(this.enemyBug).to({x:window.innerWidth - 100},2000, Phaser.Easing.Linear.None, true, score >= 6?150: 0, 0, false);	
	tween.onComplete.add(this.lose,this);


	this.detectMobile();

	},

	lose: function(){

   	this.bg.autoScroll(0,0);

		if(score < 6) //lose
		{	
			this.bug.play('fail',[9] );	
				}
		else //win
		{	
			this.enemyBug.play('fail',[9]);	
		}		

	},

	update: function() 
	{	
		let mouseX = game.input.x;
		let mouseY = game.input.y;
		let scrollerX = this.scroller._x ;
		let scrollerY = this.scroller._y;
		if(mouseX >= scrollerX && mouseX <= scrollerX + this.scroller._w && mouseY >= scrollerY && mouseY <= scrollerY + this.scroller._h){
			if(this.scroller.pressedDown){
				this.game.canvas.style.cursor = "grabbing";
			}else{
				this.game.canvas.style.cursor = "grab";
			}
		}else{
			this.game.canvas.style.cursor = "default";
		}
	},

	start: function(){
		this.game.state.start('menu');
	},


   detectMobile: function(){
    
   

      if(game.device.iPhone || game.device.android || game.device.iPhone4){

      	  // alert('Mobile');

          this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
          this.game.scale.forceOrientation(true, false);

          ratio = window.innerWidth/window.innerHeight;
          atualRatio = ratio/3;

          refPos = window.innerHeight*0.5;

          this.restartBtn.scale.setTo(atualRatio);

          // this.score_label.fontSize = atualRatio;
          // this.score_label.x = window.innerWidth -10;
          // this.score_label.y = 10;


       

          //this.scoreTag.scale.setTo(atualRatio);
          
        
      }
	},
	
	// printQuestion: function(x, y, text){
	// 	var answersResult = this.game.add.text(x, y, text);
	// 	answersResult.anchor.setTo(0.5);
	// 	answersResult.fontSize = 15; 
	// 	answersResult.font = 'Arial';
	// 	answersResult.lineSpacing = 8;
	// 	answersResult.fill = 'black';
	// 	answersResult.backgroundColor = "white";
	// },

	// printAns: function(x, y, text, correctAns){
	// 	if(correctAns){

	// 	}else{
			
	// 	}
	// }


};