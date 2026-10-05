import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LeadTable from '../components/LeadTable';
import DeleteModal from '../components/DeleteModal';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  // Delete State
  const [leadToDelete, setLeadToDelete] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getLeads({
        search,
        follow_up_status: statusFilter,
        event: eventFilter
      });
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, eventFilter]);

  const fetchEvents = async () => {
    try {
      const evtList = await api.getEvents();
      setEvents(evtList);
    } catch {
      // Fallback silently if events cannot be fetched
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchLeads();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [fetchLeads]);

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      await api.deleteLead(leadToDelete.id);
      setLeadToDelete(null);
      fetchLeads();
      fetchEvents();
    } catch (err) {
      setError(err.message || 'Failed to delete lead.');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setEventFilter('');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Event Leads</h1>
        <p className="page-subtitle">Manage people you meet at events and keep track of follow-ups.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar 
          status={statusFilter}
          onStatusChange={setStatusFilter}
          event={eventFilter}
          onEventChange={setEventFilter}
          eventOptions={events}
          onClear={handleClearFilters}
        />
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Loading leads...</span>
        </div>
      ) : (
        <LeadTable leads={leads} onDeleteClick={(lead) => setLeadToDelete(lead)} />
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <DeleteModal 
          leadName={leadToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setLeadToDelete(null)}
        />
      )}
    </div>
  );
}