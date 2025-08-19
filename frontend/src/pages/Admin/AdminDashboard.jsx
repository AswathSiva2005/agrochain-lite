import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { useContext } from 'react';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaListAlt, FaUsers, FaShieldAlt } from 'react-icons/fa';

const translations = {
  en: {
    panel: "Admin Panel",
    review: "Review loan requests, monitor transactions, and manage users.",
  },
  ta: {
    panel: "நிர்வாகப் பலகம்",
    review: "கடன் விண்ணப்பங்களை பரிசீலிக்கவும், பரிவர்த்தனைகளை கண்காணிக்கவும், பயனர்களை நிர்வகிக்கவும்.",
  }
};

function AdminDashboard() {
  const name = localStorage.getItem('agrochain-user-name');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', borderRadius: 16 }}
        >
          <div className="h5 mb-1">{translations[language].panel} — {name || 'Admin'}</div>
          <div className="small opacity-75">{translations[language].review}</div>
        </motion.div>

        <div className="row g-4">

          <div className="col-md-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(13,110,253,.1)', color: '#0d6efd' }}>
                    <FaUsers />
                  </div>
                  <h5 className="mb-0">User Details</h5>
                </div>
                <div className="text-muted small mb-3">View and manage all platform users.</div>
                <button className="btn btn-primary w-100" onClick={() => navigate('/admin/users')} style={{ transition: 'all .2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }} onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>Go</button>
              </div>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,117,125,.12)', color: '#6c757d' }}>
                    <FaShieldAlt />
                  </div>
                  <h5 className="mb-0">Admin Tools</h5>
                </div>
                <div className="text-muted small mb-3">Security and configuration quick links.</div>
                <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/admin/tools')} style={{ transition: 'all .2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }} onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>Go</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
