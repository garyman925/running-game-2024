// 在现有代码中找到处理答题的部分
if (this.currentQuestion && this.currentQuestion.checkAnswer(selectedAnswer)) {
    // 答对时的代码保持不变
    // ...
} else {
    // 在答错的情况下，播放fall_bug动画
    this.bugbug.play('fall_bug');
    
    // 等待动画播放完毕后再继续
    this.bugbug.once('animationcomplete', () => {
        // 重置为idle动画
        this.bugbug.play('idle');
        
        // 其他答错后的逻辑
        this.cameras.main.shake(200, 0.01);
        this.wrongSound.play();
        this.score -= 5;
        this.scoreText.setText('得分: ' + this.score);
    });
    
    // 其他答错的处理逻辑...
}
