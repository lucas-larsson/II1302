import styled from 'styled-components';
import { InnerBox, OuterBox, Button, Title, Text} from '../Styles/BaseStyles';
import { Slider} from '../Styles/Slider';
import { ReactComponent as WaterDrop } from '../Icons/water-drop.svg';

interface Props {
  //whatever props is needed will be put here like text:String
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
            </b> XX:XX
          </Text>
        </InnerBox>

        <InnerBox>
          <Text>
            <b>
          Current moisture level:
            </b> XX%
          </Text>
        </InnerBox>
      </OuterBox>

      <Text>move the slider to change the moisture level</Text>

      <Slider 
        type="range"
        min="1" 
        max="100"
      />


      <Text>Click the button below to water the plant</Text>

      <Button>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
