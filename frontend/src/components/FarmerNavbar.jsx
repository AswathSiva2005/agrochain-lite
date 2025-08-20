import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../App';
import img from '../assets/profile.png'
import { FaLeaf, FaSeedling, FaClipboardList, FaHandHoldingUsd, FaChartBar, FaTasks, FaSignOutAlt, FaComments } from 'react-icons/fa';

const translations = {
  en: {
    addCrop: "Add Crop",
    viewOrders: "View Orders",
    applyLoan: "Apply Loan",
		survey: "Survey",
		todo: "To-Do",
		community: "Community",
		logout: "Logout",
  },
  ta: {
    addCrop: "பயிர் சேர்க்கவும்",
    viewOrders: "ஆர்டர்களை பார்க்கவும்",
    applyLoan: "கடனுக்கு விண்ணப்பிக்கவும்",
		survey: "கணக்கெடுப்பு",
		todo: "செய்ய வேண்டியவை",
		community: "சமூகம்",
		logout: "வெளியேறு",
  }
};

function FarmerNavbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem('agrochain-user-name');
  const { language } = useContext(LanguageContext);

	const handleLogout = () => {
		localStorage.removeItem('agrochain-token');
		localStorage.removeItem('agrochain-role');
		localStorage.removeItem('agrochain-user-name');
		navigate('/login');
	};

	const avatar = localStorage.getItem('agrochain-user-avatar-farmer') || localStorage.getItem('agrochain-user-avatar');

  return (
		<nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2C5F2D', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
				<Link to="/farmer-dashboard" className="navbar-brand text-white fw-bold d-flex align-items-center" style={{ gap: 8, cursor: 'pointer', textDecoration: 'none' }}>
					<FaLeaf style={{ color: '#90EE90' }} size={24} />
					<span>{`AgroChain | ${name || 'Farmer'}`}</span>
				</Link>


				<div className="d-flex gap-2">
					<Link
						to="/farmer/add-crop"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(40,167,69,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaSeedling size={16} />
						<span className="d-none d-md-inline">{translations[language].addCrop}</span>
					</Link>

					<Link
						to="/farmer/view-orders"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(13,110,253,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaClipboardList size={16} />
						<span className="d-none d-md-inline">{translations[language].viewOrders}</span>
					</Link>

					<Link
						to="/farmer/apply-loan"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,193,7,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaHandHoldingUsd size={16} />
						<span className="d-none d-md-inline">{translations[language].applyLoan}</span>
					</Link>

					<Link
						to="/farmer/survey"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(111,66,193,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaChartBar size={16} />
						<span className="d-none d-md-inline">{translations[language].survey}</span>
					</Link>

					<Link
						to="/farmer/todo"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(253,126,20,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaTasks size={16} />
						<span className="d-none d-md-inline">{translations[language].todo}</span>
					</Link>

					<Link
						to="/farmer/community"
						className="btn btn-light d-flex align-items-center gap-2"
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(40,167,69,.28)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#212529'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<FaComments size={16} />
						<span className="d-none d-md-inline">{translations[language].community}</span>
					</Link>

          <button
						className="btn btn-outline-light ms-2 d-flex align-items-center justify-content-center"
            onClick={() => navigate('/farmer/profile')}
						style={{ width: 42, height: 42, borderRadius: '50%', padding: 0, borderWidth: 2, transition: 'all .25s ease' }}
						onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,255,255,.25)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
					>
						<img style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} src={avatar || img} />
					</button>

					<button
						className="btn btn-danger d-flex align-items-center gap-2"
						onClick={handleLogout}
						style={{ borderRadius: 20, padding: '8px 14px', transition: 'all .25s ease', boxShadow: '0 4px 12px rgba(220,53,69,.25)' }}
						onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(220,53,69,.35)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,53,69,.25)'; }}
					>
						<FaSignOutAlt size={16} />
						<span className="d-none d-md-inline"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default FarmerNavbar;
