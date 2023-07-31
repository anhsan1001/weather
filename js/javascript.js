const btnSearch = document.querySelector("#btn-search");
const API_KEY = "b250d7cc2050a9fd697f0b24dee338ce";
getCoordinatesByCityName("Ho Chi Minh");

btnSearch.onclick = () => {
  let input = document.querySelector("#inputId").value;
  if (input) {
    getCoordinatesByCityName(input);
    input = "";
  }
};

function getCoordinatesByCityName(name) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData[0]) {
        const { lat, lon } = responseData[0];
        getCurrentWeatherData({ lat, lon });
      } else {
        handleSearchCity();
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
}

function getCurrentWeatherData({ lat, lon }) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=vi`
  )
    .then((response) => response.json())
    .then((response) => {
      const data = {
        temperature: response?.main?.temp,
        city: response?.name,
        depcription: response?.weather[0]?.description,
        rain: response?.rain,
        humidity: response?.main?.humidity,
        windSpeed: response?.wind?.speed,
        winDeg: response?.wind?.deg,
      };
      renderUI(data);
      renderUIRain(response?.rain?.["1h"]);
    })
    .catch((err) => {
      throw new Error(err);
    });
}

function renderUI({
  temperature,
  city,
  depcription,
  rain,
  humidity,
  winDeg,
  windSpeed,
}) {
  const temperatureNode = document.querySelector(".temperature");
  const cityNode = document.querySelector(".city");
  const depcriptionNode = document.querySelector(".depcription");
  const ingWeather = document.querySelector("#img-weather");
  const desWindSpeed = document.querySelector("#wind-speed");
  const desHumidity = document.querySelector("#humidity");
  const desWindDeg = document.querySelector("#wind-deg");
  const exit = document.querySelector("#exit");
  const itemToast = document.querySelector(".item-toast");

  const arrIconWeather = ["rain.png", "sun.png"];

  temperatureNode.innerText = `${(temperature - 273, 15)}℃`;
  cityNode.innerText = city;
  depcriptionNode.innerText = `Thời tiết: ${depcription}`;
  const icon = rain ? arrIconWeather[0] : arrIconWeather[1];
  ingWeather.src = `./images/${icon}`;
  desWindSpeed.innerText = `Tốc độ gió: ${windSpeed} m/s`;
  desHumidity.innerText = `Độ ẩm: ${humidity} %`;
  desWindDeg.innerText = `Hướng gió: ${winDeg}`;

  exit.onclick = () => {
    itemToast.style.display = "none";
  };
}
function renderUIRain(rain1h) {
  const rain = document.querySelector("#rain");
  let htmlRain = "";
  if (rain1h) {
    htmlRain = ` <hr />
        <div class="des-rain">
          <div id="rain-1h">Lượng mưa trong 1h: ${rain1h} mm</div>
        </div>`;
  } else {
    htmlRain = "";
  }
  rain.innerHTML = htmlRain;
}

function handleSearchCity() {
  const toast = document.querySelector(".toast");
  const listToast = document.querySelector(".list-toast");

  listToast.innerHTML = `<div class="item-toast">
  <div class="title">Thành phố bạn tìm không chính xác !</div>
  <i id="exit" class="fa-solid fa-xmark"></i>
  </div>`;
  toast.appendChild(listToast);
}
