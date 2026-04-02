import {dropDown} from './dropDownMenu.js';

function displayFavoritesVault() {
  const list = JSON.parse(localStorage.getItem("favorites")) || [];
  const vault = document.querySelector(".favoritesVault");

  if (list.length === 0) {
    vault.innerHTML = `<p>No favorite questions yet...</p>`;
  } else {
    vault.innerHTML = list.map(q => `<p class="favoriteQuestion">${q.question} - <span class="correct">${q.correct_answer}</span</p>`).join("");
  }
}

function displayMissedVault() {
  const missed = JSON.parse(localStorage.getItem("missed")) || [];
  const vault = document.querySelector(".missedVault");

  if (missed.length === 0) {
    vault.innerHTML = `<p>No missed questions yet...</p>`;
  } else {
    vault.innerHTML = missed.map(q => `<p class="missed">${q.question} - <span class="missedAnswer">${q.correct_answer}</span</p>`).join("");
  }
}
dropDown();
displayFavoritesVault();
displayMissedVault();