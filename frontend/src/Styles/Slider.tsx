import React, { useState } from "react";
import styled from "styled-components";

const SliderStyled = styled.input`
  -webkit-appearance: none;
  overflow: hidden;
  width: 50%;
  height: 25px;
  border-radius: 30px;
  background-color: #98e098;
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
          position: relative;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 100px;
    background-color: #ffffffce;
    cursor: pointer;
    z-index: 1001;
    box-shadow: -1010px 0 0 1000px #2a9d8f; // Increase the shadow size
  }
  &::before {
      content: '';
      position: absolute;
      top: 298px;
      left: 25%;
      width: 15%;
      height: 25px;
      border-radius: 100px;
      border-top-right-radius: 0%;
      border-bottom-right-radius: 0%;
      border-right: 5px solid #fff;
      opacity: 0.1;
      background-color: #000;
      z-index: 1000;
    }
  &::after {
      content: '';
      position: absolute;
      top: 298px;
      right: 25%;
      width: 35%;
      height: 25px;
      border-radius: 100px;
      border-bottom-left-radius: 0%;
      border-top-left-radius: 0%;
      border-left: 5px solid #fff;
      opacity: 0.3;
      background-color: #98e098c7;
      z-index: 1002;
    }
    
`;

const SliderValue = styled.span`
  margin-left: 10px;
`;

interface Props {
  setMoisture: (value: number) => void;
}

export default function Slider(props: Props) {
  const [sliderValue, setSliderValue] = useState(50);

  function updateMinMoistureCB(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    props.setMoisture(value);
  }

  return (
    <>
      <SliderStyled
        type="range"
        min="0"
        max="100"
        step="10"
        value={sliderValue}
        onChange={updateMinMoistureCB}
      ></SliderStyled>
      <SliderValue>{sliderValue}%</SliderValue>
    </>
  );
}
