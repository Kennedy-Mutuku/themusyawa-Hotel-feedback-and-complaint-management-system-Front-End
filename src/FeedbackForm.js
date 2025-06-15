import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackForm({ defaultCategory = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackText: '',
    category: defaultCategory || '',
    anonymous: false,
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [reportHover, setReportHover] = useState(false);

  const feedbackRef = useRef(null);
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const categoryOptions = [
    'Compliment',
    'Complaint',
    'Suggestion',
    'Inquiry',
    'Other',
    'Report Corruption',
  ];

  useEffect(() => {
    if (defaultCategory) {
      setFormData((prev) => ({ ...prev, category: defaultCategory }));
    }
  }, [defaultCategory]);

  const handleChange = (e) => {
    const { name, value, checked, files } = e.target;

    if (name === 'anonymous') {
      setFormData((prev) => ({ ...prev, anonymous: checked }));
      return;
    }

    if (name === 'category') {
      setFormData((prev) => ({
        ...prev,
        category: value,
      }));
      return;
    }

    if (name === 'file') {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error('Please select a feedback category.');
      return;
    }
    if (!formData.feedbackText.trim()) {
      toast.error('Please enter your feedback.');
      return;
    }

    if (!formData.anonymous && (!formData.name.trim() || !formData.email.trim())) {
      toast.error('Please provide your name and email, or choose to submit anonymously.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('feedbackText', formData.feedbackText);
      data.append('category', formData.category);
      data.append('anonymous', formData.anonymous);
      if (formData.file) {
        data.append('file', formData.file);
      }

      await axios.post(`${API_BASE_URL}/api/feedback`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('✅ Feedback submitted successfully!');

      setFormData({
        name: '',
        email: '',
        feedbackText: '',
        category: defaultCategory || '',
        anonymous: false,
        file: null,
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
      if (nameInputRef.current) nameInputRef.current.focus();
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportClick = () => {
    setFormData((prev) => ({
      ...prev,
      category: 'Report Corruption',
      anonymous: false,
    }));

    setTimeout(() => {
      if (feedbackRef.current) {
        feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        feedbackRef.current.focus();
      }
    }, 200);
  };

  return (
    <>
      <div style={pageBackgroundStyle}>
        <div style={containerStyle}>
          <h1 style={titleStyle}>MACHAKOS LEVEL 5 HOSPITAL</h1>
          <h2
            style={subTitleStyle}
            className="animated-subtitle"
            title="Feedback and Complaint Management System"
          >
            Feedback and Complaint Management System
          </h2>

          <form onSubmit={handleSubmit} style={formStyle} noValidate>
            {!formData.anonymous && (
              <>
                <input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </>
            )}

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                ...selectStyle,
                color: formData.category === 'Report Corruption' ? '#d32f2f' : '#333',
                fontWeight: formData.category === 'Report Corruption' ? '700' : '600',
              }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  style={{ color: cat === 'Report Corruption' ? '#d32f2f' : 'inherit' }}
                >
                  {cat}
                </option>
              ))}
            </select>

            <textarea
              name="feedbackText"
              placeholder="Your Feedback"
              value={formData.feedbackText}
              onChange={handleChange}
              rows="4"
              required
              ref={feedbackRef}
              style={textareaStyle}
            />

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Submit anonymously (optional, especially for sensitive reports)
            </label>

            <label htmlFor="file-upload" style={inputStyle}>
              {formData.file ? formData.file.name : 'Attach a file (optional)'}
            </label>
            <input
              id="file-upload"
              type="file"
              name="file"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              style={{ display: 'none' }}
              ref={fileInputRef}
            />

            <div style={buttonsWrapperStyle}>
              <button
                type="button"
                onClick={handleReportClick}
                style={{
                  ...reportButtonStyle,
                  backgroundColor: reportHover ? '#d32f2f' : '#ff3b3b',
                }}
                onMouseEnter={() => setReportHover(true)}
                onMouseLeave={() => setReportHover(false)}
              >
                🚨 Report Corruption
              </button>

              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  backgroundColor: btnHover ? '#ff6a00' : '#d32f2f',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit'}
              </button>
            </div>
          </form>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            toastStyle={toastStyle}
            progressStyle={progressStyle}
          />
        </div>

        {/* Inline styles for animation and placeholders */}
        <style>{`
          .animated-subtitle {
            background: linear-gradient(90deg, #d32f2f, #ff6a00, #d32f2f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% auto;
            animation: gradient-slide 3s linear infinite;
            transition: letter-spacing 0.3s ease;
            cursor: default;
            user-select: none;
            font-variant-caps: small-caps;
          }

          .animated-subtitle:hover {
            letter-spacing: 0.18em;
          }

          @keyframes gradient-slide {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          /* Placeholder styles */
          input::placeholder,
          select::placeholder,
          textarea::placeholder {
            color: #a0a0a0;
            font-style: italic;
            font-weight: 500;
            transition: color 0.3s ease, font-style 0.3s ease;
          }

          input:focus::placeholder,
          select:focus::placeholder,
          textarea:focus::placeholder {
            color: #d32f2f;
            font-style: normal;
          }

          input:focus,
          select:focus,
          textarea:focus {
            border-color: #d32f2f;
            box-shadow: 0 0 8px rgba(211, 47, 47, 0.5);
            outline: none;
          }
        `}</style>
      </div>
    </>
  );
}

// ---- STYLES ----

const pageBackgroundStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'radial-gradient(circle at center, #ff6a00 0%, #8b0000 85%)',
  padding: '0', // ✅ Removes extra spacing
};



const containerStyle = {
  width: '96%',          // ✅ Slightly wider
  maxWidth: '700px',     // ✅ Increase max width
  padding: '2.5rem',     // ✅ More inner space
  margin: '1.5rem auto',
  fontFamily: "'Poppins', Arial, sans-serif",
  backgroundColor: 'rgba(255, 255, 255, 0.97)',
  borderRadius: '1rem',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)', // softer shadow
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.2)', // slightly thinner
  position: 'relative',
  zIndex: 1,
  boxSizing: 'border-box',
};



const titleStyle = {
  fontSize: 'clamp(2rem, 6vw, 3.2rem)', // Responsive font size
  fontWeight: '900',
  textAlign: 'center',
  color: '#d32f2f',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  textShadow: `
    1px 1px 0 #b71c1c,
    2px 2px 0 #a31818,
    3px 3px 0 #8c1414,
    4px 4px 0 #760f0f,
    5px 5px 6px rgba(0, 0, 0, 0.4)
  `,
  userSelect: 'none',
  cursor: 'default',
  lineHeight: 1.2,
};

const subTitleStyle = {
  fontSize: 'clamp(1rem, 4.5vw, 1.4rem)', // Also responsive
  fontWeight: '600',
  marginBottom: '1.2rem',
  textAlign: 'center',
  textTransform: 'capitalize',
  color: '#d32f2f',
  fontVariantCaps: 'small-caps',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center everything horizontally
  gap: 15,
};

const inputStyle = {
  border: '2px solid #ccc',
  borderRadius: 8,
  padding: '0.5rem 1rem',
  fontSize: '0.95rem',
  fontWeight: '500',
  fontFamily: "'Poppins', Arial, sans-serif",
  width: '100%',
  maxWidth: '380px',      // 👈 makes inputs shorter
  boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  color: '#333',
  cursor: 'text',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundColor: '#fff',
  cursor: 'pointer',
};



const textareaStyle = {
  ...inputStyle,
  minHeight: 110,
  resize: 'vertical',
  fontWeight: '600',
};

const checkboxLabelStyle = {
  fontWeight: '600',
  fontSize: '0.9rem',
  userSelect: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: '#444',
  marginTop: 5,
  marginBottom: 5,
  maxWidth: '380px', // align checkbox content
};

const checkboxStyle = {
  width: 18,
  height: 18,
  cursor: 'pointer',
  borderRadius: 4,
  border: '2px solid #d32f2f',
};

const buttonsWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: 15,
  marginTop: 15,
  flexWrap: 'wrap',
};

const buttonStyle = {
  cursor: 'pointer',
  borderRadius: 9,
  border: 'none',
  padding: '0.6rem 1.4rem',
  fontWeight: '700',
  fontSize: '1rem',
  color: '#fff',
  backgroundColor: '#d32f2f',
  boxShadow: '0 3px 10px rgba(211, 47, 47, 0.7)',
  transition: 'background-color 0.3s ease',
};

const reportButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ff3b3b',
  boxShadow: '0 3px 15px rgba(255, 59, 59, 0.9)',
  fontSize: '0.95rem',
};

const toastStyle = {
  borderRadius: '10px',
  backgroundColor: '#d32f2f',
  color: 'white',
  fontWeight: '700',
  fontSize: '1rem',
  textShadow: '1px 1px 1px #00000066',
  filter: 'drop-shadow(0 0 2px #9a0000bb)',
};

const progressStyle = {
  background: '#ff6a00',
  borderRadius: '10px',
};



// Export the component
export default FeedbackForm;
