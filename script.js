<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fishing Game</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            text-align: center;
            background: linear-gradient(to bottom, #87CEEB, #1E90FF);
            color: white;
            margin: 0;
            padding: 0;
        }

        canvas {
            border: 3px solid white;
            background-color: #1E90FF;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            margin-top: 20px;
        }

        .controls {
            margin-top: 20px;
        }

        button {
            padding: 12px 20px;
            margin: 8px;
            border: none;
            cursor: pointer;
            background: #ff9800;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            transition: background 0.3s, transform 0.2s;
        }

        button:hover {
            background: #e68900;
            transform: scale(1.1);
        }

        .quest-box {
            margin-top: 15px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid white;
            display: inline-block;
            border-radius: 8px;
            color: black;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .message-box {
            display: none;
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div id="questDisplay" class="quest-box"></div>
    <div id="messageBox" class="message-box"></div>
    <div class="controls">
        <button id="sellBtn">Sell Fish</button>
        <button id="shopBtn">Upgrade Rod</button>
        <button id="settingsBtn">Change Weather</button>
        <button id="inventoryBtn">Inventory</button>
    </div>
    <script src="inventory-fishing-game.js"></script>
</body>
</html>
