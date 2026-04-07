import {dropDown} from './dropDownMenu.js';

const pref = document.querySelector('.set-pref');

const form = document.querySelector('.form');
const submitMessage = document.querySelector('.pref-submit')
const categoryContainer = document.querySelector('#categories-toggled');
const categoryLookup = {
    "9": "General Knowledge",
    "10": "Books",
    "11": "Film",
    "12": "Music",
    "13": "Musicals & Theatre",
    "14": "Television",
    "15": "Video Games",
    "16": "Board Games",
    "17": "Science & Nature",
    "18": "Computers",
    "19": "Mathematics",
    "20": "Mythology",
    "21": "Sports",
    "22": "Geography",
    "23": "History",
    "24": "Politics",
    "25": "Art",
    "26": "Celebrities",
    "27": "Animals",
    "28": "Vehicles",
    "29": "Comics",
    "30": "Gadgets",
    "31": "Japanese Anime & Manga",
    "32": "Cartoon & Animations"
};



form.addEventListener('submit', function(event) {
  
  const formData = new FormData(event.target);
  const categories = formData.getAll('category');
  const errorDiv = document.getElementById('form-error');
  if (categories.length === 0) {
    errorDiv.style.display = 'block';
    return;
  } else {
    errorDiv.style.display = 'none';
  }
  const params = new URLSearchParams();
  categories.forEach(cat => params.append('category', cat));
  for (const [key, value] of formData.entries()) {
    if (key !== 'category') {
      params.append(key, value);
    }
  }
  const link = 'api.html?' + params.toString();
  const playLinkAnchor = document.querySelectorAll(".playLink a");

  playLinkAnchor.forEach(playLinkAnchor => {
  if (playLinkAnchor) {
      playLinkAnchor.href = link; 
      playLinkAnchor.textContent = "Start Game!"; 
}});
});


function updateUI() {

  categoryContainer.innerHTML = '';
  
  const savedData = localStorage.getItem('userData');

  if (savedData) {
    
    const userPrefs = JSON.parse(savedData);

    
    const selectedCategories = userPrefs.category; 
    selectedCategories.forEach(cat => {
  
      const li = document.createElement('li');
      li.classList.add('category-item');

      const categoryName = categoryLookup[cat]
    
      li.textContent = categoryName;
    
      categoryContainer.appendChild(li);
    });

  }
  else {
    const li = document.createElement('li');
      li.classList.add('category-item');
    
      li.textContent = "Everything is currently toggled on.";
    
      categoryContainer.appendChild(li);
  }
};
dropDown();
updateUI();