import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route , useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import FrontPagePresenter from './Presenter/FrontPagePresenter';
import UserSignInPresenter from './Presenter/UserLogInPresenter';
import UserSignUpPresenter from './Presenter/UserSignUpPresenter';
import UserProfilePresenter from './Presenter/UserProfilePresenter';
import UserSignOutPresenter from './Presenter/UserLogOutPresenter';
import { Nav, NavList, NavItem } from './Styles/NavStyles';
import { Button, InnerBox, Title } from './Styles/BaseStyles';
import MainPageAuthPresenter from './Presenter/MainPageAuthPresenter';
import { ReactComponent as Ripple } from './Icons/ripple.svg';


const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #f0f3bd;
  }
`;


function App() {
  const [isLoggedInTest, toggleLoginTest] = useState<Boolean>(false);

  function testLogin() {
    toggleLoginTest(!isLoggedInTest);
  }

  return (
    <Router>
      <Nav>
        {isLoggedInTest ? (
          <NavLink onClick={testLogin} to={"/"}>Test Log-out</NavLink>
        ) : (
          <NavLink onClick={testLogin} to={"/"}>Test Log-in</NavLink>
        )}

        <NavLink to="/"><InnerBox><Ripple width={30} height={30}></Ripple> Home</InnerBox></NavLink>
        
          {isLoggedInTest ? 
          
          <NavList>
            <NavItem>
              <NavLink to="/LogOut">Log Out</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Profile">Profile</NavLink>
            </NavItem>
          </NavList>
          :
          (
            <NavList>
            <NavItem>
              <NavLink to="/LogIn">Log In</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/SignUp">Sign Up</NavLink>
            </NavItem>
            </NavList>
          )
          }
          
        
      </Nav>
      {isLoggedInTest ? (
        <div className="App">
          <Routes>
            <Route path="/" element={<FrontPagePresenter />} />
            <Route path="/LogOut" element={<UserSignOutPresenter />} />
            <Route path="/Profile" element={<UserProfilePresenter />} />
          </Routes>
        </div>
      ) : (
        <Routes>
            <Route path="/" element={<MainPageAuthPresenter />} />
            <Route path="/LogIn" element={<UserSignInPresenter />} />
            <Route path="/SignUp" element={<UserSignUpPresenter />} />
        </Routes>

      )}
    </Router>
  );
}

export default App;
