import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { LanguageContext } from '../App';
import { FaBars, FaTimes } from 'react-icons/fa';

const translations = {
  en: {
    register: "Register",
    login: "Login",
  },
  ta: {
    register: "பதிவு செய்யவும்",
    login: "உள்நுழைய",
  }
};

function Navbar() {
  const { language } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar navbar-expand-lg px-3 px-md-4" style={{ backgroundColor: '#2C5F2D' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold" to="/">
          <span className="d-none d-sm-inline">AgroChain Lite</span>
          <span className="d-sm-none">AgroChain</span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button
          className="navbar-toggler border-0 p-1"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{ fontSize: '1.2rem', color: 'white' }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row gap-2">
            <li className="nav-item">
              <Link
                className="nav-link btn"
                to="/choose-register"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  textAlign: 'center',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#2C5F2D';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {translations[language].register}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link btn"
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  textAlign: 'center',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#2C5F2D';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {translations[language].login}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
