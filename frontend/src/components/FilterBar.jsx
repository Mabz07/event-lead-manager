import React from 'react';

const STATUS_OPTIONS = [
  'All Statuses',
  'Not Contacted',
  'Follow Up',
  'Contacted',
  'Completed'
];

export default function FilterBar({ status, onStatusChange, event, onEventChange, eventOptions, onClear }) {
  const hasActiveFilters = Boolean(status || event);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
      <select 
        value={status || ''} 
        onChange={(e) => onStatusChange(e.target.value || null)}
        className="form-select"
        style={{ width: 'auto', minWidth: '150px' }}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt} value={opt === 'All Statuses' ? '' : opt}>{opt}</option>
        ))}
      </select>

      <select 
        value={event || ''} 
        onChange={(e) => onEventChange(e.target.value || null)}
        className="form-select"
        style={{ width: 'auto', minWidth: '150px' }}
      >
        <option value="">All Events</option>
        {eventOptions.map(evt => (
          <option key={evt} value={evt}>{evt}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button 
          onClick={onClear} 
          className="btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.8125rem' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}