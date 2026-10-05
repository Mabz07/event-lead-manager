import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LeadsPage from './pages/LeadsPage';
import AddLeadPage from './pages/AddLeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import EditLeadPage from './pages/EditLeadPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LeadsPage />} />
            <Route path="/leads/new" element={<AddLeadPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />
            <Route path="/leads/:id/edit" element={<EditLeadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}