import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import FormBookingPage from './pages/FormBookingPage';
import BookingPage from './pages/BookingPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          duration={5000}
          position="top-right"
          reverseOrder={true}
          toastOptions={{ className: "custom-toast" }}
        />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/formulir" element={<FormBookingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;