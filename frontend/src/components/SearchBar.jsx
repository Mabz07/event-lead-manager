import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
      <Search 
        size={16} 
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }}
      />
      <input 
        type="text"
        placeholder="Search leads by name, company, email, or event..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        style={{ paddingLeft: '36px', paddingRight: value ? '32px' : '12px' }}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}