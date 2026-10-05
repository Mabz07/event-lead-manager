import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import { api } from '../services/api';

export default function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLead() {
      try {
        const data = await api.getLead(id);
        setLead(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve lead data.');
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.updateLead(id, formData);
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update lead.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="spinner"></div>
        <span>Loading lead information...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Edit Event Lead</h1>
        <p className="page-subtitle">Update contact info or interaction status.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {lead && (
        <LeadForm 
          title="Edit Details"
          submitLabel="Save Changes"
          initialData={lead}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}