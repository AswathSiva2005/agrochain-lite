import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LanguageContext } from '../../App';
import { FaGlobe, FaShoppingCart, FaEnvelope, FaPhone, FaIdCard, FaLock, FaMapMarkerAlt, FaStore } from 'react-icons/fa';

// List of Indian states and districts (reuse from FarmerRegister)
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
    title: "Buyer Registration",
    subtitle: "Please fill all details to create your buyer account.",
    name: "Name",
    email: "Email",
    phone: "Phone Number",
    aadhar: "Aadhar Number",
    businessType: "Business Type",
    password: "Password",
    groceryStore: "Grocery Store Name",
    address: "Address",
    selectState: "Select State",
    selectDistrict: "Select District",
    pincode: "Pincode",
    selectBusinessType: "Select Business Type",
    retailer: "Retailer",
    wholesaler: "Wholesaler",
    exporter: "Exporter",
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
    title: "வாங்குபவர் பதிவு",
    subtitle: "உங்கள் வாங்குபவர் கணக்கை உருவாக்க அனைத்து விவரங்களையும் நிரப்பவும்.",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி எண்",
    aadhar: "ஆதார் எண்",
    businessType: "வணிக வகை",
    password: "கடவுச்சொல்",
    groceryStore: "மளிகை கடை பெயர்",
    address: "முகவரி",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    pincode: "அஞ்சல் குறியீடு",
    selectBusinessType: "வணிக வகையைத் தேர்ந்தெடுக்கவும்",
    retailer: "சில்லறை விற்பனையாளர்",
    wholesaler: "மொத்த விற்பனையாளர்",
    exporter: "ஏற்றுமதியாளர்",
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
  // ...add other states as needed
};

function BuyerRegister() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhar: '',
    password: '', address: '', groceryStore: '', state: '', district: '', pincode: '', businessType: ''
  });
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    // Remove captcha fetch
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email) {
      setMessage(translations[language].emailFirst);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { email: form.email });
      setOtpSent(true);
      
      // Check if we're in development mode and OTP is returned
      if (response.data.otp) {
        setMessage(`${translations[language].otpSentSuccess} Your OTP is: ${response.data.otp} ${translations[language].devMode}`);
        setOtp(response.data.otp); // Auto-fill the OTP field
      } else {
        setMessage(translations[language].otpSent);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || translations[language].failedSendOtp);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !otp) {
      setMessage(translations[language].enterEmailOtp);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email: form.email, otp });
      setOtpVerified(true);
      setMessage(translations[language].otpVerifiedMsg);
    } catch (err) {
      setMessage(err.response?.data?.message || translations[language].otpVerificationFailed);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage(translations[language].verifyOtpFirst);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...form, role: 'buyer', otp });
      setMessage(translations[language].registrationSuccess);
    } catch (err) {
      setMessage(err.response?.data?.message || translations[language].registrationFailed);
    }
  };

  const districtOptions = districtsByState[form.state] || [];

  return (
    <motion.div
      className="container mt-4"
      style={{ maxWidth: 520 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Language Toggle */}
      <motion.button
        className="btn btn-light btn-sm position-absolute"
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

      <motion.div
        className="card shadow-lg p-4 rounded"
        style={{ background: "#f8f9fa" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <FaShoppingCart size={40} color="#2C5F2D" style={{ marginBottom: "0.5em" }} />
          </motion.div>
          <h3 className="mb-1" style={{ color: "#2C5F2D", fontWeight: "bold" }}>
            {translations[language].title}
          </h3>
          <p className="text-muted" style={{ fontSize: "1.05em" }}>
            {translations[language].subtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].name}</label>
              <input name="name" className="form-control" placeholder={translations[language].name} value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].email}</label>
              <input name="email" type="email" className="form-control" placeholder={translations[language].email} value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].phone}</label>
              <input name="phone" className="form-control" placeholder={translations[language].phone} value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].aadhar}</label>
              <input name="aadhar" className="form-control" placeholder={translations[language].aadhar} value={form.aadhar} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].businessType}</label>
              <select
                name="businessType"
                className="form-select"
                value={form.businessType}
                onChange={handleChange}
                required
              >
                <option value="">{translations[language].selectBusinessType}</option>
                <option value="retailer">{translations[language].retailer}</option>
                <option value="wholesaler">{translations[language].wholesaler}</option>
                <option value="exporter">{translations[language].exporter}</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">{translations[language].password}</label>
              <input name="password" type="password" className="form-control" placeholder={translations[language].password} value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">{translations[language].groceryStore}</label>
            <input name="groceryStore" className="form-control mb-2" placeholder={translations[language].groceryStore} value={form.groceryStore} onChange={handleChange} />
            <label className="form-label fw-bold">{translations[language].address}</label>
            <input name="address" className="form-control mb-2" placeholder={translations[language].address} value={form.address} onChange={handleChange} required />
            <div className="row">
              <div className="col-md-4 mb-2">
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
              <div className="col-md-4 mb-2">
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
              <div className="col-md-4 mb-2">
                <input name="pincode" className="form-control" placeholder={translations[language].pincode} value={form.pincode} onChange={handleChange} required />
              </div>
            </div>
          </div>
          {/* OTP Verification */}
          <div className="mb-3">
            <label className="form-label fw-bold">{translations[language].otpVerification}</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="email"
                className="form-control"
                placeholder={translations[language].enterEmail}
                value={form.email}
                name="email"
                onChange={handleChange}
                required
                disabled={otpSent}
                style={{ maxWidth: 220 }}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleSendOtp}
                disabled={otpSent}
                style={{ minWidth: 120 }}
              >
                {translations[language].sendOtp}
              </button>
            </div>
            {otpSent && (
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={translations[language].enterOtp}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{ maxWidth: 220 }}
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                  style={{ minWidth: 120 }}
                >
                  {translations[language].verifyOtp}
                </button>
              </div>
            )}
            {otpVerified && (
              <div className="alert alert-success py-1 mb-2">{translations[language].otpVerified}</div>
            )}
          </div>
          <motion.button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: '#2C5F2D',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1em',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(44,95,45,0.08)'
            }}
            whileHover={{ scale: 1.07, backgroundColor: "#17633A" }}
            whileTap={{ scale: 0.97, backgroundColor: "#17633A" }}
            transition={{ type: "spring", stiffness: 350 }}
            disabled={!otpVerified}
          >
            {translations[language].register}
          </motion.button>
        </form>
        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
        <div className="mt-4 text-center">
          <hr />
          <span style={{ color: '#555', fontSize: '1.08em', marginRight: 8 }}>
            {translations[language].alreadyAccount}
          </span>
          <a
            href="/login"
            className="btn btn-link"
            style={{
              color: '#2C5F2D',
              fontWeight: 'bold',
              textDecoration: 'underline',
              fontSize: '1.08em',
              padding: '0 8px'
            }}
          >
            {translations[language].loginHere}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BuyerRegister;
