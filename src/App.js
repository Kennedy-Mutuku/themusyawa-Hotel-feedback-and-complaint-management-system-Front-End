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
import AdminLogin from './components/AdminLogin';
import PrivateRoute from './components/PrivateRoute';

// Floating Report Corruption Button
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

// Wrapper to handle state-passed category
function FeedbackFormWrapper() {
  const location = useLocation();
  const defaultCategory = location.state?.defaultCategory || '';
  return <FeedbackForm defaultCategory={defaultCategory} />;
}

function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: '#dc2626', // red-600
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '1rem',
          paddingBottom: '0.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            maxWidth: '600px',
            width: '98%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 'calc(100vh - 2rem)',
          }}
        >
          <div style={{ flex: 1 }}>
            <ReportCorruptionCTA />

            <Routes>
              <Route path="/admin-login" element={<AdminLogin />} />

              <Route element={<PrivateRoute />}>
                <Route path="/feedback/view" element={<FeedbackList />} />
              </Route>

              <Route path="/feedback/submit" element={<FeedbackFormWrapper />} />

              <Route path="*" element={<FeedbackFormWrapper />} />
            </Routes>
          </div>

          <nav
            style={{
              paddingTop: '1rem',
              textAlign: 'center',
              borderTop: '1px solid #eee',
              marginTop: '1rem',
            }}
          >
            <Link to="/feedback/submit" style={{ marginRight: '20px' }}>
              Submit Feedback
            </Link>
            <Link to="/admin-login" style={{ color: 'red' }}>
              Admin Login
            </Link>
          </nav>
        </div>
      </div>
    </Router>
  );
}

export default App;
