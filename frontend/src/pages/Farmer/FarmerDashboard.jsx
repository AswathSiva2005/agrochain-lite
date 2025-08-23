import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import FarmerNavbar from "../../components/FarmerNavbar";
import { LanguageContext } from '../../App';
import { FaSeedling, FaClipboardCheck, FaHandHoldingUsd, FaChartLine, FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

const translations = {
  en: {
    welcome: "Welcome",
    manage: "Manage your crops, track orders, and apply for loans here.",
    loanApproved: " Loan Approved!",
    loanPending: "⏳ Loan Pending",
    loanRejected: "❌ Loan Rejected",
    amount: "Amount",
    reason: "Reason",
    status: "Status",
    approvedBy: "Approved by",
    sanctionDate: "Sanction Date",
    document: "Document",
    appliedAt: "Applied At",
    noLoan: "No loan requests found.",
    loading: "Loading loan status...",
    // New quick stats labels
    activeCrops: "Active Crops",
    totalOrders: "Total Orders",
    loanStatus: "Loan Status",
    earnings: "Earnings",
  },
  ta: {
    welcome: "வரவேற்கிறோம்",
    manage: "உங்கள் பயிர்களை நிர்வகிக்கவும், ஆர்டர்களை கண்காணிக்கவும், கடனுக்கு விண்ணப்பிக்கவும்.",
    loanApproved: " கடன் ஒப்புதல்!",
    loanPending: "⏳ கடன் நிலுவையில் உள்ளது",
    loanRejected: "❌ கடன் நிராகரிக்கப்பட்டது",
    amount: "தொகை",
    reason: "காரணம்",
    status: "நிலை",
    approvedBy: "ஒப்புதல் வழங்கியவர்",
    sanctionDate: "ஒப்புதல் தேதி",
    document: "ஆவணம்",
    appliedAt: "விண்ணப்பித்த தேதி",
    noLoan: "கடன் விண்ணப்பங்கள் இல்லை.",
    loading: "கடன் நிலை ஏற்றுகிறது...",
    activeCrops: "செயலில் உள்ள பயிர்கள்",
    totalOrders: "மொத்த ஆர்டர்கள்",
    loanStatus: "கடன் நிலை",
    earnings: "வருவாய்",
  }
};

function FarmerDashboard() {
  const { language } = useContext(LanguageContext);
  const [latestLoan, setLatestLoan] = useState(null);
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ crops: 0, orders: 0, earnings: 0 });
  const name = localStorage.getItem('agrochain-user-name');
  const myId = localStorage.getItem('agrochain-user-id');

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('https://agrochain-lite.onrender.com/api/loans/my', { headers }),
      axios.get('https://agrochain-lite.onrender.com/api/crops/my-crops', { headers, params: { farmerName: name } }),
      axios.get('https://agrochain-lite.onrender.com/api/orders/farmer', { headers })
    ])
      .then(([loansRes, cropsRes, ordersRes]) => {
        // Loans
        const sortedLoans = loansRes.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setMyLoans(sortedLoans);
        setLatestLoan(sortedLoans[0] || null);

        // Crops count
        const cropsCount = Array.isArray(cropsRes.data) ? cropsRes.data.length : 0;

        // Orders + Earnings
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const ordersCount = orders.length;
        const earnings = orders.reduce((sum, order) => {
          // count only accepted and paid orders
          const isPaid = order.paymentStatus === 'paid';
          const isAccepted = order.status === 'accepted';
          return isPaid && isAccepted ? sum + (order.totalPrice || 0) : sum;
        }, 0);

        setStats({ crops: cropsCount, orders: ordersCount, earnings });
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <>
      <FarmerNavbar />
      <div className="container mt-4">
        <div className="mb-4">
          <h2 className="fw-bold mb-2" style={{ color: '#2C5F2D' }}>{translations[language].welcome} !</h2>
          {/* <p className="text-muted mb-4">{translations[language].manage}</p> */}
        </div>

        {/* Quick stats row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: '6px solid #28a745', transition: 'all .25s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 1rem 2rem rgba(0,0,0,.12)'}} onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 .25rem .75rem rgba(0,0,0,.075)'}}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small text-muted">{translations[language].activeCrops}</div>
                  <FaSeedling color="#28a745" />
                </div>
                <div className="fs-4 fw-bold">{stats.crops}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: '6px solid #0d6efd', transition: 'all .25s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 1rem 2rem rgba(0,0,0,.12)'}} onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 .25rem .75rem rgba(0,0,0,.075)'}}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small text-muted">{translations[language].totalOrders}</div>
                  <FaClipboardCheck color="#0d6efd" />
                </div>
                <div className="fs-4 fw-bold">{stats.orders}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: '6px solid #ffc107', transition: 'all .25s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 1rem 2rem rgba(0,0,0,.12)'}} onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 .25rem .75rem rgba(0,0,0,.075)'}}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small text-muted">{translations[language].loanStatus}</div>
                  <FaHandHoldingUsd color="#ffc107" />
                </div>
                <div className="fs-6 fw-semibold text-muted text-truncate">{latestLoan ? latestLoan.status : '—'}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: '6px solid #6f42c1', transition: 'all .25s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 1rem 2rem rgba(0,0,0,.12)'}} onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 .25rem .75rem rgba(0,0,0,.075)'}}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small text-muted">{translations[language].earnings}</div>
                  <FaChartLine color="#6f42c1" />
                </div>
                <div className="fs-5 fs-md-4 fw-bold text-truncate">{formatCurrency(stats.earnings)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Removed the detailed latest-loan container as requested */}

        {myLoans && myLoans.length > 0 && (
          <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: 16 }}>
            <div className="card-header border-0 d-flex align-items-center flex-wrap" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>
              <div className="d-flex align-items-center flex-grow-1 mb-2 mb-md-0">
                <FaHandHoldingUsd className="me-2" />
                <h5 className="mb-0 fw-bold">Your Loan Requests</h5>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,.25)', color: '#fff', borderRadius: 16 }}>{myLoans.length}</span>
            </div>
            <div className="card-body p-3 p-md-4">
              <div className="row g-3">
                {myLoans.map((loan) => {
                  const status = loan.status || 'pending';
                  const meta = status === 'approved'
                    ? { color: '#28a745', Icon: FaCheckCircle, label: 'Approved' }
                    : status === 'rejected'
                    ? { color: '#dc3545', Icon: FaTimesCircle, label: 'Rejected' }
                    : { color: '#f0ad4e', Icon: FaClock, label: 'Pending' };
                  const { Icon } = meta;
                  return (
                    <div className="col-12 col-md-6 col-xl-4" key={loan._id}>
                      <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: `6px solid ${meta.color}`, transition: 'all .25s ease' }}
                        onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 1rem 2rem rgba(0,0,0,.12)'}}
                        onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 .25rem .75rem rgba(0,0,0,.075)'}}>
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                            <div className="d-flex align-items-center mb-1 mb-md-0">
                              <Icon size={16} color={meta.color} className="me-2" />
                              <span className="fw-semibold" style={{ color: meta.color, textTransform: 'capitalize' }}>{status}</span>
                            </div>
                            <small className="text-muted d-flex align-items-center">
                              <FaCalendarAlt className="me-1" />
                              <span className="d-none d-sm-inline">{new Date(loan.appliedAt).toLocaleDateString()}</span>
                              <span className="d-sm-none">{new Date(loan.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </small>
                          </div>
                          <div className="mb-2">
                            <span className="text-muted small">Amount</span>
                            <div className="fw-bold fs-6">₹{loan.amount.toLocaleString()}</div>
                          </div>
                          <div className="mb-3">
                            <span className="text-muted small">Reason</span>
                            <div className="fw-semibold text-wrap" style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
                              {loan.reason.length > 60 ? `${loan.reason.substring(0, 60)}...` : loan.reason}
                            </div>
                          </div>
                          {loan.document && (
                            <a 
                              href={`https://agrochain-lite.onrender.com/${loan.document}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-outline-primary btn-sm w-100" 
                              style={{ borderRadius: 20, fontSize: '0.8em' }}
                            >
                              <FaFileAlt className="me-2" />Document
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

}

export default FarmerDashboard;
