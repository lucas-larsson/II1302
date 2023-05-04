import FrontPageView from '../View/FrontPageView';
import React, { useEffect, useState } from 'react';
import { formatDateTime } from '../Helpers/Formatting';

function FrontPagePresenter() {
    const [lastWatered, setLastWatered] = useState<string>("Never");
    const [moistureLevel, setMoistureLevel] = useState<number>(0);

    useEffect(()=>{
      getPlantData();
    },[])

    async function setIOTDeviceMoistureLevel(newLevel:number){
      console.log("This will send a request to API endpoint to change the minimum moisture level for automatic watering");
    }

    async function getPlantData(){
      let plantId:number = 123;
      const response = await fetch(
        `https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/${plantId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedDateString = formatDateTime(new Date(data.last_watered));
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
  return <FrontPageView lastWatered={lastWatered} moistureLevel={moistureLevel} setIOTDeviceMoistureLevel={setIOTDeviceMoistureLevel}></FrontPageView>;
}

export default FrontPagePresenter;
