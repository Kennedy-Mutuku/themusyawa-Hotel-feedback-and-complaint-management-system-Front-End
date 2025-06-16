import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // Ensure lucide-react is installed

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://the-musyawa-hotell-feedback-and.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        toast.success('Login successful!');
        navigate('/feedback/view');
      } else {
        const errData = await response.json();
        const message = errData.message || 'Login failed';
        setError(message);
        toast.error(message);
      }
    } catch (error) {
      setError('Network error');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-blue-200">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 text-center mb-6 animate-pulse">
          Admin Portal
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold">
            Enter Admin Password
          </label>

          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoFocus
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-blue-500 hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
