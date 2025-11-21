import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MonthlyBudget from './components/MonthlyBudget';
import StocksTracking from './components/StocksTracking';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<MonthlyBudget />} />
            <Route path="/stocks" element={<StocksTracking />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

