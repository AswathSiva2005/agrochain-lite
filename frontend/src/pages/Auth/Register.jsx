import { useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';

const translations = {
  en: {
    register: "Register",
    name: "Name",
    email: "Email",
    password: "Password",
    role: "Role",
    submit: "Submit",
    changeLang: "தமிழ்",
  },
  ta: {
    register: "பதிவு செய்யவும்",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    role: "பங்கு",
    submit: "சமர்ப்பிக்கவும்",
    changeLang: "English",
  }
};

function Register() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    aadhar: '',
    farmerId: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
    businessType: '',
    groceryStore: '',
    designation: '',
    organisationName: '',
    branch: '',
    location: '',
    branchCode: '',
    ngoOrgName: '',
    ngoRegNo: '',
    ngoContact: '',
    ngoAddress: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show/hide fields based on role
  const role = formData.role;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://agrochain-lite.onrender.com/api/auth/register', formData);
      setMessage(res.data.message || 'Registration successful ✅');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Registration failed ❌');
    }
  };

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.button
        className="btn btn-outline-secondary mb-3"
        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
        style={{ float: 'right', fontWeight: 'bold', borderRadius: 8 }}
        whileHover={{ backgroundColor: "#17633A", color: "#fff", scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 350 }}
      >
        {translations[language].changeLang}
      </motion.button>
      <motion.div
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: 500 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3
          className="mb-3 text-center text-white p-2 rounded"
          style={{ backgroundColor: '#2C5F2D' }}
        >
          {translations[language].register}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder={translations[language].name}
            name="name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="form-control mb-3"
            placeholder={translations[language].email}
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder={translations[language].password}
            name="password"
            onChange={handleChange}
            required
          />
          <select className="form-select mb-3" name="role" onChange={handleChange} value={formData.role}>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="serviceProvider">Service Provider</option>
            <option value="admin">Admin</option>
          </select>
          {/* Farmer fields */}
          {role === 'farmer' && (
            <>
              <input name="phone" className="form-control mb-2" placeholder="Phone" onChange={handleChange} required />
              <input name="aadhar" className="form-control mb-2" placeholder="Aadhar" onChange={handleChange} required />
              <input name="farmerId" className="form-control mb-2" placeholder="Farmer ID" onChange={handleChange} required />
              <input name="address" className="form-control mb-2" placeholder="Address" onChange={handleChange} required />
              <input name="state" className="form-control mb-2" placeholder="State" onChange={handleChange} required />
              <input name="district" className="form-control mb-2" placeholder="District" onChange={handleChange} required />
              <input name="pincode" className="form-control mb-2" placeholder="Pincode" onChange={handleChange} required />
            </>
          )}
          {/* Buyer fields */}
          {role === 'buyer' && (
            <>
              <input name="phone" className="form-control mb-2" placeholder="Phone" onChange={handleChange} required />
              <input name="aadhar" className="form-control mb-2" placeholder="Aadhar" onChange={handleChange} required />
              <select name="businessType" className="form-select mb-2" onChange={handleChange} required>
                <option value="">Business Type</option>
                <option value="retailer">Retailer</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="exporter">Exporter</option>
              </select>
              <input name="groceryStore" className="form-control mb-2" placeholder="Grocery Store" onChange={handleChange} required />
              <input name="address" className="form-control mb-2" placeholder="Address" onChange={handleChange} required />
              <input name="state" className="form-control mb-2" placeholder="State" onChange={handleChange} required />
              <input name="district" className="form-control mb-2" placeholder="District" onChange={handleChange} required />
              <input name="pincode" className="form-control mb-2" placeholder="Pincode" onChange={handleChange} required />
            </>
          )}
          {/* Service Provider fields */}
          {role === 'serviceProvider' && (
            <>
              <input name="designation" className="form-control mb-2" placeholder="Designation" onChange={handleChange} required />
              <input name="phone" className="form-control mb-2" placeholder="Phone" onChange={handleChange} required />
              <input name="aadhar" className="form-control mb-2" placeholder="Aadhar" onChange={handleChange} required />
              <input name="state" className="form-control mb-2" placeholder="State" onChange={handleChange} required />
              {/* Bank/Loan Officer fields */}
              {(formData.designation === 'Bank Manager' || formData.designation === 'Loan Officer') && (
                <>
                  <input name="organisationName" className="form-control mb-2" placeholder="Organisation Name" onChange={handleChange} required />
                  <input name="branch" className="form-control mb-2" placeholder="Branch" onChange={handleChange} required />
                  <input name="location" className="form-control mb-2" placeholder="Location" onChange={handleChange} required />
                  <input name="branchCode" className="form-control mb-2" placeholder="Branch Code" onChange={handleChange} required />
                </>
              )}
              {/* NGO fields */}
              {formData.designation === 'NGO Field Coordinator' && (
                <>
                  <input name="ngoOrgName" className="form-control mb-2" placeholder="NGO Name" onChange={handleChange} required />
                  <input name="ngoRegNo" className="form-control mb-2" placeholder="NGO Reg No" onChange={handleChange} required />
                  <input name="ngoContact" className="form-control mb-2" placeholder="NGO Contact" onChange={handleChange} required />
                  <input name="ngoAddress" className="form-control mb-2" placeholder="NGO Address" onChange={handleChange} required />
                </>
              )}
            </>
          )}
          {/* Admin fields (only name, email, password needed) */}
          <motion.button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#2C5F2D', color: 'white', transition: 'all 0.3s', fontWeight: 'bold', borderRadius: 8 }}
            whileHover={{ scale: 1.07, backgroundColor: "#17633A", color: "#fff" }}
            whileTap={{ scale: 0.97, backgroundColor: "#17633A", color: "#fff" }}
            transition={{ type: "spring", stiffness: 350 }}
          >
            {translations[language].submit}
          </motion.button>
        </form>

        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Register;
