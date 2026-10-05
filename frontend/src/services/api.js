const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Leads CRUD
  getLeads: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.follow_up_status) query.append('follow_up_status', params.follow_up_status);
    if (params.event) query.append('event', params.event);
    
    const queryString = query.toString();
    return request(`/api/leads${queryString ? `?${queryString}` : ''}`);
  },

  getLead: (id) => request(`/api/leads/${id}`),

  createLead: (leadData) => request('/api/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  }),

  updateLead: (id, leadData) => request(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(leadData),
  }),

  deleteLead: (id) => request(`/api/leads/${id}`, {
    method: 'DELETE',
  }),

  getEvents: () => request('/api/leads/events'),

  // AI Operations
  summarizeNotes: (notes) => request('/api/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ notes }),
  }),

  generateFollowUp: (leadInfo) => request('/api/ai/follow-up', {
    method: 'POST',
    body: JSON.stringify(leadInfo),
  }),
};