import React, { useEffect, useState } from "react";
import UserProfileView from "../View/UserProfileView";
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";
import { timeStamp } from "console";
import { formatDateToData } from "../Helpers/Formatting";
import URL from "../API";

export default function UserProfilePresenter() {
  const [plantData, setPlantData] = useState([]);
  const session = useSelector((state: RootState) => state.auth.session);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
      getPlantData();
  }, []);


  async function getPlantData() {

    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
    const iotDeviceId = 123; // replace with actual IoT device ID
    const endDate = formatDateToData(currentDate); // replace with actual end date
    const startDate = formatDateToData(twelveMonthsAgo); // replace with actual start date
    const personId = user?.person_id; // replace with actual person ID
    const sessionId = session?.session_id; // replace with actual person ID
  
    try {
      const response = await fetch(
        `${URL}plants/plant-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            iot_device_id: iotDeviceId,
            end_date: endDate,
            start_date: startDate,
            person_id: personId,
          }),
        }
      );
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      setPlantData(data);
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }
    
  }
  

  return <UserProfileView plantData={plantData} />;
}
