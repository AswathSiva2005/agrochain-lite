import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaUserTag, FaUsers, FaInfoCircle } from 'react-icons/fa';

const translations = {
  en: {
    farmerDetails: "Farmer Details",
    numberOfFarmers: "Number of farmers",
    name: "Name",
    email: "Email",
    userId: "User ID",
    phone: "Phone",
    aadhar: "Aadhar",
    farmerId: "Farmer ID",
    address: "Address",
    state: "State",
    district: "District",
    pincode: "Pincode",
    loading: "Loading...",
    noFarmers: "No farmers found.",
  },
  ta: {
    farmerDetails: "விவசாயி விவரங்கள்",
    numberOfFarmers: "விவசாயிகள் எண்ணிக்கை",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    userId: "பயனர் ஐடி",
    phone: "தொலைபேசி",
    aadhar: "ஆதார்",
    farmerId: "விவசாயி ஐடி",
    address: "முகவரி",
    state: "மாநிலம்",
    district: "மாவட்டம்",
    pincode: "அஞ்சல் குறியீடு",
    loading: "ஏற்றுகிறது...",
    noFarmers: "விவசாயிகள் இல்லை.",
  }
};

const columns = [
  { key: 'name', label: 'name' },
  { key: 'email', label: 'email' },
  { key: 'phone', label: 'phone' },
  { key: 'aadhar', label: 'aadhar' },
  { key: 'farmerId', label: 'farmerId' },
  { key: 'address', label: 'address' },
  { key: 'state', label: 'state' },
  { key: 'district', label: 'district' },
  { key: 'pincode', label: 'pincode' },
  { key: '_id', label: 'userId' },
];

function ServiceProviderUserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('http://localhost:5000/api/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data.filter(u => u.role === 'farmer'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <ServiceProviderNavbar />
      <div className="container mt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-3 mb-3 text-white"
          style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', borderRadius: 14 }}
        >
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }}>
              <FaUsers />
            </div>
            <div className="h5 mb-0">{translations[language].farmerDetails}</div>
          </div>
          <div className="small opacity-75 mt-1">{translations[language].numberOfFarmers}: {users.length}</div>
        </motion.div>
        {loading ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].loading}
          </div>
        ) : users.length === 0 ? (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].noFarmers}
          </div>
        ) : (
          <div className="table-responsive shadow-sm">
            <table className="table table-hover align-middle">
              <thead className="" style={{ background: '#2C5F2D', color: '#fff' }}>
                <tr>
                  {columns.map(col => (
                    <th key={col.key}>{translations[language][col.label]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    {columns.map(col => (
                      <td key={col.key}>{u[col.key] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}


export default ServiceProviderUserDetails;
