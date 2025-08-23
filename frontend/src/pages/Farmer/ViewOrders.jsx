import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';
import { FaUser, FaPhoneAlt, FaHome, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaRegClock, FaCalendarAlt, FaMoneyBill, FaPlus } from 'react-icons/fa';

const translations = {
  en: {
    yourOrders: "Your Orders",
    noOrders: "No orders found.",
    quantity: "Quantity",
    buyer: "Buyer",
    address: "Address",
    pincode: "Pincode",
    phone: "Phone",
    status: "Status",
    deliveryDate: "Delivery Date",
    paymentMethod: "Payment Method",
    paymentDetails: "Payment Details",
    paymentConfirmed: "Payment Confirmed",
    accept: "Accept",
    reject: "Reject",
    setDeliveryDate: "Set Delivery Date",
    cancel: "Cancel",
    confirm: "Confirm",
    cashOnDelivery: "Cash on Delivery",
    gpay: "GPay",
    card: "Credit/Debit Card",
  },
  ta: {
    yourOrders: "உங்கள் ஆர்டர்கள்",
    noOrders: "ஆர்டர்கள் இல்லை.",
    quantity: "அளவு",
    buyer: "வாங்குபவர்",
    address: "முகவரி",
    pincode: "அஞ்சல் குறியீடு",
    phone: "தொலைபேசி",
    status: "நிலை",
    deliveryDate: "விநியோக தேதி",
    paymentMethod: "பணம் செலுத்தும் முறை",
    paymentDetails: "பணம் செலுத்தும் விவரங்கள்",
    paymentConfirmed: "பணம் உறுதிப்படுத்தப்பட்டது",
    accept: "ஏற்கவும்",
    reject: "நிராகரிக்கவும்",
    setDeliveryDate: "விநியோக தேதியை அமைக்கவும்",
    cancel: "ரத்து",
    confirm: "உறுதிப்படுத்தவும்",
    cashOnDelivery: "விநியோகத்தில் பணம்",
    gpay: "ஜி-பே",
    card: "கிரெடிட்/டெபிட் கார்டு",
  }
};

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [acceptOrderId, setAcceptOrderId] = useState(null);
  const [processModal, setProcessModal] = useState({ show: false, orderId: null });
  const [processStatus, setProcessStatus] = useState('');
  const [processMessage, setProcessMessage] = useState('');
  const [processAddress, setProcessAddress] = useState('');
  const [notified, setNotified] = useState(false);
  const { language } = useContext(LanguageContext);

  const fetchOrders = () => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('https://agrochain-lite.onrender.com/api/orders/farmer', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(() => alert('Error fetching orders'));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.put(
        `https://agrochain-lite.onrender.com/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleAccept = (orderId) => {
    setAcceptOrderId(orderId);
    setDeliveryDate('');
  };

  const handleConfirmAccept = async () => {
    const token = localStorage.getItem('agrochain-token');
    if (!deliveryDate) {
      alert('Please enter delivery date');
      return;
    }
    try {
      await axios.put(
        `https://agrochain-lite.onrender.com/api/orders/status/${acceptOrderId}`,
        { status: 'accepted', deliveryDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptOrderId(null);
      setDeliveryDate('');
      fetchOrders();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleAddProcess = (orderId) => {
    setProcessModal({ show: true, orderId });
    setProcessStatus('');
    setProcessMessage('');
    setProcessAddress('');
  };

  const handleSubmitProcess = async () => {
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.post(
        `https://agrochain-lite.onrender.com/api/orders/process-update/${processModal.orderId}`,
        {
          status: processStatus,
          message: processMessage,
          address: processAddress
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProcessModal({ show: false, orderId: null });
      setProcessStatus('');
      setProcessMessage('');
      setProcessAddress('');
      fetchOrders();
    } catch (err) {
      alert('Error updating process');
    }
  };

  const unreadNotifications = orders
    .flatMap(order => (order.notifications || []).filter(n => !n.read))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    if (!notified && unreadNotifications.length > 0) {
      alert(
        unreadNotifications
          .map(n => `${n.message} (${new Date(n.date).toLocaleString()})`)
          .join('\n')
      );
      setNotified(true);
      const token = localStorage.getItem('agrochain-token');
      axios.post('https://agrochain-lite.onrender.com/api/orders/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchOrders());
    }
    // eslint-disable-next-line
  }, [unreadNotifications, notified]);

  const statusBadgeClass = (status) => (
    status === 'accepted' ? 'bg-success' : status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
  );

  return (
    <>
      <FarmerNavbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-3" style={{ color: '#2C5F2D' }}>{translations[language].yourOrders}</h3>
        {unreadNotifications.length > 0 && (
          <div className="alert alert-info">
            <b>Notifications:</b>
            <ul className="mb-0">
              {unreadNotifications.map((n, idx) => (
                <li key={idx}>
                  {n.message} <span style={{ color: '#888', fontSize: '0.9em' }}>{new Date(n.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {orders.length === 0 ? (
          <div className="alert alert-info">{translations[language].noOrders}</div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-md-6" key={order._id}>
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      {order.cropId?.image ? (
                        <img
                          src={`https://agrochain-lite.onrender.com/${order.cropId.image.replace(/^\/+/, '')}`}
                          alt={order.cropId?.cropName || 'Crop'}
                          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginRight: 16, border: '2px solid #2C5F2D', background: '#fff' }}
                        />
                      ) : (
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E9F7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16, fontSize: 28, color: '#2C5F2D', fontWeight: 'bold' }}>
                          {order.cropId?.cropName?.[0]?.toUpperCase() || '-'}
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">{order.cropId?.cropName || '-'}</h5>
                          <span className={`badge ${statusBadgeClass(order.status)}`} style={{ fontSize: '0.9em' }}>
                          {translations[language].status}: {order.status}
                        </span>
                        </div>
                        {order.paymentStatus === 'paid' && (
                          <span className="badge bg-success mt-2" style={{ borderRadius: 20 }}>
                            <FaMoneyBill className="me-1" /> {translations[language].paymentConfirmed}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="row g-2" style={{ fontSize: '0.98em' }}>
                      <div className="col-6"><b>{translations[language].quantity}:</b> {order.quantity} kg</div>
                      <div className="col-6 d-flex align-items-center"><FaUser className="me-2 text-primary" /> <b className="me-1">{translations[language].buyer}:</b> {order.buyerId?.name || '-'}</div>
                      <div className="col-12 d-flex align-items-center"><FaHome className="me-2 text-secondary" /> <b className="me-1">{translations[language].address}:</b> {order.address}</div>
                      <div className="col-6 d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-danger" /> <b className="me-1">{translations[language].pincode}:</b> {order.pincode}</div>
                      <div className="col-6 d-flex align-items-center"><FaPhoneAlt className="me-2 text-success" /> <b className="me-1">{translations[language].phone}:</b> {order.phone}</div>
                      {order.deliveryDate && (
                        <div className="col-12 d-flex align-items-center"><FaCalendarAlt className="me-2 text-warning" /> <b className="me-1">{translations[language].deliveryDate}:</b> {order.deliveryDate}</div>
                      )}
                      {order.paymentMethod && (
                        <div className="col-12"><b>{translations[language].paymentMethod}:</b> {order.paymentMethod === 'cod'
                            ? translations[language].cashOnDelivery
                            : order.paymentMethod === 'gpay'
                              ? translations[language].gpay
                            : translations[language].card}</div>
                      )}
                      {order.paymentDetails && (
                        <div className="col-12"><b>{translations[language].paymentDetails}:</b> {order.paymentDetails}</div>
                      )}
                    </div>

                    {order.processUpdates && order.processUpdates.length > 0 && (
                      <div className="mt-3" style={{ background: '#F8F9FA', borderRadius: 8, padding: 8 }}>
                        <b>Order Timeline:</b>
                        <ul className="mb-0">
                          {order.processUpdates.map((u, idx) => (
                            <li key={idx}>
                              <FaRegClock className="me-2 text-secondary" />
                              <b>{u.status}</b> - {u.message} {u.address && <span>({u.address})</span>} <span style={{ color: '#888' }}>{new Date(u.date).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {order.status === 'pending' && (
                      <div className="mt-3">
                        <button className="btn btn-success me-2" onClick={() => handleAccept(order._id)} style={{ borderRadius: 10 }}>
                          <FaCheckCircle className="me-1" /> {translations[language].accept}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleStatusChange(order._id, 'rejected')} style={{ borderRadius: 10 }}>
                          <FaTimesCircle className="me-1" /> {translations[language].reject}
                        </button>
                      </div>
                    )}

                    <button className="btn btn-info mt-3" onClick={() => handleAddProcess(order._id)} style={{ borderRadius: 10 }}>
                      <FaPlus className="me-1" /> Add Process Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {acceptOrderId && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                <h5 className="modal-title">{translations[language].setDeliveryDate}</h5>
                <button type="button" className="btn-close" onClick={() => setAcceptOrderId(null)}></button>
              </div>
              <div className="modal-body">
                <input type="date" className="form-control" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setAcceptOrderId(null)}>{translations[language].cancel}</button>
                <button className="btn btn-success" onClick={handleConfirmAccept}>{translations[language].confirm}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {processModal.show && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                <h5 className="modal-title">Add Process Update</h5>
                <button type="button" className="btn-close" onClick={() => setProcessModal({ show: false, orderId: null })}></button>
              </div>
              <div className="modal-body">
                <select className="form-select mb-2" value={processStatus} onChange={e => setProcessStatus(e.target.value)} required>
                  <option value="">Select Status</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
                <input type="text" className="form-control mb-2" placeholder="Message (e.g., Packed on 2024-06-10)" value={processMessage} onChange={e => setProcessMessage(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Address (optional)" value={processAddress} onChange={e => setProcessAddress(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setProcessModal({ show: false, orderId: null })}>Cancel</button>
                <button className="btn btn-success" onClick={handleSubmitProcess} disabled={!processStatus || !processMessage}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewOrders;
