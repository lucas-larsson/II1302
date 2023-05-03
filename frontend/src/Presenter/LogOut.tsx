import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setSession, setUser } from '../store/authSlice';
import React from 'react';

export function LogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(setAuthenticated(false));
    dispatch(setSession(null));
    dispatch(setUser(null));
    navigate('/');
  }, [dispatch, navigate]);

  return <div></div>; // Return null since we don't need to render anything in this component
}
