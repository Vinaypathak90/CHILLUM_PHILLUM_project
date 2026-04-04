import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About'; // Naya About Page
import Studio from './pages/public/Studio';
import Team from './pages/public/Team';
// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MessagesList from './pages/admin/MessagesList';
import ManageProjects from './pages/admin/ManageProjects';
import ManageContent from './pages/admin/ManageContent';
import ManageCampaigns from './pages/admin/ManageCampaigns'; // 🔥 Naya Import
import ManageTeam from './pages/admin/ManageTeam';           // 🔥 Naya Import
import ManageClients from './pages/admin/ManageClients';
// 🛡️ Protected Route Logic
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  // Agar token nahi hai, toh wapas login page par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 MAIN WEBSITE */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/team" element={<Team />} />



        {/* 🔐 ADMIN LOGIN */}
        <Route path="/login" element={<Login />} />
        
        {/* 🛠️ ADMIN CONTROL PANEL (Hidden & Protected) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        >
          {/* Dashboard Sub-Routes for different sections */}
          <Route path="messages" element={<MessagesList />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="content" element={<ManageContent />} />
          
          {/* 🔥 YAHAN HUMNE NAYE ROUTES ADD KIYE HAIN */}
          <Route path="campaigns" element={<ManageCampaigns />} />
          <Route path="team" element={<ManageTeam />} />
          <Route path="clients" element={<ManageClients />} />
        </Route>
        
        {/* 404 Redirect - Agar link exist nahi karti toh Home par bhejo */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;