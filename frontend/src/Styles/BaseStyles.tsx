import styled from 'styled-components';

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90%;
  width: 90%
  padding: 10px;
  margin: 3px;
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
const Button = styled.button`
  background-color: #0077cc; /* Blue */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005ea6;
  }
`;

const RedButton = styled.div`
background-color: #BF0A30; /* Red */
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
background: #FFFFFF;
border-radius: 10px;
border: none;
`;

const Slider = styled.input`
-webkit-appearance: none;
width: 100%;
height: 20px;
border-radius: 0px;
background-color: #0077cc;
outline: none;
&::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 0px;
  background-color: #234F1E;
  cursor: pointer;
`;


export {OuterBox, InnerBox, Button, RedButton, Input, Slider};