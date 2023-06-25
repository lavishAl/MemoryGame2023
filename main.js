const CARDS = [
    {
      id: 1,
      name: 'Joker',
      img: 'https://toppng.com/uploads/preview/joker-guason-freetoedit-joker-cartoon-gif-11563303904rbkh8jknfs.png'
    },
    {
      id: 2,
      name: 'Harley Quinn',
      img: 'https://p7.hiclipart.com/preview/586/105/229/harley-quinn-joker-batman-starfire-the-new-52-harley-quinn.jpg'
    },
    {
      id: 3,
      name: 'Bane',
      img: 'https://i.pinimg.com/736x/eb/cf/9c/ebcf9cb9d95878b46cde11646c544aaa--crane-batman-batman-dark-knight.jpg'
    },
    {
      id: 4,
      name: 'ClayFace',
      img: 'https://p7.hiclipart.com/preview/668/32/863/clayface-batman-roland-daggett-killer-croc-dc-animated-universe-nightwing.jpg'
    },
    {
      id: 5,
      name: 'Mr.Freeze',
      img: 'https://w7.pngwing.com/pngs/715/618/png-transparent-mr-freeze-batman-nora-fries-animated-series-villain-teen-titans-heroes-superhero-fictional-character.png'
    },
    {
      id: 6,
      name: 'Peguin',
      img: 'https://img.favpng.com/14/7/14/penguin-batman-comic-book-superhero-dc-animated-universe-png-favpng-10pQ3XNtcqx2kKnNu8whqbUNF.jpg'
    },
    {
      id: 7,
      name: 'Scarecrow',
      img: 'https://img1.pnghut.com/14/14/8/Muv3rV1KcJ/batman-the-animated-series-costume-design-mythical-creature-dark-knight-outerwear.jpg'
    },
    {
      id: 8,
      name: "Ra's al ghul",
      img: 'https://img.favpng.com/25/18/23/ra-s-al-ghul-batman-talia-al-ghul-poison-ivy-joker-png-favpng-JXsVb48AJcMR5wkqDyEzgAnNh.jpg'
    },
    {
      id: 9,
      name: 'Two-Face',
      img:  'https://w7.pngwing.com/pngs/845/930/png-transparent-two-face-batman-joker-animated-series-cartoon-the-villain-television-white-heroes.png'
    },
    {
      id: 10,
      name: 'Mad Hatter',
      img:
        'https://i.pinimg.com/originals/be/8d/bc/be8dbc69a19abbffeb26f4acf5313e7c.png'
    }
   
  ];

const available = document.querySelector('#available');
const cardContainer = document.querySelector('.card-container');
const modalTitle = document.querySelector('#modal-title');
const modal = document.querySelector('#modal');
let currentCards = [];
currentCards.push(...CARDS);
currentCards.push(...CARDS);
let gamePause = false;
let counter = CARDS.length + 99;
let gameLost = false;
let alfred;

// Event listener to play the background audio when the window loads
window.addEventListener('load', function() {
  alfred = new Audio('audio/alfred.mp3');
  playAudio();
});
 
function shuffle(array) {
  // Shuffles the elements of the array randomly using the sort() method with a random comparison function
  return array.sort(() => Math.random() - 0.5);
}

function playAudio() {
  const audio = new Audio('audio/batman.mp3');
  audio.play();
}

function win() {
  // Sets the gamePause flag to true, displays the 'You saved Gotham!' message in the modal, and opens the modal
  if (alfred.paused) {
    alfred.play();
  }
  gamePause = true;
  modalTitle.innerHTML = 'You saved Gotham!';
  modal.classList.add('modal--open');
}

function lose() {
// Sets the gameLost flag to true, displays the 'You lost Batsy' message in the modal, and opens the modal
  gameLost = true;
  modalTitle.innerHTML = 'You lost Batsy';
  modal.classList.add('modal--open');
  const joker = new Audio('audio/joker.mp3');
  joker.play();
}

function handleCardSelection(card) {
  // Adds the 'cardPicked' class to the selected card and sets the gamePause flag to false
  card.classList.add('cardPicked');
  gamePause = false;
}

function handleClick(e) {
  const { target } = e;
  //Checks if the game is paused, lost, or if the clicked card is already guessed or picked
  if (gamePause || gameLost || target.classList.contains('cardGuess') || target.classList.contains('cardPicked')) {
    return;
  }

  gamePause = true;
  const picked = cardContainer.querySelector('.cardPicked');

  if (picked) {
    handleCardMatch(picked, target);
  } else {
    handleCardSelection(target);
  }

  updateCounter();
  checkWinCondition();
}

function handleCardMatch(card1, card2) {
  const isMatch = card1.dataset.id === card2.dataset.id;

  if (isMatch) {
    card1.classList.add('cardGuess');
    card2.classList.add('cardGuess');
  } else {
    card1.classList.add('cardPicked');
    card2.classList.add('cardPicked');
  }

  setTimeout(() => {
    card1.classList.remove('cardPicked');
    card2.classList.remove('cardPicked');
    if (!isMatch) {
      card1.classList.remove('cardGuess');
      card2.classList.remove('cardGuess');
    }
    gamePause = false;

    checkWinCondition();
  }, isMatch ? 500 : 1500);
}

function updateCounter() {
  // Decreases the counter by 1 and updates the available.innerHTML with the new counter value
  counter -= 1;
  available.innerHTML = counter;
  // Checks if the counter reached 0 and calls the lose() function if true
  if (counter === 0) {
    lose();
  }
}

function checkWinCondition() {
  // Checks if the number of guessed cards is equal to the total number of cards and calls the win() function if true
  const isWin =
    cardContainer.querySelectorAll('.cardGuess').length ===
    currentCards.length;
  if (isWin) {
    win();
  }
}

function drawCards() {
  cardContainer.innerHTML = '';
  available.innerHTML = counter;

  for (const el of shuffle(currentCards)) {
    const card = createCardElement(el);
    card.addEventListener('click', handleClick);
    cardContainer.appendChild(card);
  }
  playAudio();
}

function createCardElement(cardData) {
  // Creates a new card element with the provided cardData
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-id', cardData.id);

  const front = createFrontElement(cardData);
  const back = createBackElement();

  card.appendChild(front);
  card.appendChild(back);

  return card;
}

function createFrontElement(cardData) {
  // Creates the front side of the card element with the provided cardData
  const front = document.createElement('div');
  front.className = 'frontCard';

  const frontImg = document.createElement('img');
  frontImg.className = 'frontImg';
  frontImg.src = cardData.img;
  frontImg.alt = cardData.name;

  const cardName = document.createElement('h4');
  cardName.className = 's';
  cardName.textContent = cardData.name;

  front.appendChild(frontImg);
  front.appendChild(cardName);

  return front;
}

function createBackElement() {
  // Creates the back side of the card element
  const back = document.createElement('div');
  back.className = 'backCard';

  const backImg = document.createElement('img');
  backImg.className = 'backImg';
  backImg.src = 'https://cdn.freebiesupply.com/logos/large/2x/batman-5-logo-png-transparent.png';
  backImg.alt = 'Thought';

  back.appendChild(backImg);

  return back;
}

document.querySelector('#play-again').addEventListener('click', function () {
  // Event listener for the 'Play Again' button in the modal
  modal.classList.remove('modal--open');
  gamePause = false;
  gameLost = false;
  counter = CARDS.length - 1;
  drawCards();
});

drawCards();














