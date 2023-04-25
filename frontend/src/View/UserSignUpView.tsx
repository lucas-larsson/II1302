import React from "react";
import styled from "styled-components";
import { Text, OuterBox, Button, Input } from "../Styles/BaseStyles";

interface Props{

}

export default function UserSignUpView(props:Props){

    function signUpAttempt(){

    }
    
    return ( 
    <OuterBox>
        <Text><b>Register now to start using the app!</b></Text>
        <Input type="firstName" placeholder="First name" required />
        <Input type="lastName" placeholder="Last name" required />
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Text></Text> 
        <Button onClick={signUpAttempt} type="submit">Sign Up</Button>
        <Text></Text>
    </OuterBox>)
}