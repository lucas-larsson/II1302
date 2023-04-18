import styled from 'styled-components';

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90%;
  width: 90%
  padding: 8px;
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


export {OuterBox, InnerBox, Button};