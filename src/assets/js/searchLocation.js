import * as Event from "./event.js";
import * as WeatherData from "./weatherData.js";

const searchInput = document.querySelector('#search-bar');
const searchIcon = document.querySelector('.search-box .search');
function processData(anyData){
   let location = searchInput.value || anyData;
   if(location){
      searchInput.value = "";
      WeatherData.getWeatherData(location).then(result=>{
         if(result){
            Event.emit('currentWeatherData', result);
            Event.emit('daily_forecast', result);
            Event.emit('hourly_forecast', result);
            Event.emit('updateNext7DaysWeather', result);
            Event.emit('updateNext24HoursWeather', result);
            Event.emit('resetTempElem');
         }
      })
      
   }else console.log("NOPE!");
}
searchIcon.addEventListener('click', processData);
searchInput.addEventListener('keydown',e=>{
   Event.emit("f", "good");
   if(e.key === "Enter"){
      processData();
   }
});
processData('hanoi');
export{};


