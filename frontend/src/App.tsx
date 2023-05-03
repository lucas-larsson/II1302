import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route , useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import FrontPagePresenter from './Presenter/FrontPagePresenter';
import UserLogInPresenter from './Presenter/UserLogInPresenter';
import UserSignUpPresenter from './Presenter/UserSignUpPresenter';
import UserProfilePresenter from './Presenter/UserProfilePresenter';

import { Nav, NavList, NavItem } from './Styles/NavStyles';
import { Button, InnerBox, Title } from './Styles/BaseStyles';
import MainPageAuthPresenter from './Presenter/MainPageAuthPresenter';
import { ReactComponent as Ripple } from './Icons/ripple.svg';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { setAuthenticated, setSession, setUser } from './store/authSlice';
import { LogOut } from './Presenter/LogOut';


function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Remove the testLogin function and the isLoggedInTest state, since it's not needed anymore

  return (
    <Router>
      <Nav>
        {/* Remove the test login/logout links */}

        <NavLink to="/"><InnerBox><Ripple width={30} height={30}></Ripple> Home</InnerBox></NavLink>
        
          {isAuthenticated ? 
          
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
      {isAuthenticated ? (
        <div className="App">
          <Routes>
            <Route path="/" element={<FrontPagePresenter />} />
            <Route path="/Profile" element={<UserProfilePresenter />} />
            <Route path="/LogOut" element={<LogOut />} />
          </Routes>
        </div>
      ) : (
        <Routes>
            <Route path="/" element={<MainPageAuthPresenter />} />
            <Route path="/LogIn" element={<UserLogInPresenter />} />
            <Route path="/SignUp" element={<UserSignUpPresenter />} />
        </Routes>

      )}
    </Router>
  );
}

export default App;

const NavButton = styled(Button)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #f0f3bd;
  }
`
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