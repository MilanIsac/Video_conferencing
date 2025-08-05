import { Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"

import { Navigate } from "react-router"
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useTheme } from './store/useTheme.js';
import { Profiler } from 'react';
import ProfilePage from './pages/ProfilePage.jsx';

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  const { theme } = useTheme();

  console.log("authUser", authUser);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isOnboarded", isOnboarded);

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>

        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={isAuthenticated ? '/onboarding' : '/login'} />)
        } />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={
          isOnboarded ? '/' : '/onboarding'
        } />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={
          isOnboarded ? '/' : '/onboarding'
        } />} />
        <Route path="/notifications"
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          ) : (
            <Navigate to={isAuthenticated ? '/onboarding' : '/login'} />
          )}
        />

        {/* <Route path="/notifications"
          element={
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          }
        /> */}




        <Route path="/profile/:id" element={
          isAuthenticated && isOnboarded ? (
            <ProfilePage />
          ) : (
            <Navigate to={isAuthenticated ? '/onboarding' : '/login'} />
          )
        } />

        <Route path="/call/:id" element={
          isAuthenticated && isOnboarded ? (
            <CallPage />
          ) : (
            <Navigate to={isAuthenticated ? '/onboarding' : '/login'} />
          )
        } />

        <Route path="/chat/:id" element={
          isAuthenticated && isOnboarded ? (
            <Layout showSidebar={false}>
              <ChatPage />
            </Layout>
          ) : (
            <Navigate to={isAuthenticated ? '/onboarding' : '/login'} />
          )
        } />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? (<OnboardingPage />) : (<Navigate to="/" />)) : (<Navigate to="/login" />)} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App


