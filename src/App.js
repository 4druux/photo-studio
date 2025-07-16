import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import FormBookingPage from './pages/FormBookingPage';
import BookingPage from './pages/BookingPage';
import NotFoundPage from './pages/NotFoundPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import AdminPage from './pages/AdminPage';

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
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="services" element={<ServicesPage />} />
          </Route>
          <Route path="/formulir" element={<FormBookingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;