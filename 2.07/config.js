const gameConfig = {
    currentCharacter: window.initialCharacter || 'bugbug', // 使用 PHP 傳來的值，如果沒有則使用默認值
    characters: {
        //1
        bugbug: {
            sprite: 'assets/bugbug-sprite.png',
            atlas: 'assets/bugbug-sprite.json',
            icon: 'assets/bugbug/bugbug-icon.png'
        },
        //2
        bitbit: {
            sprite: 'assets/bitbit/bitbit-sprite.png',
            atlas: 'assets/bitbit/bitbit.json',
            icon: 'assets/bitbit/bitbit-icon.png'
        },
        //3
        tara: {
            sprite: 'assets/tara/tara-sprite.png',
            atlas: 'assets/tara/tara.json',
            icon: 'assets/tara/tara-icon.png'
        },
        //4
        qubit: {
            sprite: 'assets/qubit/qubit-sprite.png',
            atlas: 'assets/qubit/qubit.json',
            icon: 'assets/qubit/qubit-icon.png'
        },
        //5 
        daris: {
            sprite: 'assets/daris/daris-sprite.png',
            atlas: 'assets/daris/daris.json',
            icon: 'assets/daris/daris-icon.png'
        },
        //6
        twisty: {
            sprite: 'assets/twisty/twisty-sprite.png',
            atlas: 'assets/twisty/twisty.json',
            icon: 'assets/twisty/twisty-icon.png'
        },
        //7
        ava: {
            sprite: 'assets/ava/ava-sprite.png',
            atlas: 'assets/ava/ava.json',
            icon: 'assets/ava/ava-icon.png'
        },
        //8
        bolster: {
            sprite: 'assets/bolster/bolster-sprite.png',
            atlas: 'assets/bolster/bolster.json',
            icon: 'assets/bolster/bolster-icon.png'
        }   
    }
};

//console.log('Config initialized with character:', gameConfig.currentCharacter);
