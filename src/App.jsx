import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navigation from './components/Navigation';
import Overview from './pages/Overview';
import TradeBalance from './pages/TradeBalance';
import Exports from './pages/Exports';
import Imports from './pages/Imports';
import TradePartners from './pages/TradePartners';
import TradeAnalytics from './pages/TradeAnalytics';
import Methodology from './pages/Methodology';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <Overview
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            } />
            <Route path="/trade-balance" element={
              <TradeBalance
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            } />
            <Route path="/exports" element={
              <Exports
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            } />
            <Route path="/imports" element={
              <Imports
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            } />
            <Route path="/trade-partners" element={
              <TradePartners
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            } />
            <Route path="/analytics" element={
              <TradeAnalytics
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            } />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </div>
        <footer className="footer mt-5 py-3 bg-dark text-white">
          <div className="container text-center">
            <small>© 2026 Vanuatu Bureau of Statistics | IMTS Dashboard</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
