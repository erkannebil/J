//https://www.weatherapi.com/
//todo: tahmin -> ileri yönelik 
//todo: favori şehir eklemek (arge).
//todo: api.weatherapi.com burdaki başka bir endpoint i eklemek.
//todo: ilk yüklendiği zaman favori şehri gösterme
//todo: ilk yüklendiği zaman querystringden ilgili şehri gösterme -> http://localhost:5500/?city=istanbul
//todo: css ekleyelim... güzelleştirelim.

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
      let result = await fetch(`http://api.weatherapi.com/v1/current.json?key=${api_key_weatherapi}&q=${city}&aqi=yes`,requestOptions)
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
    getCurrentWeather: async function(city){
        let return_value = await weather_api.getCurrentWeather(city);
        let result = {
            temp :      return_value.current.temp_c,
            img :       return_value.current.condition.icon,
            img_text:   return_value.current.condition.text,
            last_update:return_value.current.last_updated
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
  //generateCityDom(result);
  //generateHtml(result);
  third_way(result);
  console.log(result);
}
function third_way(dtoCurrentWeatherObject){
  //put data in dom
  derece_dom.innerText = dtoCurrentWeatherObject.temp+ " derece";
  lastUpdate_dom.innerText ="Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
  img_dom.src = dtoCurrentWeatherObject.img;
  imgText_dom.innerText = dtoCurrentWeatherObject.img_text;
}


function generateHtml(dtoCurrentWeatherObject){
    let generatedDataDiv = document.getElementById('generatedData');
    generatedDataDiv.innerHTML = '';

    let derece_text =  dtoCurrentWeatherObject.temp+ " derece";
    let last_update = "Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
    let temp = `
    <div>${derece_text}</div>
    <div>${last_update}</div>
    <img src="${dtoCurrentWeatherObject.img}"/>
    <div>${dtoCurrentWeatherObject.img_text}</div>`;
    
    generatedDataDiv.innerHTML = temp;

}

function generateCityDom(dtoCurrentWeatherObject){
    //clear dom....
    let generatedDataDiv = document.getElementById('generatedData');
    generatedDataDiv.innerHTML = '';

    //put data in dom
    let dataTempDiv = document.createElement("div");
    dataTempDiv.innerText = dtoCurrentWeatherObject.temp+ " derece";
    generatedDataDiv.appendChild(dataTempDiv);

    let dataLastUpdateDiv = document.createElement("div");
    dataLastUpdateDiv.innerText ="Son Güncelleme : " + dtoCurrentWeatherObject.last_update;
    generatedDataDiv.appendChild(dataLastUpdateDiv);

    let dataImg = document.createElement("img");
    dataImg.src = dtoCurrentWeatherObject.img;
    dataImg.addEventListener('click', ()=>{
        console.log('img clicked');
    })
    generatedDataDiv.appendChild(dataImg);

    let dataImgTextDiv = document.createElement("div");
    dataImgTextDiv.innerText = dtoCurrentWeatherObject.img_text;
    generatedDataDiv.appendChild(dataImgTextDiv);

}



document.addEventListener("DOMContentLoaded", async () => {
    console.log("Dom loaded");
    derece_dom = document.getElementById('derece');
    lastUpdate_dom = document.getElementById('lastUpdate');
    img_dom = document.getElementById('img');
    imgText_dom = document.getElementById('imgText');
  // weather_api.uzunluk => 10
  //  let response_data = await weather_api.getForcastDataWeather("maltepe",3);
  //  let json_weather_data = JSON.parse(response_data);
  //  console.log(json_weather_data);
});
