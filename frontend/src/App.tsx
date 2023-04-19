import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import FrontPagePresenter from './Presenter/FrontPagePresenter';
import UserSignInPresenter from './Presenter/UserSignInPresenter';
import UserSignUpPresenter from './Presenter/UserSignUpPresenter';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/SignIn">Sign In</Link>
          </li>
          <li>
            <Link to="/SignUp">Sign Up</Link>
          </li>
        </ul>
      </nav>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPagePresenter />} />
          <Route path="/SignIn" element={<UserSignInPresenter />} />
          <Route path="/SignUp" element={<UserSignUpPresenter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;