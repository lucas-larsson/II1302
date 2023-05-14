import React, { useEffect, useState } from "react";
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
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 100px;
    background-color: #ffffffce;
    cursor: pointer;
    box-shadow: -1010px 0 0 1000px #2a9d8f; // Increase the shadow size
  }
`;

const SliderValue = styled.span`
  margin-left: 10px;
`;

interface Props {
  startValue:number;
  setMoisture: (value: number) => void;
}

export default function Slider(props: Props) {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    setSliderValue(props.startValue);
  }, [props.startValue]);
  

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
