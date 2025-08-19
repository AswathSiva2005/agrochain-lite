import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserTie, FaListAlt, FaUsers, FaFileUpload } from 'react-icons/fa';

const translations = {
  en: {
    panel: "Service Provider Dashboard",
    welcome: "Welcome",
    intro: "Review loan requests, monitor users, and manage loan schemes.",
    loanRequests: "Loan Requests",
    users: "User Details",
    schemes: "Loan Schemes",
    goToLoanRequests: "View Requests",
    goToUsers: "Manage Users",
    goToSchemes: "Upload / View",
    onlyLoanOfficer: "Accessible to Loan Officer",
  },
  ta: {
    panel: "சேவை வழங்குநர் பலகம்",
    welcome: "வரவேற்பு",
    intro: "கடன் விண்ணப்பங்களை பரிசீலிக்கவும், பயனர்களை கண்காணிக்கவும், கடன் திட்டங்களை நிர்வகிக்கவும்.",
    loanRequests: "கடன் விண்ணப்பங்கள்",
    users: "பயனர் விவரங்கள்",
    schemes: "கடன் திட்டங்கள்",
    goToLoanRequests: "விண்ணப்பங்களை பார்க்க",
    goToUsers: "பயனர்களை நிர்வகிக்க",
    goToSchemes: "பதிவேற்ற / பார்க்க",
    onlyLoanOfficer: "Loan Officer க்கு மட்டுமே",
  }
};

function ServiceProviderDashboard() {
  const [designation, setDesignation] = useState('');
  const name = localStorage.getItem('agrochain-user-name');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    // Fetch current service provider's designation
    axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setDesignation(res.data.designation || '');
    }).catch(() => setDesignation(''));
  }, []);

  return (
    <>
      <ServiceProviderNavbar />
      <div className="container mt-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 text-white"
          style={{
            background: 'linear-gradient(135deg, #2C5F2D, #17633A)',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,.15)'
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: 12 }}>
            <div className="d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }}>
              <FaUserTie size={22} />
            </div>
            <div>
              <div className="h5 mb-1">{translations[language].panel}</div>
              <div className="small opacity-75">{translations[language].welcome}, {name || 'Service Provider'} • {translations[language].intro}</div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: 16 }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(25,135,84,.1)', color: '#198754' }}>
                    <FaListAlt />
                  </div>
                  <h5 className="mb-0">{translations[language].loanRequests}</h5>
                </div>
                <div className="text-muted small mb-3">Review and process farmer loan requests.</div>
                <button
                  className="btn btn-success w-100"
                  onClick={() => navigate('/service-provider/loans')}
                  style={{ transition: 'all .2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                >
                  {translations[language].goToLoanRequests}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: 16 }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(13,110,253,.1)', color: '#0d6efd' }}>
                    <FaUsers />
                  </div>
                  <h5 className="mb-0">{translations[language].users}</h5>
                </div>
                <div className="text-muted small mb-3">View and verify user details and documents.</div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate('/service-provider/users')}
                  style={{ transition: 'all .2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                >
                  {translations[language].goToUsers}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: 16 }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,193,7,.12)', color: '#ffc107' }}>
                    <FaFileUpload />
                  </div>
                  <h5 className="mb-0">{translations[language].schemes}</h5>
                </div>
                <div className="text-muted small mb-3">Create and manage loan schemes for farmers.</div>
          <button
                  className={`btn w-100 ${designation === 'Loan Officer' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => designation === 'Loan Officer' && navigate('/service-provider/loan-schemes')}
                  disabled={designation !== 'Loan Officer'}
                  style={{ transition: 'all .2s ease' }}
                  onMouseEnter={(e) => { if (designation === 'Loan Officer') { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                >
                  {translations[language].goToSchemes}
          </button>
                {designation !== 'Loan Officer' && (
                  <div className="small text-muted mt-2">{translations[language].onlyLoanOfficer}</div>
        )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceProviderDashboard;
