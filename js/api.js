import {dropDown} from './dropDownMenu.js';

let questions = [];
let incorrectQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let acceptingAnswers = true;

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const categories = params.getAll('category');
  const amount = params.get('amount') || '5';
  const difficulty = params.get('difficulty') || '';
  return { categories, amount, difficulty };
}

function setInitialFormValues() {
  const { amount, difficulty } = getUrlParams();
  document.getElementById("amount").value = amount;
  document.getElementById("difficulty").value = difficulty;
}

setInitialFormValues();

async function startGame() {
  
  const { categories, amount, difficulty } = getUrlParams();
  let url = "";
  if (categories && categories.length > 0) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomIndex];
    url = `https://opentdb.com/api.php?amount=${amount}&category=${randomCategory}&type=multiple`;
    if (difficulty) url += `&difficulty=${difficulty}`;
  } else {
    url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (difficulty) url += `&difficulty=${difficulty}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  questions = data.results;
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("end").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  showQuestion();
  
}

function playFavoritesTrivia() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    alert("No favorite questions to play!");
    return;
  }
  questions = favorites.map(q => ({ ...q }));
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("end").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  showQuestion();
}

function playMissedTrivia() {
  const missed = JSON.parse(localStorage.getItem("missed")) || [];
  if (missed.length === 0) {
    alert("No missed questions to play!");
    return;
  }
  questions = missed.map(q => ({ ...q }));
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("end").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  showQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  acceptingAnswers = true;

  const q = questions[currentIndex];
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  questionEl.textContent = decodeHTML(q.question);
  questionEl.className = "fade-in";

  answersEl.innerHTML = "";
  document.getElementById("feedback").textContent = "";

  let answers = [...q.incorrect_answers];
  answers.push(q.correct_answer);
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = decodeHTML(answer);
    btn.className = "pop";
    btn.onclick = () => checkAnswer(btn, answer);
    answersEl.appendChild(btn);
  });

  updateProgress();
  document.getElementById("score").textContent = `Score: ${score}`;
}

function checkAnswer(button, answer) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  const correct = questions[currentIndex].correct_answer;
  userAnswers.push(answer);

  const buttons = document.querySelectorAll(".answers button");

  buttons.forEach(btn => {
    if (btn.textContent === decodeHTML(correct)) {
      btn.classList.add("correct");
    }
  });

  if (answer === correct) {
    score++;
    document.getElementById("feedback").textContent = "Correct!";
    document.getElementById("score").classList.add("pulse");
    setTimeout(() => {
      document.getElementById("score").classList.remove("pulse");
    }, 400);
  } else {
    button.classList.add("incorrect");
    document.getElementById("feedback").textContent = "Incorrect!";
    
  }

  document.getElementById("score").textContent = `Score: ${score}`;

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

function updateProgress() {
  const percent = ((currentIndex) / questions.length) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
}

function endGame() {
  document.getElementById("game").classList.add("hidden");
  const endDiv = document.getElementById("end");
  endDiv.classList.remove("hidden");

  endDiv.innerHTML =
    '<h2>Game Over!</h2>' +
    '<p>You scored ' + score + ' out of ' + questions.length + '</p>' +
    '<form id="scoreForm">' +
    '<label for="scoreName">Enter your name to save your score:</label><br>' +
    '<input type="text" id="scoreName" name="scoreName" maxlength="20" required>' +
    '<button type="submit">Save Score</button>' +
    '</form>' +
    '<div id="scoreMsg" style="color:green;margin:10px 0;"></div>' +
    '<button onclick="viewFavorites()">View Favorites</button>' +
    '<h3>Review Your Questions</h3>' +
    '<div id="review"></div>' +
    '<button onclick="location.reload()">Play Again</button>' +
    '<h3>Scoreboard</h3>' +
    '<ul id="scoreboard"></ul>';

  const reviewDiv = document.getElementById("review");
  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const correct = q.correct_answer;
    const isCorrect = userAnswer === correct;
    if (!isCorrect) {
      q.incorrect = true;
    }
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML =
      '<p><strong>Q' + (index + 1) + ':</strong> ' + decodeHTML(q.question) + '</p>' +
      '<p>Your Answer: <span style="color:' + (isCorrect ? 'green' : 'red') + '">' + decodeHTML(userAnswer) + '</span></p>' +
      '<p>Correct Answer: <span style="color:green">' + decodeHTML(correct) + '</span></p>' +
      '<button onclick="favoriteQuestion(' + index + ', this)">Favorite</button>';
    reviewDiv.appendChild(card);
  });
  placeMissedinLocalStorage();
  renderScoreboard();
  const scoreForm = document.getElementById("scoreForm");
  scoreForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("scoreName").value.trim();
    if (!name) return;
    saveScore(name, score);
    document.getElementById("scoreMsg").textContent = "Score saved!";
    renderScoreboard();
    scoreForm.reset();
  });
}

function saveScore(name, score) {
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  scoreboard.push({ name, score, date: new Date().toISOString() });
  scoreboard.sort((a, b) => b.score - a.score);
  scoreboard = scoreboard.slice(0, 10);
  localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
}

function renderScoreboard() {
  const scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  const board = document.getElementById("scoreboard");
  if (!board) return;
  board.innerHTML = scoreboard.length === 0 ? '<li>No scores yet.</li>' : scoreboard.map((entry, i) =>
    `<li>${i + 1}. ${entry.name} - ${entry.score}</li>`
  ).join("");
}

function favoriteQuestion(index, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const q = questions[index];

  const exists = favorites.some(f => f.question === q.question);

  if (!exists) {
    favorites.push(q);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    button.textContent = "Saved!";
    button.classList.add("favorite-saved");
  } else {
    button.textContent = "Already Saved";
  }
}
function placeMissedinLocalStorage() {
  const missedQuestions = [];

  questions.forEach(question => {
    if (question.incorrect && !missedQuestions.includes(question)) {
        missedQuestions.push(question);
    
    }
  });

  localStorage.setItem("missed", JSON.stringify(missedQuestions));
}

function viewFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const endDiv = document.getElementById("end");

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  endDiv.classList.remove("hidden");

  if (favorites.length === 0) {
    endDiv.innerHTML = `
      <h2>No Favorites Yet</h2>
      <button onclick="location.reload()">Back</button>
    `;
    return;
  }

  endDiv.innerHTML = `
    <h2>Your Favorite Questions</h2>
    <div id="favoritesList"></div>
    <button onclick="location.reload()">Back</button>
  `;

  const list = document.getElementById("favoritesList");

  favorites.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "review-card";

    card.innerHTML = `
      <p>${decodeHTML(q.question)}</p>
      <p><strong>Answer:</strong> ${decodeHTML(q.correct_answer)}</p>
      <button onclick="removeFavorite(${index})">Remove</button>
    `;

    list.appendChild(card);
  })
  ;
  
}

function removeFavorite(index) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  viewFavorites();
}
const startButton = document.getElementById('start-button');
const viewButton = document.getElementById('view-button');
const playFavoritesButton = document.getElementById('playFavorites-button');
const playMissedTriviaButton = document.getElementById('playMissedTrivia-button');

startButton.addEventListener('click', startGame);
viewButton.addEventListener('click', viewFavorites);
playFavoritesButton.addEventListener('click', playFavoritesTrivia);
playMissedTriviaButton.addEventListener('click', playMissedTrivia);
window.viewFavorites = viewFavorites;
window.favoriteQuestion = favoriteQuestion;
window.removeFavorite = removeFavorite;

dropDown();
