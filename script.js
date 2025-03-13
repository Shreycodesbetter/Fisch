// Fishing Game - Inspired by Fisch (Roblox) - JavaScript & HTML5 Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fishTypes = [
    { name: "Common Fish", color: "blue", rarity: 0.6, value: 5 },
    { name: "Rare Fish", color: "green", rarity: 0.3, value: 15 },
    { name: "Legendary Fish", color: "gold", rarity: 0.1, value: 50 },
    { name: "Shark", color: "gray", rarity: 0.05, value: 100 },
    { name: "Piranha", color: "red", rarity: 0.2, value: 30 },
    { name: "Electric Eel", color: "yellow", rarity: 0.1, value: 60 },
    { name: "Octopus", color: "purple", rarity: 0.15, value: 40 }
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

const baits = {
    "Basic": 1,
    "Advanced": 1.5,
    "Master": 2
};

const weatherEffects = {
    "Sunny": 1,
    "Rainy": 1.2,
    "Stormy": 0.8
};

function spawnFish() {
    fishInWater = [];
    for (let i = 0; i < 5; i++) {
        const type = fishTypes.find(f => Math.random() < f.rarity * weatherEffects[weather]) || fishTypes[0];
        fishInWater.push({ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            dx: Math.random() * 2 - 1, // Fish movement speed
            dy: Math.random() * 2 - 1,
            type 
        });
    }
}

function drawFish() {
    fishInWater.forEach(fish => {
        fish.x += fish.dx;
        fish.y += fish.dy;
        
        if (fish.x < 0 || fish.x > canvas.width) fish.dx *= -1;
        if (fish.y < 0 || fish.y > canvas.height) fish.dy *= -1;
        
        ctx.fillStyle = fish.type.color;
        ctx.beginPath();
        ctx.arc(fish.x, fish.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

function castRod() {
    if (fishing) return;
    fishing = true;
    setTimeout(() => {
        const caughtFish = fishInWater[Math.floor(Math.random() * fishInWater.length)];
        fishCaught.push(caughtFish);
        coins += caughtFish.type.value * rodLevel * baits[baitType];
        alert(`You caught a ${caughtFish.type.name}! You earned ${caughtFish.type.value * rodLevel * baits[baitType]} coins.`);
        fishing = false;
        spawnFish();
        checkQuests();
    }, (3000 / rodLevel) / baits[baitType]);
}

canvas.addEventListener("click", castRod);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFish();
    requestAnimationFrame(gameLoop);
}

function openInventory() {
    alert(`Inventory:\n${fishCaught.map(f => f.type.name).join("\n")}`);
}

function openShop() {
    const upgradeCost = rodLevel * 20;
    if (coins >= upgradeCost) {
        coins -= upgradeCost;
        rodLevel++;
        alert(`Upgraded rod to level ${rodLevel}!`);
    } else {
        alert(`Not enough coins! You need ${upgradeCost} coins.`);
    }
}

function sellFish() {
    let totalValue = fishCaught.reduce((sum, fish) => sum + fish.type.value, 0);
    coins += totalValue;
    fishCaught = [];
    alert(`Sold all fish for ${totalValue} coins!`);
}

function changeBait() {
    const baitOptions = Object.keys(baits);
    const newBait = prompt(`Choose a bait: ${baitOptions.join(", ")}`);
    if (baits[newBait]) {
        baitType = newBait;
        alert(`Bait changed to ${baitType}!`);
    } else {
        alert("Invalid bait!");
    }
}

function changeWeather() {
    const weatherOptions = Object.keys(weatherEffects);
    const newWeather = prompt(`Change weather: ${weatherOptions.join(", ")}`);
    if (weatherEffects[newWeather]) {
        weather = newWeather;
        alert(`Weather changed to ${weather}!`);
        spawnFish();
    } else {
        alert("Invalid weather!");
    }
}

function checkQuests() {
    if (fishCaught.filter(f => f.type.name === "Rare Fish").length >= 3 && !completedQuests.includes("Catch 3 Rare Fish")) {
        completedQuests.push("Catch 3 Rare Fish");
        alert("Quest Completed: Catch 3 Rare Fish!");
    }
    if (coins >= 100 && !completedQuests.includes("Earn 100 Coins")) {
        completedQuests.push("Earn 100 Coins");
        alert("Quest Completed: Earn 100 Coins!");
    }
    if (weather === "Stormy" && fishCaught.length >= 5 && !completedQuests.includes("Catch 5 Fish in Stormy Weather")) {
        completedQuests.push("Catch 5 Fish in Stormy Weather");
        alert("Quest Completed: Catch 5 Fish in Stormy Weather!");
    }
}

function openSettings() {
    const option = prompt("Settings:\n1. Change Bait\n2. Change Weather");
    if (option === "1") changeBait();
    else if (option === "2") changeWeather();
    else alert("Invalid option!");
}

document.getElementById("inventoryBtn").addEventListener("click", openInventory);
document.getElementById("shopBtn").addEventListener("click", openShop);
document.getElementById("sellBtn").addEventListener("click", sellFish);
document.getElementById("settingsBtn").addEventListener("click", openSettings);

spawnFish();
gameLoop();
