import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import { api } from '../services/api';

export default function AddLeadPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.createLead(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save lead.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Add Event Lead</h1>
        <p className="page-subtitle">Save a new business contact met at an event.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <LeadForm 
        title="Contact Details"
        submitLabel="Save Lead"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}