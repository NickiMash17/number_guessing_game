document.addEventListener('DOMContentLoaded', function() {
  // Game elements
  const minSpan = document.getElementById('min');
  const maxSpan = document.getElementById('max');
  const guessInput = document.getElementById('guess-input');
  const submitButton = document.getElementById('submit-guess');
  const resetButton = document.getElementById('reset-game');
  const messageElement = document.getElementById('message');
  const attemptsElement = document.getElementById('attempts');
  const toggleModeButton = document.getElementById('toggle-mode');
  
  // Sound elements
  const correctSound = document.getElementById('correct-sound');
  const wrongSound = document.getElementById('wrong-sound');
  const gameOverSound = document.getElementById('game-over-sound');
  
  // Game state
  let gameState = {
    secretNumber: 0,
    minNumber: 1,
    maxNumber: 100,
    attempts: 0,
    maxAttempts: 10,
    gameOver: false,
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: Infinity,
    soundEnabled: true
  };
  
  // Add DOM elements for new features
  function setupEnhancedUI() {
    // Create difficulty selector
    const container = document.querySelector('.container');
    const submitButtonElement = document.getElementById('submit-guess');
    
    // Add difficulty slider before submit button
    const difficultyControls = document.createElement('div');
    difficultyControls.innerHTML = `
      <p>Difficulty Level:</p>
      <input type="range" id="difficulty-slider" min="1" max="3" value="2" class="slider"
        aria-label="Difficulty level slider" aria-valuemin="1" aria-valuemax="3" aria-valuenow="2">
      <div id="difficulty-label" class="difficulty-label">Medium</div>
    `;
    container.insertBefore(difficultyControls, submitButtonElement);
    
    // Add progress bar for attempts
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div id="attempts-progress" class="progress-bar" style="width: 0%" role="progressbar" aria-label="Attempts used" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
    container.insertBefore(progressContainer, document.getElementById('attempts'));
    
    // Add game stats at the bottom
    const gameStats = document.createElement('div');
    gameStats.className = 'game-stats';
    gameStats.innerHTML = `
      <div class="stat-item">
        <div id="games-played" class="stat-value" aria-label="Games played">0</div>
        <div class="stat-label">Games</div>
      </div>
      <div class="stat-item">
        <div id="games-won" class="stat-value" aria-label="Games won">0</div>
        <div class="stat-label">Wins</div>
      </div>
      <div class="stat-item">
        <div id="best-score" class="stat-value" aria-label="Best score">-</div>
        <div class="stat-label">Best</div>
      </div>
    `;
    container.insertBefore(gameStats, document.querySelector('.attribution'));
    
    // Add sound toggle button
    const soundToggle = document.createElement('button');
    soundToggle.id = 'toggle-sound';
    soundToggle.innerText = 'Sound: ON';
    soundToggle.setAttribute('aria-label', 'Toggle sound effects');
    soundToggle.style.marginTop = '15px';
    container.insertBefore(soundToggle, document.querySelector('.attribution'));
    
    // Setup event listeners for new elements
    document.getElementById('difficulty-slider').addEventListener('input', updateDifficulty);
    document.getElementById('toggle-sound').addEventListener('click', toggleSound);
  }
  
  // Toggle sound on/off
  function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const soundButton = document.getElementById('toggle-sound');
    soundButton.innerText = gameState.soundEnabled ? 'Sound: ON' : 'Sound: OFF';
    soundButton.setAttribute('aria-pressed', gameState.soundEnabled);
  }
  
  // Play sound if enabled
  function playSound(soundElement) {
    if (gameState.soundEnabled) {
      soundElement.currentTime = 0;
      soundElement.play();
    }
  }
  
  // Update difficulty based on slider
  function updateDifficulty() {
    const difficultySlider = document.getElementById('difficulty-slider');
    const difficultyLabel = document.getElementById('difficulty-label');
    const difficulty = parseInt(difficultySlider.value);
    
    switch(difficulty) {
      case 1:
        gameState.maxNumber = 50;
        gameState.maxAttempts = 10;
        difficultyLabel.textContent = "Easy";
        break;
      case 2:
        gameState.maxNumber = 100;
        gameState.maxAttempts = 10;
        difficultyLabel.textContent = "Medium";
        break;
      case 3:
        gameState.maxNumber = 200;
        gameState.maxAttempts = 8;
        difficultyLabel.textContent = "Hard";
        break;
    }
    
    // Update ARIA values
    difficultySlider.setAttribute('aria-valuenow', difficulty);
    
    // Update display
    maxSpan.textContent = gameState.maxNumber;
    
    // Reset game with new difficulty
    initializeGame();
  }
  
  // Generate random number within range
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Initialize or reset the game
  function initializeGame() {
    gameState.secretNumber = generateRandomNumber(gameState.minNumber, gameState.maxNumber);
    gameState.attempts = 0;
    gameState.gameOver = false;
    
    // Update UI
    guessInput.value = '';
    messageElement.textContent = '';
    messageElement.className = '';
    attemptsElement.textContent = `Attempts: ${gameState.attempts} / ${gameState.maxAttempts}`;
    
    // Update ranges in UI
    minSpan.textContent = gameState.minNumber;
    maxSpan.textContent = gameState.maxNumber;
    
    // Enable input and submit
    guessInput.disabled = false;
    submitButton.disabled = false;
    
    // Reset progress bar
    updateProgressBar();
    
    // Focus on input
    guessInput.focus();
    
    // Update stats display
    updateStatsDisplay();
    
    // Announce game reset for screen readers
    announceToScreenReader(`Game reset. Guess a number between ${gameState.minNumber} and ${gameState.maxNumber}`);
  }
  
  // Helper function for screen reader announcements
  function announceToScreenReader(message) {
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.classList.add('sr-only');
    document.body.appendChild(ariaLive);
    
    setTimeout(() => {
      ariaLive.textContent = message;
      setTimeout(() => {
        document.body.removeChild(ariaLive);
      }, 1000);
    }, 100);
  }
  
  // Update game stats display
  function updateStatsDisplay() {
    document.getElementById('games-played').textContent = gameState.gamesPlayed;
    document.getElementById('games-won').textContent = gameState.gamesWon;
    document.getElementById('best-score').textContent = 
      gameState.bestScore < Infinity ? gameState.bestScore : '-';
  }
  
  // Update progress bar for attempts
  function updateProgressBar() {
    const progressBar = document.getElementById('attempts-progress');
    const progressPercentage = (gameState.attempts / gameState.maxAttempts) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
    
    // Change color based on attempts used
    if (progressPercentage < 40) {
      progressBar.style.backgroundColor = '#3a7bd5'; // Blue
    } else if (progressPercentage < 70) {
      progressBar.style.backgroundColor = '#f39c12'; // Orange
    } else {
      progressBar.style.backgroundColor = '#e74c3c'; // Red
    }
  }
  
  // Process the player's guess
  function processGuess() {
    if (gameState.gameOver) return;
    
    // Get and validate guess
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < gameState.minNumber || guess > gameState.maxNumber) {
      showMessage(`Please enter a valid number between ${gameState.minNumber} and ${gameState.maxNumber}.`, 'too-high');
      guessInput.value = '';
      guessInput.focus();
      return;
    }
    
    // Increment attempts
    gameState.attempts++;
    
    // Check guess
    if (guess === gameState.secretNumber) {
      handleCorrectGuess();
    } else if (guess > gameState.secretNumber) {
      showMessage('Too high! Try a lower number.', 'too-high');
      playSound(wrongSound);
    } else {
      showMessage('Too low! Try a higher number.', 'too-low');
      playSound(wrongSound);
    }
    
    // Update attempts display and progress
    attemptsElement.textContent = `Attempts: ${gameState.attempts} / ${gameState.maxAttempts}`;
    updateProgressBar();
    
    // Check for max attempts reached
    if (gameState.attempts >= gameState.maxAttempts && !gameState.gameOver) {
      handleGameOver();
    }
    
    // Clear input and focus
    guessInput.value = '';
    guessInput.focus();
  }
  
  // Handle correct guess
  function handleCorrectGuess() {
    showMessage(`Congratulations! You guessed the number ${gameState.secretNumber} correctly!`, 'correct');
    
    // Play victory sound
    playSound(correctSound);
    
    // Play victory animation
    celebrateWin();
    
    // Update game stats
    gameState.gamesPlayed++;
    gameState.gamesWon++;
    if (gameState.attempts < gameState.bestScore) {
      gameState.bestScore = gameState.attempts;
    }
    
    gameState.gameOver = true;
    disableGameInputs();
    updateStatsDisplay();
    
    // Announce win for screen readers
    announceToScreenReader(`Congratulations! You guessed the number ${gameState.secretNumber} correctly in ${gameState.attempts} attempts!`);
  }
  
  // Handle game over (max attempts reached)
  function handleGameOver() {
    showMessage(`Game over! The number was ${gameState.secretNumber}. Try again!`, 'too-high');
    
    // Play game over sound
    playSound(gameOverSound);
    
    gameState.gamesPlayed++;
    gameState.gameOver = true;
    disableGameInputs();
    updateStatsDisplay();
    
    // Announce game over for screen readers
    announceToScreenReader(`Game over! The number was ${gameState.secretNumber}. Try again!`);
  }
  
  // Disable inputs when game is over
  function disableGameInputs() {
    guessInput.disabled = true;
    submitButton.disabled = true;
  }
  
  // Display message with appropriate styling
  function showMessage(text, className) {
    messageElement.textContent = text;
    messageElement.className = `feedback ${className}`;
  }
  
  // Celebration animation for winning
  function celebrateWin() {
    // Add victory animation to container
    const container = document.querySelector('.container');
    container.classList.add('victory-animation');
    
    // Create confetti effect
    createConfetti();
    
    // Remove animation class after it completes
    setTimeout(() => {
      container.classList.remove('victory-animation');
    }, 3000);
  }
  
  // Create confetti effect
  function createConfetti() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
    const container = document.querySelector('.container');
    
    // Create 50 confetti elements
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.opacity = Math.random();
      confetti.style.animation = `confettiDrop ${Math.random() * 2 + 1}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);
    }
  }
  
  // Toggle dark/light mode
  function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleModeButton.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    toggleModeButton.setAttribute('aria-pressed', isDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
    
    // Announce mode change for screen readers
    announceToScreenReader(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`);
  }
  
  // Check for saved dark mode preference
  function loadSavedMode() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
      toggleModeButton.textContent = 'Switch to Light Mode';
      toggleModeButton.setAttribute('aria-pressed', 'true');
    } else {
      toggleModeButton.setAttribute('aria-pressed', 'false');
    }
  }
  
  // Add keyboard support
  function handleKeyPress(e) {
    if (e.key === 'Enter' && document.activeElement === guessInput) {
      processGuess();
    }
  }
  
  // Event listeners
  function setupEventListeners() {
    submitButton.addEventListener('click', processGuess);
    resetButton.addEventListener('click', initializeGame);
    toggleModeButton.addEventListener('click', toggleMode);
    document.addEventListener('keypress', handleKeyPress);
    
    // Add swipe gesture for mobile to toggle dark/light mode
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    });
    
    function handleSwipeGesture() {
      if (touchEndX - touchStartX > 100) {
        // Right swipe - toggle mode
        toggleMode();
      }
    }
  }
  
  // Initialize game
  function startGame() {
    setupEnhancedUI();
    loadSavedMode();
    setupEventListeners();
    initializeGame();
  }
  
  // Add screen reader styles
  function addAccessibilityStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add accessibility styles
  addAccessibilityStyles();
  
  // Start the game when document is loaded
  startGame();
});