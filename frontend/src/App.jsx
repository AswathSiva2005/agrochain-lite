import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { createContext, useState, Fragment } from 'react';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import FarmerDashboard from './pages/Farmer/FarmerDashboard';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Navbar from './components/Navbar';
import FarmerNavbar from './components/FarmerNavbar';
import AddCrop from './pages/Farmer/AddCrop';
import ViewOrders from './pages/Farmer/ViewOrders';
import ApplyLoan from './pages/Farmer/ApplyLoan';
import BuyerOrders from './pages/Buyer/BuyerOrders';
import AdminUserDetails from './pages/Admin/AdminUserDetails';
import AdminProfile from './pages/Admin/Profile';
import Survey from './pages/Farmer/Survey';
import ToDo from './pages/Farmer/ToDo';
import FarmerProfile from './pages/Farmer/Profile';
import Community from './pages/Farmer/Community';
import BuyerProfile from './pages/Buyer/Profile';
// import AdminProfile from './pages/Admin/Profile';
import RoleRegister from './pages/Auth/RoleRegister';
import FarmerRegister from './pages/Auth/FarmerRegister';
import BuyerRegister from './pages/Auth/BuyerRegister';
import ServiceProviderDashboard from './pages/ServiceProvider/ServiceProviderDashboard';
import ServiceProviderLoanRequests from './pages/ServiceProvider/ServiceProviderLoanRequests';
import ServiceProviderUserDetails from './pages/ServiceProvider/ServiceProviderUserDetails';
import ServiceProviderProfile from './pages/ServiceProvider/ServiceProviderProfile';
import ServiceProviderRegister from './pages/Auth/ServiceProviderRegister';
import ServiceProviderLoanSchemes from './pages/ServiceProvider/ServiceProviderLoanSchemes';
import ApplyLoanForm from './pages/Farmer/ApplyLoanForm';
import AdminTools from './pages/Admin/AdminTools';

export const LanguageContext = createContext();

function AppWrapper() {
  const location = useLocation();
  const [language, setLanguage] = useState('en'); // 'en' or 'ta'

  const hideGenericNavbar = (
    location.pathname.startsWith('/farmer') ||
    location.pathname.startsWith('/buyer') ||
    location.pathname.startsWith('/service-provider') ||
    location.pathname.startsWith('/admin')
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Fragment>
        {!hideGenericNavbar && <Navbar />}
        <div className="container mt-4">
          <Routes>
            {/* Redirect root to role selection */}
            <Route path="/" element={<Navigate to="/choose-register" replace />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/service-provider-dashboard" element={<ServiceProviderDashboard />} />

            {/* Farmer Routes */}
            <Route path="/farmer/add-crop" element={<AddCrop />} />
            <Route path="/farmer/view-orders" element={<ViewOrders />} />
            <Route path="/farmer/apply-loan" element={<ApplyLoan />} />
            <Route path="/farmer/survey" element={<Survey />} />
            <Route path="/farmer/todo" element={<ToDo />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/farmer/community" element={<Community />} />
            <Route path="/farmer/apply-loan/:schemeId" element={<ApplyLoanForm />} />

            {/* Buyer Routes */}
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/profile" element={<BuyerProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminUserDetails />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/tools" element={<AdminTools />} />

            {/* Service Provider Routes */}
            <Route path="/service-provider/loans" element={<ServiceProviderLoanRequests />} />
            <Route path="/service-provider/users" element={<ServiceProviderUserDetails />} />
            <Route path="/service-provider/profile" element={<ServiceProviderProfile />} />
            <Route path="/service-provider/loan-schemes" element={<ServiceProviderLoanSchemes />} />

            {/* Add role selection and farmer register routes */}
            <Route path="/choose-register" element={<RoleRegister />} />
            <Route path="/register/farmer" element={<FarmerRegister />} />
            <Route path="/register/buyer" element={<BuyerRegister />} />
            <Route path="/register/service-provider" element={<ServiceProviderRegister />} />
          </Routes>
        </div>
      </Fragment>
    </LanguageContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

// Route for /admin/loans is already present and loads AdminLoanRequests
// No changes needed here.
