import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LanguageContext } from '../../App';
import { FaGlobe, FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

// List of Indian states and districts (sample, add more as needed)
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const translations = {
  en: {
    title: "Farmer Registration",
    subtitle: "Please fill all details to create your farmer account.",
    name: "Name",
    email: "Email",
    phone: "Phone Number",
    aadhar: "Aadhar Number",
    farmerId: "Farmer ID",
    password: "Password",
    address: "Address",
    selectState: "Select State",
    selectDistrict: "Select District",
    pincode: "Pincode",
    otpVerification: "Email OTP Verification",
    enterEmail: "Enter your email",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verifyOtp: "Verify OTP",
    otpVerified: "OTP Verified!",
    register: "Register",
    alreadyAccount: "Already have an account?",
    loginHere: "Login here",
    changeLang: "தமிழ்",
    emailFirst: "Please enter your email first.",
    otpSent: "OTP sent to your email. Please check your inbox.",
    enterEmailOtp: "Enter email and OTP.",
    otpVerifiedMsg: "OTP verified! You can now register.",
    verifyOtpFirst: "Please verify OTP before registering.",
    registrationSuccess: "Registration successful!",
    registrationFailed: "Registration failed",
    otpSentSuccess: "OTP sent successfully!",
    devMode: "(Development mode)",
    failedSendOtp: "Failed to send OTP",
    otpVerificationFailed: "OTP verification failed"
  },
  ta: {
    title: "விவசாயி பதிவு",
    subtitle: "உங்கள் விவசாயி கணக்கை உருவாக்க அனைத்து விவரங்களையும் நிரப்பவும்.",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி எண்",
    aadhar: "ஆதார் எண்",
    farmerId: "விவசாயி அடையாள எண்",
    password: "கடவுச்சொல்",
    address: "முகவரி",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    pincode: "அஞ்சல் குறியீடு",
    otpVerification: "மின்னஞ்சல் OTP சரிபார்ப்பு",
    enterEmail: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    sendOtp: "OTP அனுப்பவும்",
    enterOtp: "OTP உள்ளிடவும்",
    verifyOtp: "OTP சரிபார்க்கவும்",
    otpVerified: "OTP சரிபார்க்கப்பட்டது!",
    register: "பதிவு செய்யவும்",
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginHere: "இங்கே உள்நுழையவும்",
    changeLang: "English",
    emailFirst: "முதலில் உங்கள் மின்னஞ்சலை உள்ளிடவும்.",
    otpSent: "உங்கள் மின்னஞ்சலுக்கு OTP அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்.",
    enterEmailOtp: "மின்னஞ்சல் மற்றும் OTP உள்ளிடவும்.",
    otpVerifiedMsg: "OTP சரிபார்க்கப்பட்டது! இப்போது நீங்கள் பதிவு செய்யலாம்.",
    verifyOtpFirst: "பதிவு செய்வதற்கு முன் OTP ஐ சரிபார்க்கவும்.",
    registrationSuccess: "பதிவு வெற்றிகரமாக முடிந்தது!",
    registrationFailed: "பதிவு தோல்வியடைந்தது",
    otpSentSuccess: "OTP வெற்றிகரமாக அனுப்பப்பட்டது!",
    devMode: "(மேம்பாட்டு முறை)",
    failedSendOtp: "OTP அனுப்புவதில் தோல்வி",
    otpVerificationFailed: "OTP சரிபார்ப்பு தோல்வியடைந்தது"
  }
};

// Sample districts mapping (add more for production)
const districtsByState = {
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri",
    "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
    "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Thoothukudi", "Tiruchirappalli",
    "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram",
    "Virudhunagar"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Belagavi", "Ballari", "Bidar", "Chamarajanagar", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada"
    // ...add all districts
  ],
  // ...add other states and their districts
};

function FarmerRegister() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhar: '', farmerId: '',
    password: '', address: '', state: '', district: '', pincode: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [showMessage, setShowMessage] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Enhanced message display function
  const showNotification = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      showNotification(translations[language].emailFirst, 'error');
      return;
    }
    try {
      const response = await axios.post('https://agrochain-lite.onrender.com/api/auth/send-otp', { email: form.email });
      setOtpSent(true);
      
      // Check if we're in development mode and OTP is returned
      if (response.data.otp) {
        showNotification(`${translations[language].otpSentSuccess} ${translations[language].devMode}: ${response.data.otp}`, 'success');
        setOtp(response.data.otp); // Auto-fill the OTP field
      } else {
        showNotification(translations[language].otpSent, 'success');
      }
    } catch (err) {
      showNotification(err.response?.data?.message || translations[language].failedSendOtp, 'error');
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !otp) {
      showNotification(translations[language].enterEmailOtp, 'error');
      return;
    }
    try {
      await axios.post('https://agrochain-lite.onrender.com/api/auth/verify-otp', { email: form.email, otp });
      setOtpVerified(true);
      showNotification(translations[language].otpVerifiedMsg, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || translations[language].otpVerificationFailed, 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!otpVerified) {
      showNotification(translations[language].verifyOtpFirst, 'error');
      return;
    }
    try {
      await axios.post('https://agrochain-lite.onrender.com/api/auth/register', { ...form, role: 'farmer', otp });
      showNotification(translations[language].registrationSuccess, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || translations[language].registrationFailed, 'error');
    }
  };

  // Get districts for selected state
  const districtOptions = districtsByState[form.state] || [];

  return (
    <motion.div
      className="container mt-4"
      style={{ maxWidth: '100%', padding: '1rem' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Language Toggle */}
      <motion.button
        className="btn btn-light btn-sm position-fixed"
        style={{ 
          top: '20px', 
          right: '20px', 
          borderRadius: '25px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000
        }}
        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          background: 'rgba(255,255,255,1)'
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <FaGlobe className="me-2" />
        {translations[language].changeLang}
      </motion.button>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <motion.div
            className="card shadow-lg p-3 p-md-4 rounded"
            style={{ background: "#f8f9fa", borderRadius: '20px' }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <FaUser size={40} color="#2C5F2D" style={{ marginBottom: "0.5em" }} />
              </motion.div>
              <h3 className="mb-2" style={{ color: "#2C5F2D", fontWeight: "bold" }}>
                {translations[language].title}
              </h3>
              <p className="text-muted" style={{ fontSize: "1.05em" }}>
                {translations[language].subtitle}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].name}</label>
                  <input 
                    name="name" 
                    className="form-control" 
                    placeholder={translations[language].name} 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].email}</label>
                  <input 
                    name="email" 
                    type="email" 
                    className="form-control" 
                    placeholder={translations[language].email} 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].phone}</label>
                  <input 
                    name="phone" 
                    className="form-control" 
                    placeholder={translations[language].phone} 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].aadhar}</label>
                  <input 
                    name="aadhar" 
                    className="form-control" 
                    placeholder={translations[language].aadhar} 
                    value={form.aadhar} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].farmerId}</label>
                  <input 
                    name="farmerId" 
                    className="form-control" 
                    placeholder={translations[language].farmerId} 
                    value={form.farmerId} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">{translations[language].password}</label>
                  <input 
                    name="password" 
                    type="password" 
                    className="form-control" 
                    placeholder={translations[language].password} 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">{translations[language].address}</label>
                  <input 
                    name="address" 
                    className="form-control mb-3" 
                    placeholder={translations[language].address} 
                    value={form.address} 
                    onChange={handleChange} 
                    required 
                  />
                  <div className="row g-2">
                    <div className="col-12 col-md-4">
                      <select
                        name="state"
                        className="form-select"
                        value={form.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{translations[language].selectState}</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <select
                        name="district"
                        className="form-select"
                        value={form.district}
                        onChange={handleChange}
                        required
                        disabled={!form.state}
                      >
                        <option value="">{translations[language].selectDistrict}</option>
                        {districtOptions.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <input 
                        name="pincode" 
                        className="form-control" 
                        placeholder={translations[language].pincode} 
                        value={form.pincode} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                {/* OTP Verification */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="form-label fw-bold d-flex align-items-center mb-3">
                    <i className="fas fa-shield-alt me-2 text-primary"></i>
                    {translations[language].otpVerification}
                  </label>
                  
                  {/* Email Input and Send OTP Button */}
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-7">
                      <motion.input
                        type="email"
                        className={`form-control ${otpSent ? 'border-success' : ''}`}
                        placeholder={translations[language].enterEmail}
                        value={form.email}
                        name="email"
                        onChange={handleChange}
                        required
                        disabled={otpSent}
                        style={{
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          minHeight: '48px',
                          border: otpSent ? '2px solid #28a745' : '2px solid #e9ecef',
                          background: otpSent ? 'rgba(40, 167, 69, 0.1)' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                        whileFocus={{ 
                          scale: 1.02,
                          boxShadow: '0 0 0 3px rgba(13, 110, 253, 0.25)'
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      />
                    </div>
                    <div className="col-12 col-md-5">
                      <motion.button
                        type="button"
                        className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${otpSent ? 'btn-success' : 'btn-primary'}`}
                        onClick={handleSendOtp}
                        disabled={otpSent}
                        style={{
                          borderRadius: '12px',
                          padding: '12px 20px',
                          fontWeight: '600',
                          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                          minHeight: '48px',
                          border: 'none',
                          background: otpSent 
                            ? 'linear-gradient(135deg, #28a745, #20c997)'
                            : 'linear-gradient(135deg, #007bff, #0056b3)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        whileHover={!otpSent ? { 
                          scale: 1.05,
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                        } : {}}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {otpSent ? (
                          <>
                            <i className="fas fa-check"></i>
                            {translations[language].otpSentSuccess}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane"></i>
                            {translations[language].sendOtp}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* OTP Input and Verify Button - Show only after OTP is sent */}
                  {otpSent && (
                    <motion.div
                      className="row g-2 mb-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="col-12 col-md-7">
                        <motion.input
                          type="text"
                          className={`form-control ${otpVerified ? 'border-success' : ''}`}
                          placeholder={translations[language].enterOtp}
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                          maxLength="6"
                          style={{
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            minHeight: '48px',
                            border: otpVerified ? '2px solid #28a745' : '2px solid #e9ecef',
                            background: otpVerified ? 'rgba(40, 167, 69, 0.1)' : 'white',
                            letterSpacing: '2px',
                            textAlign: 'center',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          whileFocus={{ 
                            scale: 1.02,
                            boxShadow: '0 0 0 3px rgba(13, 110, 253, 0.25)'
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        />
                      </div>
                      <div className="col-12 col-md-5">
                        <motion.button
                          type="button"
                          className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${otpVerified ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={handleVerifyOtp}
                          disabled={otpVerified}
                          style={{
                            borderRadius: '12px',
                            padding: '12px 20px',
                            fontWeight: '600',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            minHeight: '48px',
                            border: otpVerified ? 'none' : '2px solid #28a745',
                            background: otpVerified 
                              ? 'linear-gradient(135deg, #28a745, #20c997)'
                              : 'transparent',
                            color: otpVerified ? 'white' : '#28a745',
                            boxShadow: otpVerified ? '0 4px 15px rgba(40, 167, 69, 0.3)' : 'none',
                            transition: 'all 0.3s ease'
                          }}
                          whileHover={!otpVerified ? { 
                            scale: 1.05,
                            background: '#28a745',
                            color: 'white',
                            boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                          } : {}}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {otpVerified ? (
                            <>
                              <i className="fas fa-check-double"></i>
                              {translations[language].otpVerified}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-shield-check"></i>
                              {translations[language].verifyOtp}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Success Badge - Show only when OTP is verified */}
                  {otpVerified && (
                    <motion.div
                      className="alert alert-success d-flex align-items-center py-2 mb-0"
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(25, 135, 84, 0.1))',
                        borderLeft: '4px solid #28a745'
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.i 
                        className="fas fa-check-circle text-success me-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                      />
                      <span className="fw-semibold text-success">{translations[language].otpVerified}</span>
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              <motion.button
                type="submit"
                className="btn w-100 mt-4"
                style={{
                  backgroundColor: '#2C5F2D',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(44,95,45,0.08)',
                  minHeight: '50px'
                }}
                whileHover={{ scale: 1.02, backgroundColor: "#17633A" }}
                whileTap={{ scale: 0.98, backgroundColor: "#17633A" }}
                transition={{ type: "spring", stiffness: 350 }}
                disabled={!otpVerified}
              >
                {translations[language].register}
              </motion.button>
            </form>
            {showMessage && (
              <motion.div
                className={`alert alert-${messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} d-flex align-items-center mb-4`}
                style={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(10px)',
                  background: messageType === 'success' 
                    ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(25, 135, 84, 0.9))'
                    : messageType === 'error'
                    ? 'linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(176, 42, 55, 0.9))'
                    : 'linear-gradient(135deg, rgba(13, 202, 240, 0.9), rgba(11, 172, 204, 0.9))',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Animated background effect */}
                <motion.div
                  className="position-absolute"
                  style={{
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    zIndex: 1
                  }}
                  animate={{
                    left: ['100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="d-flex align-items-center w-100" style={{ zIndex: 2 }}>
                  <div className="me-3">
                    {messageType === 'success' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                      >
                        <i className="fas fa-check-circle" style={{ fontSize: '1.5rem' }}></i>
                      </motion.div>
                    )}
                    {messageType === 'error' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                      >
                        <i className="fas fa-exclamation-circle" style={{ fontSize: '1.5rem' }}></i>
                      </motion.div>
                    )}
                    {messageType === 'info' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                      >
                        <i className="fas fa-info-circle" style={{ fontSize: '1.5rem' }}></i>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-grow-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {message}
                    </motion.div>
                  </div>
                  
                  <motion.button
                    type="button"
                    className="btn-close btn-close-white ms-3"
                    onClick={() => setShowMessage(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      opacity: 0.8
                    }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close notification"
                  />
                </div>
              </motion.div>
            )}

            <div className="mt-4 text-center">
              <hr />
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2">
                <span style={{ color: '#555', fontSize: '1.08em' }}>
                  {translations[language].alreadyAccount}
                </span>
                <a
                  href="/login"
                  className="btn btn-link p-0"
                  style={{
                    color: '#2C5F2D',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    fontSize: '1.08em'
                  }}
                >
                  {translations[language].loginHere}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

}

export default FarmerRegister;
