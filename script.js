// Selecting html Elements
const buttonEle = document.getElementById("button");
const audioElement = document.getElementById("audio");
const jokeContainer = document.getElementById("joke-container");
const jokeText = document.getElementById("joke-text");
const jokeHeading = document.getElementById("joke-heading");

// VoiceRSS Javascript SDK
const VoiceRSS = {
  speech: function (e) {
    this._validate(e), this._request(e);
  },
  _validate: function (e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      var a = !1;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw "The browser does not support the audio codec " + e.c;
    }
  },
  _request: function (e) {
    var a = this._buildRequest(e),
      t = this._getXHR();
    (t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
        // new Audio(t.responseText).play();
        audioElement.src = t.responseText;
        audioElement.play();
      }
    }),
      t.open("POST", "https://api.voicerss.org/", !0),
      t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
      t.send(a);
  },
  _buildRequest: function (e) {
    var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return (
      "key=" +
      (e.key || "") +
      "&src=" +
      (e.src || "") +
      "&hl=" +
      (e.hl || "") +
      "&r=" +
      (e.r || "") +
      "&c=" +
      (a || "") +
      "&f=" +
      (e.f || "") +
      "&ssml=" +
      (e.ssml || "") +
      "&b64=true" +
      "&v=" +
      (e.v || "")
    );
  },
  _detectCodec: function () {
    var e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : e.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : e.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : e.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : e.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  },
  _getXHR: function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};

// Toggle button
function toggleButton() {
  buttonEle.disabled = !buttonEle.disabled;
}

// Getting joke String
async function getJoke() {
  toggleButton();
  const jokeUrl = "https://v2.jokeapi.dev/joke/Any";
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
      key: "82b91ac3efc24608a9aa83ca2c7bcb01",
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

/////////////// !!!!Important to remove it ?/////////////////
// function test() {
//   VoiceRSS.speech({
//     key: "82b91ac3efc24608a9aa83ca2c7bcb01",
//     src: "मैं तुमसे प्यार करता हूँ किरण",
//     hl: "hi-in",
//     // hl: "en-us",
//     // v: "Linda",
//     v: "Puja",
//     r: 1,
//     c: "mp3",
//     f: "44khz_16bit_stereo",
//     ssml: false,
//   });
// }
// test();
