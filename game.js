const TOTAL_POKEMON = 1025;
const MAX_TIME = 60; // seconds

let numPairs = 3;
let matchedPairs = 0;
let timer = 0;
let timerInterval;

async function fetchRandomPokemon() {
  const ids = new Set();
  while (ids.size < numPairs) {
    ids.add(Math.floor(Math.random() * TOTAL_POKEMON) + 1);
  }

  const promises = [...ids].map((id) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
  );

  return Promise.all(promises);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCard(pokemon) {
  return `
    <div class="card" data-id="${pokemon.id}">
      <img class="front_face" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
      <img class="back_face" src="back.webp" alt="pokeball"> 
    </div>
  `;
}

async function buildGameBoard() {
  const pokemon = await fetchRandomPokemon();

  // Duplicate for pairs
  const paired = [...pokemon, ...pokemon];

  shuffle(paired);

  const html = paired.map((pokemon) => createCard(pokemon)).join("");
  $("#game_grid").html(html);

  setup();
}

function startTimer() {
  timer = 0;
  $("#timer").text(`Time: ${timer}s`);

  timerInterval = setInterval(() => {
    timer++;
    $("#timer").text(`Time: ${timer}s`);

    if (timer >= MAX_TIME) {
      clearInterval(timerInterval);
      alert("Time's up! Restarting the game.");
      location.reload(); // reload the page to restart
    }
  }, 1000);
}

function setup() {
  let firstCard = undefined;
  let secondCard = undefined;
  let isProcessing = false;

  $(".card").on("click", function () {
    const card = $(this);

    // If the card is already flipped or processing is happening do nothing
    if (isProcessing || isFlipped(card)) return;

    // Flip the clicked card
    flip(card);

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      isProcessing = true;

      run(firstCard, secondCard);

      // Reset state after 1 second
      setTimeout(() => {
        firstCard = undefined;
        secondCard = undefined;
        isProcessing = false;
      }, 1000);
    }
  });

  startTimer();
}

function run(firstCard, secondCard) {
  if (cardsMatch(firstCard, secondCard)) {
    firstCard.off("click");
    secondCard.off("click");

    matchedPairs++;
    if (matchedPairs === numPairs) {
      setTimeout(() => {
        clearInterval(timerInterval);
        alert(`You won in ${timer} seconds!`);
      }, 1000);

      // Re-enable Start button for new game
      $("#startBtn").prop("disabled", false);
      $("#restartBtn").prop("disabled", true);
    }
    return;
  }
  console.log("no match");
  // Flip cards after 1 second
  setTimeout(() => {
    flip(firstCard);
    flip(secondCard);
  }, 1000);
}

function isFlipped(card) {
  return card.hasClass("flip");
}

function flip(card) {
  card.toggleClass("flip");
}

function cardsMatch(firstCard, secondCard) {
  return (
    firstCard.data("id") === secondCard.data("id") &&
    firstCard[0] !== secondCard[0]
  );
}
