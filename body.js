
let rooms=[];
let bookings=[];



async function loadData() {

    try {

        let response = await fetch("data_set.json");

        let data = await response.json();

         rooms = data.rooms;
         bookings=data.bookings;

        document.getElementById("output").innerHTML =
            rooms.map(room => `<p>${room.name} - ${room.building}</p>`).join("");

         document.getElementById("output2").innerHTML =
            bookings.map(bookings => `<p>${bookings.start} - ${bookings.end} - ${bookings.day}</p>`).join("");

    }
    catch (error) {

        console.log("Error:", error);

    }
}


function timetominutes(time){
    let parts=time.split(":");
    let hour=Number(parts[0]);
    let minute=Number(parts[1]);

   return (hour*60)+minute;


}

function isRoomBusy(roomId, day, start, end){

    const timestarts=timetominutes(start);
    const timeends=timetominutes(end);

    
    for(let i=0;i<bookings.length;i++){

         if (bookings[i].roomId===roomId && bookings[i].day === day){
                 const bookingstart=timetominutes(bookings[i].start);
        const bookingend=timetominutes(bookings[i].end);

       if(bookingstart<timeends && bookingend>timestarts){
        return true;
        
    }
         }
       
   
}
return false;
    
}

function getFreeRooms(day, start, end){

      const freerooms=[];
    for(let i=0;i<rooms.length;i++){
        const isbusy=isRoomBusy(rooms[i].id,day,start,end);

        if(!isbusy){
            freerooms.push(rooms[i]);
        }
    }

    return freerooms;
}

function applyFilters(rooms, filters){
    const filtered_rooms=[];

    for(let i=0;i<rooms.length;i++){

        if(filters.building==="" || rooms[i].building===filters.building ){
            if(filters.type==="" || rooms[i].type===filters.type){
                if(filters.floor==="" || rooms[i].floor===Number(filters.floor)){
                    if(filters.capacity==="" || rooms[i].capacity>=Number(filters.capacity)){
                               filtered_rooms.push(rooms[i]);
                    }
                }
            }
          
        }
    }
    return filtered_rooms;
}

function groupRooms(rooms){           
    const result={};
   
    for(let i=0;i<rooms.length;i++){
      const current_building=rooms[i].building;
      const  current_floor=rooms[i].floor;
       
      if(result[current_building]===undefined){
        result[current_building]={};
      }
      if(result[current_building][current_floor]===undefined){
          result[current_building][current_floor]=[];
      }
       result[current_building][current_floor].push(rooms[i]);
    }

    return result;
}


 function searchRooms(day, start, end, filters){
  let  freerooms=getFreeRooms(day,start,end);
   let filteredRooms=applyFilters(freerooms, filters);
   let groupedrooms=groupRooms(filteredRooms);

   return groupedrooms;
 }

 function readinput(){
        
     let user_day=document.getElementById("user-day").value;
    let user_given_start= document.getElementById("start-time").value;
   let  user_given_end=document.getElementById("end-time").value;
     let  user_given_building=document.getElementById("user-building").value;
     let  user_given_type=document.getElementById("user-type").value;
    let  user_given_floor=document.getElementById("user-floor").value;
     let  user_given_capacity=document.getElementById("user-capacity").value;

         const filters={

            building,type,floor,capacity

         };

         const returntype={

            filters , day,start, end
         };

         return returntype;
       
 }

 async function startapp(){
     await loadData();

     document.getElementById("search_button").addEventListener("click",function(){
          const input=readinput();

          if(!validateInput(input.day, input.start, input.end)){
            return; 
     }
    
     const result = searchRooms(input.day, input.start, input.end, input.filters);
        displayResults(result);
    });

}

startapp();

function display(result){
    let container=document.getElementById("result");
   
    if( Object.keys(result).length===0){
        container.innerHTML="No free rooms found";
        return;
    }

    let html = "";

    for (let building in result) {
  html += "<h2>Building " + building + "</h2>";              
    for (let floor in result[building]) {
     html += "<h3>Floor " + floor + "</h3>";            
       let roomsOnFloor = result[building][floor];
for (let i = 0; i < roomsOnFloor.length; i++) {
    html += "<p>" + roomsOnFloor[i].name + " - " + roomsOnFloor[i].type + " - Capacity: " + roomsOnFloor[i].capacity + "</p>";
}
    }
}

container.innerHTML = html;

}



    
