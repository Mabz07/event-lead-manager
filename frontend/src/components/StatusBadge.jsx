import React from 'react';

const STATUS_CONFIG = {
  'Not Contacted': {
    bg: '#F5EFEB',
    text: '#736257',
    border: '#E8DFD5'
  },
  'Follow Up': {
    bg: '#FBF0E9',
    text: '#AF5828',
    border: '#F1D1BD'
  },
  'Contacted': {
    bg: '#EAF3EF',
    text: '#27634B',
    border: '#CBE2D7'
  },
  'Completed': {
    bg: '#EBF0F5',
    text: '#34526B',
    border: '#CAD8E4'
  }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Not Contacted'];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 9px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: config.bg,
      color: config.text,
      border: `1px solid ${config.border}`,
      whiteSpace: 'nowrap'
    }}>
      {status || 'Not Contacted'}
    </span>
  );
}