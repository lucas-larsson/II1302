import styled from 'styled-components';
import { InnerBox, OuterBox, Button, Title , Text} from '../Styles/BaseStyles';
import { ReactComponent as WaterDrop } from '../Icons/water-drop.svg';

interface Props {
  //whatever props is needed will be put here like text:String
}

function FrontPageView(props: Props) {
  return (
    <OuterBox>
      <Text />
      <InnerBox>
        <div>
          Objects placed inside these inner containers will be put on a row.
        </div>
        <div>Like this.</div>
      </InnerBox>

      <InnerBox>
        <div>
          However, objects placed inside the main container will be put in a
          column.
        </div>
      </InnerBox>

      <p>Click the button below to water the plant</p>

      <Button>
        <WaterDrop width={32} height={32} /> Water
      </Button>
      <Text />
    </OuterBox>
  );
}

export default FrontPageView;
