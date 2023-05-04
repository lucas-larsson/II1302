import styled from 'styled-components';
import { InnerBox, OuterBox, Button, Title , Text, Slider} from '../Styles/BaseStyles';
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

      <Text>Click the button below to water the plant</Text>

      <Slider 
      type="range"
      min="1" 
      max="100"
      />

      <Button>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
