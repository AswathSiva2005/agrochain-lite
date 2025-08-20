import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaFileContract, FaCheckCircle, FaTimesCircle, FaClock, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api.js';

const translations = {
  en: {
    panel: "Service Provider Dashboard",
    welcome: "Welcome",
    intro: "Review loan requests, monitor users, and manage loan schemes.",
    loanStats: "Loan Statistics",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
    fieldVisits: "Field Visits",
    totalLoans: "Total Loans",
    viewDetails: "View Details",
    loading: "Loading...",
  },
  ta: {
    panel: "சேவை வழங்குநர் பலகம்",
    welcome: "வரவேற்பு",
    intro: "கடன் விண்ணப்பங்களை பரிசீலிக்கவும், பயனர்களை கண்காணிக்கவும், கடன் திட்டங்களை நிர்வகிக்கவும்.",
    loanStats: "கடன் புள்ளிவிவரங்கள்",
    accepted: "ஏற்றுக்கொள்ளப்பட்டது",
    rejected: "நிராகரிக்கப்பட்டது",
    pending: "நிலுவையில்",
    fieldVisits: "களப் பார்வைகள்",
    totalLoans: "மொத்த கடன்கள்",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    loading: "ஏற்றுகிறது...",
  }
};

function ServiceProviderDashboard() {
  const [designation, setDesignation] = useState('');
  const [loanStats, setLoanStats] = useState({ accepted: 0, rejected: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('agrochain-user-name');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    
    // Fetch current service provider's designation and loan stats
    Promise.all([
      axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API_BASE_URL}/api/loans/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]).then(([userRes, statsRes]) => {
      setDesignation(userRes.data.designation || '');
      setLoanStats(statsRes.data);
    }).catch(() => {
      setDesignation('');
      setLoanStats({ accepted: 0, rejected: 0, pending: 0, total: 0 });
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <ServiceProviderNavbar />
      <div className="container mt-4">
        {/* Header Section */}
        {/* <motion.div
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
        </motion.div> */}

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

        {/* Loan Statistics Dashboard */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">{translations[language].loading}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <h4 className="fw-bold mb-3 d-flex align-items-center">
                  <FaChartLine className="me-2 text-success" />
                  {translations[language].loanStats}
                </h4>
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* Accepted Loans */}
              <div className="col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="card border-0 shadow-lg h-100 cursor-pointer"
                  style={{ borderRadius: 16, borderLeft: '5px solid #28a745' }}
                  onClick={() => navigate('/service-provider/loans?status=approved')}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                >
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(40,167,69,.1)', margin: '0 auto' }}>
                      <FaCheckCircle size={24} color="#28a745" />
                    </div>
                    <h2 className="fw-bold text-success mb-1">{loanStats.accepted}</h2>
                    <h6 className="text-muted mb-2">{translations[language].accepted}</h6>
                    <small className="text-success fw-semibold">{translations[language].viewDetails}</small>
                  </div>
                </motion.div>
              </div>

              {/* Rejected Loans */}
              <div className="col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="card border-0 shadow-lg h-100 cursor-pointer"
                  style={{ borderRadius: 16, borderLeft: '5px solid #dc3545' }}
                  onClick={() => navigate('/service-provider/loans?status=rejected')}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                >
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(220,53,69,.1)', margin: '0 auto' }}>
                      <FaTimesCircle size={24} color="#dc3545" />
                    </div>
                    <h2 className="fw-bold text-danger mb-1">{loanStats.rejected}</h2>
                    <h6 className="text-muted mb-2">{translations[language].rejected}</h6>
                    <small className="text-danger fw-semibold">{translations[language].viewDetails}</small>
                  </div>
                </motion.div>
              </div>

              {/* Pending Loans */}
              <div className="col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="card border-0 shadow-lg h-100 cursor-pointer"
                  style={{ borderRadius: 16, borderLeft: '5px solid #ffc107' }}
                  onClick={() => navigate('/service-provider/loans?status=pending')}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                >
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,193,7,.1)', margin: '0 auto' }}>
                      <FaClock size={24} color="#ffc107" />
                    </div>
                    <h2 className="fw-bold text-warning mb-1">{loanStats.pending}</h2>
                    <h6 className="text-muted mb-2">{translations[language].pending}</h6>
                    <small className="text-warning fw-semibold">{translations[language].viewDetails}</small>
                  </div>
                </motion.div>
              </div>

              {/* Total Loans */}
              <div className="col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="card border-0 shadow-lg h-100 cursor-pointer"
                  style={{ borderRadius: 16, borderLeft: '5px solid #6f42c1' }}
                  onClick={() => navigate('/service-provider/loans')}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                >
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(111,66,193,.1)', margin: '0 auto' }}>
                      <FaHandHoldingUsd size={24} color="#6f42c1" />
                    </div>
                    <h2 className="fw-bold text-purple mb-1" style={{ color: '#6f42c1' }}>{loanStats.total}</h2>
                    <h6 className="text-muted mb-2">{translations[language].totalLoans}</h6>
                    <small className="fw-semibold" style={{ color: '#6f42c1' }}>{translations[language].viewDetails}</small>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ServiceProviderDashboard;
