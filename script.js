window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const questDisplay = document.getElementById("questDisplay");
    const messageBox = document.getElementById("messageBox");

    const fishTypes = [
        { name: "Flimsy Fish", color: "lightblue", rarity: 50, value: 5 },
        { name: "Training Fish", color: "green", rarity: 45, value: 10 },
        { name: "Plastic Fish", color: "gray", rarity: 40, value: 15 },
        { name: "Carbon Fish", color: "black", rarity: 35, value: 20 },
        { name: "Fast Fish", color: "red", rarity: 30, value: 25 },
        { name: "Lucky Fish", color: "gold", rarity: 25, value: 30 },
        { name: "Long Fish", color: "purple", rarity: 20, value: 35 },
        { name: "Steady Fish", color: "blue", rarity: 15, value: 40 },
        { name: "Nocturnal Fish", color: "darkblue", rarity: 10, value: 50 },
        { name: "Fortune Fish", color: "yellow", rarity: 8, value: 55 },
        { name: "Megalodon", color: "darkgray", rarity: 5, value: 100 },
        { name: "The Bloop", color: "darkred", rarity: 3, value: 150 },
        { name: "Fishy Fishity Fishing Fished Fish", color: "rainbow", rarity: 1, value: 500 }
    ];

    const rodTypes = [
        "Flimsy Rod", "Training Rod", "Plastic Rod", "Carbon Rod", "Fast Rod", "Lucky Rod", "Long Rod", "Steady Rod",
        "Nocturnal Rod", "Fortune Rod", "Rapid Rod", "Magnet Rod", "Midas Rod", "Mythical Rod", "Kings Rod", "Destiny Rod",
        "Magma Rod", "Fungal Rod", "Haunted Rod", "Executive Rod", "Golden Rod", "Legendary Rod", "Inferno Rod", "Aqua Rod",
        "Celestial Rod", "Thunder Rod", "Frost Rod", "Solar Rod", "Lunar Rod", "Crystal Rod", "Phantom Rod", "Diamond Rod"
    ];

    let fishCaught = [];
    let fishing = false;
    let fishInWater = [];
    let coins = 0;
    let rodLevel = 1;
    let baitType = "Basic";
    let weather = "Sunny";
    let quests = ["Catch 3 Rare Fish", "Earn 100 Coins", "Catch 5 Fish in Stormy Weather"];
    let completedQuests = [];

    const baits = { "Basic": 1, "Advanced": 1.5, "Master": 2 };
    const weatherEffects = { "Sunny": 1, "Rainy": 1.2, "Stormy": 0.8 };

    function spawnFish() {
        fishInWater = [];
        for (let i = 0; i < 5; i++) {
            let type = fishTypes[Math.floor(Math.random() * fishTypes.length)];
            fishInWater.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() * 2 - 1) * 2,
                dy: (Math.random() * 2 - 1) * 2,
                type
            });
        }
    }

    function drawFish() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fishInWater.forEach(fish => {
            fish.x += fish.dx;
            fish.y += fish.dy;
            if (fish.x < 10 || fish.x > canvas.width - 10) fish.dx *= -1;
            if (fish.y < 10 || fish.y > canvas.height - 10) fish.dy *= -1;
            ctx.fillStyle = fish.type.color;
            ctx.beginPath();
            ctx.arc(fish.x, fish.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(drawFish);
    }

    function displayMessage(msg) {
        messageBox.innerText = msg;
        messageBox.style.display = "block";
        setTimeout(() => messageBox.style.display = "none", 3000);
    }

    document.getElementById("sellBtn").addEventListener("click", () => {
        let totalValue = fishCaught.reduce((sum, fish) => sum + fish.type.value, 0);
        coins += totalValue;
        fishCaught = [];
        displayMessage(`Sold all fish for ${totalValue} coins!`);
    });

    document.getElementById("shopBtn").addEventListener("click", () => {
        let upgradeCost = rodLevel * 20;
        if (coins >= upgradeCost) {
            coins -= upgradeCost;
            rodLevel++;
            displayMessage(`Upgraded rod to level ${rodLevel}!`);
        } else {
            displayMessage(`Not enough coins! You need ${upgradeCost} coins.`);
        }
    });

    document.getElementById("settingsBtn").addEventListener("click", () => {
        let newWeather = prompt("Change weather: Sunny, Rainy, Stormy");
        if (weatherEffects[newWeather]) {
            weather = newWeather;
            displayMessage(`Weather changed to ${weather}!`);
            spawnFish();
        } else {
            displayMessage("Invalid weather!");
        }
    });

    document.getElementById("inventoryBtn").addEventListener("click", () => {
        const inventory = rodTypes.map((rod, index) => `${index + 1}. ${rod}`).join("\n");
        alert(`Available Rods:\n\n${inventory}`);
    });

    spawnFish();
    drawFish();
};
