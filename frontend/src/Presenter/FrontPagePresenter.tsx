import FrontPageView from '../View/FrontPageView';
import React, { useEffect, useState } from 'react';
import { formatDateFromData } from '../Helpers/Formatting';
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";
import URL from '../API';

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
      try {
        const timeNow = new Date().toISOString();
    
        const response = await fetch(`${URL}plants/water-plant`, {
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
    
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
    
        console.log("Watered plant successfully " + response.json);
        await getPlantData();
    
        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

    async function getPlantData(){
      try {
        let plantId:number = 123;
    
        const response = await fetch(
          `${URL}plants/${plantId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "session_id": sessionId
            }
          }
        );
    
        if (!response.ok) {
          let errorText = "";
    
          switch (response.status) {
            case 400:
              errorText = "No clue what this error means 400";
              break;
            default:
              errorText = `An error occurred: ${response.statusText}`;
          }
    
          throw new Error(errorText);
        }
    
        const data = await response.json();
        const formattedDateString = formatDateFromData(new Date(data.last_watered));
        setLastWatered(formattedDateString);
        setMoistureLevel(data.moisture_level);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

  //All logic will be computed here and then sent to the view via the use of props
  return <FrontPageView waterPlant={waterPlant} lastWatered={lastWatered} moistureLevel={moistureLevel} setIOTDeviceMoistureLevel={setIOTDeviceMoistureLevel}></FrontPageView>;
}

export default FrontPagePresenter;
