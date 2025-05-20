const TOTAL_POKEMON = 1025;

async function fetchRandomPokemon() {
  const numPairs = 3;

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
}

function run(firstCard, secondCard) {
  if (cardsMatch(firstCard, secondCard)) {
    console.log("match");
    firstCard.off("click");
    secondCard.off("click");
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

$(document).ready(buildGameBoard);
