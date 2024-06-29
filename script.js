// Selecting html Elements
const buttonEle = document.getElementById("button");
const audioElement = document.getElementById("audio");
const jokeContainer = document.getElementById("joke-container");
const jokeText = document.getElementById("joke-text");
const jokeHeading = document.getElementById("joke-heading");

// Toggle button
function toggleButton() {
  buttonEle.disabled = !buttonEle.disabled;
}

// Getting joke String
async function getJoke() {
  toggleButton();
  // const jokeUrl = "https://v2.jokeapi.dev/joke/Any";
  const jokeUrl = "https://v2.jokeapi.dev/joke/Programming";
  try {
    let joke = "";
    const res = await fetch(jokeUrl);
    const data = await res.json();
    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    data.joke = joke;
    tellJoke(data);
  } catch (err) {
    console.log(err);
  }
}

// joke text to speech
async function tellJoke(jokeData) {
  try {
    const { category, joke, error, type } = jokeData;
    if (error) throw new Error("Error");

    // RSS Voice speed Method
    VoiceRSS.speech({
      key: window.API,
      src: joke,
      hl: "en-us",
      v: "Mary",
      r: 0,
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: false,
    });

    // adding joke data to elements
    jokeHeading.innerHTML = `<span>Type: ${type}</span> <span>Category: ${category}</span>`;
    jokeText.textContent = joke;
    jokeContainer.hidden = false;
  } catch (error) {
    console.log(error);
    alert("Joke not loaded correctly!!");
  }
}

buttonEle.onclick = getJoke;
audioElement.onended = toggleButton;
