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


export {OuterBox, InnerBox};