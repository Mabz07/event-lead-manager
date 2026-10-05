import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Mail, Building, Calendar } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import AISection from '../components/AISection';
import DeleteModal from '../components/DeleteModal';

export default function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLead(id);
        setLead(data);
      } catch (err) {
        setError(err.message || 'Failed to load lead details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.deleteLead(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete lead.');
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="spinner"></div>
        <span>Loading lead...</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div>
        <div className="alert-error">{error || 'Lead not found.'}</div>
        <Link to="/" className="btn-secondary">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Bar Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link to="/" className="btn-secondary" style={{ padding: '6px 12px' }}>
          <ArrowLeft size={16} />
          <span>Back to Leads</span>
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/leads/${lead.id}/edit`} className="btn-secondary">
            <Edit2 size={16} />
            <span>Edit</span>
          </Link>
          <button onClick={() => setShowDeleteModal(true)} className="btn-secondary" style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{lead.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} /> {lead.company}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> {lead.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} /> {lead.event}
              </span>
            </div>
          </div>
          <div>
            <StatusBadge status={lead.follow_up_status} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Interaction Notes
          </h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {lead.notes}
          </p>
        </div>
      </div>

      {/* Integrated AI Section */}
      <AISection lead={lead} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal 
          leadName={lead.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}