import { saveScore } from './storage-manager.js';

// הערה: אם תרצי להשתמש ב-renderScoresInTable מ-main.js, תצטרכי לעשות לה export שם ו-import כאן.
// כרגע נשתמש בפתרון פשוט יותר כדי שהמשחק יעבוד מיד.

const gameState = {
    expected: 0,
    timer: 0,
    tries: 0,
    interval: null,
    level: new URLSearchParams(window.location.search).get('level') || 'easy',
    playerName: localStorage.getItem('playerName') || 'שחקן'
};

const initGame = () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    if (gameState.level === 'hard') {
        numbers = numbers.filter(n => n % 2 === 0);
        gameState.expected = 2;
    } else {
        gameState.expected = 1;
    }

    numbers.sort(() => Math.random() - 0.5); 
    
    renderBoard(numbers);
    startTimer();
};

const renderBoard = (numbers) => {
    const board = document.querySelector('#game-board');
    if (!board) return;
    
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    numbers.forEach(num => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const frontImg = document.createElement('img');
        frontImg.src = `../images/${num}.png`;
        frontImg.alt = `מספר ${num}`;
        cardFront.appendChild(frontImg);

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        const backImg = document.createElement('img');
        backImg.src = '../images/back.png';
        backImg.alt = 'גב קלף';
        cardBack.appendChild(backImg);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardContainer.appendChild(cardInner);

        cardContainer.addEventListener('click', () => clicksRight(cardContainer, num));
        board.appendChild(cardContainer);
    });
};

const clicksRight = (cardEl, val) => {
    const inner = cardEl.querySelector('.card-inner');
    if (inner.classList.contains('is-flipped')) return;

    inner.classList.add('is-flipped');

    if (val === gameState.expected) {
        gameState.expected += (gameState.level === 'easy' ? 1 : 2);
        // בדיקה אם ניצחנו (15 ברגיל, 14 בזוגי)
        const winCondition = gameState.level === 'easy' ? 15 : 14;
        if (gameState.expected > winCondition) handleWin();
    } else {
        gameState.tries++;
        const triesDisplay = document.querySelector('#tries');
        if (triesDisplay) triesDisplay.textContent = gameState.tries;
        
        setTimeout(() => {
            document.querySelectorAll('.is-flipped').forEach(c => c.classList.remove('is-flipped'));
            gameState.expected = (gameState.level === 'easy' ? 1 : 2);
        }, 800);
    }
};

const startTimer = () => {
    gameState.interval = setInterval(() => {
        gameState.timer++;
        const timerDisplay = document.querySelector('#timer');
        if (timerDisplay) timerDisplay.textContent = gameState.timer;
    }, 1000);
};

const handleWin = () => {
    clearInterval(gameState.interval);
    
    const winAudio = new Audio('../images/מנצח.mp3'); 
    winAudio.play();

    saveScore(gameState.playerName, gameState.timer, gameState.level, gameState.tries);

    // קריאה לפונקציית הצגת השיאים - שימוש בגרסה המקומית כדי למנוע שגיאות ייבוא
    showScoresAfterWin();
};

const showScoresAfterWin = () => {
    const modal = document.getElementById('score-modal');
    const tbody = document.getElementById('scores-body');
    if (!tbody || !modal) return;

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    scores.forEach(s => {
        const row = document.createElement('tr');
        const data = [s.name, `${s.time} ש'`, (s.level === 'hard' ? 'זוגי' : 'רגיל'), s.tries];
        
        data.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    modal.style.display = 'flex';
};

document.addEventListener('DOMContentLoaded', initGame);