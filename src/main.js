import "./assets/styles/main.css";
import * as Event from "./assets/js/event.js";
import * as SearchLocation from "./assets/js/searchLocation.js";
import * as Icon from "./assets/js/iconLib.js";


// every element of current time forecast need to update
const currConditionElem = document.querySelector('.description');
const currDateElem = document.querySelector('.date');
const currTimeElem = document.querySelector('.time');
const currTempElem = document.querySelector('.curr-temp-data');
const currFeelsTempElem = document.querySelector('.feels-like-temp');
const currHumidityElem = document.querySelector('.humidity');
const chanceRainElem = document.querySelector('.chance-rain');
const windSpeedElem = document.querySelector('.wind-speed');
const cityNameElem = document.querySelector('.city-name');
const currIconElem = document.querySelector('.weather-infor .weather-icon');
Event.on('currentWeatherData', updateCurrWeathe); /**UPDATE FULL WEATHER FOREST INFOR OF CURRENT TIME*/

// alert window when meet error
const alertWindowElem = document.querySelector('.error-alert');
const closeAlertBtn = document.querySelector('.error-alert .close-btn');
const confirmErrorBtn = document.querySelector('.error-alert .confirm-error-btn');
Event.on("alertError", ToggleDisplayErrorWindow); /**DISPLAY AN ERROR WINDOW IF SEARCHING PHRASE ISN'T FOUND */

closeAlertBtn.addEventListener('click', ToggleDisplayErrorWindow);
confirmErrorBtn.addEventListener('click', ToggleDisplayErrorWindow);

// Daily day forecast:
const dailyForeCastElem = document.querySelector('.daily-forecast');
const dailyForeCast = allListOfSubForecastElem(dailyForeCastElem, '.day-name');
Event.on("updateNext7DaysWeather", updateNext7DaysWeather); /**UPDATE NEXT 7 DAYS FORECAST*/

// hourly day forecast:
const hourlyForecastElem = document.querySelector('.hourly-forecast');
const hourlyList = {
   hoursListElemList: hourlyForecastElem.querySelectorAll('.hours-list'),
   listOfSubElem: allListOfSubForecastElem(hourlyForecastElem, '.hour-name'),
}
Event.on('updateNext24HoursWeather', updateNext24HoursWeather); /**UPDATE NEXT 24 HOURS FORECAST */

// change scale;
/**CHANGE EVERY TEMPERATURE TO ANOTHER SCALE */
const AllTemp = [...document.querySelectorAll('.temp')];
const allTempScale = [...document.querySelectorAll('.scale')];
const changeScaleBtn = document.querySelector('.change-scale');
const currentScale = document.querySelector('.curr-scale');
changeScaleBtn.addEventListener('click', e=>{
   changeScaleBtn.classList.toggle('fahrenheit');
   let isCelsius = currentScale.textContent === 'C' ? false : true;
   currentScale.textContent = currentScale.textContent === 'C' ? 'F' : 'C';
   AllTemp.forEach(tempElem=>{
      let temp = +tempElem.textContent;
      if(isCelsius){
         temp = Math.round((temp*(9/5) + 32));
      }else temp = Math.round((temp-32)*(5/9));
      tempElem.textContent = temp;
   });
   allTempScale.forEach(scale=>{
      scale.textContent = isCelsius ? 'F' : 'C';
   })
});

// reset tempeture scale when continue to search
Event.on('resetTempElem', function(){
   allTempScale.forEach(scale=>{
      scale.textContent = 'C';
   })
   currentScale.textContent = 'F';
});

// Daily and hourly button switch
const dailyForecastBtn = document.querySelector('.daily-btn');
const hourlyForecastBtn = document.querySelector('.hourly-btn');
const hoursIndicators = document.querySelector('.hours-indicator');
const leftHourList = hoursIndicators.querySelector('.left-index');
const rightHourList = hoursIndicators.querySelector('.right-index');
const switchWindowController = [
   {
      btn: dailyForecastBtn,
      window: dailyForeCastElem,
   },
   {
      btn: hourlyForecastBtn,
      window: hourlyForecastElem,
   }
]
switchWindowAndBtn(switchWindowController); /**SWITH BETWEEN TWO WINDOW: DAILY AND HOURLY */
// indicator control hourly
const indexDotList = [...hoursIndicators.querySelectorAll('.dots')];
(function(){
   let currentIndex = 0;
   leftHourList.addEventListener('click', e=>{
      currentIndex = (currentIndex - 1);
      if(currentIndex < 0) currentIndex = 2;
      changeHourList(currentIndex);
   });
   rightHourList.addEventListener('click', e=>{
      currentIndex = (currentIndex + 1)%3;
      changeHourList(currentIndex);
   })
})();




/** FUNCTION DEFINE SECTION */
// update  main forecast weather function
function updateCurrWeathe(data){
   currConditionElem.textContent = data.currentCondition.conditions;
   currTempElem.textContent = data.currentCondition.temp;
   currFeelsTempElem.textContent = data.currentCondition.feelslike;
   currHumidityElem.textContent = data.currentCondition.humidity;
   chanceRainElem.textContent = data.currentCondition.precipprob;
   windSpeedElem.textContent = data.currentCondition.windspeed;
   cityNameElem.textContent = data.address;
   const date_time = createDateTime(data.timezone);
   currDateElem.textContent = date_time.dateForm;
   currTimeElem.textContent = date_time.timeForm;
   updateIcon(currIconElem, data.currentCondition.icon);
}

// update anysub future time forecast
function updateSpecificForecast(NameElem, HightTempElem, LowTempElem, IconElem, weatherInfor){
   NameElem.textContent = getDayOfWeek(weatherInfor.datetime);
   
   HightTempElem.textContent = weatherInfor.feelslikemax;
   LowTempElem.textContent = weatherInfor.feelslikemin;
   updateIcon(IconElem, weatherInfor.icon);
}

// update daily day forecast
function updateNext7DaysWeather(weatherData){
   for(let i = 0; i < 7; i++){
      updateSpecificForecast(dailyForeCast.NameList[i], dailyForeCast.HightTempList[i],
      dailyForeCast.LowTempList[i], dailyForeCast.IconList[i], weatherData.days[i + 1]);
   }
}

// update next 24 hours forecast
function updateNext24HoursWeather(weatherData){
   const foreCast48Hours = [...weatherData.days[0].hours, ...weatherData.days[1].hours];
   const currentTime = weatherData.currentCondition.datetime;
   let startPoint = 0;
   for(let i= 0; i < foreCast48Hours.length; i++){
      if(foreCast48Hours[i].datetime >= currentTime){
         startPoint = i + 1;
         break;
      }
   }
   for(let i = 0; i < 24; i++){
      hourlyList.listOfSubElem.NameList[i].textContent = foreCast48Hours[startPoint].datetime;
      hourlyList.listOfSubElem.HightTempList[i].textContent = Math.max(foreCast48Hours[startPoint].temp, foreCast48Hours[startPoint].feelslike);
      hourlyList.listOfSubElem.LowTempList[i].textContent = Math.min(foreCast48Hours[startPoint].temp, foreCast48Hours[startPoint].feelslike);
      updateIcon(hourlyList.listOfSubElem.IconList[i], foreCast48Hours[startPoint].icon);
      startPoint++;
   }
}

// get all sub future time need to be update
function allListOfSubForecastElem(rootElem, className){
   return {
      NameList: [...rootElem.querySelectorAll(className)],
      HightTempList: [...rootElem.querySelectorAll('.hight-temp .temp')],
      LowTempList: [...rootElem.querySelectorAll('.low-temp .temp')],
      IconList: [...rootElem.querySelectorAll('.weather-icon')],
   }
}

// createDateTime Function
function createDateTime(timezone){
   const options = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long',
  };
  const formatter = new Intl.DateTimeFormat([], options);
  const parts = formatter.formatToParts(new Date());
  let month, year, day, weekday, hour, minute, dayPeriod;
  parts.forEach(({type, value})=>{
      switch(type){
         case 'month':
            month = value;
            break;
         case 'year':
            year = value;
            break;
         case 'day':
            day = value;
            break;
         case 'weekday':
            weekday = value;
            break;
         case 'hour':
            hour = value;
            break;
         case 'minute':
            minute = value;
            break;
         case 'dayPeriod':
            dayPeriod = value;
      }
  });
  return{
   dateForm: `${weekday}, ${day} ${month} ${year}`,
   timeForm: `${hour}:${minute} ${dayPeriod}`,
  }
}

// update icon
function updateIcon(iconElem, iconName){
   const classArr = [...iconElem.classList];
   iconElem.classList.remove(classArr[classArr.length - 1]);
   if(Icon.weatherIcons[iconName]){
      iconElem.classList.add(Icon.weatherIcons[iconName]);
   }else iconElem.classList.add('wi-alien');
   
}


// display error window function
function ToggleDisplayErrorWindow(error){
   if(alertWindowElem.style.display === 'flex'){
      alertWindowElem.style.display = 'none';
   }else{
      alertWindowElem.style.display = 'flex';
   }
   console.log("This is error name: " + error);
}

// switch window relative with button
function switchWindowAndBtn(controller){
   controller.forEach(control=>{
      control.btn.addEventListener('click', e=>{
         controller.forEach(control=>{
            control.btn.classList.remove('btn-active');
            control.window.classList.remove('forecast-active');
         });
         control.btn.classList.add('btn-active');
         control.window.classList.add('forecast-active');
         if([...control.btn.classList].includes('hourly-btn')){
            hoursIndicators.style.display = 'flex';
         }else hoursIndicators.style.display = 'none';
      });
   });
}
// function get day name
function getDayOfWeek(dateString) {
   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   const date = new Date(dateString);
   const dayIndex = date.getDay();
   return daysOfWeek[dayIndex];
}

function changeHourList(currList){
   indexDotList.forEach(dotElem=>{
      dotElem.classList.remove('dots-active');
   });
   hourlyList.hoursListElemList.forEach(listElem=>{
      listElem.classList.remove('show-window');
   });
   indexDotList[currList].classList.add('dots-active');
   hourlyList.hoursListElemList[currList].classList.add('show-window');
}