import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaSignInAlt } from 'react-icons/fa';

const translations = {
  en: {
    login: "Welcome Back",
    subtitle: "Sign in to your account",
    name: "Name",
    email: "Email",
    password: "Password",
    submit: "Sign In",
    error: "Login failed",
    changeLang: "தமிழ்",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    register: "Register Now",
  },
  ta: {
    login: "மீண்டும் வரவேற்கிறோம்",
    subtitle: "உங்கள் கணக்கில் உள்நுழையவும்",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    submit: "உள்நுழைய",
    error: "உள்நுழைவு தோல்வியடைந்தது",
    changeLang: "English",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    noAccount: "கணக்கு இல்லையா?",
    register: "இப்போது பதிவு செய்யவும்",
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);

  function clearAgrochainTokens() {
    localStorage.removeItem('agrochain-token');
    localStorage.removeItem('agrochain-role');
    localStorage.removeItem('agrochain-user-name');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearAgrochainTokens(); // Clear tokens before login

    try {
      const res = await axios.post('https://agrochain-lite.onrender.com/api/auth/login', {
        email,
        password
      });

      const { role, name } = res.data.user;
      const token = res.data.token;

      localStorage.setItem('agrochain-user-name', name);
      localStorage.setItem('agrochain-token', token);
      localStorage.setItem('agrochain-role', role);

      if (role === 'farmer') navigate('/farmer-dashboard');
      else if (role === 'buyer') navigate('/buyer-dashboard');
      else if (role === 'serviceProvider') navigate('/service-provider-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else alert('Unknown role');
    } catch (err) {
      alert(translations[language].error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      
      {/* Animated background elements */}
      <motion.div
        className="position-absolute floating"
        style={{
          top: '15%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="position-absolute floating"
        style={{
          bottom: '25%',
          right: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          filter: 'blur(25px)'
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container">
        <motion.div
          className="row justify-content-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="col-lg-5 col-md-7 col-sm-12">
            {/* Language Toggle */}
            <motion.button
              className="btn btn-light btn-sm position-absolute"
              style={{ 
                top: '20px', 
                right: '20px', 
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000
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
              variants={itemVariants}
            >
              <FaGlobe className="me-2" />
        {translations[language].changeLang}
            </motion.button>

            {/* Login Card */}
            <motion.div
              className="card glass-card border-0 shadow-lg"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              variants={itemVariants}
            >
              {/* Card Header */}
              <div
                className="card-header border-0 text-center py-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <FaSignInAlt 
                    size={40} 
                    color="white"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                  />
                </motion.div>
                
                <motion.h3
                  className="text-white fw-bold mb-2 mt-3"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  variants={itemVariants}
                >
        {translations[language].login}
                </motion.h3>
                
                <motion.p
                  className="text-white-50 mb-0"
                  style={{ fontSize: '0.9rem' }}
                  variants={itemVariants}
                >
                  {translations[language].subtitle}
                </motion.p>
              </div>

              {/* Card Body */}
              <div className="card-body p-4">
      <form onSubmit={handleLogin}>
                  {/* Name Input */}
                  <motion.div className="mb-3" variants={itemVariants}>
                    <div className="input-group">
                      <span 
                        className="input-group-text border-0"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderTopLeftRadius: '15px',
                          borderBottomLeftRadius: '15px'
                        }}
                      >
                        <FaUser size={16} />
                      </span>
        <input
          type="text"
                        className="form-control border-0"
          placeholder={translations[language].name}
          value={name}
          onChange={e => setName(e.target.value)}
          required
                        style={{
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          padding: '12px 15px',
                          fontSize: '14px',
                          background: '#f8f9fa'
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div className="mb-3" variants={itemVariants}>
                    <div className="input-group">
                      <span 
                        className="input-group-text border-0"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderTopLeftRadius: '15px',
                          borderBottomLeftRadius: '15px'
                        }}
                      >
                        <FaEnvelope size={16} />
                      </span>
        <input
          type="email"
                        className="form-control border-0"
          placeholder={translations[language].email}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
                        style={{
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          padding: '12px 15px',
                          fontSize: '14px',
                          background: '#f8f9fa'
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div className="mb-4" variants={itemVariants}>
                    <div className="input-group">
                      <span 
                        className="input-group-text border-0"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderTopLeftRadius: '15px',
                          borderBottomLeftRadius: '15px'
                        }}
                      >
                        <FaLock size={16} />
                      </span>
        <input
          type="password"
                        className="form-control border-0"
          placeholder={translations[language].password}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
                        style={{
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          padding: '12px 15px',
                          fontSize: '14px',
                          background: '#f8f9fa'
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div className="text-end mb-3" variants={itemVariants}>
                    <a 
                      href="#" 
                      className="text-decoration-none"
                      style={{ 
                        color: '#667eea',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {translations[language].forgotPassword}
                    </a>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
          className="btn w-100"
          style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
                        borderRadius: '15px',
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '16px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {translations[language].submit}...
                        </div>
                      ) : (
                        translations[language].submit
                      )}
                    </motion.button>
                  </motion.div>
      </form>

                {/* Register Link */}
                <motion.div 
                  className="text-center mt-4"
                  variants={itemVariants}
                >
                  <p className="mb-0" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {translations[language].noAccount}{' '}
                    <a 
                      href="/choose-register" 
                      className="text-decoration-none fw-bold"
                      style={{ color: '#667eea' }}
                    >
                      {translations[language].register}
                    </a>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
