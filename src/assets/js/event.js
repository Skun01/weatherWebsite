
const events = {};
export function on(eventName, func){
   events[eventName] = events[eventName] || [];
   events[eventName].push(func);
}

export function off(eventName, fn){
   if(events[eventName]){
      for(let i = 0; i < events[eventName].length; i++){
         if(events[eventName][i] === fn){
            events[eventName].splice(i, 1);
            break;
         }
      }
   }
}

export function emit(eventName, data){
   if(events[eventName]){
      events[eventName].forEach(func => {
         func(data);
      });
   }
}

export function printSomething(data){
   console.log(data);
}

