
/**
 * @file main.js
 * @description ניהול אירועים מרכזי, ניווט וטבלת שיאים.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ניהול טופס כניסה ושם שחקן ---
    const loginForm = document.querySelector('#login-form');
    const welcomeMsg = document.querySelector('#welcome-msg');
    const playerNameDisplay = document.querySelector('#player-name-display');

    // הצגת שם המשתמש (אם אנחנו בדף שבו האלמנט קיים)
    const savedName = localStorage.getItem('playerName') || 'אורח';
    if (welcomeMsg) welcomeMsg.textContent = `שלום, ${savedName}`;
    if (playerNameDisplay) playerNameDisplay.textContent = savedName;

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.querySelector('#username').value;
            localStorage.setItem('playerName', nameInput);
            window.location.href = 'pages/levels.html';
        });
    }

    // --- 2. בחירת רמה ומעבר למשחק ---
    const levelBtns = document.querySelectorAll('.lvl-btn');
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            window.location.href = `game.html?level=${level}`;
        });
    });

    // --- 3. ניהול מודאלים (הוראות ושיאים) באופן גנרי ---
    
    /**
     * פונקציה לניהול פתיחה וסגירה של מודאל
     * @param {string} modalId מזהה המודאל
     * @param {string} openBtnId מזהה כפתור הפתיחה
     * @param {Array} closeSelectors רשימת מזהים/קלאסים לסגירה
     */
    const initModal = (modalId, openBtnId, closeSelectors) => {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        if (!modal) return; // אם המודאל לא קיים בדף הזה, אל תמשיך

        const closeModal = () => modal.style.display = 'none';

        // כפתור פתיחה
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                // אם זה מודאל שיאים, נטען את הנתונים לפני הפתיחה
                if (modalId === 'score-modal') renderScoresInTable();
                modal.style.display = 'flex';
            });
        }

        // כפתורי סגירה
        closeSelectors.forEach(selector => {
            const btn = document.getElementById(selector) || document.querySelector(selector);
            if (btn) btn.addEventListener('click', closeModal);
        });

        // סגירה בלחיצה על הרקע
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    };

    // הפעלת המודאלים
    initModal('instructions-modal', 'open-instructions', ['close-instructions', 'close-btn-bottom']);
    initModal('score-modal', 'show-scores-btn', ['close-modal', 'hide-modal-btn']);

    // --- 4. פונקציית עזר לרינדור טבלת שיאים (ללא innerHTML) ---
    function renderScoresInTable() {
        const scoresBody = document.getElementById('scores-body');
        if (!scoresBody) return;

        // ניקוי הטבלה
        while (scoresBody.firstChild) {
            scoresBody.removeChild(scoresBody.firstChild);
        }

        const scores = JSON.parse(localStorage.getItem('highScores')) || [];

        scores.forEach(s => {
            const row = document.createElement('tr');

            // יצירת התאים
            const data = [
                s.name,
                `${s.time} ש'`,
                (s.level === 'hard' ? 'זוגי' : 'רגיל'),
                s.tries
            ];

            data.forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });

            scoresBody.appendChild(row);
        });
    }
});