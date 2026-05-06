const gameState=
{
    expected: 0,   
    timer: 0,
    tries: 0,
  level: new URLSearchParams(window.location.search).get('level') || 'easy'

}

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
//ןלהתחיל את ספירת הזמן


} 
