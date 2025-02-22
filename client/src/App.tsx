import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page/HomePage';
import RequestDetail from './components/request-detail/RequestDetail';
import CancelAll from './components/cancel-all/CancelAll';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/cancel-all" element={<CancelAll />} />
      </Routes>
    </Router>
  );
};

export default App;
