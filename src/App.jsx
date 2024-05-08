import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Portal } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
     
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
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
