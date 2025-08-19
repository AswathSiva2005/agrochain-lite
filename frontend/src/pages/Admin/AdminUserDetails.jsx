import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { LanguageContext } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaMapMarkerAlt,
  FaBuilding,
  FaStore,
  FaShieldAlt,
  FaUserTie,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaChartBar,
  FaDatabase
} from 'react-icons/fa';

const translations = {
  en: {
    userDetails: "User Details",
    numberOfUsers: "Number of users",
    name: "Name",
    email: "Email",
    role: "Role",
    phone: "Phone",
    aadhar: "Aadhar",
    farmerId: "Farmer ID",
    businessType: "Business Type",
    groceryStore: "Grocery Store",
    designation: "Designation",
    organisationName: "Organisation Name",
    branch: "Branch",
    location: "Location",
    branchCode: "Branch Code",
    ngoOrgName: "NGO Name",
    ngoRegNo: "NGO Reg No",
    ngoContact: "NGO Contact",
    ngoAddress: "NGO Address",
    state: "State",
    district: "District",
    pincode: "Pincode",
    loading: "Loading...",
    noUsers: "No users found.",
    userId: "User ID",
    farmerSection: "Farmers",
    buyerSection: "Buyers",
    serviceProviderSection: "Service Providers",
    searchUsers: "Search users...",
    exportData: "Export Data",
    viewDetails: "View Details",
    editUser: "Edit User",
    deleteUser: "Delete User",
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    userStats: "User Statistics"
  },
  ta: {
    userDetails: "பயனர் விவரங்கள்",
    numberOfUsers: "பயனர்கள் எண்ணிக்கை",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    role: "பங்கு",
    phone: "தொலைபேசி",
    aadhar: "ஆதார்",
    farmerId: "விவசாயி ஐடி",
    businessType: "வணிக வகை",
    groceryStore: "கிராசரி கடை",
    designation: "பதவி",
    organisationName: "நிறுவன பெயர்",
    branch: "கிளை",
    location: "இடம்",
    branchCode: "கிளை குறியீடு",
    ngoOrgName: "என்ஜிஓ பெயர்",
    ngoRegNo: "என்ஜிஓ பதிவு எண்",
    ngoContact: "என்ஜிஓ தொடர்பு",
    ngoAddress: "என்ஜிஓ முகவரி",
    state: "மாநிலம்",
    district: "மாவட்டம்",
    pincode: "அஞ்சல் குறியீடு",
    loading: "ஏற்றுகிறது...",
    noUsers: "பயனர்கள் இல்லை.",
    userId: "பயனர் ஐடி",
    farmerSection: "விவசாயிகள்",
    buyerSection: "வாங்குபவர்கள்",
    serviceProviderSection: "சேவை வழங்குநர்கள்",
    searchUsers: "பயனர்களைத் தேடுங்கள்...",
    exportData: "தரவை ஏற்றுமதி செய்யுங்கள்",
    viewDetails: "விவரங்களைக் காண்க",
    editUser: "பயனரைத் திருத்து",
    deleteUser: "பயனரை நீக்கு",
    totalUsers: "மொத்த பயனர்கள்",
    activeUsers: "செயலில் உள்ள பயனர்கள்",
    userStats: "பயனர் புள்ளிவிவரங்கள்"
  }
};

const columnsByRole = {
  farmer: [
    { key: '_id', label: 'userId', icon: FaIdCard },
    { key: 'name', label: 'name', icon: FaUser },
    { key: 'email', label: 'email', icon: FaEnvelope },
    { key: 'role', label: 'role', icon: FaShieldAlt },
    { key: 'phone', label: 'phone', icon: FaPhone },
    { key: 'aadhar', label: 'aadhar', icon: FaIdCard },
    { key: 'state', label: 'state', icon: FaMapMarkerAlt },
    { key: 'district', label: 'district', icon: FaMapMarkerAlt },
    { key: 'pincode', label: 'pincode', icon: FaMapMarkerAlt },
    { key: 'farmerId', label: 'farmerId', icon: FaIdCard },
  ],
  buyer: [
    { key: '_id', label: 'userId', icon: FaIdCard },
    { key: 'name', label: 'name', icon: FaUser },
    { key: 'email', label: 'email', icon: FaEnvelope },
    { key: 'role', label: 'role', icon: FaShieldAlt },
    { key: 'phone', label: 'phone', icon: FaPhone },
    { key: 'aadhar', label: 'aadhar', icon: FaIdCard },
    { key: 'state', label: 'state', icon: FaMapMarkerAlt },
    { key: 'district', label: 'district', icon: FaMapMarkerAlt },
    { key: 'pincode', label: 'pincode', icon: FaMapMarkerAlt },
    { key: 'businessType', label: 'businessType', icon: FaBuilding },
    { key: 'groceryStore', label: 'groceryStore', icon: FaStore },
  ],
  serviceProvider: [
    { key: '_id', label: 'userId', icon: FaIdCard },
    { key: 'name', label: 'name', icon: FaUser },
    { key: 'email', label: 'email', icon: FaEnvelope },
    { key: 'role', label: 'role', icon: FaShieldAlt },
    { key: 'phone', label: 'phone', icon: FaPhone },
    { key: 'aadhar', label: 'aadhar', icon: FaIdCard },
    { key: 'state', label: 'state', icon: FaMapMarkerAlt },
    { key: 'designation', label: 'designation', icon: FaUserTie },
    { key: 'organisationName', label: 'organisationName', icon: FaBuilding },
    { key: 'branch', label: 'branch', icon: FaBuilding },
    { key: 'location', label: 'location', icon: FaMapMarkerAlt },
    { key: 'branchCode', label: 'branchCode', icon: FaIdCard },
    { key: 'ngoOrgName', label: 'ngoOrgName', icon: FaBuilding },
    { key: 'ngoRegNo', label: 'ngoRegNo', icon: FaIdCard },
    { key: 'ngoContact', label: 'ngoContact', icon: FaPhone },
    { key: 'ngoAddress', label: 'ngoAddress', icon: FaMapMarkerAlt },
  ],
};

const roleBadge = (role) => {
  if (role === 'farmer') return <span className="badge bg-success fs-6 px-3 py-2"><FaUser className="me-1" />Farmer</span>;
  if (role === 'buyer') return <span className="badge bg-primary fs-6 px-3 py-2"><FaStore className="me-1" />Buyer</span>;
  if (role === 'serviceProvider') return <span className="badge bg-warning text-dark fs-6 px-3 py-2"><FaUserTie className="me-1" />Service Provider</span>;
  if (role === 'admin') return <span className="badge bg-danger fs-6 px-3 py-2"><FaShieldAlt className="me-1" />Admin</span>;
  return <span className="badge bg-secondary fs-6 px-3 py-2">{role}</span>;
};

function AdminUserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [spType, setSpType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('http://localhost:5000/api/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const roleOptions = [
    { key: 'farmer', label: translations[language].farmerSection, icon: FaUser, color: '#28a745' },
    { key: 'buyer', label: translations[language].buyerSection, icon: FaStore, color: '#007bff' },
    { key: 'serviceProvider', label: translations[language].serviceProviderSection, icon: FaUserTie, color: '#ffc107' },
  ];

  const spTypes = [
    { key: 'all', label: 'All', icon: FaUsers },
    { key: 'Loan Officer', label: 'Loan Officer', icon: FaUserTie },
    { key: 'NGO Field Coordinator', label: 'NGO Field Coordinator', icon: FaBuilding },
  ];

  let filteredUsers = users.filter(u => u.role === selectedRole);
  
  // Apply search filter
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
    );
  }

  let columns = columnsByRole[selectedRole];

  if (selectedRole === 'serviceProvider' && spType !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.designation === spType);
  }

  if (selectedRole === 'serviceProvider' && spType === 'NGO Field Coordinator') {
    columns = columns.filter(col =>
      !['organisationName', 'branch', 'location', 'branchCode'].includes(col.key)
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      y: -10, 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const tableVariants = {
    initial: { opacity: 0, scale: 0.96, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.96, y: -40, transition: { duration: 0.25, ease: "easeIn" } }
  };

  const buttonVariants = {
    initial: { scale: 1, backgroundColor: "#2C5F2D", color: "#fff" },
    whileHover: { scale: 1.07, backgroundColor: "#17633A", color: "#fff" },
    whileTap: { scale: 0.97, backgroundColor: "#17633A", color: "#fff" },
    selected: { scale: 1.12, backgroundColor: "#17633A", color: "#fff", boxShadow: "0 2px 12px rgba(44,95,45,0.18)" }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
        <motion.div
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-4 fw-bold mb-3" style={{ 
              background: 'linear-gradient(135deg, #2C5F2D, #17633A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <FaUsers className="me-3" />
              {translations[language].userDetails}
            </h1>
            <p className="lead text-muted" style={{ fontSize: '1.2rem' }}>
              {translations[language].userStats}
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div 
            className="row g-4 mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="col-md-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16, borderLeft: '6px solid #28a745' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <FaUsers size={48} style={{ color: '#28a745' }} />
                  </div>
                  <h3 className="fw-bold text-primary">{users.length}</h3>
                  <p className="text-muted mb-0">{translations[language].totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16, borderLeft: '6px solid #17a2b8' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <FaUser size={48} style={{ color: '#17a2b8' }} />
                  </div>
                  <h3 className="fw-bold text-info">{filteredUsers.length}</h3>
                  <p className="text-muted mb-0">{translations[language].activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16, borderLeft: '6px solid #6f42c1' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <FaDatabase size={48} style={{ color: '#6f42c1' }} />
                  </div>
                  <h3 className="fw-bold text-purple">{selectedRole}</h3>
                  <p className="text-muted mb-0">Current Role</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="card border-0 shadow-lg mb-4"
            style={{ borderRadius: 16 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card-body p-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaSearch style={{ color: '#6c757d' }} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder={translations[language].searchUsers}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderRadius: '0 8px 8px 0' }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 justify-content-end">
                    <motion.button
                      className="btn btn-outline-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload className="me-2" />
                      {translations[language].exportData}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            className="mb-4 d-flex gap-3 justify-content-center flex-wrap"
            initial="initial"
            animate="animate"
          >
            {roleOptions.map(opt => (
              <motion.button
                key={opt.key}
                className={`btn fw-bold d-flex align-items-center gap-2`}
                style={{
                  borderRadius: 12,
                  border: selectedRole === opt.key ? '2px solid #17633A' : 'none',
                  boxShadow: selectedRole === opt.key ? '0 4px 20px rgba(44,95,45,0.25)' : '0 2px 10px rgba(0,0,0,0.1)',
                  background: selectedRole === opt.key ? opt.color : '#fff',
                  color: selectedRole === opt.key ? '#fff' : '#6c757d'
                }}
                onClick={() => setSelectedRole(opt.key)}
                variants={buttonVariants}
                initial="initial"
                animate={selectedRole === opt.key ? "selected" : "initial"}
                whileHover="whileHover"
                whileTap="whileTap"
                transition={{ type: "spring", stiffness: 350 }}
              >
                <opt.icon size={18} />
                {opt.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Service Provider Type Filter */}
          {selectedRole === 'serviceProvider' && (
            <motion.div
              className="mb-4 d-flex gap-2 justify-content-center flex-wrap"
              initial="initial"
              animate="animate"
            >
              {spTypes.map(sp => (
                <motion.button
                  key={sp.key}
                  className={`btn fw-bold d-flex align-items-center gap-2`}
                  style={{
                    borderRadius: 12,
                    border: spType === sp.key ? '2px solid #17633A' : 'none',
                    boxShadow: spType === sp.key ? '0 4px 20px rgba(44,95,45,0.25)' : '0 2px 10px rgba(0,0,0,0.1)',
                    background: spType === sp.key ? '#ffc107' : '#fff',
                    color: spType === sp.key ? '#212529' : '#6c757d'
                  }}
                  onClick={() => setSpType(sp.key)}
                  variants={buttonVariants}
                  initial="initial"
                  animate={spType === sp.key ? "selected" : "initial"}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  transition={{ type: "spring", stiffness: 350 }}
                >
                  <sp.icon size={18} />
                  {sp.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-5"
            >
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">{translations[language].loading}</span>
              </div>
              <p className="mt-3 text-muted">{translations[language].loading}</p>
            </motion.div>
          ) : filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-5"
            >
              <FaUsers size={64} className="text-muted mb-3" />
              <h5 className="text-muted">{translations[language].noUsers}</h5>
            </motion.div>
          ) : (
            /* Data Table */
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole + spType}
                variants={tableVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="card border-0 shadow-lg"
                style={{ borderRadius: 16, overflow: 'hidden' }}
              >
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                      <tr>
                        {columns.map(col => (
                          <th key={col.key} className="border-0 py-3 px-3">
                            <div className="d-flex align-items-center gap-2">
                              <col.icon size={16} />
                              {translations[language][col.label] || col.label}
                            </div>
                          </th>
                        ))}
                        <th className="border-0 py-3 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, index) => (
                        <motion.tr
                          key={u._id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ duration: 0.25, delay: index * 0.05 }}
                          style={{ cursor: 'pointer' }}
                          className="border-bottom"
                        >
                          {columns.map(col => (
                            <td key={col.key} className="py-3 px-3 align-middle">
                              {col.key === 'role'
                                ? roleBadge(u.role)
                                : u[col.key] || '-'}
                            </td>
                          ))}
                          <td className="py-3 px-3 text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <motion.button
                                className="btn btn-sm btn-outline-primary"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title={translations[language].viewDetails}
                              >
                                <FaEye size={14} />
                              </motion.button>
                              <motion.button
                                className="btn btn-sm btn-outline-warning"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title={translations[language].editUser}
                              >
                                <FaEdit size={14} />
                              </motion.button>
                              <motion.button
                                className="btn btn-sm btn-outline-danger"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title={translations[language].deleteUser}
                              >
                                <FaTrash size={14} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default AdminUserDetails;
