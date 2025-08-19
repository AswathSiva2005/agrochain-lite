import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../App';
import { FaLeaf, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import img from '../assets/profile.png';

const translations = {
  en: { dashboard: 'AgroChain Buyer', myOrders: 'My Orders', logout: 'Logout' },
  ta: { dashboard: 'AgroChain வாங்குபவர்', myOrders: 'என் ஆர்டர்கள்', logout: 'வெளியேறு' }
};

function BuyerNavbar() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const name = localStorage.getItem('agrochain-user-name');

  const handleLogout = () => {
    localStorage.removeItem('agrochain-token');
    localStorage.removeItem('agrochain-role');
    localStorage.removeItem('agrochain-user-name');
    navigate('/login');
  };

  const avatarSrc = localStorage.getItem('agrochain-user-avatar-buyer') || localStorage.getItem('agrochain-user-avatar') || img;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <div className="container">
        <button
          className="navbar-brand d-flex align-items-center fw-bold btn btn-link p-0 m-0 text-decoration-none"
          style={{ gap: 8, color: 'white' }}
          onClick={() => navigate('/buyer-dashboard')}
        >
          <FaLeaf style={{ color: '#90EE90' }} /> {`AgroChain | ${name || 'Buyer'}`}
        </button>

        <div className="d-flex gap-2 ms-auto">
          <button
            className="btn btn-outline-light d-flex align-items-center gap-2"
            onClick={() => navigate('/buyer/orders')}
            style={{ borderRadius: 20, padding: '6px 12px', transition: 'all .25s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <FaShoppingCart /> {translations[language].myOrders}
          </button>

          {/* Profile avatar button */}
          <button
            className="btn btn-outline-light d-flex align-items-center justify-content-center"
            onClick={() => navigate('/buyer/profile')}
            style={{ width: 42, height: 42, borderRadius: '50%', padding: 0, borderWidth: 2, transition: 'all .25s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,255,255,.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <img
              style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
              src={avatarSrc}
              alt="Profile"
            />
          </button>

          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
            style={{ borderRadius: 20, padding: '6px 12px', transition: 'all .2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default BuyerNavbar;



