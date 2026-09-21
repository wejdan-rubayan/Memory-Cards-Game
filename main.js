const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const playerInput = document.getElementById("player-name");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const modalRestart = document.getElementById("modal-restart");
const gameBoard = document.getElementById("game-board");
const displayPlayer = document.getElementById("display-player");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameModal = document.getElementById("game-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");

const GAME_TIME = 50;


const imageNames = [
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
    "img8.png",
    "img9.png",
    "img10.png"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let score = 0;
let timeLeft = GAME_TIME;
let timerInterval = null;
let playerName = "";

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


function createValidDeck() {
    let deck;
    let isValid = false;
    const rows = 4;
    const cols = 4;

    while (!isValid) {
        deck = shuffle([...imageNames, ...imageNames]);
        isValid = true;

        let grid = [];
        for (let i = 0; i < rows; i++) {
            grid.push(deck.slice(i * cols, (i + 1) * cols));
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // الفحص أفقي (يمين)
                if (c < cols - 1 && grid[r][c] === grid[r][c + 1]) {
                    isValid = false;
                }
                // الفحص عمودي (أسفل)
                if (r < rows - 1 && grid[r][c] === grid[r + 1][c]) {
                    isValid = false;
                }
            }
        }
    }
    return deck;
}

function startGame() {
    playerName = playerInput.value.trim() || "لاعبنا";
    displayPlayer.textContent = playerName;
    score = 0;
    matchedPairs = 0;
    timeLeft = GAME_TIME;

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    timerElement.style.color = "";

    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    gameModal.classList.remove("show");

    createBoard();
}

function createBoard() {
    clearInterval(timerInterval);

    
    const deck = createValidDeck();
    gameBoard.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = true; 

    deck.forEach((imageName, index) => {
        const card = document.createElement("div");
        card.className = "card flipped"; 
        card.dataset.image = imageName;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <img src="img/${imageName}" alt="صورة سعودية">
                </div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
    });

    
    setTimeout(() => {
        const allCards = document.querySelectorAll(".card");
        allCards.forEach(card => card.classList.remove("flipped"));
        lockBoard = false;
        startTimer();
    }, 5000);
}

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    if (isMatch) {
        matchedCards();
    } else {
        unflipCards();
    }
}

function matchedCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    score += 10;
    scoreElement.textContent = score;
    resetTurn();

    if (matchedPairs === imageNames.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            showWinModal();
        }, 500);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
    }, 750);
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerElement.style.color = "#a33b2f";
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showLoseModal();
        }
    }, 1000);
}

function showWinModal() {
    modalIcon.textContent = "🏆";
    modalTitle.textContent = `كفو يا ${playerName}!`;
    modalMessage.textContent = "وهذا السعودي فوق فوق ";
    gameModal.classList.add("show");
    createConfetti();
}

function showLoseModal() {
    lockBoard = true;
    modalIcon.textContent = "⏳";
    modalTitle.textContent = "انتهى الوقت";
    modalMessage.textContent = " لكن همتنا ما تنتهي، حاول مرة آخرى!";
    gameModal.classList.add("show");
}

function restartGame() {
    gameModal.classList.remove("show");
    clearInterval(timerInterval);
    score = 0;
    matchedPairs = 0;
    timeLeft = GAME_TIME;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    timerElement.style.color = "";
    createBoard();
}

function createConfetti() {
    const oldConfetti = document.getElementById("confetti");
    if (oldConfetti) oldConfetti.remove();

    const container = document.createElement("div");
    container.id = "confetti";
    document.body.appendChild(container);

    const colors = ["#075b43", "#d7aa55", "#8b6aa8", "#ffffff"];

    for (let i = 0; i < 90; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty("--x", (Math.random() * 250 - 125) + "px");
        piece.style.animationDuration = (2.2 + Math.random() * 2) + "s";
        piece.style.animationDelay = (Math.random() * .8) + "s";
        container.appendChild(piece);
    }

    setTimeout(() => { container.remove(); }, 5000);
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
modalRestart.addEventListener("click", restartGame);

playerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        startGame();
    }
});