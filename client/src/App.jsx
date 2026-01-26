import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { About, Contact, Experience, Hero, Navbar, Works, Education, BeyondCode } from './pages/main';
import { Portal } from './pages/portal/components';
import LoginPage from './pages/login/LoginPage';
import ProjectArchive from './pages/project_archive/ProjectArchive';
import PrivateRoutes from './utils/privateRoutes';
import { UserContextProvider } from '../context/userContext';
import { AuthProvider } from '../context/authContext';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import AskNeilWidget from './components/AskNeilWidget';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8081";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative z-0 bg-primary noise-overlay">
          <ScrollProgress />
          <BackToTop />
              <AskNeilWidget />
          <Toaster position="top-center" toastOptions={{duration:2000}} />
          
          <Routes>
            <Route path="/" element={
              <>
                <div className="bg-purplehue bg-cover bg-no-repeat bg-center">
                  <Navbar />
                  <Hero />
                </div>
                <About />
                <Education />
                <Experience />
                <Works />
                <BeyondCode />
                <div className="relative z-0">
                  <Contact />
                </div>
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoutes/>}>
              <Route path="/portal" element={
                <UserContextProvider>
                  <Portal />
                </UserContextProvider>
              } />
            </Route>
            <Route path="/projects-archive" element={ <ProjectArchive />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
