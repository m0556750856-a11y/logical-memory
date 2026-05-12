export const saveScore = (name, time, level,tries) => {
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    scores.push({ name, time, level,tries ,date: new Date().toLocaleDateString() });
    scores.sort((a, b) => a.time - b.time);//מיון
    localStorage.setItem('highScores', JSON.stringify(scores));
};