import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function LeadTable({ leads, onDeleteClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!leads || leads.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '64px 24px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          No event leads found
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto' }}>
          Add the people you meet at conferences and trade shows to manage interactions and follow-ups.
        </p>
        <Link to="/leads/new" className="btn-primary">
          Add Lead
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      overflowX: 'auto',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.875rem'
      }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-surface-subtle)'
          }}>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Company</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Event</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Updated</th>
            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr 
              key={lead.id}
              style={{
                borderBottom: idx !== leads.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                <Link to={`/leads/${lead.id}`} style={{ color: 'inherit' }}>
                  {lead.name}
                </Link>
              </td>
              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{lead.company}</td>
              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{lead.email}</td>
              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{lead.event}</td>
              <td style={{ padding: '14px 16px' }}>
                <StatusBadge status={lead.follow_up_status} />
              </td>
              <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                {formatDate(lead.updated_at)}
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <Link 
                    to={`/leads/${lead.id}`} 
                    title="View Lead"
                    style={{
                      padding: '6px',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Eye size={16} />
                  </Link>
                  <Link 
                    to={`/leads/${lead.id}/edit`} 
                    title="Edit Lead"
                    style={{
                      padding: '6px',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button 
                    onClick={() => onDeleteClick(lead)}
                    title="Delete Lead"
                    style={{
                      padding: '6px',
                      color: 'var(--danger)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}