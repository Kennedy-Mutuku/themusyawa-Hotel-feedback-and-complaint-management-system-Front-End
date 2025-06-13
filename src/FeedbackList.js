import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from './config';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(response.data);
    } catch (err) {
      setError('Failed to fetch feedback');
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...feedbacks];

    if (categoryFilter !== 'All') {
      result = result.filter((fb) => fb.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (fb) =>
          (fb.message?.toLowerCase().includes(q) || fb.feedbackText?.toLowerCase().includes(q)) ||
          fb.name?.toLowerCase().includes(q)
      );
    }

    setFilteredFeedbacks(result);
  }, [feedbacks, categoryFilter, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
      toast.success('Feedback deleted');
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  // ✅ Moved this inside the component so it can access fileUrl safely
  const renderFileAttachment = (fileUrl) => {
    if (!fileUrl) return null;

    const fullFileUrl = fileUrl.startsWith('http')
      ? fileUrl
      : `${API_BASE_URL.replace(/\/+$/, '')}/${fileUrl.replace(/^\/+/, '')}`;

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fullFileUrl);

    return (
      <div style={fileContainerStyle}>
        {isImage ? (
          <img
            src={fullFileUrl}
            alt="attachment"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <a
            href={fullFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '1rem',
              color: '#007bff',
              textDecoration: 'underline',
              fontWeight: '600',
            }}
          >
            📎 View Attached File
          </a>
        )}
      </div>
    );
  };

  if (loading) return <p style={loadingStyle}>Loading feedback...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Submitted Feedback</h2>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search by message or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Categories</option>
          <option value="Complaint">Complaint</option>
          <option value="Compliment">Compliment</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Inquiry">Inquiry</option>
          <option value="Other">Other</option>
          <option value="Report Corruption">Report Corruption</option>
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p style={emptyStyle}>No matching feedback found.</p>
      ) : (
        <ul style={listStyle}>
  {filteredFeedbacks.map(({ _id, name, email, category, message, feedbackText, submittedAt, anonymous, fileUrl }) => {
    const formattedDate = submittedAt
      ? new Date(submittedAt).toLocaleString()
      : 'N/A';

    const isImage = fileUrl && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
    const fullFileUrl = fileUrl
      ? fileUrl.startsWith('http')
        ? fileUrl
        : `${API_BASE_URL.replace(/\/+$/, '')}/${fileUrl.replace(/^\/+/, '')}`
      : null;

    return (
      <li key={_id} style={itemStyle}>
        <div style={categoryStyle}>{category}</div>
        <p style={messageStyle}>"{message || feedbackText}"</p>
        <p style={infoStyle}>
          <strong>Name:</strong> {anonymous ? 'Anonymous' : name} |{' '}
          <strong>Email:</strong> {anonymous ? 'Hidden' : email || 'N/A'} |{' '}
          <strong>Date:</strong> {formattedDate}
        </p>
        {fileUrl && (
          <div style={{ marginTop: '10px' }}>
            <strong>Attachment:</strong><br />
            {isImage ? (
              <img
                src={fullFileUrl}
                alt="attachment"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '6px' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            ) : (
              <a
                href={fullFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '1rem',
                  color: '#007bff',
                  textDecoration: 'underline',
                  fontWeight: '600',
                }}
              >
                📎 View Attached File
              </a>
            )}
          </div>
        )}
        <button style={deleteButtonStyle} onClick={() => handleDelete(_id)}>Delete</button>
      </li>
    );
  })}
</ul>

      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// 🔧 Styling
const containerStyle = {
  maxWidth: 800,
  margin: '3rem auto',
  padding: '30px 40px',
  backgroundColor: '#ffffff',
  borderRadius: 15,
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
};

const headerStyle = {
  color: '#007bff',
  marginBottom: 25,
  textAlign: 'center',
  fontWeight: '700',
  fontSize: '2rem',
};

const filterContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 20,
  gap: '10px',
};

const inputStyle = {
  flex: 2,
  padding: '10px',
  fontSize: '1rem',
  borderRadius: 8,
  border: '1px solid #ccc',
};

const selectStyle = {
  flex: 1,
  padding: '10px',
  fontSize: '1rem',
  borderRadius: 8,
  border: '1px solid #ccc',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const itemStyle = {
  backgroundColor: '#f9faff',
  borderRadius: 12,
  padding: '20px 25px',
  marginBottom: 18,
  boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
  position: 'relative',
};

const categoryStyle = {
  display: 'inline-block',
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: 12,
};

const messageStyle = {
  fontSize: '1.1rem',
  fontStyle: 'italic',
  color: '#333',
  marginBottom: 10,
};

const infoStyle = {
  fontSize: '0.85rem',
  color: '#666',
  marginBottom: 12,
};

const fileContainerStyle = {
  marginTop: 10,
  marginBottom: 12,
};

const deleteButtonStyle = {
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '8px 15px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '600',
  position: 'absolute',
  right: 20,
  bottom: 20,
};

const loadingStyle = {
  textAlign: 'center',
  fontSize: '1.2rem',
  marginTop: '3rem',
  color: '#555',
};

const errorStyle = {
  textAlign: 'center',
  color: '#d9534f',
  fontWeight: '600',
  marginTop: '3rem',
};

const emptyStyle = {
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#777',
  marginTop: '3rem',
};

export default FeedbackList;
