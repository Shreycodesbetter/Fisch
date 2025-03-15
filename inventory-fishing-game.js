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
    let fishInWater = [];
    let coins = 0;
    let rodLevel = 1;
    let baitType = "Basic";
    let weather = "Sunny";
    let quests = ["Catch 3 Rare Fish", "Earn 100 Coins", "Catch 5 Fish in Stormy Weather"];
    let completedQuests = [];
    let xp = 0;
    let level = 1;
    let achievements = [];

    const baits = { "Basic": 1, "Advanced": 1.5, "Master": 2 };
    const weatherEffects = { "Sunny": 1, "Rainy": 1.2, "Stormy": 0.8 };

    function getRandomWeather() {
        const weatherTypes = Object.keys(weatherEffects);
        return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    }

    function changeWeather() {
        weather = getRandomWeather();
        displayMessage(`Weather changed to ${weather}!`);
    }

    function spawnMoreFish() {
        for (let i = 0; i < 5; i++) {
            let type = fishTypes[Math.floor(Math.random() * fishTypes.length)];
            let size = Math.random() * 2 + 0.5; // Fish size between 0.5 and 2.5
            fishInWater.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() * 2 - 1) * 2,
                dy: (Math.random() * 2 - 1) * 2,
                type,
                size,
                caught: false,
                tailSwish: Math.random() * Math.PI
            });
        }
    }

    function spawnInitialFish() {
        fishInWater = [];
        spawnMoreFish();
    }

    function drawFish() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fishInWater.forEach(fish => {
            fish.x += fish.dx;
            fish.y += fish.dy;
            if (fish.x < 10 || fish.x > canvas.width - 10) fish.dx *= -1;
            if (fish.y < 10 || fish.y > canvas.height - 10) fish.dy *= -1;

            ctx.fillStyle = fish.caught ? "white" : fish.type.color;
            ctx.beginPath();
            ctx.arc(fish.x, fish.y, 10 * fish.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw tail
            ctx.fillStyle = fish.caught ? "white" : fish.type.color;
            ctx.beginPath();
            ctx.moveTo(fish.x, fish.y);
            const tailLength = 10 * fish.size;
            const tailWidth = 5 * fish.size;
            const tailX = fish.x - tailLength * Math.cos(fish.tailSwish);
            const tailY = fish.y - tailLength * Math.sin(fish.tailSwish);
            ctx.lineTo(tailX - tailWidth, tailY - tailWidth);
            ctx.lineTo(tailX + tailWidth, tailY + tailWidth);
            ctx.closePath();
            ctx.fill();

            fish.tailSwish += 0.1;
        });
        if (fishInWater.length <= 2) {
            spawnMoreFish();
        }
        requestAnimationFrame(drawFish);
    }

    function displayMessage(msg) {
        messageBox.innerText = msg;
        messageBox.style.display = "block";
        setTimeout(() => messageBox.style.display = "none", 3000);
    }

    function addXp(amount) {
        xp += amount;
        if (xp >= level * 100) {
            xp -= level * 100;
            level++;
            displayMessage(`Leveled up to level ${level}!`);
        }
    }

    function checkAchievements() {
        if (coins >= 1000 && !achievements.includes("Wealthy Angler")) {
            achievements.push("Wealthy Angler");
            displayMessage("Achievement unlocked: Wealthy Angler!");
        }
        if (fishCaught.length >= 100 && !achievements.includes("Master Fisherman")) {
            achievements.push("Master Fisherman");
            displayMessage("Achievement unlocked: Master Fisherman!");
        }
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        fishInWater.forEach((fish, index) => {
            const dist = Math.sqrt((fish.x - mouseX) ** 2 + (fish.y - mouseY) ** 2);
            if (dist < 10 * fish.size && !fish.caught) {
                fish.caught = true;
                fishCaught.push(fish);
                displayMessage(`Caught a ${fish.type.name} of size ${fish.size.toFixed(2)}!`);
                addXp(Math.floor(fish.size * 10));
                setTimeout(() => fishInWater.splice(index, 1), 500);
            }
        });
    });

    document.getElementById("sellBtn").addEventListener("click", () => {
        let totalValue = fishCaught.reduce((sum, fish) => sum + fish.type.value * fish.size * rodLevel, 0);
        coins += totalValue;
        fishCaught = [];
        displayMessage(`Sold all fish for ${totalValue.toFixed(2)} coins!`);
        checkAchievements();
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
        } else {
            displayMessage("Invalid weather!");
        }
    });

    document.getElementById("inventoryBtn").addEventListener("click", () => {
        const inventory = fishCaught.map((fish, index) => `${index + 1}. ${fish.type.name} (Size: ${fish.size.toFixed(2)})`).join("\n");
        alert(`Inventory:\n\n${inventory}`);
    });

    setInterval(changeWeather, 120000); // Change weather every 2 minutes

    spawnInitialFish();
    drawFish();
};
