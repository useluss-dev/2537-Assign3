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
  } else {
    console.log("no match");

    // Flip cards after 1 second
    setTimeout(() => {
      flip(firstCard);
      flip(secondCard);
    }, 1000);
  }
}

function isFlipped(card) {
  return card.hasClass("flip");
}

function flip(card) {
  card.toggleClass("flip");
}

function cardsMatch(firstCard, secondCard) {
  const firstCardImg = firstCard.find(".front_face")[0];
  const secondCardImg = secondCard.find(".front_face")[0];

  return (
    firstCardImg.id !== secondCardImg.id &&
    firstCardImg.src === secondCardImg.src
  );
}

$(document).ready(setup);
