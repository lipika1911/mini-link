import { UrlState } from '@/Context';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RequireAuth = ({children}) => {
  const navigate = useNavigate();
  const {loading, isAuthenticated} = UrlState();

  useEffect(()=>{
    if(!isAuthenticated && loading === false) navigate("/auth");
  },[isAuthenticated, loading]);

  if(loading) return <BarLoader width={"100%"} />;
  if(isAuthenticated) return children;
}

export default RequireAuth;