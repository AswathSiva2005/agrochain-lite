// (Delete this file)
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { LanguageContext } from '../../App';

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
    enterSanctionDate: "Enter Loan Sanction Date",
    cancel: "Cancel",
    approveBtn: "Approve",
    checkingAdmin: "Checking admin access...",
    viewDoc: "View Document",
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
    enterSanctionDate: "கடன் ஒப்புதல் தேதியை உள்ளிடவும்",
    cancel: "ரத்து",
    approveBtn: "ஒப்புதல்",
    checkingAdmin: "நிர்வாக அணுகலை சரிபார்க்கிறது...",
    viewDoc: "ஆவணத்தை பார்க்கவும்",
  }
};

function AdminLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null); // null = not checked yet
  const [sanctionDateModal, setSanctionDateModal] = useState({ show: false, loanId: null });
  const [sanctionDate, setSanctionDate] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitMessage, setVisitMessage] = useState('');
  const [officerName, setOfficerName] = useState('');
  const { language } = useContext(LanguageContext);

  const fetchLoans = () => {
    const token = localStorage.getItem('agrochain-token');
    if (!token) {
      setLoading(false);
      setLoans([]);
      return;
    }
    axios.get('https://agrochain-lite.onrender.com/api/loans/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setLoans(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoans([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = (id) => {
    setSanctionDateModal({ show: true, loanId: id });
    setSanctionDate('');
    setVisitDate('');
    setVisitMessage('');
    setOfficerName('');
  };

  const confirmApprove = async () => {
    const token = localStorage.getItem('agrochain-token');
    await axios.put(
      `https://agrochain-lite.onrender.com/api/loans/approve/${sanctionDateModal.loanId}`,
      {
        sanctionDate,
        visitDate,
        visitMessage,
        officerName,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSanctionDateModal({ show: false, loanId: null });
    setVisitDate('');
    setVisitMessage('');
    setOfficerName('');
    fetchLoans();
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('agrochain-token');
    await axios.put(`https://agrochain-lite.onrender.com/api/loans/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchLoans();
  };

  // Check if the user is an admin
  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (token) {
      axios.get('https://agrochain-lite.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setIsAdmin(res.data.role === 'admin');
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === false) {
    return <Navigate to="/" />;
  }
  if (isAdmin === null) {
    // Still checking admin status
    return <div className="container mt-4"><div className="alert alert-info">{translations[language].checkingAdmin}</div></div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h3>{translations[language].loanRequests}</h3>
        {loading ? (
          <div className="alert alert-info">{translations[language].loading}</div>
        ) : loans.length === 0 ? (
          <div className="alert alert-info">{translations[language].noLoans}</div>
        ) : (
          <div className="row">
            {loans.map(loan => (
              <div className="col-md-6 mb-4" key={loan._id}>
                <div className="card shadow border-0" style={{ borderRadius: 16 }}>
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
                          fontSize: 28,
                          color: loan.status === 'approved' ? '#2C5F2D' : loan.status === 'rejected' ? '#842029' : '#856404',
                          fontWeight: 'bold'
                        }}
                      >
                        {loan.farmer?.name?.[0]?.toUpperCase() || '-'}
                      </div>
                      <div>
                        <h5 className="mb-0">{translations[language].farmer}: {loan.farmer?.name || '-'}</h5>
                        <span className={`badge ${loan.status === 'approved' ? 'bg-success' : loan.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.95em' }}>
                          {translations[language].status}: {loan.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.05em' }}>
                      <b>{translations[language].amount}:</b> ₹{loan.amount}<br />
                      <b>{translations[language].reason}:</b> {loan.reason}<br />
                      {loan.document && (
                        <>
                          <b>{translations[language].document}:</b>{' '}
                          <a href={`https://agrochain-lite.onrender.com/${loan.document}`} target="_blank" rel="noopener noreferrer">
                            {translations[language].viewDoc}
                          </a><br />
                        </>
                      )}
                      {loan.status === 'approved' && (
                        <>
                          <b>Approved By:</b> {loan.approvedBy?.name || 'Admin'}<br />
                          <b>Sanction Date:</b> {loan.sanctionDate ? new Date(loan.sanctionDate).toLocaleDateString() : '-'}<br />
                          {loan.visitDetails && (
                            <>
                              <b>Field Visit Date:</b> {loan.visitDetails.visitDate ? new Date(loan.visitDetails.visitDate).toLocaleDateString() : '-'}<br />
                              <b>Officer Name:</b> {loan.visitDetails.officerName || '-'}<br />
                              <b>Visit Message:</b> {loan.visitDetails.visitMessage || '-'}<br />
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {loan.status === 'pending' && (
                      <div className="mt-3">
                        <button className="btn btn-success me-2" onClick={() => handleApprove(loan._id)}>{translations[language].approve}</button>
                        <button className="btn btn-danger" onClick={() => handleReject(loan._id)}>{translations[language].reject}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {sanctionDateModal.show && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{translations[language].enterSanctionDate}</h5>
                  <button type="button" className="btn-close" onClick={() => setSanctionDateModal({ show: false, loanId: null })}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={sanctionDate}
                    onChange={e => setSanctionDate(e.target.value)}
                    required
                  />
                  <label className="form-label mt-2">Field Visit Date</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                  />
                  <label className="form-label mt-2">Officer Name</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={officerName}
                    onChange={e => setOfficerName(e.target.value)}
                  />
                  <label className="form-label mt-2">Visit Message</label>
                  <textarea
                    className="form-control"
                    value={visitMessage}
                    onChange={e => setVisitMessage(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSanctionDateModal({ show: false, loanId: null })}>{translations[language].cancel}</button>
                  <button className="btn btn-success" onClick={confirmApprove} disabled={!sanctionDate}>{translations[language].approveBtn}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminLoanRequests;
