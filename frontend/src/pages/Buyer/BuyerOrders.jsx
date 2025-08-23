import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { FaUser, FaRegClock, FaMoneyBill, FaCalendarAlt, FaTimesCircle, FaEdit, FaCreditCard, FaGoogle } from 'react-icons/fa';
import BuyerNavbar from '../../components/BuyerNavbar';

const translations = {
  en: {
    myOrders: "My Orders",
    noOrders: "No orders found.",
    quantity: "Quantity",
    totalPrice: "Total Price",
    status: "Status",
    payment: "Payment",
    farmer: "Farmer",
    deliveryDate: "Delivery Date",
    paymentConfirmed: "Payment Confirmed",
    edit: "Edit",
    cancelOrder: "Cancel Order",
    pay: "Pay",
    editOrder: "Edit Order",
    enterNewQty: "Enter new quantity",
    cancel: "Cancel",
    update: "Update",
    payForOrder: "Pay for Order",
    amountToPay: "Amount to pay",
    paymentMethod: "Payment Method",
    card: "Credit/Debit Card",
    gpay: "GPay",
    cod: "Cash on Delivery",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    expiry: "Expiry (MM/YY)",
    cvv: "CVV",
    gpayNumber: "GPay Number",
    codInfo: "You have selected Cash on Delivery. Please pay the farmer at delivery.",
    confirmPayment: "Confirm Payment",
    paymentSuccess: "Payment successful!",
    paymentFailed: "Payment failed",
    fillCard: "Please fill all card details",
    fillGpay: "Please enter GPay number",
    confirm: "Confirm",
  },
  ta: {
    myOrders: "என் ஆர்டர்கள்",
    noOrders: "ஆர்டர்கள் இல்லை.",
    quantity: "அளவு",
    totalPrice: "மொத்த விலை",
    status: "நிலை",
    payment: "பணம்",
    farmer: "விவசாயி",
    deliveryDate: "விநியோக தேதி",
    paymentConfirmed: "பணம் உறுதிப்படுத்தப்பட்டது",
    edit: "திருத்து",
    cancelOrder: "ஆர்டர் ரத்து",
    pay: "பணம் செலுத்து",
    editOrder: "ஆர்டரை திருத்து",
    enterNewQty: "புதிய அளவை உள்ளிடவும்",
    cancel: "ரத்து",
    update: "புதுப்பிக்கவும்",
    payForOrder: "ஆர்டருக்கு பணம் செலுத்தவும்",
    amountToPay: "செலுத்த வேண்டிய தொகை",
    paymentMethod: "பணம் செலுத்தும் முறை",
    card: "கிரெடிட்/டெபிட் கார்டு",
    gpay: "ஜி-பே",
    cod: "விநியோகத்தில் பணம்",
    cardNumber: "கார்டு எண்",
    cardName: "கார்டில் உள்ள பெயர்",
    expiry: "காலாவதி (MM/YY)",
    cvv: "CVV",
    gpayNumber: "ஜி-பே எண்",
    codInfo: "விநியோகத்தில் பணம் தேர்ந்தெடுக்கப்பட்டுள்ளது. தயவுசெய்து விவசாயிக்கு பணம் செலுத்தவும்.",
    confirmPayment: "பணம் உறுதிப்படுத்தவும்",
    paymentSuccess: "பணம் வெற்றிகரமாக செலுத்தப்பட்டது!",
    paymentFailed: "பணம் செலுத்த பிழை",
    fillCard: "அனைத்து கார்டு விவரங்களையும் நிரப்பவும்",
    fillGpay: "ஜி-பே எண்ணை உள்ளிடவும்",
    confirm: "உறுதிப்படுத்தவும்",
  }
};

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [payOrder, setPayOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [gpayNumber, setGpayNumber] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const { language } = useContext(LanguageContext);

  const fetchOrders = () => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('https://agrochain-lite.onrender.com/api/orders/buyer', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const token = localStorage.getItem('agrochain-token');
    if (window.confirm(translations[language].cancelOrder + "?")) {
      try {
        await axios.put(
          `https://agrochain-lite.onrender.com/api/orders/cancel/${orderId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchOrders();
      } catch (err) {
        alert(translations[language].paymentFailed);
      }
    }
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setEditQty(order.quantity);
  };

  const handleUpdateOrder = async () => {
    const token = localStorage.getItem('agrochain-token');
    if (!editQty || isNaN(editQty) || Number(editQty) <= 0) {
      alert(translations[language].enterNewQty);
      return;
    }
    try {
      await axios.put(
        `https://agrochain-lite.onrender.com/api/orders/${editOrder._id}`,
        { quantity: Number(editQty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOrder(null);
      setEditQty('');
      fetchOrders();
    } catch (err) {
      alert(translations[language].paymentFailed);
    }
  };

  const handlePay = (order) => {
    setPayOrder(order);
    setPaymentMethod('card');
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setGpayNumber('');
    setFarmerPhone(order.cropId?.phone || order.farmerId?.phone || '');
  };

  const handleConfirmPay = async () => {
    const token = localStorage.getItem('agrochain-token');
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        alert(translations[language].fillCard);
        return;
      }
    }
    if (paymentMethod === 'gpay') {
      if (!gpayNumber) {
        alert(translations[language].fillGpay);
        return;
      }
      if (farmerPhone && gpayNumber !== farmerPhone) {
        alert("Please enter the farmer's GPay number exactly as shown.");
        return;
      }
    }
    try {
      await axios.post(
        `https://agrochain-lite.onrender.com/api/orders/pay/${payOrder._id}`,
        { paymentMethod, cardNumber, cardName, expiry, cvv, gpayNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayOrder(null);
      fetchOrders();
      alert(translations[language].paymentSuccess);
    } catch (err) {
      alert(err.response?.data?.message || translations[language].paymentFailed);
    }
  };

  const statusBadgeClass = (status) => (
    status === 'accepted' ? 'bg-success' : status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
  );

  const gpayUpiLink = farmerPhone ? `upi://pay?pa=${farmerPhone}%40okicici&pn=Farmer` : '';
  const gpayQrUrl = farmerPhone ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(gpayUpiLink)}` : '';

  return (
    <>
      <BuyerNavbar />
      <div className="container py-4">
      <h3 className="fw-bold mb-3" style={{ color: '#2C5F2D' }}>{translations[language].myOrders}</h3>
      {orders.length === 0 ? (
        <div className="alert alert-info">{translations[language].noOrders}</div>
      ) : (
        <div className="row g-4">
          {orders.map(order => (
            <div className="col-md-6" key={order._id}>
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    {order.cropId?.image ? (
                      <img src={`https://agrochain-lite.onrender.com/${order.cropId.image.replace(/^\/+/, '')}`} alt={order.cropId?.cropName || 'Crop'} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginRight: 16, border: '2px solid #2C5F2D', background: '#fff' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E9F7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16, fontSize: 28, color: '#2C5F2D', fontWeight: 'bold' }}>
                        {order.cropId?.cropName?.[0]?.toUpperCase() || '-'}
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-0">{order.cropId?.cropName}</h5>
                        <span className={`badge ${statusBadgeClass(order.status)}`} style={{ fontSize: '0.9em' }}>{translations[language].status}: {order.status}</span>
                      </div>
                      {order.paymentStatus === 'paid' && (
                        <span className="badge bg-success mt-2" style={{ borderRadius: 20 }}>
                          <FaMoneyBill className="me-1" /> {translations[language].paymentConfirmed}
                      </span>
                      )}
                    </div>
                  </div>
                  <p className="mb-2" style={{ fontSize: '0.98em' }}>
                    <b>{translations[language].quantity}:</b> {order.quantity} kg<br />
                    <b>{translations[language].totalPrice}:</b> ₹{order.totalPrice}<br />
                    <b>{translations[language].farmer}:</b> {order.farmerId?.name}<br />
                    {order.deliveryDate && (<><FaCalendarAlt className="me-1 text-warning" /> <b>{translations[language].deliveryDate}:</b> {order.deliveryDate}<br /></>)}
                  </p>
                    {order.processUpdates && order.processUpdates.length > 0 && (
                    <div className="mt-2" style={{ background: '#F8F9FA', borderRadius: 8, padding: 8 }}>
                        <b>Order Timeline:</b>
                        <ul className="mb-0">
                          {order.processUpdates.map((u, idx) => (
                          <li key={idx}><FaRegClock className="me-2 text-secondary" /> <b>{u.status}</b> - {u.message} {u.address && <span>({u.address})</span>} <span style={{ color: '#888' }}>{new Date(u.date).toLocaleString()}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <div className="mt-3">
                    <button
                      className={`btn me-2 ${order.status === 'accepted' ? 'btn-secondary' : 'btn-warning'}`}
                      onClick={() => order.status !== 'accepted' && handleEdit(order)}
                      disabled={order.status === 'accepted'}
                      title={order.status === 'accepted' ? 'Editing disabled after acceptance' : ''}
                    >
                      <FaEdit className="me-1" /> {translations[language].edit}
                    </button>
                    <button
                      className={`btn me-2 ${order.status === 'accepted' ? 'btn-secondary' : 'btn-danger'}`}
                      onClick={() => order.status !== 'accepted' && handleCancel(order._id)}
                      disabled={order.status === 'accepted'}
                      title={order.status === 'accepted' ? 'Cannot cancel after acceptance' : ''}
                    >
                      <FaTimesCircle className="me-1" /> {translations[language].cancelOrder}
                    </button>
                  {(order.status === 'accepted' && (!order.paymentStatus || order.paymentStatus === 'pending')) && (
                      <button className="btn btn-success" onClick={() => handlePay(order)}><FaCreditCard className="me-1" /> {translations[language].pay}</button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editOrder && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                <h5 className="modal-title">{translations[language].editOrder}</h5>
                <button type="button" className="btn-close" onClick={() => setEditOrder(null)}></button>
              </div>
              <div className="modal-body">
                <input type="number" className="form-control" placeholder={translations[language].enterNewQty} value={editQty} onChange={e => setEditQty(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditOrder(null)}>{translations[language].cancel}</button>
                <button className="btn btn-success" onClick={handleUpdateOrder}>{translations[language].update}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {payOrder && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                <h5 className="modal-title">{translations[language].payForOrder}</h5>
                <button type="button" className="btn-close" onClick={() => setPayOrder(null)}></button>
              </div>
              <div className="modal-body">
                <p>{translations[language].amountToPay}: ₹{payOrder.totalPrice}</p>
                <div className="mb-2">
                  <label className="form-label">{translations[language].paymentMethod}</label>
                  <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="card">{translations[language].card}</option>
                    <option value="gpay">{translations[language].gpay}</option>
                    <option value="cod">{translations[language].cod}</option>
                  </select>
                </div>
                {paymentMethod === 'card' && (
                  <>
                    <input type="text" className="form-control mb-2" placeholder={translations[language].cardNumber} value={cardNumber} onChange={e => setCardNumber(e.target.value)} maxLength={16} />
                    <input type="text" className="form-control mb-2" placeholder={translations[language].cardName} value={cardName} onChange={e => setCardName(e.target.value)} />
                    <input type="text" className="form-control mb-2" placeholder={translations[language].expiry} value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={5} />
                    <input type="password" className="form-control mb-2" placeholder={translations[language].cvv} value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} />
                  </>
                )}
                {paymentMethod === 'gpay' && (
                  <>
                    <input type="text" className="form-control mb-2" placeholder={translations[language].gpayNumber} value={gpayNumber} onChange={e => setGpayNumber(e.target.value)} />
                    <div className="alert alert-info">
                      <div className="mb-2 d-flex align-items-center"><FaGoogle className="me-2" /> Enter the farmer's GPay number shown on order details.</div>
                      {farmerPhone ? (
                        <div className="text-center">
                          <img src={gpayQrUrl} alt="GPay QR" style={{ borderRadius: 8, background: '#fff', padding: 6 }} />
                          <div className="small text-muted mt-2">Scan to pay: {farmerPhone}</div>
                        </div>
                      ) : (
                        <div className="small text-muted">No farmer phone number available.</div>
                      )}
                    </div>
                  </>
                )}
                {paymentMethod === 'cod' && (
                  <div className="alert alert-info">{translations[language].codInfo}</div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPayOrder(null)}>{translations[language].cancel}</button>
                <button className="btn btn-success" onClick={handleConfirmPay}>{translations[language].confirmPayment}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default BuyerOrders;
