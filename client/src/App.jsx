import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { About, Contact, Experience, Hero, Navbar, Works } from './pages/main';
import { Portal } from './pages/portal/components';
import LoginPage from './pages/login/LoginPage';
import ProjectArchive from './pages/project_archive/ProjectArchive';
import PrivateRoutes from './utils/privateRoutes';
import { UserContextProvider } from '../context/userContext';
import { AuthProvider } from '../context/authContext';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://neildaterao.com";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <div className="relative z-0 bg-primary">
          <Toaster position="top-center" toastOptions={{duration:2000}} />
          
          <Routes>
            <Route path="/" element={
              <>
                <div className="bg-purplehue bg-cover bg-no-repeat bg-center">
                  <Navbar />
                  <Hero />
                </div>
                <About />
                <Experience />
                <Works />
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
