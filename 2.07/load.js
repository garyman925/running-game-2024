var load_state = {

	preload: function() { 
		var loadingText = this.game.add.text(this.game.world.width/2, this.game.world.height/2, 'Loading...');
		loadingText.anchor.setTo(0.5, 0.5);

		this.game.load.image('bird','../assets/bird.png');
		this.game.load.spritesheet('bug','../assets/bug.png',190,174);
		this.game.load.spritesheet('ground','../assets/ground.jpg', 512 , 512);
		this.game.load.image('bg','../assets/bg4.png');
		this.game.load.spritesheet('button','../assets/button.png',310,70);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.onFileError.add(this.fileError, this);
	},

	create: function(){	
		// 这里可以添加一些过渡效果
	},

	onLoadComplete: function() {
		console.log('All assets loaded');
		this.game.state.start('menu');
	},

	fileError: function(key, file) {
		console.error('Error loading asset:', key);
	}
};
