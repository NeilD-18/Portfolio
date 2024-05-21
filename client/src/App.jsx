import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Portal, LoginPage } from './components';
import { UserContextProvider } from '../context/userContext';

axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <Toaster position="top-center" toastOptions={{duration:2000}} />
        
        <Routes>
          <Route path="/" element={
            <>
              <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                <Navbar />
                <Hero />
              </div>
              <About />
              <Experience />
              <Tech />
              <Works />
              <Feedbacks />
              <div className="relative z-0">
                <Contact />
                <StarsCanvas />
              </div>
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal" element={
            <UserContextProvider>
              <Portal />
            </UserContextProvider>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
