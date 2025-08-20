import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaUserTie, FaShoppingCart, FaHandshake, FaUserShield, FaGlobe } from 'react-icons/fa';

const translations = {
  en: {
    registerAs: "Choose Your Role",
    subtitle: "Select the role that best describes you",
    farmer: "Farmer",
    farmerDesc: "Grow and sell your crops",
    buyer: "Buyer",
    buyerDesc: "Purchase fresh produce",
    serviceProvider: "Service Provider",
    serviceProviderDesc: "Offer agricultural services",
    admin: "Admin",
    adminDesc: "Manage the platform",
    changeLang: "தமிழ்",
    getStarted: "Get Started",
  },
  ta: {
    registerAs: "உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    subtitle: "உங்களை சிறப்பாக விவரிக்கும் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    farmer: "விவசாயி",
    farmerDesc: "உங்கள் பயிர்களை வளர்த்து விற்கவும்",
    buyer: "வாங்குபவர்",
    buyerDesc: "புதிய உற்பத்திகளை வாங்கவும்",
    serviceProvider: "சேவை வழங்குநர்",
    serviceProviderDesc: "விவசாய சேவைகளை வழங்கவும்",
    admin: "நிர்வாகி",
    adminDesc: "மேடையை நிர்வகிக்கவும்",
    changeLang: "English",
    getStarted: "தொடங்குங்கள்",
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9,
    rotateX: -15
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -10,
    scale: 1.05,
    rotateY: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const roleCards = [
  {
    id: 'farmer',
    icon: FaUserTie,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/register/farmer',
    delay: 0.1,
    color: '#667eea'
  },
  {
    id: 'buyer',
    icon: FaShoppingCart,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    route: '/register/buyer',
    delay: 0.2,
    color: '#f093fb'
  },
  {
    id: 'serviceProvider',
    icon: FaHandshake,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: '/register/service-provider',
    delay: 0.3,
    color: '#4facfe'
  },
  {
    id: 'admin',
    icon: FaUserShield,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    route: '/register',
    delay: 0.4,
    color: '#43e97b'
  }
];

function RoleRegister() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="role-register-container d-flex align-items-center justify-content-center">
      
      {/* Animated background elements */}
      <motion.div
        className="position-absolute floating"
        style={{
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="position-absolute floating"
        style={{
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container">
    <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Title with Language Toggle */}
          <div className="d-flex justify-content-center align-items-center mb-3">
            <motion.h1
              className="display-4 fw-bold mb-0 me-4"
              style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                letterSpacing: '2px'
              }}
              initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
    >
              {translations[language].registerAs}
            </motion.h1>
            
            {/* Language Toggle - Repositioned next to title */}
      <motion.button
              className="btn btn-light btn-sm"
              style={{ 
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
              }}
        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                background: 'rgba(255,255,255,1)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FaGlobe className="me-2" />
        {translations[language].changeLang}
      </motion.button>
          </div>
          
          <motion.p
            className="lead mb-5"
        style={{
              fontSize: '1.2rem',
              color: '#34495e',
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}
            initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {translations[language].subtitle}
          </motion.p>
        </motion.div>

        {/* Role Cards Grid */}
        <motion.div
          className="row justify-content-center g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {roleCards.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <motion.div
                key={role.id}
                className="col-lg-3 col-md-6 col-sm-12"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                custom={index}
              >
      <motion.div
                  className="card glass-card card-hover h-100 border-0 shadow-lg"
                  style={{
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => navigate(role.route)}
                  whileHover={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(role.route);
                    }
                  }}
                  aria-label={`Register as ${translations[language][role.id]}`}
                >
                  {/* Card Header with Gradient */}
                  <div
                    className="card-header border-0 text-center py-4"
                    style={{
                      background: role.gradient,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      className="position-absolute"
                      style={{
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <motion.div
                      className="position-relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent 
                        size={50} 
                        color="white"
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                      />
                    </motion.div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body text-center py-4">
                    <motion.h5
                      className="card-title fw-bold mb-3"
                      style={{ color: '#2c3e50' }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {translations[language][role.id]}
                    </motion.h5>
                    
                    <p className="card-text text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                      {translations[language][`${role.id}Desc`]}
                    </p>

                    <motion.div
                      className="btn btn-gradient w-100"
                      style={{
                        background: role.gradient,
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {translations[language].getStarted}
                    </motion.div>
                  </div>
      </motion.div>
    </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-black-50" style={{ fontSize: '0.9rem' }}>
            © 2024 AgroChain Lite. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default RoleRegister;
