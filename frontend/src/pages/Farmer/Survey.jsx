// ...filepath: d:\CULTURAL FEST\agrochain-lite\frontend\src\pages\Farmer\Survey.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';
import { FaChartBar, FaSeedling } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Survey() {
  const [topCrops, setTopCrops] = useState([]);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/survey/top-crops')
      .then(res => setTopCrops(res.data))
      .catch(() => setTopCrops([]));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
  };

  const height = 120 + (topCrops.length * 68);

  return (
    <>
      <FarmerNavbar />
      <div className="container py-4">
        <div className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
          <div className="card-header border-0 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>
            <FaChartBar className="me-2" />
            <h4 className="mb-0">Survey: What Buyers Buy More?</h4>
          </div>
          <div className="card-body">
            <p className="text-muted">Use this visual to understand demand. Hover nodes to highlight; the flow animates in to guide your eye.</p>
        {topCrops.length === 0 ? (
              <div className="text-center p-4">
                <div className="alert alert-info d-inline-block mb-0">No data available yet.</div>
              </div>
        ) : (
          <div className="d-flex justify-content-center">
                <motion.svg
                  width="520"
                  height={height}
                  initial="hidden"
                  animate="show"
                  variants={containerVariants}
                  style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.08))' }}
                >
                <defs>
                    <linearGradient id="nodeGrad" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2C5F2D" />
                      <stop offset="100%" stopColor="#17633A" />
                    </linearGradient>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2C5F2D" />
                  </marker>
                </defs>

                  <motion.g variants={itemVariants}>
                    <rect x="210" y="10" width="120" height="48" fill="url(#nodeGrad)" rx="12" />
                    <text x="270" y="40" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">Buyers</text>
                  </motion.g>

                  {topCrops.map((crop, idx) => {
                    const y = 100 + idx * 68;
                    return (
                      <motion.g key={crop.cropName} variants={itemVariants} whileHover={{ scale: 1.03 }}>
                        <line x1="270" y1={58} x2="270" y2={y - 8} stroke="#2C5F2D" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <rect x="150" y={y} width="240" height="48" fill="#E9F7EF" stroke="#2C5F2D" rx="12" />
                        <FaSeedling style={{ position: 'absolute', opacity: 0 }} />
                        <text x="270" y={y + 30} textAnchor="middle" fill="#2C5F2D" fontSize="15" fontWeight="bold">
                          {crop.cropName} ({crop.count} orders)
                        </text>
                      </motion.g>
                    );
                  })}
                </motion.svg>
          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Survey;
