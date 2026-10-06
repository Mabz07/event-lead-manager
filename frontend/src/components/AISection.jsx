import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileText, Send, Mail } from 'lucide-react';
import { api } from '../services/api';

export default function AISection({ lead }) {
  const [summary, setSummary] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setError(null);
    try {
      const res = await api.summarizeNotes(lead.notes);
      setSummary(res.summary);
    } catch (err) {
      setError(err.message || 'Failed to generate summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDraftFollowUp = async () => {
    setLoadingFollowUp(true);
    setError(null);
    try {
      const res = await api.generateFollowUp({
        name: lead.name,
        company: lead.company,
        event: lead.event,
        notes: lead.notes,
      });
      setFollowUp(res.follow_up);
    } catch (err) {
      setError(err.message || 'Failed to generate follow-up.');
    } finally {
      setLoadingFollowUp(false);
    }
  };

  const handleCopy = () => {
    if (!followUp) return;
    navigator.clipboard.writeText(followUp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInGmail = () => {
    if (!followUp) return;
    const subject = encodeURIComponent(`Following up from our meeting at ${lead.event || 'the event'}`);
    const body = encodeURIComponent(followUp);
    const recipient = encodeURIComponent(lead.email || '');
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '24px 32px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Assistant
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Generate summaries and professional emails grounded in your meeting notes.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSummarize} 
            className="btn-secondary"
            disabled={loadingSummary}
          >
            <FileText size={15} />
            <span>{loadingSummary ? 'Summarizing...' : 'Summarize Notes'}</span>
          </button>

          <button 
            onClick={handleDraftFollowUp} 
            className="btn-primary"
            disabled={loadingFollowUp}
          >
            <Send size={15} />
            <span>{loadingFollowUp ? 'Drafting...' : 'Draft Follow-up'}</span>
          </button>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

      {/* Summary Output */}
      {summary && (
        <div style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px',
          marginBottom: '16px'
        }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Interaction Summary
          </h4>
          <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {summary}
          </div>
        </div>
      )}

      {/* Follow-up Draft Output */}
      {followUp && (
        <div style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested Follow-up Message
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleCopy} 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                {copied ? <Check size={13} color="var(--primary)" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button 
                onClick={handleOpenInGmail} 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Mail size={13} />
                <span>Open in Gmail</span>
              </button>
            </div>
          </div>
          <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {followUp}
          </div>
        </div>
      )}
    </div>
  );
}