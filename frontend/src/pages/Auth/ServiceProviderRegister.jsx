import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const designations = [
  "Bank Manager",
  "Loan Officer",
  "NGO Field Coordinator"
];

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

function ServiceProviderRegister() {
  const [form, setForm] = useState({
    name: '', designation: '', phone: '', email: '', password: '',
    aadhar: '', organisationName: '', branch: '', location: '', branchCode: '', state: '',
    ngoOrgName: '', ngoRegNo: '', ngoContact: '', ngoAddress: ''
  });
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

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
      await axios.post('http://localhost:5000/api/auth/register', { ...form, role: 'serviceProvider', otp });
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

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
        <h3 className="mb-3 text-center" style={{ color: "#2C5F2D", fontWeight: "bold" }}>
          Service Provider Registration
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-3 rounded" style={{ background: "#e9f7ef", border: "1px solid #2C5F2D" }}>
            <h5 className="mb-3" style={{ color: "#2C5F2D" }}>Personal Info</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Name</label>
                <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Designation</label>
                <select
                  name="designation"
                  className="form-select"
                  value={form.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Designation</option>
                  {/* <option value="Bank Manager">Bank Manager</option> */}
                  <option value="Loan Officer">Loan Officer</option>
                  <option value="NGO Field Coordinator">NGO Field Coordinator</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <input name="phone" className="form-control" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Password</label>
                <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Aadhar Number</label>
                <input name="aadhar" className="form-control" placeholder="Aadhar Number" value={form.aadhar} onChange={handleChange} required />
              </div>
            </div>
          </div>
          {/* Organisation Info for Bank/Loan Officer */}
          {(form.designation === "Bank Manager" || form.designation === "Loan Officer") && (
            <div className="mb-4 p-3 rounded" style={{ background: "#f3e9ef", border: "1px solid #2C5F2D" }}>
              <h5 className="mb-3" style={{ color: "#2C5F2D" }}>Organisation Info</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Bank Name</label>
                  <input name="organisationName" className="form-control" placeholder="Organisation Name" value={form.organisationName} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Branch</label>
                  <input name="branch" className="form-control" placeholder="Branch" value={form.branch} onChange={handleChange} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Location</label>
                  <input name="location" className="form-control" placeholder="Location" value={form.location} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Bank Branch Code</label>
                  <input name="branchCode" className="form-control" placeholder="Bank Branch Code" value={form.branchCode} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">State</label>
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
            </div>
          )}
          {/* Organisation Info for NGO Field Coordinator */}
          {form.designation === "NGO Field Coordinator" && (
            <div className="mb-4 p-3 rounded" style={{ background: "#f3e9ef", border: "1px solid #2C5F2D" }}>
              <h5 className="mb-3" style={{ color: "#2C5F2D" }}>NGO Organisation Info</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">NGO Name</label>
                  <input name="ngoOrgName" className="form-control" placeholder="NGO Name" value={form.ngoOrgName} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">NGO Registration Number</label>
                  <input name="ngoRegNo" className="form-control" placeholder="NGO Registration Number" value={form.ngoRegNo} onChange={handleChange} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">NGO Contact</label>
                  <input name="ngoContact" className="form-control" placeholder="NGO Contact" value={form.ngoContact} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">NGO Address</label>
                  <input name="ngoAddress" className="form-control" placeholder="NGO Address" value={form.ngoAddress} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">State</label>
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
            </div>
          )}
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

export default ServiceProviderRegister;
