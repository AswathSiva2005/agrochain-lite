import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { LanguageContext } from '../../App';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaCog, 
  FaUsers, 
  FaDatabase, 
  FaChartBar, 
  FaFileAlt,
  FaKey,
  FaLock,
  FaUserShield,
  FaServer,
  FaNetworkWired,
  FaHistory
} from 'react-icons/fa';

const translations = {
  en: {
    adminTools: "Admin Tools",
    securityAndConfig: "Security and Configuration Quick Links",
    security: "Security",
    configuration: "Configuration",
    monitoring: "Monitoring",
    userManagement: "User Management",
    systemSettings: "System Settings",
    databaseManagement: "Database Management",
    auditLogs: "Audit Logs",
    backupRestore: "Backup & Restore",
    apiManagement: "API Management",
    networkSettings: "Network Settings",
    accessControl: "Access Control",
    passwordPolicy: "Password Policy",
    twoFactorAuth: "Two-Factor Authentication",
    sessionManagement: "Session Management",
    dataEncryption: "Data Encryption",
    securityAudit: "Security Audit",
    systemHealth: "System Health",
    performanceMetrics: "Performance Metrics",
    errorLogs: "Error Logs",
    maintenanceMode: "Maintenance Mode",
    systemUpdates: "System Updates",
    configurationBackup: "Configuration Backup",
    environmentVariables: "Environment Variables",
    serviceStatus: "Service Status"
  },
  ta: {
    adminTools: "நிர்வாக கருவிகள்",
    securityAndConfig: "பாதுகாப்பு மற்றும் கட்டமைப்பு விரைவு இணைப்புகள்",
    security: "பாதுகாப்பு",
    configuration: "கட்டமைப்பு",
    monitoring: "கண்காணிப்பு",
    userManagement: "பயனர் நிர்வாகம்",
    systemSettings: "சிஸ்டம் அமைப்புகள்",
    databaseManagement: "தரவுத்தள நிர்வாகம்",
    auditLogs: "தணிக்கை பதிவுகள்",
    backupRestore: "காப்பு & மீட்டமைப்பு",
    apiManagement: "API நிர்வாகம்",
    networkSettings: "பிணைய அமைப்புகள்",
    accessControl: "அணுகல் கட்டுப்பாடு",
    passwordPolicy: "கடவுச்சொல் கொள்கை",
    twoFactorAuth: "இரண்டு காரணி அங்கீகாரம்",
    sessionManagement: "அமர்வு நிர்வாகம்",
    dataEncryption: "தரவு குறியாக்கம்",
    securityAudit: "பாதுகாப்பு தணிக்கை",
    systemHealth: "சிஸ்டம் ஆரோக்கியம்",
    performanceMetrics: "செயல்திறன் அளவீடுகள்",
    errorLogs: "பிழை பதிவுகள்",
    maintenanceMode: "பராமரிப்பு பயன்முறை",
    systemUpdates: "சிஸ்டம் புதுப்பிப்புகள்",
    configurationBackup: "கட்டமைப்பு காப்பு",
    environmentVariables: "சுற்றுச்சூழல் மாறிகள்",
    serviceStatus: "சேவை நிலை"
  }
};

const toolCategories = [
  {
    title: 'security',
    icon: FaShieldAlt,
    color: '#dc3545',
    gradient: 'linear-gradient(135deg, #dc3545, #c82333)',
    tools: [
      { name: 'accessControl', icon: FaLock, description: 'Manage user permissions and roles' },
      { name: 'passwordPolicy', icon: FaKey, description: 'Configure password requirements' },
      { name: 'twoFactorAuth', icon: FaUserShield, description: 'Enable 2FA for enhanced security' },
      { name: 'sessionManagement', icon: FaHistory, description: 'Monitor and manage user sessions' },
      { name: 'dataEncryption', icon: FaShieldAlt, description: 'Configure data encryption settings' },
      { name: 'securityAudit', icon: FaFileAlt, description: 'Review security logs and reports' }
    ]
  },
  {
    title: 'configuration',
    icon: FaCog,
    color: '#17a2b8',
    gradient: 'linear-gradient(135deg, #17a2b8, #138496)',
    tools: [
      { name: 'systemSettings', icon: FaCog, description: 'Configure system parameters' },
      { name: 'databaseManagement', icon: FaDatabase, description: 'Manage database connections' },
      { name: 'apiManagement', icon: FaNetworkWired, description: 'Configure API endpoints' },
      { name: 'networkSettings', icon: FaServer, description: 'Network configuration options' },
      { name: 'configurationBackup', icon: FaFileAlt, description: 'Backup system configurations' },
      { name: 'environmentVariables', icon: FaCog, description: 'Manage environment settings' }
    ]
  },
  {
    title: 'monitoring',
    icon: FaChartBar,
    color: '#28a745',
    gradient: 'linear-gradient(135deg, #28a745, #20c997)',
    tools: [
      { name: 'systemHealth', icon: FaChartBar, description: 'Monitor system performance' },
      { name: 'performanceMetrics', icon: FaChartBar, description: 'View performance analytics' },
      { name: 'errorLogs', icon: FaFileAlt, description: 'Review system error logs' },
      { name: 'serviceStatus', icon: FaServer, description: 'Check service availability' },
      { name: 'maintenanceMode', icon: FaCog, description: 'Enable maintenance mode' },
      { name: 'systemUpdates', icon: FaServer, description: 'Manage system updates' }
    ]
  }
];

function AdminTools() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      y: -10, 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const toolVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    hover: { 
      x: 10,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
        <motion.div
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-4 fw-bold mb-3" style={{ 
              background: 'linear-gradient(135deg, #2C5F2D, #17633A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {translations[language].adminTools}
            </h1>
            <p className="lead text-muted" style={{ fontSize: '1.2rem' }}>
              {translations[language].securityAndConfig}
            </p>
          </motion.div>

          {/* Tool Categories */}
          <div className="row g-4">
            {toolCategories.map((category, categoryIndex) => (
              <motion.div 
                key={category.title}
                className="col-lg-4 col-md-6"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="card h-100 border-0 shadow-lg" style={{ 
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Category Header */}
                  <div className="card-header text-white text-center py-4" style={{ 
                    background: category.gradient,
                    border: 'none'
                  }}>
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <category.icon size={48} />
                    </motion.div>
                    <h4 className="mt-3 mb-0 fw-bold">
                      {translations[language][category.title]}
                    </h4>
                  </div>

                  {/* Tools List */}
                  <div className="card-body p-4">
                    <div className="d-flex flex-column gap-3">
                      {category.tools.map((tool, toolIndex) => (
                        <motion.div
                          key={tool.name}
                          className="d-flex align-items-center p-3 rounded"
                          style={{
                            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                            border: '1px solid #dee2e6',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          variants={toolVariants}
                          whileHover="hover"
                          onClick={() => {
                            // Navigate to specific admin tools or show modals
                            if (tool.name === 'userManagement') {
                              navigate('/admin/users');
                            } else if (tool.name === 'auditLogs') {
                              navigate('/admin/audit-logs');
                            } else if (tool.name === 'systemHealth') {
                              navigate('/admin/system-health');
                            }
                          }}
                        >
                          <div className="me-3" style={{ color: category.color }}>
                            <tool.icon size={20} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>
                              {translations[language][tool.name]}
                            </h6>
                            <small className="text-muted">
                              {tool.description}
                            </small>
                          </div>
                          <div className="ms-2">
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FaChartBar size={16} style={{ color: category.color }} />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="mt-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <div className="card-header text-white text-center py-3" style={{ 
                background: 'linear-gradient(135deg, #6f42c1, #5a32a3)',
                border: 'none'
              }}>
                <h5 className="mb-0 fw-bold">
                  <FaUsers className="me-2" />
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <motion.button
                      className="btn btn-outline-primary w-100 py-3"
                      style={{ borderRadius: 12 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/users')}
                    >
                      <FaUsers className="me-2" />
                      View All Users
                    </motion.button>
                  </div>
                  <div className="col-md-4">
                    <motion.button
                      className="btn btn-outline-success w-100 py-3"
                      style={{ borderRadius: 12 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/loan-requests')}
                    >
                      <FaFileAlt className="me-2" />
                      Loan Requests
                    </motion.button>
                  </div>
                  <div className="col-md-4">
                    <motion.button
                      className="btn btn-outline-warning w-100 py-3"
                      style={{ borderRadius: 12 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      <FaChartBar className="me-2" />
                      Dashboard
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default AdminTools;

