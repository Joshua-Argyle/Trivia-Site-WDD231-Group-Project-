const baseUrl = "https://the-trivia-api.com/v2/questions?limit=1";
const hero = document.querySelector(".hero");
hero.innerHTML = `<p class="sample"></p>`;
const sample = document.querySelector(".sample");

async function getQuestion() {

  const url = baseUrl;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data[0].question);
  return data[0].question.text;
  
}

async function renderQuestion() {
  sample.classList.add("fade-out");

  // Wait for fade-out to finish (match CSS duration)
  await new Promise(resolve => setTimeout(resolve, 500));

  const question = await getQuestion();

  sample.classList.remove("fade-out");
  
  sample.textContent = question;

  
}

renderQuestion();
setInterval(renderQuestion, 10000);