import * as Event from "./event.js";
export async function getWeatherData(cityName){
   try{
      const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=C4XGZBF2VQ9AP9F8KMQSCPY6R&contentType=json`, {mode:"cors"});
      
      if(!response.ok){
         throw new Error("400 error");
      }
      const jsData = await response.json();
      return{
         currentCondition: jsData.currentConditions,
         address: jsData.resolvedAddress,
         timezone: jsData.timezone,
         days: jsData.days,
         nextHours: [jsData.days[0].hours, jsData.days[1].hours],
      }
   }catch(error){
      Event.emit('alertError', error);
      return undefined;
   }
   
}
