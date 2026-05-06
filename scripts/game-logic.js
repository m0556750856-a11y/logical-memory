//modal----------


const gameState=
{
    expected: 0,   
    timer: 0,
    tries: 0,
  level: new URLSearchParams(window.location.search).get('level') || 'easy',
   playerName: localStorage.getItem('playerName') || 'שחקן'

}
//1--------------------------------
const initGame = () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
 if(gameState.level==='easy' ){
    numbers=numbers.filter(n=> n % 2 === 0);
    gameState.expected=2;
}
else
    gameState.expected=1;

//מערבבת
numbers.sort(() => Math.random - 0.5);
//אני צריכה להשים פונקציה שתיצור את הקלפים
renderBoard(numbers);
//להתחיל את ספירת הזמן
startTimer();


} 
//2-----------------------------------------
//פונקציה שיוצרת את הקלפים
const renderBoard = (numbers) => {
const board= document.querySelector(game-board);
if (!board) return;

 // ניקוי הלוח בצורה בטוחה
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
}
//3-----------------------------------------------
const startTimer = () => {
    gameState.interval = setInterval(() => {
        gameState.timer++;
        const timerDisplay = document.querySelector('#timer');
        if (timerDisplay) timerDisplay.textContent = gameState.timer;
    }, 1000);
};

//4------------------------------------------------------------------
const handleWin = () => {
    // יצירת אובייקט שמע חדש עם הנתיב לקובץ
    const winAudio = new Audio('../assets/מנצח.mp3'); 
    
    // הפעלת המנגינה
    winAudio.play();

    // שאר לוגיקת הניצחון שלך
    clearInterval(gameState.interval);
    saveScore(gameState.playerName, gameState.timer, gameState.level,gameState.tries);
    showScoresModal();
};
//5----------------------------------------------------------------------
const clicksRight = (cardEl, val) => {
    const inner = cardEl.querySelector('.card-inner');
    if (inner.classList.contains('is-flipped')) return;

    inner.classList.add('is-flipped');

    if (val === gameState.expected) {
        gameState.expected += (gameState.level === 'easy' ? 1 : 2);
        if (gameState.expected > 15) handleWin();
    } else {
        gameState.tries++;
        const triesDisplay = document.querySelector('#tries');
        if (triesDisplay) triesDisplay.textContent = gameState.tries;
        
        // טעות - הפיכה חזרה לאחר השהייה
        setTimeout(() => {
            document.querySelectorAll('.is-flipped').forEach(c => c.classList.remove('is-flipped'));
            gameState.expected = (gameState.level === 'easy' ? 1 : 2);
        }, 800);
    }
};

//הדפדפן יסתיים ואז הפונ יתחילו ועישיתi -זה לא טוב nitGame(); 

document.addEventListener('DOMContentLoaded', initGame);







const clicksRight = (cardEl, val) => {
    const inner = cardEl.querySelector('.card-inner');
    if (inner.classList.contains('is-flipped')) return;

    inner.classList.add('is-flipped');

    if (val === gameState.expected) {
        gameState.expected += (gameState.level === 'easy' ? 1 : 2);
        if (gameState.expected > 15) handleWin();
    } else {
        gameState.tries++;
        const triesDisplay = document.querySelector('#tries');
        if (triesDisplay) triesDisplay.textContent = gameState.tries;
        
        // טעות - הפיכה חזרה לאחר השהייה
        setTimeout(() => {
            document.querySelectorAll('.is-flipped').forEach(c => c.classList.remove('is-flipped'));
            gameState.expected = (gameState.level === 'easy' ? 1 : 2);
        }, 800);
    }
};







const showScoresModal = () => {
    const modal = document.getElementById('score-modal');
    const tbody = document.getElementById('scores-body');
    if (!tbody) return;

    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // ניקוי הטבלה בלי innerhtml=' ' שינתי
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    scores.forEach(s => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = s.name;
        
      const timeCell = document.createElement('td');
timeCell.textContent = `${s.time} ש'`; 

const levelCell = document.createElement('td');
levelCell.textContent = (s.level === 'easy' ? 'רגיל' : 'זוגי');

const triesCell = document.createElement('td');
triesCell.textContent = s.tries; 


row.appendChild(nameCell);
row.appendChild(timeCell);
row.appendChild(levelCell);
row.appendChild(triesCell); 
        tbody.appendChild(row);
    });

   
};
//פונקצית ניצחון
//