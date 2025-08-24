import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { LanguageContext } from '../App';
import { motion } from 'framer-motion';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';

const translations = {
  en: {
    register: "Register",
    login: "Login",
    changeLang: "தமிழ்"
  },
  ta: {
    register: "பதிவு செய்யவும்",
    login: "உள்நுழைய",
    changeLang: "English"
  }
};

function Navbar() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.nav
      className="navbar navbar-expand-lg shadow-sm sticky-top"
      style={{
        backgroundColor: '#2C5F2D',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Brand Section with Language Toggle */}
          <div className="d-flex align-items-center gap-3">
            <motion.div
              className="navbar-brand fw-bold mb-0 d-flex align-items-center text-white"
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="d-none d-sm-inline">AgroChain Lite</span>
              <span className="d-sm-none">AgroChain</span>
            </motion.div>

            {/* Language Toggle - Right side of brand */}
            <motion.button
              className="btn btn-light d-flex align-items-center gap-2"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              style={{
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                minHeight: '36px',
                minWidth: '90px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                zIndex: 1050
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                background: 'rgba(255,255,255,1)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
            >
              <FaGlobe size={14} style={{ color: '#2C5F2D' }} />
              <span style={{ color: '#2c3e50' }}>
                {translations[language].changeLang}
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="btn d-lg-none"
            onClick={toggleMenu}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1.2rem',
              color: 'white',
              padding: '8px',
              minHeight: '44px',
              minWidth: '44px'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <motion.button
              className="btn btn-outline-light"
              onClick={() => navigate('/choose-register')}
              style={{
                borderRadius: '20px',
                padding: '8px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                minHeight: '40px',
                border: '2px solid rgba(255,255,255,0.8)',
                color: 'white',
                background: 'transparent',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: 'white',
                color: '#2C5F2D',
                boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].register}
            </motion.button>

            <motion.button
              className="btn btn-light"
              onClick={() => navigate('/login')}
              style={{
                borderRadius: '20px',
                padding: '8px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                minHeight: '40px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#2C5F2D',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.05,
                background: 'white',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].login}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          className={`collapse navbar-collapse d-lg-none ${isMenuOpen ? 'show' : ''}`}
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: 'hidden' }}
        >
          <div className="navbar-nav mt-3 gap-2">
            <motion.button
              className="btn btn-outline-light w-100 mb-2"
              onClick={() => {
                navigate('/choose-register');
                setIsMenuOpen(false);
              }}
              style={{
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600',
                minHeight: '48px',
                border: '2px solid rgba(255,255,255,0.8)',
                color: 'white',
                background: 'transparent'
              }}
              whileHover={{
                backgroundColor: 'white',
                color: '#2C5F2D'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].register}
            </motion.button>

            <motion.button
              className="btn btn-light w-100"
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              style={{
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600',
                minHeight: '48px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#2C5F2D',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              whileHover={{
                background: 'white',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].login}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
