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
  const feedbackRef = useRef();
  const nameInputRef = useRef();
  const fileInputRef = useRef();

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
      setFormData(prev => ({ ...prev, category: defaultCategory }));
    }
  }, [defaultCategory]);

  const handleChange = e => {
    const { name, value, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'anonymous' ? checked :
        name === 'file' ? files[0] :
        value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.category) return toast.error('Please select a feedback category.');
    if (!formData.feedbackText?.trim()) return toast.error('Please enter your feedback.');
    if (!formData.anonymous && (!formData.name.trim() || !formData.email.trim())) {
      return toast.error('Please provide your name and email, or choose to submit anonymously.');
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('feedbackText', formData.feedbackText);
      data.append('category', formData.category);
      data.append('anonymous', formData.anonymous);
      if (formData.file) data.append('file', formData.file);

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
      fileInputRef.current.value = '';
      nameInputRef.current.focus();
    } catch {
      toast.error('❌ Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportClick = () => {
    setFormData(prev => ({ ...prev, category: 'Report Corruption', anonymous: false }));
    setTimeout(() => feedbackRef.current?.focus(), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/90 rounded-xl shadow-xl p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-red-700 uppercase mb-2">
          MACHAKOS LEVEL 5 HOSPITAL
        </h1>
        <h2 className="text-lg text-center text-red-700 font-semibold mb-6">
          Feedback and Complaint Management System
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </>
          )}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select Category</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat} className={cat === 'Report Corruption' ? 'text-red-700 font-bold' : ''}>
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
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="accent-red-600"
            />
            Submit anonymously (optional)
          </label>

          <label
            htmlFor="file-upload"
            className="block border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 text-center cursor-pointer hover:border-red-500 text-sm"
          >
            {formData.file ? formData.file.name : 'Attach a file (optional)'}
          </label>
          <input
            id="file-upload"
            type="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReportClick}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold shadow"
            >
              🚨 Report Corruption
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold shadow disabled:opacity-60"
            >
              {isSubmitting ? '⏳ Submitting...' : '🚀 Submit'}
            </button>
          </div>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          toastStyle={{ borderRadius: '10px', backgroundColor: '#d32f2f', color: 'white', fontWeight: 'bold' }}
          progressStyle={{ background: '#ff6a00', borderRadius: '10px' }}
        />
      </div>
    </div>
  );
}

export default FeedbackForm;
