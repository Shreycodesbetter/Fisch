const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const questDisplay = document.getElementById("questDisplay");
const messageBox = document.getElementById("messageBox");

const fishTypes = [
    { name: "Common Fish", color: "blue", rarity: 60, value: 5 },
    { name: "Rare Fish", color: "green", rarity: 30, value: 15 },
    { name: "Legendary Fish", color: "gold", rarity: 10, value: 50 },
    { name: "Shark", color: "gray", rarity: 5, value: 100 },
    { name: "Piranha", color: "red", rarity: 20, value: 30 },
    { name: "Electric Eel", color: "yellow", rarity: 10, value: 60 },
    { name: "Octopus", color: "purple", rarity: 15, value: 40 }
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

function getRandomFish() {
    let totalWeight = fishTypes.reduce((sum, fish) => sum + fish.rarity * weatherEffects[weather], 0);
    let randomNum = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let fish of fishTypes) {
        cumulativeWeight += fish.rarity * weatherEffects[weather];
        if (randomNum < cumulativeWeight) return fish;
    }
    return fishTypes[0];
}

function spawnFish() {
    fishInWater = [];
    for (let i = 0; i < 5; i++) {
        let type = getRandomFish();
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
}

function castRod() {
    if (fishing || fishInWater.length === 0) return;
    fishing = true;
    
    setTimeout(() => {
        const caughtFish = fishInWater[Math.floor(Math.random() * fishInWater.length)];
        fishCaught.push(caughtFish);
        let earnings = caughtFish.type.value * rodLevel * baits[baitType];
        coins += earnings;
        displayMessage(`You caught a ${caughtFish.type.name}! Earned ${earnings} coins.`);
        fishing = false;
        spawnFish();
        updateQuestProgress();
    }, (3000 / rodLevel) / baits[baitType]);
}

canvas.addEventListener("click", castRod);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFish();
    requestAnimationFrame(gameLoop);
}

function displayMessage(msg) {
    messageBox.innerText = msg;
    messageBox.style.display = "block";
    setTimeout(() => messageBox.style.display = "none", 3000);
}

function updateQuestProgress() {
    let questStatus = `Quests:\n`;
    quests.forEach(q => {
        if (q === "Catch 3 Rare Fish" && fishCaught.filter(f => f.type.name === "Rare Fish").length >= 3) {
            completedQuests.push(q);
        }
        if (q === "Earn 100 Coins" && coins >= 100) {
            completedQuests.push(q);
        }
        if (q === "Catch 5 Fish in Stormy Weather" && weather === "Stormy" && fishCaught.length >= 5) {
            completedQuests.push(q);
        }
        questStatus += completedQuests.includes(q) ? `✔️ ${q}\n` : `❌ ${q}\n`;
    });
    questDisplay.innerText = questStatus;
}

document.getElementById("sellBtn").addEventListener("click", () => {
    let totalValue = fishCaught.reduce((sum, fish) => sum + fish.type.value, 0);
    coins += totalValue;
    fishCaught = [];
    displayMessage(`Sold all fish for ${totalValue} coins!`);
    updateQuestProgress();
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
        updateQuestProgress();
    } else {
        displayMessage("Invalid weather!");
    }
});

spawnFish();
gameLoop();
