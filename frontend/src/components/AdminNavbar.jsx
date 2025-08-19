import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../App';
import img from '../assets/profile.png';
import { FaLeaf, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const translations = {
  en: {
    dashboard: "AgroChain Admin Dashboard",
    userDetails: "User Details",
  },
  ta: {
    dashboard: "AgroChain நிர்வாகப் பலகம்",
    userDetails: "பயனர் விவரங்கள்",
  }
};

function AdminNavbar() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const avatarSrc = localStorage.getItem('agrochain-user-avatar-admin') || localStorage.getItem('agrochain-user-avatar') || img;

  const handleLogout = () => {
    localStorage.removeItem('agrochain-token');
    localStorage.removeItem('agrochain-role');
    localStorage.removeItem('agrochain-user-name');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)' }}>
      <div className="container">
        <button
          className="navbar-brand btn btn-link p-0 m-0 text-decoration-none d-flex align-items-center"
          style={{ color: 'white', gap: 8 }}
          onClick={() => navigate('/admin-dashboard')}
        >
          <FaLeaf style={{ color: '#90EE90' }} /> {`AgroChain | ${localStorage.getItem('agrochain-user-name') || 'Admin'}`}
        </button>

        <div className="d-flex ms-auto align-items-center">
          <button
            className="btn btn-light ms-2 d-flex align-items-center"
            onClick={() => navigate('/admin/users')}
            style={{ transition: 'all .2s ease', fontWeight: 'bold', gap: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <FaUsers /> {translations[language].userDetails}
          </button>

          <button
            className="btn btn-outline-light ms-2 d-flex align-items-center justify-content-center"
            onClick={() => navigate('/admin/profile')}
            style={{ width: 42, height: 42, borderRadius: '50%', padding: 0, borderWidth: 2, transition: 'all .25s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,255,255,.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <img style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} src={avatarSrc} alt="Profile" />
          </button>

          <button
            className="btn btn-danger ms-2 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
            style={{ borderRadius: 20, padding: '6px 12px', transition: 'all .2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
}


export default AdminNavbar;
