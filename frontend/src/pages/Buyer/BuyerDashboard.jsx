import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { FaSearch, FaSync, FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRupeeSign, FaUser, FaShoppingCart } from 'react-icons/fa';
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
    cancel: "Cancel",
    placeOrder: "Place Order",
    success: "Order placed successfully!",
    error: "Error placing order",
    fillAddress: "Please fill address, pincode, and phone",
    validQty: "Enter a valid quantity",
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
    cancel: "ரத்து",
    placeOrder: "ஆர்டர் செய்யவும்",
    success: "ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது!",
    error: "ஆர்டர் செய்ய பிழை",
    fillAddress: "முகவரி, அஞ்சல் குறியீடு மற்றும் தொலைபேசி எண்ணை நிரப்பவும்",
    validQty: "சரியான அளவை உள்ளிடவும்",
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
    const url = 'http://localhost:5000/api/crops/all';
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
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.post(
        'http://localhost:5000/api/orders/place',
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
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="fw-bold" style={{ color: '#2C5F2D' }}>{translations[language].availableCrops}</h3>
        </div>
        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span>
              <input type="text" className="form-control" placeholder="Search by crop, farmer or address..." value={unifiedSearch} onChange={e => setUnifiedSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-12 col-md-auto">
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

        <div className="row g-4">
          {crops.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info">{translations[language].noCrops}</div>
            </div>
          )}
          {crops
            .filter(crop => {
              const q = unifiedSearch.trim().toLowerCase();
              if (!q) return true;
              const cropName = (crop.cropName || '').toLowerCase();
              const farmerName = (crop.farmer?.name || '').toLowerCase();
              const address = (crop.address || '').toLowerCase();
              return cropName.includes(q) || farmerName.includes(q) || address.includes(q);
            })
            .map(crop => (
            <div className="col-md-4" key={crop._id}>
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                {crop.image && (
                  <img
                    src={`http://localhost:5000/${crop.image.replace(/^\/+/, '')}`}
                    alt={crop.cropName}
                    className="card-img-top"
                    style={{ maxHeight: 180, objectFit: 'cover' }}
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x180?text=No+Image"; }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title mb-1">{crop.cropName}</h5>
                  <div className="small text-muted mb-2 d-flex align-items-center"><FaUser className="me-2" /> Farmer: {crop.farmer?.name || '-'}</div>
                  <div className="row g-2 mb-2" style={{ fontSize: '0.96em' }}>
                    <div className="col-6 d-flex align-items-center"><FaRupeeSign className="me-2 text-success" /> ₹{crop.pricePerKg}/kg</div>
                    <div className="col-6">Qty: {crop.quantity} kg</div>
                    {crop.address && (
                      <div className="col-12 d-flex align-items-center"><FaHome className="me-2 text-secondary" /> {crop.address}</div>
                    )}
                  </div>
                  {crop.description && (<p className="text-muted" style={{ fontSize: '0.9em' }}>{crop.description}</p>)}
                  <button className="btn btn-primary w-100" onClick={() => handleOrderClick(crop)} style={{ borderRadius: 10 }}>
                    <FaShoppingCart className="me-2" /> {translations[language].order}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCrop && (
          <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}>
                  <h5 className="modal-title">{translations[language].orderCrop} {selectedCrop.cropName}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedCrop(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="input-group mb-2">
                    <span className="input-group-text">kg</span>
                    <input type="number" className="form-control" placeholder={translations[language].enterQty} value={orderQty} onChange={e => setOrderQty(e.target.value)} />
                  </div>
                  <div className="input-group mb-2">
                    <span className="input-group-text"><FaHome /></span>
                    <input type="text" className="form-control" placeholder={translations[language].address} value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="input-group mb-2">
                    <span className="input-group-text"><FaMapMarkerAlt /></span>
                    <input type="text" className="form-control" placeholder={translations[language].pincode} value={pincode} onChange={e => setPincode(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <span className="input-group-text"><FaPhoneAlt /></span>
                    <input type="text" className="form-control" placeholder={translations[language].phone} value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedCrop(null)}>{translations[language].cancel}</button>
                  <button className="btn btn-success" onClick={handlePlaceOrder}>{translations[language].placeOrder}</button>
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
