import { InnerBox, OuterBox, Button, Text } from '../Styles/BaseStyles';
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
            <b>Last time watered:</b> XX:XX
          </Text>
        </InnerBox>

        <InnerBox>
          <Text>
            <b>Current moisture level:</b> XX%
          </Text>
        </InnerBox>
      </OuterBox>

      <Text>Click the button below to water the plant</Text>

      <Button>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
