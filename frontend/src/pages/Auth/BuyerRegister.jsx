import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
      setMessage('Please enter your email first.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { email: form.email });
      setOtpSent(true);
      
      // Check if we're in development mode and OTP is returned
      if (response.data.otp) {
        setMessage(`OTP sent successfully! Your OTP is: ${response.data.otp} (Development mode)`);
        setOtp(response.data.otp); // Auto-fill the OTP field
      } else {
        setMessage('OTP sent to your email. Please check your inbox.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !otp) {
      setMessage('Enter email and OTP.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email: form.email, otp });
      setOtpVerified(true);
      setMessage('OTP verified! You can now register.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage('Please verify OTP before registering.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...form, role: 'buyer', otp });
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
      <motion.div
        className="card shadow-lg p-4 rounded"
        style={{ background: "#f8f9fa" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-3">
          <span style={{
            fontSize: "2.2em",
            color: "#2C5F2D",
            marginBottom: "0.5em"
          }}>
            <i className="bi bi-person-plus"></i>
          </span>
          <h3 className="mb-1" style={{ color: "#2C5F2D", fontWeight: "bold" }}>
            Buyer Registration
          </h3>
          <p className="text-muted" style={{ fontSize: "1.05em" }}>
            Please fill all details to create your buyer account.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Name</label>
              <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Email</label>
              <input name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input name="phone" className="form-control" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Aadhar Number</label>
              <input name="aadhar" className="form-control" placeholder="Aadhar Number" value={form.aadhar} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Business Type</label>
              <select
                name="businessType"
                className="form-select"
                value={form.businessType}
                onChange={handleChange}
                required
              >
                <option value="">Select Business Type</option>
                <option value="retailer">Retailer</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="exporter">Exporter</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Password</label>
              <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Grocery Store Name</label>
            <input name="groceryStore" className="form-control mb-2" placeholder="Grocery Store Name" value={form.groceryStore} onChange={handleChange} />
            <label className="form-label fw-bold">Address</label>
            <input name="address" className="form-control mb-2" placeholder="Address" value={form.address} onChange={handleChange} required />
            <div className="row">
              <div className="col-md-4 mb-2">
                <select
                  name="state"
                  className="form-select"
                  value={form.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
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
                  <option value="">Select District</option>
                  {districtOptions.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <input name="pincode" className="form-control" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
              </div>
            </div>
          </div>
          {/* OTP Verification */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email OTP Verification</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
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
                Send OTP
              </button>
            </div>
            {otpSent && (
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
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
                  Verify OTP
                </button>
              </div>
            )}
            {otpVerified && (
              <div className="alert alert-success py-1 mb-2">OTP Verified!</div>
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
            Register
          </motion.button>
        </form>
        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
        <div className="mt-4 text-center">
          <hr />
          <span style={{ color: '#555', fontSize: '1.08em', marginRight: 8 }}>
            Already have an account?
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
            Login here
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BuyerRegister;
