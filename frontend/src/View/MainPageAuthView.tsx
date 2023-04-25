import { OuterBox, Text, Button } from '../Styles/BaseStyles';
import styled from 'styled-components';
import logo from '../Icons/logoTransparent.png';

const StyledImage = styled.img`
  width: 25%;
  height: 25%;
  border-radius: 5%;
`;

export default function MainPageAuthView() {
  return (
    <OuterBox>
            <StyledImage src={logo}></StyledImage>
      <Text>Dead plants? No more!</Text>
      <Text>
      Our innovative irrigation system is designed to provide an efficient and sustainable way to water your plants. Say goodbye to unreliable manual watering methods that can damage or kill your plants. With H2Oasis, you can enjoy peace of mind knowing that your plants are receiving the optimal amount of water they need to thrive.
        </Text><Text>
        Our system not only helps you save time and resources, but it also contributes to sustainable development by minimizing water waste and promoting plant growth. We hope that you will enjoy using H2Oasis to water your plants in a reliable, efficient, and environmentally-friendly way.
      </Text><Text>  
        Now you can monitor plant health, soil moisture and set up both
        automatic and manual remote watering according to your plant's specific
        needs.
      </Text>
      <Text>
        Fine tune specific parameters for optimal growth and overall wellness.
      </Text>
      
      {/*<Text><b>You must sign up or log in to continue.</b></Text>*/}
      <Text/>
    </OuterBox>
  );
}
