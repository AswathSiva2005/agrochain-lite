import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';
import { FaSeedling, FaWeightHanging, FaRupeeSign, FaRegStickyNote, FaMapMarkerAlt, FaPhoneAlt, FaImage, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const translations = {
  en: {
    addNewCrop: "Add New Crop",
    cropName: "Crop Name",
    quantity: "Quantity (kg)",
    pricePerKg: "Price per kg",
    description: "Description (optional)",
    address: "Address",
    phone: "Phone Number",
    cultivationDate: "Cultivation Date",
    chooseImage: "Choose Image",
    addCrop: "Add Crop",
    success: "✅ Crop added successfully!",
    error: "❌ Error adding crop. Please try again.",
    notLoggedIn: "You're not logged in as a farmer.",
  },
  ta: {
    addNewCrop: "புதிய பயிர் சேர்க்கவும்",
    cropName: "பயிர் பெயர்",
    quantity: "அளவு (கிலோ)",
    pricePerKg: "ஒரு கிலோவிற்கான விலை",
    description: "விளக்கம் (விருப்பம்)",
    address: "முகவரி",
    phone: "தொலைபேசி எண்",
    cultivationDate: "சாகுபடி தேதி",
    chooseImage: "படத்தைத் தேர்ந்தெடுக்கவும்",
    addCrop: "பயிர் சேர்க்கவும்",
    success: "✅ பயிர் வெற்றிகரமாக சேர்க்கப்பட்டது!",
    error: "❌ பயிர் சேர்க்கும் போது பிழை. மீண்டும் முயற்சிக்கவும்.",
    notLoggedIn: "நீங்கள் விவசாயியாக உள்நுழையவில்லை.",
  }
};

function AddCrop() {
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cultivationDate, setCultivationDate] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    const role = localStorage.getItem('agrochain-role');

    if (!token || role !== 'farmer') {
      alert(translations[language].notLoggedIn);
      navigate('/farmer-login');
    }
  }, [navigate, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const farmerName = localStorage.getItem('agrochain-user-name');
    const token = localStorage.getItem('agrochain-token');

    if (!farmerName || !token) {
      alert(translations[language].notLoggedIn);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cropName', cropName);
      formData.append('quantity', quantity);
      formData.append('pricePerKg', pricePerKg);
      formData.append('description', description);
      formData.append('farmerName', farmerName);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('cultivationDate', cultivationDate);
      if (image) formData.append('image', image);

      await axios.post(
        'https://agrochain-lite.onrender.com/api/crops/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert(translations[language].success);
      setCropName('');
      setQuantity('');
      setPricePerKg('');
      setDescription('');
      setImage(null);
      setAddress('');
      setPhone('');
      setCultivationDate('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || translations[language].error;
      alert(errorMessage);
    }
  };

  return (
    <>
      <FarmerNavbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <div className="card-header border-0" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>
                <h4 className="mb-0 d-flex align-items-center" style={{ gap: 10 }}>
                  <FaSeedling /> {translations[language].addNewCrop}
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">{translations[language].cropName}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaSeedling /></span>
                        <input type="text" className="form-control" placeholder={translations[language].cropName} value={cropName} onChange={(e) => setCropName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">{translations[language].quantity}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaWeightHanging /></span>
                        <input type="number" className="form-control" placeholder={translations[language].quantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">{translations[language].pricePerKg}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaRupeeSign /></span>
                        <input type="number" className="form-control" placeholder={translations[language].pricePerKg} value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">{translations[language].phone}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaPhoneAlt /></span>
                        <input type="text" className="form-control" placeholder={translations[language].phone} value={phone} onChange={e => { const v = e.target.value; if (/^\d{0,10}$/.test(v)) setPhone(v); }} maxLength={10} minLength={10} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">{translations[language].cultivationDate}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaCalendarAlt /></span>
                        <input type="date" className="form-control" value={cultivationDate} onChange={(e) => setCultivationDate(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted">{translations[language].address}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                        <input type="text" className="form-control" placeholder={translations[language].address} value={address} onChange={e => setAddress(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted">{translations[language].description}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaRegStickyNote /></span>
                        <textarea className="form-control" placeholder={translations[language].description} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted">{translations[language].chooseImage}</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaImage /></span>
                        <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn d-flex align-items-center gap-2" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: 12, padding: '10px 18px', boxShadow: '0 6px 18px rgba(44,95,45,.25)' }} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 24px rgba(44,95,45,.35)'}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(44,95,45,.25)'}}>
                      <FaPlus /> {translations[language].addCrop}
          </button>
                  </div>
        </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCrop;
