import React from "react";
import UserSignUpView from "../View/UserSignUpView";
import { useNavigate } from "react-router-dom";
import { containsNumber, containsSymbol, isValidEmail } from "../Helpers/Formatting";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser, setSession } from "../store/authSlice";
import URL from "../API";

export default function UserSignUpPresenter() {
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function signUp(firstName: string, lastName: string, email: string, password: string) {

    if(firstName.length < 2 || lastName.length < 2){
      setErrorMsg("Your names must be at least 2 letters long.");
      console.log(errorMsg);
      return;
    }
    if(containsNumber(firstName) || containsSymbol(firstName) || containsNumber(lastName) || containsSymbol(lastName)){
      setErrorMsg("Your name(s) contain illegal symbols.");
      console.log(errorMsg);
      return;
    }
    if(!isValidEmail(email)){
      setErrorMsg("Your email is in an invalid format.");
      console.log(errorMsg);
      return;
    }
    if(password.length < 6){
      setErrorMsg("Your password must be at least 6 characters long");
      console.log(errorMsg);
      return;
    }

    try {
      const response = await fetch(
        `${URL}signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: firstName,
            surname: lastName,
            email: email,
            password: password,
          }),
        }
      );
    
      if (!response.ok) {
        let errorText = "";
        switch (response.status) {
          case 400:
            errorText = "There is already a user with this email address. Please try another email or log in.";
            break;
          default:
            errorText = `An error occurred: ${response.statusText}`;
        }
        throw new Error(errorText);
      }
    
      const data = await response.json();
      const user = data.user;
      const session = data.session;
      console.log("New user:", user);
      console.log("Session:", session);
      setErrorMsg(""); // Clear any previous error message
      dispatch(setAuthenticated(true));
      dispatch(setUser(user));
      dispatch(setSession(session[0]));
    
      // Navigate to the home page
      navigate("/");
    } catch (error) {
      if (error instanceof Error) { // This is a type guard
        console.log(error.message);
        setErrorMsg(error.message);
      }
    }
    
  }

  return <UserSignUpView signUp={signUp} errorMsg={errorMsg}></UserSignUpView>;
}
