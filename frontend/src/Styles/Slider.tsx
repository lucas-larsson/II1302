import styled from 'styled-components';

const Slider = styled.input`
-webkit-appearance: none;
overflow: hidden;
width: 50%;
height: 25px;
border-radius: 30px;
background-color: #98e098;
outline: none;
&::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 100px;
  background-color: #ffffffce;
  cursor: pointer;
  box-shadow: -315px 0 0 300px #2a9d8f;
}
`;


export {Slider};