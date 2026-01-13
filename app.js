const container = document.querySelector("#container");
const form = document.querySelector("#form");
const input = document.querySelector("#input");

runEventListener();

function runEventListener() {
  form.addEventListener("submit", weatherSearch);
}

function weatherSearch(e) {
  const value = input.value.trim();
  const key = "e2a40be855fef69afe8d8422e1645bac";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${key}&units=metric&lang=tr`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === "404") {
        alert("Şehir Bulunamadı!!");
      } else {
        weatherUI(data);
      }
    })
    .catch((err) => console.log(err));
  input.value = "";
  e.preventDefault();
}

function weatherUI(data) {
  const city = document.querySelector("#city");
  const temp = document.querySelector("#temp");
  const state = document.querySelector("#state");
  const cityName = data.name;
  const tempCity = Math.round(data.main.temp);
  const negativControl = tempCity < 0 ? "eksi " : "";
  const comment = data.weather[0].description;

  document.querySelector("#felt").innerText = `${Math.round(
  data.main.feels_like)}°C`;
  document.querySelector("#moisture").innerText = `%${data.main.humidity}`;
  document.querySelector("#wind").innerText = `${data.wind.speed} km/s`;

  container.style.display = "flex";
  city.innerText = `${data.name},${data.sys.country}`;
  temp.innerText = `${Math.round(data.main.temp)}°C`;
  const description = data.weather[0].description;
  state.innerText = description.toUpperCase();
  
  const desc = description.toLowerCase();
  const body = document.body;

  if (desc.includes("hafif kar yağışlı")) {
    body.style.backgroundImage = "url('img/hafifKar.jpg')";
  } else if (desc.includes("gök gürültülü yağmurlu")) {
    body.style.backgroundImage = "url('img/gokGurultulu.jpg')";
  } else if (desc.includes("kar")) {
    body.style.backgroundImage = "url('img/karli.jpg')";
  } else if (desc.includes("yağmur") || desc.includes("çisenti")) {
    body.style.backgroundImage = "url('img/yağmurlu.jpg')";
  } else if (desc.includes("bulut")) {
    body.style.backgroundImage = "url('img/bulutlu.jpg')";
  } else if (desc.includes("açık") || desc.includes("güneş")) {
    body.style.backgroundImage = "url('img/gunesli.jpg')";
  } else if (desc.includes("sis") || desc.includes("pus")) {
    body.style.backgroundImage = "url('img/sisli.jpg')";
  } else if (desc.includes("kapalı")) {
    body.style.backgroundImage = "url('img/kapali.jpg')";
  } else if (
    desc.includes("hafif yağmur") ||
    desc.includes("orta şiddetli yağmur")
  ) {
    body.style.backgroundImage = "url('img/hafifYagmur.jpg')";
  }
  
  const message = `${cityName} için hava şu an ${comment} ve sıcaklık yaklaşık ${negativControl}${Math.abs(tempCity)} derece.`;
  voiceNarration(message);
}

const locationButton = document.querySelector("#locationButton");
locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const key = "e2a40be855fef69afe8d8422e1645bac";

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=tr`
        )
          .then((res) => res.json())
          .then((data) => {
            weatherUI(data);
          })
          .catch((err) => console.log("Hata:", err));
      },
      () => {
        alert("Konum izni verilmedi.Lütfen tarayıcı ayarlarından izin verin.");
      }
    );
  } else {
    alert("Tarayıcınız konum özelliğini desteklemiyor.");
  }
});

function voiceNarration(message) {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(message);
  utterThis.lang = 'tr-TR';
  utterThis.rate = 0.8;
  utterThis.pitch = -5
  synth.speak(utterThis);
}



