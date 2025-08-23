import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { FaSearch, FaSync, FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRupeeSign, FaUser, FaShoppingCart, FaCalendarAlt } from 'react-icons/fa';
import BuyerNavbar from '../../components/BuyerNavbar';

const translations = {
  en: {
    dashboard: "AgroChain Buyer Dashboard",
    myOrders: "My Orders",
    availableCrops: "Available Crops",
    refresh: "Refresh",
    noCrops: "No crops available.",
    order: "Order",
    orderCrop: "Order",
    enterQty: "Enter quantity",
    address: "Address",
    pincode: "Pincode",
    phone: "Phone Number",
    cultivationDate: "Cultivation Date",
    cancel: "Cancel",
    placeOrder: "Place Order",
    success: "Order placed successfully!",
    error: "Error placing order",
    fillAddress: "Please fill address, pincode, and phone",
    validQty: "Enter a valid quantity",
    validPhone: "Phone number must be exactly 10 digits",
    logout: "Logout"
  },
  ta: {
    dashboard: "AgroChain வாங்குபவர் பலகம்",
    myOrders: "என் ஆர்டர்கள்",
    availableCrops: "கிடைக்கும் பயிர்கள்",
    refresh: "புதுப்பிக்கவும்",
    noCrops: "பயிர்கள் இல்லை.",
    order: "ஆர்டர்",
    orderCrop: "ஆர்டர்",
    enterQty: "அளவை உள்ளிடவும்",
    address: "முகவரி",
    pincode: "அஞ்சல் குறியீடு",
    phone: "தொலைபேசி எண்",
    cultivationDate: "சாகுபடி தேதி",
    cancel: "ரத்து",
    placeOrder: "ஆர்டர் செய்யவும்",
    success: "ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது!",
    error: "ஆர்டர் செய்ய பிழை",
    fillAddress: "முகவரி, அஞ்சல் குறியீடு மற்றும் தொலைபேசி எண்ணை நிரப்பவும்",
    validQty: "சரியான அளவை உள்ளிடவும்",
    validPhone: "தொலைபேசி எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்",
    logout: "வெளியேறு"
  }
};

function BuyerDashboard() {
  const [crops, setCrops] = useState([]);
  const [orderQty, setOrderQty] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [unifiedSearch, setUnifiedSearch] = useState('');
  const { language } = useContext(LanguageContext);

  const fetchCrops = () => {
    const url = 'https://agrochain-lite.onrender.com/api/crops/all';
    axios.get(url)
      .then(res => {
        setCrops(res.data);
      })
      .catch((err) => {
        console.error('Error fetching crops:', err);
        setCrops([]);
      });
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleOrderClick = (crop) => {
    setSelectedCrop(crop);
    setOrderQty('');
    setAddress('');
    setPincode('');
    setPhone('');
  };

  const handlePlaceOrder = async () => {
    if (!orderQty || isNaN(orderQty) || Number(orderQty) <= 0) {
      alert(translations[language].validQty);
      return;
    }
    if (!address || !pincode || !phone) {
      alert(translations[language].fillAddress);
      return;
    }
    // Validate phone number - must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert(translations[language].validPhone);
      return;
    }
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.post(
        'https://agrochain-lite.onrender.com/api/orders/place',
        {
          cropName: selectedCrop.cropName,
          quantity: Number(orderQty),
          farmerName: selectedCrop.farmer.name,
          address,
          pincode,
          phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(translations[language].success);
      setSelectedCrop(null);
      setOrderQty('');
      setAddress('');
      setPincode('');
      setPhone('');
    } catch (err) {
      alert(err.response?.data?.message || translations[language].error);
    }
  };

  return (
    <>
      <BuyerNavbar />
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
          <h3 className="fw-bold mb-2 mb-md-0" style={{ color: '#2C5F2D' }}>{translations[language].availableCrops}</h3>
        </div>
        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-lg-8">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by crop, farmer or address..." 
                value={unifiedSearch} 
                onChange={e => setUnifiedSearch(e.target.value)} 
              />
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <button
              className="btn btn-success w-100"
              onClick={() => { setUnifiedSearch(''); fetchCrops(); }}
              style={{ transition: 'all .2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.borderColor = '#ffc107'; e.currentTarget.style.color = '#212529'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
            >
              <FaSync className="me-1" /> {translations[language].refresh}
            </button>
          </div>
        </div>

        <div className="row g-3 g-md-4">
          {crops.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info">{translations[language].noCrops}</div>
            </div>
          )}
          {crops
            .filter(crop => {
              // Filter out crops with zero or negative quantity
              if (!crop.quantity || crop.quantity <= 0) return false;
              
              const q = unifiedSearch.trim().toLowerCase();
              if (!q) return true;
              const cropName = (crop.cropName || '').toLowerCase();
              const farmerName = (crop.farmer?.name || '').toLowerCase();
              const address = (crop.address || '').toLowerCase();
              return cropName.includes(q) || farmerName.includes(q) || address.includes(q);
            })
            .map(crop => (
            <div className="col-12 col-sm-6 col-lg-4" key={crop._id}>
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                {crop.image && (
                  <img
                    src={`https://agrochain-lite.onrender.com/${crop.image.replace(/^\/+/, '')}`}
                    alt={crop.cropName}
                    className="card-img-top"
                    style={{ maxHeight: 180, objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x180?text=No+Image"; }}
                  />
                )}
                <div className="card-body p-3">
                  <h5 className="card-title mb-2 text-truncate">{crop.cropName}</h5>
                  <div className="small text-muted mb-2 d-flex align-items-center">
                    <FaUser className="me-2 flex-shrink-0" /> 
                    <span className="text-truncate">Farmer: {crop.farmer?.name || '-'}</span>
                  </div>
                  <div className="row g-2 mb-3" style={{ fontSize: '0.9em' }}>
                    <div className="col-6 d-flex align-items-center">
                      <FaRupeeSign className="me-1 text-success flex-shrink-0" /> 
                      <span className="fw-semibold">₹{crop.pricePerKg}/kg</span>
                    </div>
                    <div className="col-6 text-end">
                      <span className="badge bg-light text-dark">Qty: {crop.quantity} kg</span>
                    </div>
                    {crop.cultivationDate && (
                      <div className="col-12 d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-info flex-shrink-0" /> 
                        <small className="text-truncate">{translations[language].cultivationDate}: {new Date(crop.cultivationDate).toLocaleDateString()}</small>
                      </div>
                    )}
                    {crop.address && (
                      <div className="col-12 d-flex align-items-center">
                        <FaHome className="me-2 text-secondary flex-shrink-0" /> 
                        <small className="text-truncate">{crop.address}</small>
                      </div>
                    )}
                  </div>
                  {crop.description && (
                    <p className="text-muted mb-3" style={{ fontSize: '0.85em', lineHeight: '1.4' }}>
                      {crop.description.length > 80 ? `${crop.description.substring(0, 80)}...` : crop.description}
                    </p>
                  )}
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={() => handleOrderClick(crop)} 
                    style={{ borderRadius: 10 }}
                  >
                    <FaShoppingCart className="me-2" /> {translations[language].order}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCrop && (
          <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '16px' }}>
                <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>
                  <h5 className="modal-title">{translations[language].orderCrop} {selectedCrop.cropName}</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setSelectedCrop(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-3 p-md-4">
                  {selectedCrop.cultivationDate && (
                    <div className="alert alert-info mb-3 d-flex align-items-center">
                      <FaCalendarAlt className="me-2 flex-shrink-0" />
                      <div>
                        <strong>{translations[language].cultivationDate}:</strong> {new Date(selectedCrop.cultivationDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Quantity (kg)</label>
                      <div className="input-group">
                        <span className="input-group-text">kg</span>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder={translations[language].enterQty} 
                          value={orderQty} 
                          onChange={e => setOrderQty(e.target.value)}
                          min="1"
                          max={selectedCrop.quantity}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">{translations[language].address}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaHome /></span>
                        <textarea 
                          className="form-control" 
                          placeholder={translations[language].address} 
                          value={address} 
                          onChange={e => setAddress(e.target.value)}
                          rows="2"
                          style={{ resize: 'none' }}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">{translations[language].pincode}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder={translations[language].pincode} 
                          value={pincode} 
                          onChange={e => setPincode(e.target.value)}
                          maxLength="6"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">{translations[language].phone}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaPhoneAlt /></span>
                        <input 
                          type="tel" 
                          className="form-control" 
                          placeholder={translations[language].phone} 
                          value={phone} 
                          maxLength={10}
                          onChange={e => {
                            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                            setPhone(value);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  {orderQty && selectedCrop.pricePerKg && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Total Amount:</span>
                        <span className="fs-5 fw-bold text-success">
                          ₹{(Number(orderQty) * selectedCrop.pricePerKg).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer p-3 gap-2">
                  <button 
                    className="btn btn-secondary flex-fill" 
                    onClick={() => setSelectedCrop(null)}
                  >
                    {translations[language].cancel}
                  </button>
                  <button 
                    className="btn btn-success flex-fill" 
                    onClick={handlePlaceOrder}
                  >
                    {translations[language].placeOrder}
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

export default BuyerDashboard;
