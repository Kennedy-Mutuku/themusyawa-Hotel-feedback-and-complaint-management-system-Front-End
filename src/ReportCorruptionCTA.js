import React, { useState } from 'react';

export default function ReportCorruptionCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackText: '',
    anonymous: false,
  });
  const [status, setStatus] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setStatus(null);
    setFormData({ name: '', email: '', feedbackText: '', anonymous: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: 'Report Corruption',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setStatus('success');
      setTimeout(closeModal, 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating round button */}
      <button
        onClick={openModal}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
        aria-label="Report Corruption"
        title="Report Corruption"
      >
        Report<br />Corruption
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001,
          }}
          onClick={closeModal}
        >
          {/* Modal content */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Report Corruption</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                />
              </label>
              <br />
              <label>
                Report details:
                <textarea
                  name="feedbackText"
                  value={formData.feedbackText}
                  onChange={handleChange}
                  placeholder="Describe the corruption issue"
                  required
                  rows={4}
                  style={{ width: '100%' }}
                />
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                /> Report anonymously
              </label>
              <br />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting...' : 'Submit Report'}
              </button>
              {status === 'success' && <p style={{ color: 'green' }}>Thank you for your report!</p>}
              {status === 'error' && <p style={{ color: 'red' }}>Submission failed. Try again.</p>}
            </form>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
