import styled from 'styled-components';

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90%;
  width: 90%
  padding: 8px;
  margin: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 40px;
  backdrop-filter: blur(2px);
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 90%;
  padding: 10px;
  margin: 3px;
`;
const Title = styled.h1`
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  color: #2a9d8f;
  margin: 2rem;
  padding: 8px;
`;
const SmallTitle = styled.h1`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  color: #2a9d8f;
  margin: 2rem;
  padding: 8px;
`;

const Text = styled.p`
  font-size: 20px;
  text-align: center;
  color: #2a9d8f;
  margin: 5px;
  padding: 8px;
`;
const ErrorText = styled.p`
  font-size: 20px;
  text-align: center;
  color: #ff0000;
  margin: 5px;
  padding: 8px;
`;
interface BtnProps{
  fontSize?:number
}
const Button = styled.button<BtnProps>`
  font-size: ${props => props.fontSize?props.fontSize:28}px;
  font-weight: bold;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  border: none;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  color: white;
  background-color: #2a9d8f;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #21867a;
  }
`;

const RedButton = styled.div`
  background-color: #bf0a30; /* Red */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  border-radius: 90px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #800000;
  }
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #2a9d8f;
`;



export { OuterBox, InnerBox, Button, RedButton, Input, Title, Text, ErrorText, SmallTitle };
