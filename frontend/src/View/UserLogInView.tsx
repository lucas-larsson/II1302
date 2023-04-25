import React from "react";
import styled from "styled-components";
import { Text, OuterBox, Button, Input } from "../Styles/BaseStyles";

interface Props{

}

export default function UserLogInView(props:Props) {


    function logInAttempt(){

    }


  return (
    <OuterBox>
        <Text><b>Welcome back!</b></Text>
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Password" required />
      <Text></Text> 
      <Button onClick={logInAttempt} type="submit">Log In</Button>
      <Text></Text>
    </OuterBox>
  );
}
