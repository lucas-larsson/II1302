import styled from 'styled-components';
import { InnerBox, OuterBox, Button, Title, Text} from '../Styles/BaseStyles';
import Slider from '../Styles/Slider';
import { ReactComponent as WaterDrop } from '../Icons/water-drop.svg';
import { Timestamp } from 'firebase/firestore';

interface Props {
  lastWatered:string;
  moistureLevel:number;
  setIOTDeviceMoistureLevel:(newLevel:number)=>void;
}

function FrontPageView(props: Props) {
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

      <Slider setMoisture={props.setIOTDeviceMoistureLevel}/>


      <Text>Click the button below to manually water the plant</Text>

      <Button>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
