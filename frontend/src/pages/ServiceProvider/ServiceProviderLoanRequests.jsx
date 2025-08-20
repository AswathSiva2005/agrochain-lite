// ...existing imports
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaFileContract, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaRupeeSign, FaClock, FaInfoCircle, FaUpload, FaImage } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api.js';

const translations = {
  en: {
    loanRequests: "Loan Requests",
    loading: "Loading...",
    noLoans: "No loan requests found.",
    farmer: "Farmer",
    amount: "Amount",
    reason: "Reason",
    status: "Status",
    document: "Document",
    approve: "Approve",
    reject: "Reject",
    send: "Send",
    sanctionDate: "Sanction Date",
    dueAmount: "Due Amount",
    loanStart: "Loan Start Date",
    loanEnd: "Loan End Date",
    confirm: "Confirm",
    cancel: "Cancel",
    checkingAdmin: "Checking service provider access...",
    viewDoc: "View Document",
    fieldVisit: "Field Visit",
    fieldVisitDate: "Field Visit Date",
    officerName: "Officer Name",
    officerPhone: "Officer Phone",
    visitMessage: "Visit Message",
    save: "Save",
    geoTagImage: "Geo-tag Image",
    ngoMessage: "Approval Message",
    rejectionReason: "Rejection Reason",
    ngoApproval: "NGO Approval",
    ngoRejection: "NGO Rejection",
    uploadImage: "Upload Image",
    enterMessage: "Enter approval message",
    enterRejectionReason: "Enter rejection reason",
    acceptedLoans: "Accepted Loans",
    rejectedLoans: "Rejected Loans", 
    pendingLoans: "Pending Loans",
    allLoans: "All Loans",
  },
  ta: {
    loanRequests: "கடன் விண்ணப்பங்கள்",
    loading: "ஏற்றுகிறது...",
    noLoans: "கடன் விண்ணப்பங்கள் இல்லை.",
    farmer: "விவசாயி",
    amount: "தொகை",
    reason: "காரணம்",
    status: "நிலை",
    document: "ஆவணம்",
    approve: "ஒப்புதல்",
    reject: "நிராகரிக்கவும்",
    send: "அனுப்பு",
    sanctionDate: "ஒப்புதல் தேதி",
    dueAmount: "கடன் தொகை",
    loanStart: "கடன் தொடக்கம் தேதி",
    loanEnd: "கடன் முடிவு தேதி",
    confirm: "உறுதிப்படுத்தவும்",
    cancel: "ரத்து",
    checkingAdmin: "சேவை வழங்குநர் அணுகலை சரிபார்க்கிறது...",
    viewDoc: "ஆவணத்தை பார்க்கவும்",
    fieldVisit: "கள ஆய்வு",
    fieldVisitDate: "கள ஆய்வு தேதி",
    officerName: "அதிகாரி பெயர்",
    officerPhone: "அதிகாரி தொலைபேசி",
    visitMessage: "விசிட் செய்தி",
    save: "சேமி",
    geoTagImage: "ஜியோ-டேக் படம்",
    ngoMessage: "ஒப்புதல் செய்தி",
    rejectionReason: "நிராகரிப்பு காரணம்",
    ngoApproval: "NGO ஒப்புதல்",
    ngoRejection: "NGO நிராகரிப்பு",
    uploadImage: "படம் பதிவேற்று",
    enterMessage: "ஒப்புதல் செய்தியை உள்ளிடவும்",
    enterRejectionReason: "நிராகரிப்பு காரணத்தை உள்ளிடவும்",
    acceptedLoans: "ஏற்றுக்கொள்ளப்பட்ட கடன்கள்",
    rejectedLoans: "நிராகரிக்கப்பட்ட கடன்கள்",
    pendingLoans: "நிலுவையில் உள்ள கடன்கள்",
    allLoans: "அனைத்து கடன்கள்",
  }
};

function ServiceProviderLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(null); // null = not checked yet
  const [fieldVisitModal, setFieldVisitModal] = useState({ show: false, loanId: null });
  const [visitDate, setVisitDate] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [visitMessage, setVisitMessage] = useState('');
  const [fieldVisitDone, setFieldVisitDone] = useState({}); // loanId: true/false
  const [approveModal, setApproveModal] = useState({ show: false, loan: null });
  const [sanctionDate, setSanctionDate] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [loanStart, setLoanStart] = useState('');
  const [loanEnd, setLoanEnd] = useState('');
  const [userDesignation, setUserDesignation] = useState('');
  const [ngoApproveModal, setNgoApproveModal] = useState({ show: false, loan: null });
  const [geoTagImage, setGeoTagImage] = useState(null);
  const [ngoMessage, setNgoMessage] = useState('');
  const [ngoRejectModal, setNgoRejectModal] = useState({ show: false, loan: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const { language } = useContext(LanguageContext);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  const fetchLoans = () => {
    const token = localStorage.getItem('agrochain-token');
    if (!token) {
      setLoading(false);
      setLoans([]);
      return;
    }
    axios.get(`${API_BASE_URL}/api/loans/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        let filteredLoans = res.data;
        
        // Filter loans based on status parameter
        if (statusFilter) {
          filteredLoans = res.data.filter(loan => {
            if (statusFilter === 'approved') {
              return loan.status === 'approved';
            } else if (statusFilter === 'rejected') {
              return loan.status === 'rejected';
            } else if (statusFilter === 'pending') {
              return loan.status === 'pending' || loan.status === 'ngo_approved';
            }
            return true; // Show all if unknown status
          });
        }
        
        setLoans(filteredLoans);
        setLoading(false);
      })
      .catch(() => {
        setLoans([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (value) => {
    setOfficerPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Please enter a valid 10-digit Indian phone number starting with 6-9');
    } else {
      setPhoneError('');
    }
  };

  // Field Visit Modal logic
  const handleFieldVisit = (loanId) => {
    setFieldVisitModal({ show: true, loanId });
    setVisitDate('');
    setOfficerName('');
    setOfficerPhone('');
    setPhoneError('');
    setVisitMessage('');
  };

  const sendFieldVisit = async () => {
    if (!validatePhone(officerPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }
    
    const token = localStorage.getItem('agrochain-token');
    // Save field visit details to loan (but do not approve yet)
    await axios.put(
      `${API_BASE_URL}/api/loans/field-visit/${fieldVisitModal.loanId}`,
      {
        visitDate,
        officerName,
        officerPhone,
        visitMessage,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFieldVisitModal({ show: false, loanId: null });
    setFieldVisitDone(prev => ({ ...prev, [fieldVisitModal.loanId]: true }));
    setVisitDate('');
    setOfficerName('');
    setOfficerPhone('');
    setPhoneError('');
    setVisitMessage('');
    fetchLoans();
  };

  const handleApproveModal = (loan) => {
    setApproveModal({ show: true, loan });
    setSanctionDate('');
    setApproveAmount(loan.amount || '');
    setDueAmount('');
    setLoanStart('');
    setLoanEnd('');
  };

  const confirmApprove = async () => {
    const token = localStorage.getItem('agrochain-token');
    // Determine which approval route to use based on status and designation
    let url = '';
    if (approveModal.loan.status === 'ngo_approved' && userDesignation === 'Loan Officer') {
      url = `${API_BASE_URL}/api/loans/approve/${approveModal.loan._id}`;
    } else if (approveModal.loan.status === 'pending' && userDesignation === 'NGO Field Coordinator') {
      url = `${API_BASE_URL}/api/loans/ngo-approve/${approveModal.loan._id}`;
    } else {
      // Should not happen, but fallback to ngo-approve
      url = `${API_BASE_URL}/api/loans/ngo-approve/${approveModal.loan._id}`;
    }
    await axios.put(
      url,
      {
        sanctionDate,
        amount: approveAmount,
        dueAmount,
        loanStart,
        loanEnd,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setApproveModal({ show: false, loan: null });
    setSanctionDate('');
    setApproveAmount('');
    setDueAmount('');
    setLoanStart('');
    setLoanEnd('');
    fetchLoans();
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('agrochain-token');
    await axios.put(`${API_BASE_URL}/api/loans/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchLoans();
  };

  // NGO Approval Modal handlers
  const handleNgoApproveModal = (loan) => {
    setNgoApproveModal({ show: true, loan });
    setGeoTagImage(null);
    setNgoMessage('');
  };

  const confirmNgoApprove = async () => {
    const token = localStorage.getItem('agrochain-token');
    const formData = new FormData();
    if (geoTagImage) formData.append('geoTagImage', geoTagImage);
    if (ngoMessage) formData.append('ngoMessage', ngoMessage);

    await axios.put(
      `${API_BASE_URL}/api/loans/ngo-approve/${ngoApproveModal.loan._id}`,
      formData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      }
    );
    setNgoApproveModal({ show: false, loan: null });
    setGeoTagImage(null);
    setNgoMessage('');
    fetchLoans();
  };

  // NGO Rejection Modal handlers
  const handleNgoRejectModal = (loan) => {
    setNgoRejectModal({ show: true, loan });
    setRejectionReason('');
  };

  const confirmNgoReject = async () => {
    const token = localStorage.getItem('agrochain-token');
    await axios.put(
      `${API_BASE_URL}/api/loans/ngo-reject/${ngoRejectModal.loan._id}`,
      { rejectionReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNgoRejectModal({ show: false, loan: null });
    setRejectionReason('');
    fetchLoans();
  };

  // Check if the user is a serviceProvider or admin
  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setIsAllowed(res.data.role === 'serviceProvider' || res.data.role === 'admin');
          setUserDesignation(res.data.designation || '');
        })
        .catch(() => {
          setIsAllowed(false);
          setUserDesignation('');
        });
    } else {
      setIsAllowed(false);
      setUserDesignation('');
    }
  }, []);

  if (isAllowed === false) {
    return <Navigate to="/" />;
  }
  if (isAllowed === null) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">{translations[language].checkingAdmin}</div>
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
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }}>
              <FaFileAlt />
            </div>
            <div className="h5 mb-0">
              {statusFilter === 'approved' ? translations[language].acceptedLoans :
               statusFilter === 'rejected' ? translations[language].rejectedLoans :
               statusFilter === 'pending' ? translations[language].pendingLoans :
               translations[language].loanRequests}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].loading}
          </div>
        ) : loans.length === 0 ? (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" /> {translations[language].noLoans}
          </div>
        ) : (
          <div className="row">
            {loans.map(loan => (
              <div className="col-md-6 mb-4" key={loan._id}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="card shadow border-0 h-100"
                  style={{ borderRadius: 16 }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: loan.status === 'approved' ? '#E9F7EF' : loan.status === 'rejected' ? '#F8D7DA' : '#FFF3CD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                          color: loan.status === 'approved' ? '#2C5F2D' : loan.status === 'rejected' ? '#842029' : '#856404'
                        }}
                      >
                        <FaUser />
                      </div>
                      <div>
                        <h5 className="mb-0">{loan.farmer?.name || '-'}</h5>
                        <span className={`badge ${loan.status === 'approved' ? 'bg-success' : loan.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {translations[language].status}: {loan.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.02em' }}>
                      <div className="mb-1"><b>{translations[language].amount}:</b> ₹{loan.amount}</div>
                      <div className="mb-1"><b>{translations[language].reason}:</b> {loan.reason}</div>
                      {loan.document && (
                        <div className="mb-2">
                          <b>{translations[language].document}:</b>{' '}
                          <a href={`${API_BASE_URL}/${loan.document}`} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center">
                            <FaEye className="me-1" /> {translations[language].viewDoc}
                          </a>
                        </div>
                      )}
                      {loan.visitDetails && loan.visitDetails.visitDate && (
                        <div className="p-2 rounded" style={{ background: '#f8f9fa' }}>
                          <div className="mb-1 d-flex align-items-center"><FaCalendarAlt className="me-2 text-secondary" /> <b>{translations[language].fieldVisitDate}:</b>&nbsp;{loan.visitDetails.visitDate ? new Date(loan.visitDetails.visitDate).toLocaleDateString() : '-'}</div>
                          <div className="mb-1 d-flex align-items-center"><FaUser className="me-2 text-secondary" /> <b>{translations[language].officerName}:</b>&nbsp;{loan.visitDetails.officerName || '-'}</div>
                          <div className="mb-1 d-flex align-items-center"><FaPhoneAlt className="me-2 text-secondary" /> <b>{translations[language].officerPhone}:</b>&nbsp;{loan.visitDetails.officerPhone || '-'}</div>
                          <div className="mb-1"><b>{translations[language].visitMessage}:</b> {loan.visitDetails.visitMessage || '-'}</div>
                        </div>
                      )}
                      {loan.status === 'approved' && (
                        <div className="mt-3 p-3 border rounded bg-light">
                          <h6 className="text-success mb-2"><FaCheck className="me-2" />Approve Loan</h6>
                          <div><b>{translations[language].sanctionDate}:</b> {loan.sanctionDate ? new Date(loan.sanctionDate).toLocaleDateString() : '-'}</div>
                          <div><b>{translations[language].amount}:</b> ₹{loan.amount}</div>
                          <div><b>{translations[language].dueAmount}:</b> {loan.dueAmount || '-'}</div>
                          <div><b>{translations[language].loanStart}:</b> {loan.loanStart ? new Date(loan.loanStart).toLocaleDateString() : '-'}</div>
                          <div><b>{translations[language].loanEnd}:</b> {loan.loanEnd ? new Date(loan.loanEnd).toLocaleDateString() : '-'}</div>
                        </div>
                      )}
                    </div>

                    {loan.status === 'pending' && userDesignation === 'NGO Field Coordinator' && (
                      <div className="mt-3">
                        <button
                          className="btn btn-info me-2 d-inline-flex align-items-center"
                          onClick={() => handleFieldVisit(loan._id)}
                          disabled={fieldVisitDone[loan._id] || (loan.visitDetails && loan.visitDetails.visitDate)}
                          style={{ transition: 'all .2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          <FaClipboardCheck className="me-1" /> {translations[language].fieldVisit}
                        </button>
                        <button
                          className="btn btn-success me-2 d-inline-flex align-items-center"
                          onClick={() => handleNgoApproveModal(loan)}
                          disabled={!(loan.visitDetails && loan.visitDetails.visitDate)}
                          style={{ transition: 'all .2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          <FaCheck className="me-1" /> {translations[language].approve}
                        </button>
                        <button
                          className="btn btn-danger d-inline-flex align-items-center"
                          onClick={() => handleNgoRejectModal(loan)}
                          style={{ transition: 'all .2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          <FaTimes className="me-1" /> {translations[language].reject}
                        </button>
                      </div>
                    )}
                    {loan.status === 'ngo_approved' && userDesignation === 'Loan Officer' && (
                      <div className="mt-3">
                        {/* Display NGO geo-tag image and message for loan officers */}
                        {(loan.ngoGeoTagImage || loan.ngoMessage) && (
                          <div className="mb-3 p-3 border rounded bg-light">
                            <h6 className="text-success mb-2"><FaCheck className="me-2" />NGO Approval Details</h6>
                            {loan.ngoGeoTagImage && (
                              <div className="mb-2">
                                <b>Geo-tag Image:</b><br/>
                                <img 
                                  src={`${API_BASE_URL}/${loan.ngoGeoTagImage}`} 
                                  alt="NGO Geo-tag" 
                                  style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }}
                                />
                              </div>
                            )}
                            {loan.ngoMessage && (
                              <div><b>NGO Message:</b> {loan.ngoMessage}</div>
                            )}
                          </div>
                        )}
                        <button
                          className="btn btn-success me-2 d-inline-flex align-items-center"
                          onClick={() => handleApproveModal(loan)}
                          style={{ transition: 'all .2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          <FaCheck className="me-1" /> {translations[language].approve}
                        </button>
                        <button
                          className="btn btn-danger d-inline-flex align-items-center"
                          onClick={() => handleReject(loan._id)}
                          style={{ transition: 'all .2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          <FaTimes className="me-1" /> {translations[language].reject}
                        </button>
                      </div>
                    )}
                    {loan.status === 'rejected' && loan.ngoRejectionReason && (
                      <div className="mt-3 p-3 border rounded bg-danger-subtle">
                        <h6 className="text-danger mb-2"><FaTimes className="me-2" />NGO Rejection</h6>
                        <div><b>Rejection Reason:</b> {loan.ngoRejectionReason}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
        {/* Field Visit Modal */}
        {fieldVisitModal.show && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                  <h5 className="modal-title d-flex align-items-center">
                    <FaClipboardCheck className="me-2" />
                    {translations[language].fieldVisit}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setFieldVisitModal({ show: false, loanId: null })}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-success" />
                        {translations[language].fieldVisitDate}
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef' }}
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaUser className="me-2 text-success" />
                        {translations[language].officerName}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef' }}
                        value={officerName}
                        onChange={e => setOfficerName(e.target.value)}
                        placeholder="Enter officer name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaPhoneAlt className="me-2 text-success" />
                        {translations[language].officerPhone}
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${phoneError ? 'is-invalid' : officerPhone && validatePhone(officerPhone) ? 'is-valid' : ''}`}
                        style={{ borderRadius: '10px', border: phoneError ? '2px solid #dc3545' : officerPhone && validatePhone(officerPhone) ? '2px solid #28a745' : '2px solid #e9ecef' }}
                        value={officerPhone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        required
                      />
                      {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
                      {officerPhone && validatePhone(officerPhone) && <div className="valid-feedback d-block">Valid phone number</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaInfoCircle className="me-2 text-success" />
                        {translations[language].visitMessage}
                      </label>
                      <textarea
                        className="form-control"
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef', minHeight: '80px' }}
                        value={visitMessage}
                        onChange={e => setVisitMessage(e.target.value)}
                        placeholder="Enter visit details and observations"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4">
                  <button 
                    className="btn btn-secondary px-4" 
                    style={{ borderRadius: '25px' }}
                    onClick={() => setFieldVisitModal({ show: false, loanId: null })}
                  >
                    {translations[language].cancel}
                  </button>
                  <button 
                    className="btn btn-success px-4 d-flex align-items-center" 
                    style={{ borderRadius: '25px' }}
                    onClick={sendFieldVisit} 
                    disabled={!visitDate || !officerName || !officerPhone || phoneError}
                  >
                    <FaCheck className="me-2" />
                    {translations[language].save}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Approve Modal */}
        {approveModal.show && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{translations[language].approve} Loan</h5>
                  <button type="button" className="btn-close" onClick={() => setApproveModal({ show: false, loan: null })}></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">{translations[language].sanctionDate}</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={sanctionDate}
                    onChange={e => setSanctionDate(e.target.value)}
                    required
                  />
                  <label className="form-label">{translations[language].amount}</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={approveAmount}
                    onChange={e => setApproveAmount(e.target.value)}
                    required
                  />
                  <label className="form-label">{translations[language].dueAmount}</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={dueAmount}
                    onChange={e => setDueAmount(e.target.value)}
                  />
                  <label className="form-label">{translations[language].loanStart}</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={loanStart}
                    onChange={e => setLoanStart(e.target.value)}
                  />
                  <label className="form-label">{translations[language].loanEnd}</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={loanEnd}
                    onChange={e => setLoanEnd(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setApproveModal({ show: false, loan: null })}>{translations[language].cancel}</button>
                  <button className="btn btn-success" onClick={confirmApprove} disabled={!sanctionDate || !approveAmount}>{translations[language].confirm}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NGO Approval Modal */}
        {ngoApproveModal.show && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                  <h5 className="modal-title d-flex align-items-center">
                    <FaCheck className="me-2" />
                    {translations[language].ngoApproval}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setNgoApproveModal({ show: false, loan: null })}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaFileAlt className="me-2 text-success" />
                        {translations[language].geoTagImage}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef' }}
                        accept="image/*"
                        onChange={e => setGeoTagImage(e.target.files[0])}
                        required
                      />
                      <small className="text-muted">Upload a geo-tagged image of the field visit location</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        <FaInfoCircle className="me-2 text-success" />
                        {translations[language].ngoMessage}
                      </label>
                      <textarea
                        className="form-control"
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef', minHeight: '100px' }}
                        value={ngoMessage}
                        onChange={e => setNgoMessage(e.target.value)}
                        placeholder={translations[language].enterMessage}
                        rows="4"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4">
                  <button 
                    className="btn btn-secondary px-4" 
                    style={{ borderRadius: '25px' }}
                    onClick={() => setNgoApproveModal({ show: false, loan: null })}
                  >
                    {translations[language].cancel}
                  </button>
                  <button 
                    className="btn btn-success px-4 d-flex align-items-center" 
                    style={{ borderRadius: '25px' }}
                    onClick={confirmNgoApprove} 
                    disabled={!geoTagImage || !ngoMessage}
                  >
                    <FaCheck className="me-2" />
                    {translations[language].approve}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NGO Rejection Modal */}
        {ngoRejectModal.show && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                  <h5 className="modal-title d-flex align-items-center">
                    <FaTimes className="me-2" />
                    {translations[language].ngoRejection}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setNgoRejectModal({ show: false, loan: null })}></button>
                </div>
                <div className="modal-body p-4">
                  <label className="form-label fw-semibold d-flex align-items-center">
                    <FaInfoCircle className="me-2 text-danger" />
                    {translations[language].rejectionReason}
                  </label>
                  <textarea
                    className="form-control"
                    style={{ borderRadius: '10px', border: '2px solid #e9ecef', minHeight: '120px' }}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder={translations[language].enterRejectionReason}
                    rows="5"
                    required
                  />
                </div>
                <div className="modal-footer border-0 p-4">
                  <button 
                    className="btn btn-secondary px-4" 
                    style={{ borderRadius: '25px' }}
                    onClick={() => setNgoRejectModal({ show: false, loan: null })}
                  >
                    {translations[language].cancel}
                  </button>
                  <button 
                    className="btn btn-danger px-4 d-flex align-items-center" 
                    style={{ borderRadius: '25px' }}
                    onClick={confirmNgoReject} 
                    disabled={!rejectionReason}
                  >
                    <FaTimes className="me-2" />
                    {translations[language].reject}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServiceProviderLoanRequests;
