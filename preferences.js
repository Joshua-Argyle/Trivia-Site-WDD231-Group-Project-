const pref = document.querySelector('.set-pref');
const button = document.querySelector('.pref-button');
const arrow = document.querySelector('.arrow');

button.addEventListener('click', () => {
  pref.classList.toggle("hidden");
  arrow.classList.toggle('arrow-is-rotated');
});

