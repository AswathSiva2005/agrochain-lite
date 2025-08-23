import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { LanguageContext } from '../App';
import { FaLeaf, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import img from '../assets/profile.png';

const translations = {
  en: { dashboard: 'AgroChain Buyer', myOrders: 'My Orders', logout: 'Logout' },
  ta: { dashboard: 'AgroChain வாங்குபவர்', myOrders: 'என் ஆர்டர்கள்', logout: 'வெளியேறு' }
};

function BuyerNavbar() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const name = localStorage.getItem('agrochain-user-name');

  const handleLogout = () => {
    localStorage.removeItem('agrochain-token');
    localStorage.removeItem('agrochain-role');
    localStorage.removeItem('agrochain-user-name');
    navigate('/login');
  };

  const avatarSrc = localStorage.getItem('agrochain-user-avatar-buyer') || localStorage.getItem('agrochain-user-avatar') || img;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <div className="container-fluid px-3">
        {/* Brand */}
        <button
          className="navbar-brand d-flex align-items-center fw-bold btn btn-link p-0 m-0 text-decoration-none border-0"
          style={{ gap: 8, color: 'white', background: 'transparent' }}
          onClick={() => navigate('/buyer-dashboard')}
        >
          <FaLeaf style={{ color: '#90EE90' }} /> 
          <span className="d-none d-sm-inline">{`AgroChain | ${name || 'Buyer'}`}</span>
          <span className="d-sm-none">AgroChain</span>
        </button>

        {/* Mobile menu toggle */}
        <button
          className="navbar-toggler border-0 p-1"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{ fontSize: '1.2rem' }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation items */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <div className="navbar-nav ms-auto d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
            
            {/* My Orders */}
            <button
              className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 nav-item"
              onClick={() => {
                navigate('/buyer/orders');
                setIsMenuOpen(false);
              }}
              style={{ 
                borderRadius: 20, 
                padding: '8px 16px', 
                transition: 'all .25s ease',
                minHeight: '44px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = '#ffc107'; 
                e.currentTarget.style.borderColor = '#ffc107'; 
                e.currentTarget.style.color = '#212529'; 
                e.currentTarget.style.transform = 'translateY(-2px)'; 
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.35)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = ''; 
                e.currentTarget.style.borderColor = ''; 
                e.currentTarget.style.color = ''; 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.boxShadow = 'none'; 
              }}
            >
              <FaShoppingCart /> 
              <span className="d-lg-inline">{translations[language].myOrders}</span>
            </button>

            {/* Profile avatar */}
            <button
              className="btn btn-outline-light d-flex align-items-center justify-content-center nav-item"
              onClick={() => {
                navigate('/buyer/profile');
                setIsMenuOpen(false);
              }}
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                padding: 0, 
                borderWidth: 2, 
                transition: 'all .25s ease',
                alignSelf: 'center'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-2px)'; 
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,255,255,.25)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.boxShadow = 'none'; 
              }}
            >
              <img
                style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                src={avatarSrc}
                alt="Profile"
              />
            </button>

            {/* Logout */}
            <button
              className="btn btn-danger d-flex align-items-center justify-content-center gap-2 nav-item"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              style={{ 
                borderRadius: 20, 
                padding: '8px 16px', 
                transition: 'all .2s ease',
                minHeight: '44px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = '#ffc107'; 
                e.currentTarget.style.borderColor = '#ffc107'; 
                e.currentTarget.style.color = '#212529'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = ''; 
                e.currentTarget.style.borderColor = ''; 
                e.currentTarget.style.color = ''; 
              }}
            >
              <FaSignOutAlt />
              <span className="d-lg-inline mobile-only">{translations[language].logout}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BuyerNavbar;
