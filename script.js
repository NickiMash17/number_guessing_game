// Initialize variables
let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

// DOM elements
const guessInput = document.getElementById("guess-input");
const submitGuessButton = document.getElementById("submit-guess");
const resetButton = document.getElementById("reset-game");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");

// Event listener for submitting a guess
submitGuessButton.addEventListener("click", () => {
  const userGuess = parseInt(guessInput.value);
  if (!userGuess || userGuess < 1 || userGuess > 100) {
    message.textContent = "Please enter a number between 1 and 100.";
    message.classList.remove("correct", "too-high", "too-low");
    message.classList.add("too-high"); // Just use a generic class for invalid inputs
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (userGuess === targetNumber) {
    message.textContent = "Congratulations! You guessed the correct number!";
    message.classList.remove("too-high", "too-low");
    message.classList.add("correct");
  } else if (userGuess > targetNumber) {
    message.textContent = "Your guess is too high. Try again!";
    message.classList.remove("correct", "too-low");
    message.classList.add("too-high");
  } else {
    message.textContent = "Your guess is too low. Try again!";
    message.classList.remove("correct", "too-high");
    message.classList.add("too-low");
  }

  guessInput.value = ""; // Clear the input after submitting
  guessInput.focus();
});

// Event listener for resetting the game
resetButton.addEventListener("click", () => {
  targetNumber = Math.floor(Math.random() * 100) + 1; // Reset the target number
  attempts = 0;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  message.textContent = "";
  message.classList.remove("correct", "too-high", "too-low");
  guessInput.value = "";
  guessInput.focus();
});

// Toggle dark mode functionality
const toggleButton = document.getElementById("toggle-mode");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleButton.textContent = document.body.classList.contains("dark-mode")
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
});
