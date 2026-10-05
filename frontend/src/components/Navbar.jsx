import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              Event Lead Manager
            </span>
          </Link>

          <nav style={{ display: 'flex', gap: '8px' }}>
            <Link 
              to="/" 
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: location.pathname === '/' ? 'var(--primary-soft)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Leads
            </Link>
          </nav>
        </div>

        {/* Global Action */}
        <div>
          <Link to="/leads/new" className="btn-primary">
            <Plus size={16} />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>
    </header>
  );
}