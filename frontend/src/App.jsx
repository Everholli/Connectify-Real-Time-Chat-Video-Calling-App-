import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import OnboardingPage from './pages/OnboardingPage';

import { Navigate, Route, Routes } from 'react-router-dom';
import {Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLoader from './components/pageLoader.jsx';
import useAuthUser from './hooks/useAuthuser.js';
import { Layout } from './components/Layout.jsx';
import {useThemeStore} from './store/useThemeStore.js';

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  // const authUser = authData?.user;
  
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  if(isLoading){
    return <PageLoader />;
  }



  return (
    <div className="h-screen text-5xl" data-theme= {theme}>
      <Routes>
        <Route 
          path='/' 
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
            <Navigate to={!isAuthenticated ? '/login' : '/onboarding'}/>
          )} 
        /> 

        <Route path='/friends' element={
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        } />

        <Route path='/signup' element={
            !isAuthenticated? <SignupPage /> : <Navigate to ='/'/>
          } 
        />
        <Route 
          path='/login' 
          element={
            !isAuthenticated? <LoginPage /> : <Navigate to ={isOnboarded ? '/' : '/onboarding'}/> 
          } 
        />
        <Route path='/chat' element={
            isAuthenticated? <ChatPage /> : <Navigate to ='/login'/>
          } 
        />
        <Route path='/chat' element={
          <Layout showSidebar={true}>
            <ChatPage />
          </Layout>
        } />
        <Route path='/notifications' element={<NotificationPage />} />
        {/* <Route path='/call' element={isAuthenticated? <CallPage /> : <Navigate to ='/login'/>} /> */}
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
         path='/onboarding' 
         element={isAuthenticated? (
          !isOnboarded ? <OnboardingPage /> : <Navigate to ='/'/>
         ) : (
          <Navigate to ='/login'/>
         )}
        />

      </Routes>
      <Toaster position='top-center' reverseOrder={false} />

    </div>
  )
}

export default App