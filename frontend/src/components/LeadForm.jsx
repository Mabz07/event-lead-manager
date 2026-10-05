import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  'Not Contacted',
  'Follow Up',
  'Contacted',
  'Completed'
];

export default function LeadForm({ initialData = {}, onSubmit, isSubmitting, title, submitLabel }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    company: initialData.company || '',
    email: initialData.email || '',
    event: initialData.event || '',
    notes: initialData.notes || '',
    follow_up_status: initialData.follow_up_status || 'Not Contacted'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.company.trim()) errs.company = 'Company name is required.';
    
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.event.trim()) errs.event = 'Event name is required.';
    if (!formData.notes.trim()) errs.notes = 'Interaction notes are required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
        {title}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input 
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Sarah Jenkins"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company">Company *</label>
            <input 
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Nexus Enterprise"
              className="form-input"
              value={formData.company}
              onChange={handleChange}
            />
            {errors.company && <div className="form-error">{errors.company}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input 
              id="email"
              name="email"
              type="email"
              placeholder="sarah@nexussystems.io"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event">Event Name *</label>
            <input 
              id="event"
              name="event"
              type="text"
              placeholder="e.g. SaaS Connect 2026"
              className="form-input"
              value={formData.event}
              onChange={handleChange}
            />
            {errors.event && <div className="form-error">{errors.event}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="follow_up_status">Follow-up Status</label>
          <select 
            id="follow_up_status"
            name="follow_up_status"
            className="form-select"
            value={formData.follow_up_status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Interaction Notes *</label>
          <textarea 
            id="notes"
            name="notes"
            rows="5"
            placeholder="Document key points discussed, product interests, budget, and promised next steps..."
            className="form-textarea"
            value={formData.notes}
            onChange={handleChange}
          />
          {errors.notes && <div className="form-error">{errors.notes}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}