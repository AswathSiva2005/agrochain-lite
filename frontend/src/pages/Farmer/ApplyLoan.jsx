import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';
import { FaUniversity, FaUserTie, FaMapMarkerAlt, FaPercent, FaRupeeSign, FaClock, FaFilePdf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const translations = {
  en: {
    applyLoan: "Apply for a Loan",
    loanAmount: "Loan Amount",
    reason: "Reason for Loan",
    uploadDoc: "Upload Document",
    submit: "Apply Loan",
    success: "Loan application submitted!",
    error: "Error applying for loan",
    pleaseUpload: "Please upload a document",
    bankName: "Bank Name",
    selectFile: "Select Document (PDF/JPG/PNG)",
    apply: "Apply Loan",
    scheme: "Loan Scheme",
    details: "Details",
    amountRange: "Amount Range",
    repayment: "Repayment",
    fee: "Processing Fee",
    collateral: "Collateral",
    eligibility: "Eligibility",
    subsidy: "Govt Subsidy",
    requiredDocs: "Required Docs",
    expiry: "Expiry",
    viewPDF: "View PDF"
  },
  ta: {
    applyLoan: "கடனுக்கு விண்ணப்பிக்கவும்",
    loanAmount: "கடன் தொகை",
    reason: "கடனுக்கான காரணம்",
    uploadDoc: "ஆவணம் பதிவேற்றவும்",
    submit: "கடனுக்கு விண்ணப்பிக்கவும்",
    success: "கடன் விண்ணப்பம் சமர்ப்பிக்கப்பட்டது!",
    error: "கடனுக்கு விண்ணப்பிக்க பிழை",
    pleaseUpload: "ஆவணம் பதிவேற்றவும்",
    bankName: "வங்கி பெயர்",
    selectFile: "ஆவணத்தை தேர்ந்தெடுக்கவும் (PDF/JPG/PNG)",
    apply: "கடனுக்கு விண்ணப்பிக்கவும்",
    scheme: "கடன் திட்டம்",
    details: "விவரங்கள்",
    amountRange: "தொகை வரம்பு",
    repayment: "திருப்பிச் செலுத்துதல்",
    fee: "செயலாக்க கட்டணம்",
    collateral: "கௌரவம்",
    eligibility: "தகுதி",
    subsidy: "அரசு மானியம்",
    requiredDocs: "தேவையான ஆவணங்கள்",
    expiry: "காலாவதி",
    viewPDF: "PDF பார்க்க"
  }
};

function ApplyLoan() {
  const [schemes, setSchemes] = useState([]);
  const [loanOfficerDetails, setLoanOfficerDetails] = useState({});
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('https://agrochain-lite.onrender.com/api/loan-schemes/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSchemes(res.data)).catch(() => setSchemes([]));

    axios.get('https://agrochain-lite.onrender.com/api/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const officerMap = {};
      res.data.forEach(u => {
        if (u.role === 'serviceProvider' && u.designation === 'Loan Officer') {
          officerMap[u._id] = {
            officerName: u.name,
            bankName: u.organisationName || '-',
            branchName: u.branch || '-',
            bankAddress: u.location || '-'
          };
        }
      });
      setLoanOfficerDetails(officerMap);
    }).catch(() => setLoanOfficerDetails({}));
  }, []);

  return (
    <>
      <FarmerNavbar />
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="fw-bold" style={{ color: '#2C5F2D' }}>{translations[language].applyLoan}</h3>
        </div>
          <div className="row g-4">
            {schemes.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info">No loan schemes available.</div>
              </div>
            )}
            {schemes.map(s => {
              const officer = loanOfficerDetails[s.createdBy] || {};
              return (
              <div className="col-lg-6" key={s._id}>
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                  <div className="card-header border-0" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>
                    <div className="d-flex align-items-center">
                      <FaUniversity className="me-2" />
                      <h5 className="mb-0 fw-bold">{translations[language].scheme}</h5>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between flex-wrap">
                          <div>
                            <div className="small text-muted">{translations[language].bankName}</div>
                            <div className="fw-bold d-flex align-items-center"><FaUniversity className="me-2 text-success" /> {officer.bankName || '-'}</div>
                          </div>
                          <div>
                            <div className="small text-muted">Branch</div>
                            <div className="fw-bold"><FaMapMarkerAlt className="me-2 text-primary" /> {officer.branchName || '-'}</div>
                          </div>
                          <div>
                            <div className="small text-muted">Loan Officer</div>
                            <div className="fw-bold"><FaUserTie className="me-2 text-warning" /> {officer.officerName || '-'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12"><hr /></div>

                      <div className="col-md-6">
                        <div className="small text-muted">Purpose</div>
                        <div className="fw-bold">{s.purpose || '-'}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].interest}</div>
                        <div className="fw-bold d-flex align-items-center"><FaPercent className="me-2 text-danger" /> {s.interestRate}%</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].amountRange}</div>
                        <div className="fw-bold d-flex align-items-center"><FaRupeeSign className="me-2 text-success" /> ₹{s.minAmount} - ₹{s.maxAmount}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].repayment}</div>
                        <div className="fw-bold d-flex align-items-center"><FaClock className="me-2 text-primary" /> {s.repaymentPeriod}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].fee}</div>
                        <div className="fw-bold">{s.processingFee || '-'}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].collateral}</div>
                        <div className="fw-bold d-flex align-items-center">{s.collateralRequired ? <><FaCheckCircle className="me-2 text-success" /> Yes</> : <><FaTimesCircle className="me-2 text-danger" /> No</>} {s.collateralDetails}</div>
                      </div>
                      <div className="col-12">
                        <div className="small text-muted">{translations[language].eligibility}</div>
                        <div className="fw-bold">{s.eligibility}</div>
                      </div>
                      <div className="col-12">
                        <div className="small text-muted">{translations[language].requiredDocs}</div>
                        <div className="fw-bold">{Array.isArray(s.requiredDocuments) ? s.requiredDocuments.join(', ') : s.requiredDocuments}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].subsidy}</div>
                        <div className="fw-bold">{s.govtSubsidy ? `Yes (${s.subsidyPercent}%)` : 'No'}</div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">{translations[language].expiry}</div>
                        <div className="fw-bold">{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'No expiry'}</div>
                      </div>

                      <div className="col-12 d-flex justify-content-between align-items-center mt-2">
                        <div>
                          <span className="badge bg-light text-dark border" style={{ borderRadius: 20 }}>{translations[language].details}</span>
                        </div>
                        <div>
                          {s.brochure ? (
                            <a href={`https://agrochain-lite.onrender.com/${s.brochure}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-sm" style={{ borderRadius: 20 }}>
                              <FaFilePdf className="me-2" /> {translations[language].viewPDF}
                            </a>
                          ) : (
                            <span className="text-muted small">No brochure</span>
                          )}
                        </div>
                    </div>

                      <div className="col-12">
                        <button className="btn w-100" onClick={() => navigate(`/farmer/apply-loan/${s._id}`)} style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: 12, padding: '10px 16px', boxShadow: '0 6px 18px rgba(44,95,45,.25)' }} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 24px rgba(44,95,45,.35)'}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(44,95,45,.25)'}}>
                        {translations[language].apply}
                      </button>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ApplyLoan;
