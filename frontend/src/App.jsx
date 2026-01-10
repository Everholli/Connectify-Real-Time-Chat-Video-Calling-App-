import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import OnboardingPage from './pages/OnboardingPage';

import { Navigate, Route, Routes } from 'react-router';
import {Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLoader from './components/pageLoader.jsx';
import { getAuthUser } from './lib/api.js';

const App = () => {
  const { data:authData, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: true,
  });
  const authUser = authData?.user;
  
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  if(isLoading){
    return <PageLoader />;
  }
  return (
    <div className="h-screen text-5xl" data-theme= "valentine">
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ? (
          <HomePage /> 
          ) : (
            <Navigate to={!isAuthenticated ? '/login' : '/onboarding'}/>
          )} /> 
        <Route path='/signup' element={!authUser? <SignupPage /> : <Navigate to ='/'/>} />
        <Route path='/login' element={!authUser? <LoginPage /> : <Navigate to ='/'/>} />
        <Route path='/chat' element={authUser? <ChatPage /> : <Navigate to ='/login'/>} />
        <Route path='/notifications' element={authUser? <NotificationPage /> : <Navigate to ='/login'/>} />
        <Route path='/call' element={authUser? <CallPage /> : <Navigate to ='/login'/>} />
        <Route path='/onboarding' element={authUser? <OnboardingPage /> : <Navigate to ='/login'/>} />

      </Routes>
      <Toaster position='top-center' reverseOrder={false} />

    </div>
  )
}

export default App