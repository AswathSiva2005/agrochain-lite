import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../App';

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

  return (
    <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: '#2C5F2D' }}>
      <Link className="navbar-brand text-white" to="/">
        AgroChain Lite
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/choose-register"
              style={{
                color: 'black',
                backgroundColor: 'transparent',
                transition: 'all 0.3s',
                borderRadius: '5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              {translations[language].register}
            </Link>
          </li>
          <li className="nav-item ms-2">
            <Link
              className="nav-link"
              to="/login"
              style={{
                color: 'black',
                backgroundColor: 'transparent',
                transition: 'all 0.3s',
                borderRadius: '5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = 'black';
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
    </nav>
  );
}

export default Navbar;
