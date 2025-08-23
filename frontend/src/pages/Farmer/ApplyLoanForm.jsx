import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';

function ApplyLoanForm() {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState('');
  const [district, setDistrict] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    axios.get(`https://agrochain-lite.onrender.com/api/loan-schemes/${schemeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setScheme(res.data)).catch(() => setScheme(null));

    // Get farmer's district from profile
    axios.get('https://agrochain-lite.onrender.com/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setDistrict(res.data.district || ''));

    // Get all NGOs for selection
    axios.get('https://agrochain-lite.onrender.com/api/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const ngoList = res.data.filter(u => u.role === 'serviceProvider' && u.designation === 'NGO Field Coordinator');
      setNgos(ngoList);
    });
  }, [schemeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !reason || !document || !selectedNgo) {
      setMessage('Please fill all fields and select an NGO.');
      return;
    }
    const token = localStorage.getItem('agrochain-token');
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('reason', reason);
    formData.append('document', document);
    formData.append('schemeId', schemeId);
    formData.append('ngoId', selectedNgo);
    formData.append('district', district);

    try {
      await axios.post('https://agrochain-lite.onrender.com/api/loans/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Loan application submitted! NGO will review your request.');
      setTimeout(() => navigate('/farmer-dashboard'), 2000);
    } catch (err) {
      setMessage('Error submitting loan application.');
    }
  };

  if (!scheme) {
    return (
      <>
        <FarmerNavbar />
        <div className="container mt-4">
          <div className="alert alert-info">Loading scheme details...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <FarmerNavbar />
      <div className="container mt-4">
        <h3>Apply for Loan: {scheme.name}</h3>
        <div className="card p-4 shadow" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="mb-3">
            <b>Purpose:</b> {scheme.purpose}<br />
            <b>Interest Rate:</b> {scheme.interestRate}%<br />
            <b>Amount Range:</b> ₹{scheme.minAmount} - ₹{scheme.maxAmount}<br />
            <b>Repayment:</b> {scheme.repaymentPeriod}<br />
            <b>District:</b> {district}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Select NGO</label>
              <select
                className="form-select"
                value={selectedNgo}
                onChange={e => setSelectedNgo(e.target.value)}
                required
              >
                <option value="">Choose NGO</option>
                {ngos.map(ngo => (
                  <option key={ngo._id} value={ngo._id}>
                    {ngo.ngoOrgName || ngo.name} ({ngo.ngoAddress || ngo.location || '-'})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Loan Amount</label>
              <input
                type="number"
                className="form-control"
                min={scheme.minAmount}
                max={scheme.maxAmount}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Reason for Loan</label>
              <textarea
                className="form-control"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Upload Document (PDF/JPG/PNG)</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setDocument(e.target.files[0])}
                required
              />
            </div>
            <button className="btn btn-success w-100" type="submit">
              Submit Loan Application
            </button>
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default ApplyLoanForm;
