import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

import FeedbackList from './FeedbackList';
import FeedbackForm from './FeedbackForm';
import AdminLogin from './components/AdminLogin'; // Ensure casing matches
import PrivateRoute from './components/PrivateRoute'; // Protect routes needing login

// Floating Report Corruption Button component
function ReportCorruptionCTA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/feedback/submit', { state: { defaultCategory: 'Report Corruption' } });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        borderRadius: '50%',
        width: 60,
        height: 60,
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        fontSize: 24,
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
      title="Report Corruption"
      aria-label="Report Corruption"
    >
      🚨
    </button>
  );
}
function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Main content area */}
        <div>
          <ReportCorruptionCTA />

          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/feedback/view" element={<FeedbackList />} />
            </Route>

            <Route path="/feedback/submit" element={<FeedbackFormWrapper />} />

            {/* Catch-all: redirect to submit feedback */}
            <Route path="*" element={<FeedbackFormWrapper />} />
          </Routes>
        </div>

        {/* Footer navigation */}
        <nav style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #ccc' }}>
          <Link to="/feedback/submit" style={{ marginRight: '20px' }}>
            Submit Feedback
          </Link>
          <Link to="/admin-login" style={{ color: 'red' }}>
            Admin Login
          </Link>
        </nav>
      </div>
    </Router>
  );
}


// Wrapper to pass defaultCategory prop from navigation state to FeedbackForm
function FeedbackFormWrapper() {
  const location = useLocation();
  const defaultCategory = location.state?.defaultCategory || '';

  return <FeedbackForm defaultCategory={defaultCategory} />;
}

export default App;
