import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import img from '../assets/profile.png';
import { FaLeaf, FaListAlt, FaUsers, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';

const translations = {
  en: {
    dashboard: "Service Provider Dashboard",
    viewLoans: "View Loan Requests",
    userDetails: "User Details",
    loanSchemes: "Loan Schemes",
  },
  ta: {
    dashboard: "சேவை வழங்குநர் பலகம்",
    viewLoans: "கடன் விண்ணப்பங்களை பார்க்கவும்",
    userDetails: "பயனர் விவரங்கள்",
    loanSchemes: "கடன் திட்டங்கள்",
  }
};

function ServiceProviderNavbar() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [designation, setDesignation] = useState('');
  const [avatarSrc, setAvatarSrc] = useState(localStorage.getItem('agrochain-user-avatar-service-provider') || localStorage.getItem('agrochain-user-avatar') || img);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (!token) return;
    fetch('https://agrochain-lite.onrender.com/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const desig = data.designation || '';
        setDesignation(desig);
        const key = desig ? `agrochain-user-avatar-service-provider-${desig.toLowerCase().replace(/\s+/g, '-')}` : 'agrochain-user-avatar-service-provider';
        const src = localStorage.getItem(key) || localStorage.getItem('agrochain-user-avatar-service-provider') || localStorage.getItem('agrochain-user-avatar') || img;
        setAvatarSrc(src);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agrochain-token');
    localStorage.removeItem('agrochain-role');
    localStorage.removeItem('agrochain-user-name');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2C5F2D' }}>
      <div className="container">
        <button
          className="navbar-brand btn btn-link p-0 m-0 text-decoration-none d-flex align-items-center"
          style={{ color: 'white', gap: 8 }}
          onClick={() => navigate('/service-provider-dashboard')}
        >
          <FaLeaf style={{ color: '#90EE90' }} /> {`AgroChain | ${localStorage.getItem('agrochain-user-name') || 'Service Provider'}`}
        </button>

        <div className="d-flex ms-auto align-items-center">
          <button
            className="btn btn-light ms-2 d-flex align-items-center"
            onClick={() => navigate('/service-provider/loans')}
            style={{
              transition: 'all 0.2s ease',
              fontWeight: 'bold',
              gap: 8
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#ffc107';
              e.currentTarget.style.borderColor = '#ffc107';
              e.currentTarget.style.color = '#212529';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaListAlt /> {translations[language].viewLoans}
          </button>
          <button
            className="btn btn-light ms-2 d-flex align-items-center"
            onClick={() => navigate('/service-provider/users')}
            style={{
              transition: 'all 0.2s ease',
              fontWeight: 'bold',
              gap: 8
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#ffc107';
              e.currentTarget.style.borderColor = '#ffc107';
              e.currentTarget.style.color = '#212529';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaUsers /> {translations[language].userDetails}
          </button>
          {designation === 'Loan Officer' && (
            <button
              className="btn btn-light ms-2 d-flex align-items-center"
              onClick={() => navigate('/service-provider/loan-schemes')}
              style={{
                transition: 'all 0.2s ease',
                fontWeight: 'bold',
                gap: 8
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#ffc107';
                e.currentTarget.style.borderColor = '#ffc107';
                e.currentTarget.style.color = '#212529';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaFileAlt /> {translations[language].loanSchemes}
            </button>
          )}
          <button
            className="btn btn-outline-light ms-2 d-flex align-items-center justify-content-center"
            onClick={() => navigate('/service-provider/profile')}
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

export default ServiceProviderNavbar;
