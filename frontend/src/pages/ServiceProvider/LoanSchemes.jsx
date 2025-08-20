import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaFileAlt, FaPlus, FaCalendarAlt, FaPercentage, FaRupeeSign, FaClock, FaShieldAlt, FaGift, FaExternalLinkAlt, FaUpload, FaTimes, FaDownload } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api.js';

const translations = {
  en: {
    loanSchemes: "Loan Schemes",
    addNewScheme: "Add New Scheme",
    loading: "Loading...",
    noSchemes: "No loan schemes found.",
    schemeName: "Scheme Name",
    purpose: "Purpose",
    interestRate: "Interest Rate (%)",
    minAmount: "Minimum Amount (₹)",
    maxAmount: "Maximum Amount (₹)",
    repaymentPeriod: "Repayment Period",
    processingFee: "Processing Fee",
    collateralRequired: "Collateral Required",
    collateralDetails: "Collateral Details",
    eligibility: "Eligibility Criteria",
    govtSubsidy: "Government Subsidy",
    subsidyPercent: "Subsidy Percentage (%)",
    requiredDocuments: "Required Documents",
    applyLink: "Application Link",
    brochure: "Brochure (PDF)",
    expiryDate: "Expiry Date",
    save: "Save Scheme",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    download: "Download",
    active: "Active",
    expired: "Expired",
    checkingAccess: "Checking access...",
    schemeAdded: "Loan scheme added successfully!",
    optional: "Optional",
    enterDocuments: "Enter documents separated by commas",
    uploadBrochure: "Upload PDF brochure"
  },
  ta: {
    loanSchemes: "கடன் திட்டங்கள்",
    addNewScheme: "புதிய திட்டம் சேர்க்கவும்",
    loading: "ஏற்றுகிறது...",
    noSchemes: "கடன் திட்டங்கள் எதுவும் இல்லை.",
    schemeName: "திட்டத்தின் பெயர்",
    purpose: "நோக்கம்",
    interestRate: "வட்டி விகிதம் (%)",
    minAmount: "குறைந்தபட்ச தொகை (₹)",
    maxAmount: "அதிகபட்ச தொகை (₹)",
    repaymentPeriod: "திருப்பிச் செலுத்தும் காலம்",
    processingFee: "செயலாக்கக் கட்டணம்",
    collateralRequired: "பிணையம் தேவை",
    collateralDetails: "பிணைய விவரங்கள்",
    eligibility: "தகுதி நிபந்தனைகள்",
    govtSubsidy: "அரசு மானியம்",
    subsidyPercent: "மானிய சதவீதம் (%)",
    requiredDocuments: "தேவையான ஆவணங்கள்",
    applyLink: "விண்ணப்ப இணைப்பு",
    brochure: "பிரசுரம் (PDF)",
    expiryDate: "காலாவதி தேதி",
    save: "திட்டத்தைச் சேமிக்கவும்",
    cancel: "ரத்து",
    edit: "திருத்து",
    delete: "நீக்கு",
    view: "பார்க்கவும்",
    download: "பதிவிறக்கம்",
    active: "செயலில்",
    expired: "காலாவதியானது",
    checkingAccess: "அணுகலைச் சரிபார்க்கிறது...",
    schemeAdded: "கடன் திட்டம் வெற்றிகரமாக சேர்க்கப்பட்டது!",
    optional: "விருப்பமானது",
    enterDocuments: "ஆவணங்களை காற்புள்ளியால் பிரித்து உள்ளிடவும்",
    uploadBrochure: "PDF பிரசுரத்தைப் பதிவேற்றவும்"
  }
};

function LoanSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { language } = useContext(LanguageContext);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    interestRate: '',
    minAmount: '',
    maxAmount: '',
    repaymentPeriod: '',
    processingFee: '',
    collateralRequired: false,
    collateralDetails: '',
    eligibility: '',
    govtSubsidy: false,
    subsidyPercent: '',
    requiredDocuments: '',
    applyLink: '',
    expiryDate: ''
  });
  const [brochureFile, setBrochureFile] = useState(null);

  // Check if user is Loan Officer
  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const isLoanOfficer = res.data.role === 'serviceProvider' && res.data.designation === 'Loan Officer';
          setIsAllowed(isLoanOfficer || res.data.role === 'admin');
        })
        .catch(() => setIsAllowed(false));
    } else {
      setIsAllowed(false);
    }
  }, []);

  // Fetch loan schemes
  const fetchSchemes = async () => {
    try {
      const token = localStorage.getItem('agrochain-token');
      const response = await axios.get(`${API_BASE_URL}/api/loan-schemes/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchemes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) {
      fetchSchemes();
    }
  }, [isAllowed]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      purpose: '',
      interestRate: '',
      minAmount: '',
      maxAmount: '',
      repaymentPeriod: '',
      processingFee: '',
      collateralRequired: false,
      collateralDetails: '',
      eligibility: '',
      govtSubsidy: false,
      subsidyPercent: '',
      requiredDocuments: '',
      applyLink: '',
      expiryDate: ''
    });
    setBrochureFile(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('agrochain-token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (brochureFile) {
        formDataToSend.append('brochure', brochureFile);
      }

      await axios.post(`${API_BASE_URL}/api/loan-schemes/add`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowAddModal(false);
      resetForm();
      fetchSchemes();
      alert(translations[language].schemeAdded);
    } catch (error) {
      console.error('Error adding scheme:', error);
      alert('Error adding scheme: ' + error.response?.data?.message);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isAllowed === false) {
    return <Navigate to="/" />;
  }

  if (isAllowed === null) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">{translations[language].checkingAccess}</div>
      </div>
    );
  }

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
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" style={{ gap: 10 }}>
              <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }}>
                <FaFileAlt />
              </div>
              <div className="h5 mb-0">{translations[language].loanSchemes}</div>
            </div>
            <button
              className="btn btn-light d-flex align-items-center"
              onClick={() => setShowAddModal(true)}
              style={{ borderRadius: '25px' }}
            >
              <FaPlus className="me-2" />
              {translations[language].addNewScheme}
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].loading}
          </div>
        ) : schemes.length === 0 ? (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].noSchemes}
          </div>
        ) : (
          <div className="row">
            {schemes.map(scheme => {
              const isExpired = scheme.expiryDate && new Date(scheme.expiryDate) < new Date();
              return (
                <div className="col-lg-6 mb-4" key={scheme._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="card shadow border-0 h-100"
                    style={{ borderRadius: 16 }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: '50%',
                              background: isExpired ? '#F8D7DA' : '#E9F7EF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 16,
                              color: isExpired ? '#842029' : '#2C5F2D'
                            }}
                          >
                            <FaFileAlt />
                          </div>
                          <div>
                            <h5 className="mb-1">{scheme.name}</h5>
                            <span className={`badge ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                              {isExpired ? translations[language].expired : translations[language].active}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.95em' }}>
                        <div className="mb-2">
                          <div className="d-flex align-items-center mb-1">
                            <FaRupeeSign className="me-2 text-success" />
                            <b>{translations[language].interestRate}:</b>&nbsp;{scheme.interestRate}%
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <FaRupeeSign className="me-2 text-primary" />
                            <b>Amount Range:</b>&nbsp;₹{scheme.minAmount?.toLocaleString()} - ₹{scheme.maxAmount?.toLocaleString()}
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <FaCalendarAlt className="me-2 text-info" />
                            <b>{translations[language].repaymentPeriod}:</b>&nbsp;{scheme.repaymentPeriod}
                          </div>
                          {scheme.govtSubsidy && (
                            <div className="d-flex align-items-center mb-1">
                              <FaGift className="me-2 text-warning" />
                              <b>{translations[language].govtSubsidy}:</b>&nbsp;{scheme.subsidyPercent}%
                            </div>
                          )}
                        </div>
                        
                        <div className="text-muted small mb-2" style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {scheme.purpose}
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaShieldAlt className={`me-1 ${scheme.collateralRequired ? 'text-warning' : 'text-success'}`} />
                            <small>{scheme.collateralRequired ? 'Collateral Required' : 'No Collateral'}</small>
                          </div>
                          {scheme.brochure && (
                            <a 
                              href={`${API_BASE_URL}/${scheme.brochure}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <FaDownload className="me-1" />
                              {translations[language].download}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Scheme Modal */}
        {showAddModal && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                  <h5 className="modal-title d-flex align-items-center">
                    <FaPlus className="me-2" />
                    {translations[language].addNewScheme}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => { setShowAddModal(false); resetForm(); }}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].schemeName}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].interestRate}</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          name="interestRate"
                          value={formData.interestRate}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">{translations[language].purpose}</label>
                        <textarea
                          className="form-control"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].minAmount}</label>
                        <input
                          type="number"
                          className="form-control"
                          name="minAmount"
                          value={formData.minAmount}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].maxAmount}</label>
                        <input
                          type="number"
                          className="form-control"
                          name="maxAmount"
                          value={formData.maxAmount}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].repaymentPeriod}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="repaymentPeriod"
                          value={formData.repaymentPeriod}
                          onChange={handleInputChange}
                          placeholder="e.g., 3 to 7 years"
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].processingFee} <small className="text-muted">({translations[language].optional})</small></label>
                        <input
                          type="text"
                          className="form-control"
                          name="processingFee"
                          value={formData.processingFee}
                          onChange={handleInputChange}
                          placeholder="e.g., 1% of loan amount"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="collateralRequired"
                            checked={formData.collateralRequired}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label fw-semibold">
                            {translations[language].collateralRequired}
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="govtSubsidy"
                            checked={formData.govtSubsidy}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label fw-semibold">
                            {translations[language].govtSubsidy}
                          </label>
                        </div>
                      </div>
                      {formData.collateralRequired && (
                        <div className="col-12">
                          <label className="form-label fw-semibold">{translations[language].collateralDetails}</label>
                          <textarea
                            className="form-control"
                            name="collateralDetails"
                            value={formData.collateralDetails}
                            onChange={handleInputChange}
                            rows="2"
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                      )}
                      {formData.govtSubsidy && (
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{translations[language].subsidyPercent}</label>
                          <input
                            type="number"
                            className="form-control"
                            name="subsidyPercent"
                            value={formData.subsidyPercent}
                            onChange={handleInputChange}
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                      )}
                      <div className="col-12">
                        <label className="form-label fw-semibold">{translations[language].eligibility}</label>
                        <textarea
                          className="form-control"
                          name="eligibility"
                          value={formData.eligibility}
                          onChange={handleInputChange}
                          rows="2"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">{translations[language].requiredDocuments}</label>
                        <textarea
                          className="form-control"
                          name="requiredDocuments"
                          value={formData.requiredDocuments}
                          onChange={handleInputChange}
                          placeholder={translations[language].enterDocuments}
                          rows="2"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].applyLink} <small className="text-muted">({translations[language].optional})</small></label>
                        <input
                          type="url"
                          className="form-control"
                          name="applyLink"
                          value={formData.applyLink}
                          onChange={handleInputChange}
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">{translations[language].expiryDate} <small className="text-muted">({translations[language].optional})</small></label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">{translations[language].brochure} <small className="text-muted">({translations[language].optional})</small></label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf"
                          onChange={(e) => setBrochureFile(e.target.files[0])}
                          style={{ borderRadius: '10px' }}
                        />
                        <small className="text-muted">{translations[language].uploadBrochure}</small>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4">
                    <button 
                      type="button"
                      className="btn btn-secondary px-4" 
                      style={{ borderRadius: '25px' }}
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                    >
                      {translations[language].cancel}
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-success px-4 d-flex align-items-center" 
                      style={{ borderRadius: '25px' }}
                    >
                      <FaUpload className="me-2" />
                      {translations[language].save}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LoanSchemes;
