/**
 * ui-manager.js - פונקציות עזר משותפות לממשק המשתמש
 */

export const renderHighScoresTable = (tbodyElement) => {
    if (!tbodyElement) return;

    // ניקוי הטבלה
    while (tbodyElement.firstChild) {
        tbodyElement.removeChild(tbodyElement.firstChild);
    }

    // שליפת נתונים
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];

    // בניית השורות
    scores.forEach(s => {
        const row = document.createElement('tr');
        
        const cells = [
            s.name,
            `${s.time} ש'`,
            (s.level === 'hard' ? 'זוגי' : 'רגיל'),
            s.tries
        ];

        cells.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });

        tbodyElement.appendChild(row);
    });
};

export const setupModal = (modalId, openBtnId, closeBtnIds) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeModal = () => modal.style.display = 'none';

    // חיבור כפתורי סגירה (מערך של מזהים)
    closeBtnIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', closeModal);
    });

    // פתיחה אם קיים כפתור פתיחה
    const openBtn = document.getElementById(openBtnId);
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    // סגירה בלחיצה על הרקע
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    return { open: () => modal.style.display = 'flex', close: closeModal };
};