import styled from 'styled-components';
import { InnerBox, OuterBox, Button, Title, Text} from '../Styles/BaseStyles';
import Slider from '../Styles/Slider';
import { ReactComponent as WaterDrop } from '../Icons/water-drop.svg';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Props {
  lastWatered:string;
  moistureLevel:number;
  currentMoistureLevel:number;
  setIOTDeviceMoistureLevel:(newLevel:number)=>void;
  waterPlant:()=>void;
  statusMessage:string;
  isAutomaticWatering:boolean;
  toggleAutomaticWatering:()=>void;

}

function FrontPageView(props: Props) {

  function waterPlantCB(){
    props.waterPlant();
  }
  function toggleAutoWateringCB(){
    props.toggleAutomaticWatering();
  }

  return (
    <OuterBox>
      <Text />
      <OuterBox>
        <InnerBox>
          <Text>
            <b>
            Last time watered:
            </b> {props.lastWatered}
          </Text>
        </InnerBox>

        <InnerBox>
          <Text>
            <b>
          Current moisture level:
            </b> {props.moistureLevel}%
          </Text>
        </InnerBox>
      </OuterBox>

      <Text>Minimum level of moisture for automatic watering</Text>

      <Slider startValue={props.currentMoistureLevel} setMoisture={props.setIOTDeviceMoistureLevel}/>
      {}

      <Text>Click the button below to manually water the plant</Text>

      <Button onClick={waterPlantCB}>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      {props.statusMessage == "" ? <Text/> : <Text>{props.statusMessage}</Text>}
      {props.isAutomaticWatering ? <Button onClick={toggleAutoWateringCB}>
        Disable Auto Watering
      </Button> : <Button onClick={toggleAutoWateringCB}>
        Enable Auto Watering
      </Button>}
      
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
