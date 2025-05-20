function setDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      numPairs = 3;
      $("#game_grid").css({ width: "600px", height: "400px" });
      setCardWidth("33.3%");
      break;
    case "medium":
      numPairs = 6;
      $("#game_grid").css({ width: "800px", height: "600px" });
      setCardWidth("25%");
      break;
    case "hard":
      numPairs = 10;
      $("#game_grid").css({ width: "1000px", height: "800px" });
      setCardWidth("20%");
      break;
  }
  clearInterval(timerInterval);
  buildGameBoard();
}

function setCardWidth(percent) {
  const style = document.createElement("style");
  style.innerHTML = `.card { width: ${percent} !important; }`;
  document.head.appendChild(style);
}

$(document).ready(() => {
  $("input[name='difficulty']").on("change", function () {
    setDifficulty(this.value);
  });

  setDifficulty($("input[name='difficulty']:checked").val());
});
