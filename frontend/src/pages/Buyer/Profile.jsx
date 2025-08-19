import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaHome, FaMapMarkerAlt, FaGlobe, FaHashtag, FaSave, FaCamera } from 'react-icons/fa';
import BuyerNavbar from '../../components/BuyerNavbar';

function BuyerProfile() {
  const { language } = useContext(LanguageContext);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '', state: '', district: '', pincode: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(localStorage.getItem('agrochain-user-avatar-buyer') || localStorage.getItem('agrochain-user-avatar') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agrochain-token');
    if (!token) return setLoading(false);
    axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        state: res.data.state || '',
        district: res.data.district || '',
        pincode: res.data.pincode || ''
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.put('http://localhost:5000/api/users/me', profile, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});

      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        await axios.post('http://localhost:5000/api/users/me/avatar', fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        }).catch(() => {});
      }

      if (avatarPreview) {
        localStorage.setItem('agrochain-user-avatar-buyer', avatarPreview);
      }
      alert('Profile saved');
    } catch (err) {
      alert('Error saving profile');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <BuyerNavbar />
      <div className="container py-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="d-flex align-items-center mb-3" style={{ gap: 10 }}>
        <div className="d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, borderRadius: '50%', background: '#2C5F2D', color: '#fff' }}>
          <FaUser />
        </div>
        <h3 className="fw-bold mb-0" style={{ color: '#2C5F2D' }}>Buyer Profile</h3>
      </motion.div>
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <div className="card-body text-center">
                <div className="mb-3 position-relative d-inline-block">
                  <img
                    src={avatarPreview || 'https://via.placeholder.com/160?text=Avatar'}
                    alt="Avatar"
                    style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2C5F2D' }}
                  />
                  <label className="btn btn-success position-absolute" style={{ right: -6, bottom: -6, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCamera />
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      setAvatarFile(file || null);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setAvatarPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                <div className="small text-muted">Upload a clear profile photo</div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-8">
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaUser /></span>
                      <input className="form-control" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaEnvelope /></span>
                      <input className="form-control" value={profile.email} disabled />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Phone</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaPhoneAlt /></span>
                      <input className="form-control" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Pincode</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaHashtag /></span>
                      <input className="form-control" value={profile.pincode} onChange={e => setProfile({ ...profile, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-muted">Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaHome /></span>
                      <input className="form-control" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">State</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaGlobe /></span>
                      <input className="form-control" value={profile.state} onChange={e => setProfile({ ...profile, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">District</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><FaMapMarkerAlt /></span>
                      <input className="form-control" value={profile.district} onChange={e => setProfile({ ...profile, district: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleSave}>
                    <FaSave />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default BuyerProfile;
