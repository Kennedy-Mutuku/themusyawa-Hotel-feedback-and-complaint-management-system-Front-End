import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FeedbackForm = ({ defaultCategory = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: defaultCategory,
  });

  const [status, setStatus] = useState('');

  // Update category if defaultCategory prop changes
  useEffect(() => {
    if (defaultCategory) {
      setFormData((prev) => ({ ...prev, category: defaultCategory }));
    }
  }, [defaultCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      setStatus('✅ Feedback submitted successfully!');
      toast.success('Feedback submitted successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
        category: defaultCategory || '',
      });
      // Clear status message after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('❌ Failed to submit feedback. Try again.');
      toast.error('Failed to submit feedback. Try again.');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="General Feedback">General Feedback</option>
          <option value="Report Corruption">Report Corruption</option>
          <option value="Complaint">Complaint</option>
          {/* Add more categories if needed */}
        </select>

        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          rows={4}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
      <p style={{ marginTop: '10px', color: status.includes('Failed') ? 'red' : 'green' }}>{status}</p>
    </div>
  );
};

export default FeedbackForm;
