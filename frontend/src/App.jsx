import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import History from './components/history'

function App() {
  // Ambil data role dari localStorage untuk pengecekan akses
  const userRole = localStorage.getItem('userRole')
  const isAuthenticated = localStorage.getItem('adminToken')

  return (
    <Router>
      <Routes>
        {/* 1. HALAMAN UTAMA & LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* 2. PROTEKSI RUTE ADMIN */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && userRole === 'admin' 
            ? <AdminDashboard /> 
            : <Navigate to="/login" />
          } 
        />

        {/* 3. PROTEKSI RUTE USER */}
        <Route 
          path="/user" 
          element={
            isAuthenticated && userRole === 'user' 
            ? <UserDashboard /> 
            : <Navigate to="/login" />
          } 
        />

        {/* 4. HALAMAN RIWAYAT (Bisa diakses Admin & User) */}
        <Route 
          path="/history" 
          element={
            isAuthenticated 
            ? <History /> 
            : <Navigate to="/login" />
          } 
        />

        {/* 5. FALLBACK (Jika URL tidak ditemukan) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App