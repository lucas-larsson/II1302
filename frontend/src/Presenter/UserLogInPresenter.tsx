import React from "react";
import UserLogInView from "../View/UserLogInView";
import { useNavigate } from "react-router-dom";
import { containsNumber, containsSymbol, isValidEmail } from "../Helpers/Formatting";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser, setSession } from "../store/authSlice";


export default function UserLogInPresenter() {
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function logIn(email: string, password: string) {

    if(email.length < 1 || password.length < 1){
      setErrorMsg("One or more fields are empty.");
      console.log(errorMsg);
      return;
    }
    if(!isValidEmail(email)){
      setErrorMsg("Your email is in an invalid format.");
      console.log(errorMsg);
      return;
    }

    const response = await fetch(
      "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const user = data.user;
      const session = data.session;
      console.log("Logged in:", user);
      console.log("Session:", session);
      setErrorMsg(""); // Clear any previous error message
      dispatch(setAuthenticated(true));
      dispatch(setUser(user));
      dispatch(setSession(session[0]));

      // Navigate to the home page
      navigate("/");
    } else {
      let errorText = "";

      switch (response.status) {
        case 400:
          errorText = "No email found with that password.";
          break;
        default:
          errorText = `An error occurred: ${response.statusText}`;
      }
      console.log(errorText);
      setErrorMsg(errorText);
    }
  }

  return <UserLogInView logIn={logIn}></UserLogInView>;
}
