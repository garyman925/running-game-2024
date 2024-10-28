<?php
// 模擬從數據庫獲取角色設置
//$character = get_character_from_database();  // 這裡替換為實際的數據庫查詢
$character = 'daris';

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
    
    <!-- 添加 Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital,wght@0,400;0,700;1,400&family=Press+Start+2P&display=swap" rel="stylesheet">
    
    <style>
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
        
        /* 字體預加載 */
        .font-preload {
            position: absolute;
            left: -9999px;
            visibility: hidden;
        }
    </style>
    
    <!-- 將 PHP 數據傳遞給 JavaScript -->
    <script>
        window.initialCharacter = "<?php echo $gameData['character']; ?>";
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
</head>
<body>
    <!-- 字體預加載元素 -->
    <div class="font-preload">
        <span style="font-family: 'Press Start 2P'">.</span>
        <span style="font-family: 'IM Fell DW Pica'">.</span>
    </div>

    <div id="game"></div>

    <!-- 遊戲腳本 -->
    <script src="config.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
    <script src="load.js"></script>
    <script src="menu.js"></script>
    <script src="main.js"></script>
    <script src="end.js"></script>

    <script>
        // 等待字體加載
        WebFont.load({
            google: {
                families: ['Press Start 2P', 'IM Fell DW Pica:400,700']
            },
            active: function() {
                // 字體加載完成後初始化遊戲
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
            },
            inactive: function() {
                console.warn('Font loading failed');
            }
        });
    </script>
</body>
</html>
