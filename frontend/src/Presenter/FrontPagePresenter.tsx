import FrontPageView from '../View/FrontPageView';
import React, { useEffect, useState } from 'react';
import { formatDateFromData } from '../Helpers/Formatting';
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";
import URL from '../API';
import { stat } from 'fs';
import { TIMEOUT } from 'dns';
import { text } from 'stream/consumers';
import FrontPageLoadingView from '../View/FrontPageLoadingView';

function FrontPagePresenter() {
    const [lastWatered, setLastWatered] = useState<string>("Never");
    const [moistureLevel, setMoistureLevel] = useState<number>(0);
    const [currentMoistureLevel, setCurrentMoistureLevel] = useState<number>(0);
    const user = useSelector((state: RootState) => state.auth.user);
    const session = useSelector((state: RootState) => state.auth.session);
    const sessionId = session ? session.session_id : '';
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [isAutomaticWatering, setAutomaticWatering] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<string>("");

    useEffect(()=>{
      getPlantData();
    },[])

    const [settingsInitialized, setSettingsInitialized] = useState(false);

    useEffect(() => {
      if (settingsInitialized) {
        setSettings();
      } else {
        setSettingsInitialized(true);
      }
    }, [currentMoistureLevel, isAutomaticWatering]);
    

    async function setSettings() {
      try {
        const response = await fetch(`${URL}plants/plant-settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            person_id: session?.person_id,
            iot_device_id: 123,
            moist_threshold: currentMoistureLevel,
            automatic_mode: isAutomaticWatering,
            session_id: sessionId
          }),
        });
    
        if (!response.ok) {
          showStatusMessage("Error occurred, check your connection to device. " + "(" +response.status + ")");
          return;
        }else {
          console.log("Updated settings successfully");
        }
    
        showStatusMessage("Updated settings successfully!");
        await getPlantData();
    
      } catch (error) {
        if (error instanceof Error){
          console.log(error);
        }
      }
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
          showStatusMessage("Error occurred, check your connection to device. " + "(" + response.status+")");
          throw new Error(`Error: ${response.statusText}`);
        }
    
        console.log("Watered plant successfully " + response.json);
        
        showStatusMessage("Watered plant successfully!");
        await getPlantData();
        
        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
    async function showStatusMessage(text:string) {
      setStatusMessage(text);
      setTimeout(() =>{setStatusMessage("")}, 5000);
    }
    function toggleAutomaticWateringCb(){
      setAutomaticWatering(!isAutomaticWatering);
    }
    function setCurrentMoistureLevelCb(number:number){
      setCurrentMoistureLevel(number);
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
            default:
              errorText = `An error occurred: ${response.statusText}`;
          }
          setLoadError("" + response.status);
          throw new Error(errorText);
        }
    
        const data = await response.json();
        const formattedDateString = formatDateFromData(new Date(data.last_watered));
        setLastWatered(formattedDateString);
        setMoistureLevel(data.moisture_level);
        setCurrentMoistureLevel(data.iot_settings.moist_threshold);
        setLoaded(true);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

  if(!loaded){
    return (<FrontPageLoadingView errorMsg={loadError}></FrontPageLoadingView>)
  }
  //All logic will be computed here and then sent to the view via the use of props
  return (<FrontPageView isAutomaticWatering = {isAutomaticWatering} toggleAutomaticWatering={toggleAutomaticWateringCb} statusMessage={statusMessage} waterPlant={waterPlant} lastWatered={lastWatered} currentMoistureLevel={currentMoistureLevel} moistureLevel={moistureLevel} setIOTDeviceMoistureLevel={setCurrentMoistureLevelCb}></FrontPageView>);
}

export default FrontPagePresenter;
