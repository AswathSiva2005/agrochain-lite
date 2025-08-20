import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ServiceProviderNavbar from '../../components/ServiceProviderNavbar';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaFileAlt, FaPlus, FaCalendarAlt, FaPercentage, FaRupeeSign, FaClock, FaShieldAlt, FaGift, FaExternalLinkAlt, FaUpload, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api.js';

function ServiceProviderLoanSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({
    name: '', purpose: '', interestRate: '', minAmount: '', maxAmount: '',
    repaymentPeriod: '', processingFee: '', collateralRequired: false, collateralDetails: '',
    eligibility: '', govtSubsidy: false, subsidyPercent: '', requiredDocuments: '',
    applyLink: '', expiryDate: '', brochure: null
  });
  const [message, setMessage] = useState('');
  const [designation, setDesignation] = useState('');
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    // Get current service provider's designation
    axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setDesignation(res.data.designation || '');
    }).catch(() => setDesignation(''));

    axios.get(`${API_BASE_URL}/api/loan-schemes/all`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSchemes(res.data)).catch(() => setSchemes([]));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = e => setForm(f => ({ ...f, brochure: e.target.files[0] }));

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('agrochain-token');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'brochure' && v) fd.append(k, v);
      else fd.append(k, v);
    });
    try {
      await axios.post(`${API_BASE_URL}/api/loan-schemes/add`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Loan scheme uploaded!');
      setForm({
        name: '', purpose: '', interestRate: '', minAmount: '', maxAmount: '',
        repaymentPeriod: '', processingFee: '', collateralRequired: false, collateralDetails: '',
        eligibility: '', govtSubsidy: false, subsidyPercent: '', requiredDocuments: '',
        applyLink: '', expiryDate: '', brochure: null
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error uploading scheme');
    }
  };

  return (
    <>
      <ServiceProviderNavbar />
      <div className="container mt-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-3 mb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', borderRadius: 14 }}
        >
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }}>
              <FaFileUpload />
            </div>
            <div className="h5 mb-0">Upload Loan Scheme</div>
          </div>
        </motion.div>

        {designation === "Loan Officer" ? (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="card p-3 mb-4 shadow-lg border-0"
            style={{ borderRadius: 16 }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-muted">Scheme Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaClipboardList /></span>
                <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Purpose</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaClipboardList /></span>
                <input name="purpose" className="form-control" value={form.purpose} onChange={handleChange} required />
              </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small text-muted">Interest Rate (%)</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaPercent /></span>
                <input name="interestRate" type="number" className="form-control" value={form.interestRate} onChange={handleChange} required />
              </div>
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Min Amount</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaRupeeSign /></span>
                <input name="minAmount" type="number" className="form-control" value={form.minAmount} onChange={handleChange} required />
              </div>
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Max Amount</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaRupeeSign /></span>
                <input name="maxAmount" type="number" className="form-control" value={form.maxAmount} onChange={handleChange} required />
              </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-muted">Repayment Period</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaClock /></span>
                <input name="repaymentPeriod" className="form-control" value={form.repaymentPeriod} onChange={handleChange} required />
              </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Processing Fee</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaRupeeSign /></span>
                <input name="processingFee" className="form-control" value={form.processingFee} onChange={handleChange} />
              </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-muted">Collateral Required</label>
                <div className="d-flex align-items-center gap-2">
                <input name="collateralRequired" type="checkbox" checked={form.collateralRequired} onChange={handleChange} />
                  <span className="text-muted small d-flex align-items-center" style={{ gap: 6 }}><FaShieldAlt className="text-secondary" />
                    {form.collateralRequired ? 'Yes' : 'No'}
                  </span>
                </div>
                <input name="collateralDetails" className="form-control mt-2" placeholder="Details" value={form.collateralDetails} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-muted">Eligibility Criteria</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaCheck /></span>
                <input name="eligibility" className="form-control" value={form.eligibility} onChange={handleChange} />
              </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-muted">Govt Subsidy Support</label>
                <div className="d-flex align-items-center gap-2">
                <input name="govtSubsidy" type="checkbox" checked={form.govtSubsidy} onChange={handleChange} />
                  <span className="text-muted small">{form.govtSubsidy ? 'Yes' : 'No'}</span>
                </div>
                <div className="input-group mt-2">
                  <span className="input-group-text bg-white"><FaPercent /></span>
                  <input name="subsidyPercent" className="form-control" placeholder="% Subsidy" value={form.subsidyPercent} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-muted">Required Documents (comma separated)</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaClipboardList /></span>
                <input name="requiredDocuments" className="form-control" value={form.requiredDocuments} onChange={handleChange} />
              </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Apply Link</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaLink /></span>
                <input name="applyLink" className="form-control" value={form.applyLink} onChange={handleChange} />
              </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Scheme Expiry Date</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaCalendarAlt /></span>
                <input name="expiryDate" type="date" className="form-control" value={form.expiryDate} onChange={handleChange} />
              </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">PDF Brochure</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaFilePdf /></span>
                <input name="brochure" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              </div>
            </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success mt-3"
                style={{ transition: 'all .2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
              >
                <FaFileUpload className="me-2" /> Upload Scheme
              </button>
            </div>
            {message && <div className="alert alert-info mt-2">{message}</div>}
          </motion.form>
        ) : (
          <div className="alert alert-warning mb-4">
            Only Loan Officers can upload loan schemes.
          </div>
        )}

        <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
          <h5 className="mb-0">Existing Loan Schemes</h5>
          <small className="text-muted">({schemes.length})</small>
        </div>
        <div className="row g-3">
          {schemes.map((s, idx) => (
            <div className="col-md-6" key={s._id}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className="card shadow-lg border-0 h-100"
                style={{ borderRadius: 16 }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                    <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(25,135,84,.1)', color: '#198754' }}>
                      <FaClipboardList />
                    </div>
                    <h5 className="mb-0">{s.name}</h5>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.95em' }}>
                    <div className="mb-1"><b>Purpose:</b> {s.purpose}</div>
                    <div className="mb-1"><b>Interest Rate:</b> {s.interestRate}%</div>
                    <div className="mb-1"><b>Amount:</b> ₹{s.minAmount} - ₹{s.maxAmount}</div>
                    <div className="mb-1"><b>Repayment:</b> {s.repaymentPeriod}</div>
                    <div className="mb-1"><b>Processing Fee:</b> {s.processingFee || '-'}</div>
                    <div className="mb-1"><b>Collateral:</b> {s.collateralRequired ? 'Yes' : 'No'} {s.collateralDetails}</div>
                    <div className="mb-1"><b>Eligibility:</b> {s.eligibility}</div>
                    <div className="mb-1"><b>Govt Subsidy:</b> {s.govtSubsidy ? `Yes (${s.subsidyPercent}%)` : 'No'}</div>
                    <div className="mb-1"><b>Required Documents:</b> {Array.isArray(s.requiredDocuments) ? s.requiredDocuments.join(', ') : s.requiredDocuments}</div>
                    <div className="mb-1 d-flex align-items-center" style={{ gap: 6 }}>
                      <b>Brochure:</b> {s.brochure ? (
                        <a href={`${API_BASE_URL}/${s.brochure}`} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center">
                          <FaExternalLinkAlt className="me-1" /> Download PDF
                        </a>
                      ) : '-'}
                    </div>
                    <div className="mb-1"><b>Expiry:</b> {s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'No expiry'}</div>
                </div>
              </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ServiceProviderLoanSchemes;
