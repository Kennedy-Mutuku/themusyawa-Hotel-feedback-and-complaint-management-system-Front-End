import React, { useState } from 'react';
import axios from 'axios';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    file: null,
  });

  const [btnHover, setBtnHover] = useState(false);
  const [reportHover, setReportHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://your-backend-api.com/feedback', data);
      alert('✅ Feedback submitted successfully!');
      console.log('Server response:', response.data);
      setFormData({ name: '', email: '', phone: '', category: '', message: '', file: null });
    } catch (error) {
      alert('❌ Submission failed. Try again.');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportClick = () => {
    alert('🚨 Corruption report process initiated.');
  };

  return (
    <div>
      <style>
        {`
        .form-container {
          max-width: 600px;
          margin: auto;
          padding: 2rem;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        input, select, textarea {
          font-size: 1.05rem;
          padding: 0.75rem 1.25rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          width: 100%;
        }

        label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        h1 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 1.2rem;
          text-align: center;
          margin-bottom: 2rem;
          color: #555;
        }

        .buttons-wrapper {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .submit-btn, .report-btn {
          padding: 0.7rem 1.5rem;
          font-size: 1.1rem;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .report-btn {
          background-color: #ff3b3b;
        }

        .submit-btn {
          background-color: #d32f2f;
        }

        @media (max-width: 600px) {
          .form-container {
            padding: 1rem;
            margin: 1rem;
          }

          input, select, textarea {
            font-size: 1rem !important;
            padding: 0.6rem 1rem !important;
          }

          .buttons-wrapper {
            flex-direction: column;
            gap: 0.8rem;
          }

          .submit-btn, .report-btn {
            width: 100%;
            font-size: 1.05rem !important;
            padding: 0.65rem 1.2rem !important;
          }

          h1 {
            font-size: 2.2rem !important;
          }

          h2 {
            font-size: 1rem !important;
          }
        }
        `}
      </style>

      <form onSubmit={handleSubmit} className="form-container" noValidate>
        <h1>📢 Submit Your Feedback</h1>
        <h2>We value your input and aim to serve you better!</h2>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@domain.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="07XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Service Delivery">Service Delivery</option>
          <option value="Corruption">Corruption</option>
          <option value="Staff Conduct">Staff Conduct</option>
          <option value="Facility Hygiene">Facility Hygiene</option>
          <option value="Billing Issues">Billing Issues</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          rows="4"
          placeholder="Write your message here..."
          value={formData.message}
          onChange={handleChange}
          required
        />

        <label htmlFor="file">Attach Screenshot (optional)</label>
        <input
          type="file"
          name="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
        />

        <div className="buttons-wrapper">
          <button
            type="button"
            onClick={handleReportClick}
            className="report-btn"
            onMouseEnter={() => setReportHover(true)}
            onMouseLeave={() => setReportHover(false)}
            style={{
              backgroundColor: reportHover ? '#d32f2f' : '#ff3b3b',
            }}
          >
            🚨 Report Corruption
          </button>

          <button
            type="submit"
            className="submit-btn"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              backgroundColor: btnHover ? '#ff6a00' : '#d32f2f',
              opacity: isSubmitting ? 0.6 : 1,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Submitting...' : '🚀 Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm;
