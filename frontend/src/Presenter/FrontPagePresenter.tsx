import FrontPageView from '../View/FrontPageView';
import React, { useEffect, useState } from 'react';
import { formatDateFromData } from '../Helpers/Formatting';
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";

function FrontPagePresenter() {
    const [lastWatered, setLastWatered] = useState<string>("Never");
    const [moistureLevel, setMoistureLevel] = useState<number>(0);
    const user = useSelector((state: RootState) => state.auth.user);
    const session = useSelector((state: RootState) => state.auth.session);
    const sessionId = session ? session.session_id : '';
    

    useEffect(()=>{
      getPlantData();
    },[])

    async function setIOTDeviceMoistureLevel(newLevel:number){
      console.log("This will send a request to API endpoint to change the minimum moisture level for automatic watering");
    }

    async function waterPlant(){
      const timeNow = new Date().toISOString();

      const response = await fetch('https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/water-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          water_now: true,
          time: timeNow,
          iot_device_id: 1,
          person_id: user?.person_id,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        console.log("Watered plant successfully " + response.json);
        getPlantData();
      }
      else{
        console.log("Error: " + response.statusText);
      }

      return response.json();
    }

    async function getPlantData(){
      let plantId:number = 123;
     
      const response = await fetch(
        `https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/${plantId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "session_id": sessionId
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedDateString = formatDateFromData(new Date(data.last_watered));
        setLastWatered(formattedDateString);
        setMoistureLevel(data.moisture_level);
        console.log(data);
      } else {
        let errorText = "";

        switch (response.status) {
          case 400:
            errorText = "No clue what this error means 400";
            break;
          default:
            errorText = `An error occurred: ${response.statusText}`;
        }

        console.log(errorText);
      }
    }

  //All logic will be computed here and then sent to the view via the use of props
  return <FrontPageView waterPlant={waterPlant} lastWatered={lastWatered} moistureLevel={moistureLevel} setIOTDeviceMoistureLevel={setIOTDeviceMoistureLevel}></FrontPageView>;
}

export default FrontPagePresenter;
