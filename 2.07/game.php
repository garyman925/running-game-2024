<?php
// 模擬從數據庫獲取角色設置
//$character = get_character_from_database();  // 這裡替換為實際的數據庫查詢
$character = 'tara';

// 模擬從數據庫獲取的數據
$gameData = [
    'character' => $character,  // 使用從數據庫獲取的角色
    'member_id' => 'test_user_123',
    'domain_id' => 'game_domain_001',
    'center_domain' => 'center_domain_001',
    'limit' => 10,
    'questions' => [
        "What is the capital of France?",
        "What is the capital of Japan?",
        "What is the capital of China?",
        "What is the capital of Korea?",
        "What is the capital of Vietnam?"
    ],
    'answers' => [
        ["Paris", "London"],
        ["Tokyo", "Seoul"],
        ["Beijing", "Shanghai"],
        ["Seoul", "Tokyo"],
        ["Hanoi", "Bangkok"]
    ],
    'qIds' => [1, 2, 3, 4, 5]
];

// 模擬數據庫查詢函數
function get_character_from_database() {
    // 這裡替換為實際的數據庫查詢邏輯
    return 'bitbit';
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>Runrun Bug</title>
    
    <!-- 添加 Google Fonts 連結，包含 IM Fell DW Pica 字體 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital,wght@0,400;0,700;1,400&family=Press+Start+2P&display=swap" rel="stylesheet">
    
    <!-- 添加字體預加載 -->
    <style>
        @font-face {
            font-family: 'Press Start 2P';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2) format('woff2');
        }

        @font-face {
            font-family: 'IM Fell DW Pica';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/imfelldwpica/v16/2sDGZGRQotv9nbn2qSl0TxXVYNw9ZA.woff2) format('woff2');
        }
        
        /* 添加一個隱藏的元素來預加載字體 */
        .font-preload {
            font-family: 'Press Start 2P', 'IM Fell DW Pica';
            position: absolute;
            left: -100px;
            visibility: hidden;
        }
        
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #000;
        }
        #game {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        
    </style>
    
    <!-- 將 PHP 數據傳遞給 JavaScript -->
    <script>
        // 設置初始角色
        window.initialCharacter = "<?php echo $gameData['character']; ?>";
        console.log('PHP set character:', window.initialCharacter); // 添加這行
        
        // 設置遊戲數據
        window.gameData = {
            questions: <?php echo json_encode($gameData['questions']); ?>,
            answers: <?php echo json_encode($gameData['answers']); ?>,
            qIds: <?php echo json_encode($gameData['qIds']); ?>,
            memberId: "<?php echo $gameData['member_id']; ?>",
            domainId: "<?php echo $gameData['domain_id']; ?>",
            centerDomain: "<?php echo $gameData['center_domain']; ?>",
            limit: <?php echo $gameData['limit']; ?>
        };
    </script>

    <!-- 遊戲腳本 -->
    <script src="config.js"></script>
    <!-- phaser 3.55.2 -->
    <script src="phaser.min.js"></script>
    <script src="load.js"></script>
    <script src="menu.js"></script>
    <script src="main.js"></script>
    <script src="end.js"></script>
</head>
<body>
    <!-- 添加預加載元素 -->
    <div class="font-preload">.</div>
    
    <div id="game"></div>
    <script>
        document.fonts.ready.then(function() {
            console.log('Fonts are loaded');
            
            // 使用 WebFontLoader 確保字體加載
            WebFont.load({
                google: {
                    families: ['Press Start 2P', 'IM Fell DW Pica:400,700']
                },
                active: function() {
                    console.log('WebFont loaded');
                    var config = {
                        type: Phaser.WEBGL,
                        scale: {
                            mode: Phaser.Scale.FIT,
                            parent: 'game',
                            width: 1920,
                            height: 1200,
                            autoCenter: Phaser.Scale.CENTER_BOTH
                        },
                        physics: {
                            default: 'arcade',
                            arcade: {
                                gravity: { y: 800 },
                                debug: false
                            }
                        },
                        scene: [LoadScene, MenuScene, MainScene, EndScene]
                    };

                    var game = new Phaser.Game(config);
                }
            });
        });
    </script>
    <!-- 添加 WebFontLoader -->
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
</body>
</html>
