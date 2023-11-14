const gameContainer = document.getElementById("game");
let firstCard, secondCard;//variables to store two clicked sets of cards
let haveClickedFirstCard = false; //trakcs if fist card has been clicked
let lockGame = false; //tracks when the game is locked to prevent card flipping before cards are matched or flipped back
let gameStart = false;
let scoreCounter = 0;//counts the score or number turn card flips done
let pairCounter = 0; //counts a matching pair of cards
let bestScore = localStorage.getItem('highscore');//best score stored in local storage

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

const numCard = COLORS.length; //Number of total cards in game
const totalMatchedPairs = numCard/2; //total number of matched pairs in game

if(bestScore){//Display the best score from local storage
  document.querySelector('#bestScore').innerText = 'Best Score: ' + bestScore;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    //add click event listner for start button
    const start_button = document.querySelector('#start');
    start_button.addEventListener('click', function(event){
      if(event.target.id === 'start'){
        document.querySelector('#game').className = 'on'; //if start button clicked on display cards
        gameStart = true;//enable event listener for clicking cards
      }
    })

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);     
  }
}

// TO DO: Implement this function! /////////////////////////////////////////////////////////////////////////
function handleCardClick(event) {
  if(gameStart){
    if(event.target === firstCard) return; //if clicked on the same card then escape function
    if(lockGame === true) return; //this prevents user from turning more than two cards before being matched or flipped back
  
    event.target.style.backgroundColor = event.target.className;//change background color to classname color
  
    if(!haveClickedFirstCard){ //check if first card has already been clicked on
      haveClickedFirstCard = true;
      firstCard = event.target;
      scoreCounter++;
      document.querySelector('#score').innerText = 'Score: ' + scoreCounter;//update current score
      return; //escape function after storing first card clicked on to variable
    } else{ 
      secondCard = event.target;
      lockGame = true; 
      scoreCounter++;
      document.querySelector('#score').innerText = 'Score: ' + scoreCounter;
    }
  
    if(firstCard.className === secondCard.className){ //matched cards --> disable click event listener to prevent further flipping of matched cards
      firstCard.removeEventListener('click', handleCardClick);
      secondCard.removeEventListener('click', handleCardClick);
      pairCounter++;
      if(pairCounter === totalMatchedPairs){//checks if game is over
        document.querySelector('#restart').className = 'displayOn';//dsiplay the restart button
        document.querySelector('#start').className = 'displayOff';//hide the start button
        if(scoreCounter < bestScore){// check if current score beats the current best score
          localStorage.setItem('highscore', scoreCounter);
        }
      }
      resetCards();
    } else{ //unmatched card --> set card color to white. unmatched cards will remian visible for 1s
      setTimeout(function(){
        firstCard.style.backgroundColor = "white";
        secondCard.style.backgroundColor = "white";
        resetCards();
      }, 1000);
    }
  
  
    function resetCards(){ //clear card variables and reset lockgame and haveClickedFirstCard variables
      haveClickedFirstCard = false;
      firstCard = null;
      secondCard = null;
      lockGame = false;
    }
  } 
}

// when the DOM loads
createDivsForColors(shuffledColors);
