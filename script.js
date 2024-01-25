//https://www.weatherapi.com/
//todo: tahmin -> ileri yönelik --->>>> (done)
//todo: favori şehir eklemek (arge).--->>>> (done)
//todo: ilk yüklendiği zaman favori şehri gösterme.--->>>> (done)
//todo: ilk yüklendiği zaman querystringden ilgili şehri gösterme -> http://localhost:5500/?city=istanbul --->>>> (done)
//todo: css ekleyelim... güzelleştirelim. --->>>> (done)


//globals
let api_key_weatherapi = "0f9bce7e09204105842165055242401";
let derece_dom;
let lastUpdate_dom;
let img_dom;
let imgText_dom;

let weather_api = {
  getCurrentWeather: async function (city) {
    //http://api.weatherapi.com/v1/current.json?key=0f9bce7e09204105842165055242401&q=istanbul&aqi=yes
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      let result = await fetch(`http://api.weatherapi.com/v1/current.json?key=${api_key_weatherapi}&q=${city}&aqi=yes`, requestOptions)
        .then((response) => response.text());
      result = JSON.parse(result);
      return result;
    } catch (error) {
      console.log("error: ", error);
      return error;
    }
  },
  getForcastDataWeather: async function (city, days, aqi = "yes", alerts = "yes") {
    //http://api.weatherapi.com/v1/forecast.json?key=0f9bce7e09204105842165055242401&q=istanbul&days=1&aqi=yes&alerts=yes
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      let result = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${api_key_weatherapi}&q=${city}&days=${days}&aqi=${aqi}&alerts=${alerts}`,
        requestOptions
      ).then((response) => response.text());
      result = JSON.parse(result);
      return result;
    } catch (error) {
      console.log("error: ", error);
      return error;
    }
  },
  dtoFunctions: {
    getCurrentWeather: async function (city) {
      let return_value = await weather_api.getCurrentWeather(city);
      let result = {
        temp: return_value.current.temp_c,
        img: return_value.current.condition.icon,
        img_text: return_value.current.condition.text,
        last_update: return_value.current.last_updated
      }

      return result;
    }
  }
};

async function btnClick(event) {
  let domTxtCity = document.getElementById("txtCity");
  let city = domTxtCity.value;
  if (city === "") {
    alert("boş şehir ismi girilemez");
  }
  let result = await weather_api.dtoFunctions.getCurrentWeather(city);
  third_way(result);
  let resetElement = document.getElementById('weather-forecast');
  resetElement.innerHTML = '';
  let futureData = get5DaysForcastDataWeather(city);
  console.log(result);
  console.log(futureData);
}
function third_way(dtoCurrentWeatherObject) {
  derece_dom.innerText = dtoCurrentWeatherObject.temp + " derece";
  lastUpdate_dom.innerText = "Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
  img_dom.src = dtoCurrentWeatherObject.img;
  imgText_dom.innerText = dtoCurrentWeatherObject.img_text;
}


function generateHtml(dtoCurrentWeatherObject) {
  let generatedDataDiv = document.getElementById('generatedData');
  generatedDataDiv.innerHTML = '';

  let derece_text = dtoCurrentWeatherObject.temp + " derece";
  let last_update = "Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
  let temp = `
    <div>${derece_text}</div>
    <div>${last_update}</div>
    <img src="${dtoCurrentWeatherObject.img}"/>
    <div>${dtoCurrentWeatherObject.img_text}</div>`;

  generatedDataDiv.innerHTML = temp;

}

function generateCityDom(dtoCurrentWeatherObject) {
  //clear dom....
  let generatedDataDiv = document.getElementById('generatedData');
  generatedDataDiv.innerHTML = '';

  //put data in dom
  let dataTempDiv = document.createElement("div");
  dataTempDiv.innerText = dtoCurrentWeatherObject.temp + " derece";
  generatedDataDiv.appendChild(dataTempDiv);

  let dataLastUpdateDiv = document.createElement("div");
  dataLastUpdateDiv.innerText = "Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
  generatedDataDiv.appendChild(dataLastUpdateDiv);

  let dataImg = document.createElement("img");
  dataImg.src = dtoCurrentWeatherObject.img;
  dataImg.addEventListener('click', () => {
    console.log('img clicked');
  })
  generatedDataDiv.appendChild(dataImg);

  let dataImgTextDiv = document.createElement("div");
  dataImgTextDiv.innerText = dtoCurrentWeatherObject.img_text;
  generatedDataDiv.appendChild(dataImgTextDiv);

}
async function get5DaysForcastDataWeather(city) {
  const days = 8;
  let datato5Days = await weather_api.getForcastDataWeather(city, days, aqi = "yes", alerts = "yes");
  let daysData = datato5Days.forecast.forecastday;
  let tableDiv = document.createElement('div');
  tableDiv.classList.add('tablesDiv');

  let headerDiv = document.createElement('div');
  headerDiv.classList.add('rowDiv', 'headerRow');

  let headerDate = document.createElement('div');
  headerDate.classList = 'title'
  let headerMaxtemp_c = document.createElement('div');
  headerMaxtemp_c.classList = 'title'
  let headerMintemp_c = document.createElement('div');
  headerMintemp_c.classList = 'title'
  let headerImg = document.createElement('div');
  headerImg.classList = 'title'
  let headerImg_text = document.createElement('div');
  headerImg_text.classList = 'title'

  headerDate.textContent = "Date";
  headerMaxtemp_c.textContent = "Max Temperature";
  headerMintemp_c.textContent = "Min Temperature";
  headerImg.textContent = "Condition Icon";
  headerImg_text.textContent = "Condition Text";

  headerDiv.appendChild(headerDate);
  headerDiv.appendChild(headerMaxtemp_c);
  headerDiv.appendChild(headerMintemp_c);
  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerImg_text);

  tableDiv.appendChild(headerDiv);

  for (let i = 0; i < daysData.length; i++) {
    let rowDiv = document.createElement('div');
    rowDiv.classList.add('rowDiv');

    let date = document.createElement('div');
    let maxtemp_c = document.createElement('div');
    let mintemp_c = document.createElement('div');
    let img = document.createElement('div');
    let img_text = document.createElement('div');

    date.textContent = daysData[i].date;
    maxtemp_c.textContent = daysData[i].day.maxtemp_c;
    mintemp_c.textContent = daysData[i].day.mintemp_c;
    img.innerHTML = `<img src="${daysData[i].day.condition.icon}" alt="${daysData[i].day.condition.text}" />`;
    img_text.textContent = daysData[i].day.condition.text;

    rowDiv.appendChild(date);
    rowDiv.appendChild(maxtemp_c);
    rowDiv.appendChild(mintemp_c);
    rowDiv.appendChild(img);
    rowDiv.appendChild(img_text);

    tableDiv.appendChild(rowDiv);
  }
  let addDiv = document.getElementById("weather-forecast");
  addDiv.appendChild(tableDiv);
}


async function showCityFromQueryString() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('city')) {
    const city = urlParams.get('city');
    let text = document.getElementById('txtCity');
    text.value = city;

    let button = document.getElementById('btnSend');
    if (button) {
      button.click();
    }
  }
}

function showFavoriteCityOnLoad() {
  const favoriteCity = getFavoriteCity();
  if (favoriteCity) {
    let text = document.getElementById('txtCity');
    text.value = favoriteCity;
    let button = document.getElementById('btnSend');
    if (button) {
      button.click();
    }
  }
}
function getFavoriteCity() {
  return localStorage.getItem('favoriteCity');
}
function addFavoriteCity() {
  const cityInput = document.getElementById('txtFavoriteCity');
  let favoriteCity = cityInput.value.trim();

  if (favoriteCity !== "") {
    localStorage.setItem('favoriteCity', favoriteCity);
    alert('Favori şehir başarıyla eklendi: ' + favoriteCity);
  } else {
    alert('Lütfen bir şehir adı girin.');
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Dom loaded");
  derece_dom = document.getElementById('derece');
  lastUpdate_dom = document.getElementById('lastUpdate');
  img_dom = document.getElementById('img');
  imgText_dom = document.getElementById('imgText');
  showCityFromQueryString();
  showFavoriteCityOnLoad();
});
