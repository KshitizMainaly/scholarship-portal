
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScholarshipBanner from './components/ScholorshipBanner';
import Home from './pages/Home';
import ApplyNow from './pages/Apply';
import Blog from './pages/Blog'; 
const App: React.FC = () => {
  return (
    <Router>
      <div className="container px-6 py-3 bg-gradient-to-br bg-white min-h-screen"> 
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <ScholarshipBanner />
              <Home />
            </>
          } />
          <Route path="/apply-now" element={<ApplyNow />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;