import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import styled from 'styled-components';
import { OuterBox, Text, Title, SmallTitle } from "../Styles/BaseStyles";
import { formatDateFromData } from "../Helpers/Formatting";
import { ReactComponent as Ripple } from '../Icons/ripple.svg';

const DataBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DataEntry = styled.p`
  font-size: 12px;
  margin: 0;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ScrollBox = styled.div`
  height: 240px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
`;


interface PlantData {
  device_id: number;
  moisture_level: number;
  last_watered: string;
  user_id: number;
}

interface UserProfileViewProps {
  plantData: PlantData[];
}

export default function UserProfileView({ plantData }: UserProfileViewProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [timePeriod, setTimePeriod] = useState('DAY');
  const [filteredData, setFilteredData] = useState(plantData);
  const [renderedData, setRenderedData] = useState<React.ReactNode | null>(null);


  useEffect(() => {
    const now = new Date();
    switch(timePeriod) {
      case 'DAY':
        setFilteredData(plantData.filter(plant => (now.getTime() - new Date(plant.last_watered).getTime()) <= 86400000));
        break;
      case 'WEEK':
        setFilteredData(plantData.filter(plant => (now.getTime() - new Date(plant.last_watered).getTime()) <= 604800000));
        break;
      case 'MONTH':
        setFilteredData(plantData.filter(plant => (now.getTime() - new Date(plant.last_watered).getTime()) <= 2629800000));
        break;
      case 'YEAR':
        setFilteredData(plantData.filter(plant => (now.getTime() - new Date(plant.last_watered).getTime()) <= 31557600000));
        break;
      default:
        setFilteredData(plantData);
    }
    setRenderedData(null);
  }, [timePeriod, plantData]);

  useEffect(() => {
    if (filteredData != null) {
      const mappedData = filteredData.map((plant, index) => (
        <DataBox key={index}>
          <DataEntry>IOT Device ID: {"[" + plant.device_id + "] "}</DataEntry>
          <DataEntry>Moisture Level: {"[" + plant.moisture_level + "] "}</DataEntry>
          <DataEntry>Last Watered: {"[" + formatDateFromData(new Date(plant.last_watered)) + "] "}</DataEntry>
          <DataEntry>Person ID: {"[" + plant.user_id + "]"}</DataEntry>
        </DataBox>
      ));
      setRenderedData(mappedData);
    } else {
      setRenderedData(null);
    }
  }, [filteredData]);

  return (
    <OuterBox>
      {user ? (
        <>
        <SmallTitle>User Profile</SmallTitle>
          <Text>Name: {user.name}</Text>
          <Text>Surname: {user.surname}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Person ID: {user.person_id}</Text>
          <SmallTitle>Historical Plant Data:</SmallTitle>
          <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
            <option value="ALL">All</option>
            <option value="DAY">Last Day</option>
            <option value="WEEK">Last Week</option>
            <option value="MONTH">Last Month</option>
            <option value="YEAR">Last Year</option>
          </select>
          {renderedData === null ? (
            <>        
              
              <Ripple width={128} height={128}></Ripple>
              <DataEntry>Loading...</DataEntry>
              </> 
          ) 
          : (<ScrollBox>
            {filteredData.length > 0 ? renderedData : <DataEntry>No data found for this time period.</DataEntry>}</ScrollBox>
          )}
        </>
      ) : (
        <DataEntry>You have to log in to see this page.</DataEntry>
      )}
    </OuterBox>
  );
}