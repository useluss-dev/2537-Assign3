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

  // Set stats
  $("#clicks").text("0");
  $("#pairsLeft").text(numPairs);
  $("#pairsMatched").text("0");
  $("#totalPairs").text(numPairs);

  matchedPairs = 0;
  clearInterval(timerInterval);
  timer = 0;
  $("#timer").text("Time: 0s");
  $("#game_grid").empty();
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

  $("#startBtn").on("click", () => {
    setDifficulty($("input[name='difficulty']:checked").val());
    buildGameBoard();
    $("#startBtn").prop("disabled", true);
    $("#restartBtn").prop("disabled", false);
    $("#powerUpBtn").prop("disabled", false);
    $("#timer").show();
  });

  $("#restartBtn").on("click", () => {
    // Reset game state and clear board
    clearInterval(timerInterval);
    timer = 0;
    matchedPairs = 0;
    $("#game_grid").empty();

    // Allow user to press Start again
    $("#startBtn").prop("disabled", false);
    $("#restartBtn").prop("disabled", true);
    $("#powerUpBtn").prop("disabled", true);

    // Add reset for stats
    clickCount = 0;
    $("#clicks").text("0");
    $("#pairsMatched").text("0");
    $("#pairsLeft").text(numPairs);
  });

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    $("#darkModeBtn").text("Light Mode");
  }

  // Dark mode toggle handler
  $("#darkModeBtn").on("click", function () {
    const isDark = $("html").attr("data-theme") === "dark";
    if (isDark) {
      $("html").removeAttr("data-theme");
      localStorage.setItem("theme", "light");
      $(this).text("Dark Mode");
    } else {
      $("html").attr("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      $(this).text("Light Mode");
    }
  });

  $("#powerUpBtn").on("click", activatePowerUp);
});
