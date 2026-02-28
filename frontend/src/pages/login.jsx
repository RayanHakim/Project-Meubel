import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '', email: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password })
      })
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('userRole', data.user.role)
        
        // Cek Role, arahkan ke dashboard yang sesuai
        if (data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/user')
        }
      } else {
        alert(data.message || "Username atau password salah!")
      }
    } catch (error) {
      alert("Koneksi gagal! Pastikan backend menyala.")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: loginData.username,
          email: loginData.email,
          password: loginData.password
        })
      })
      if (res.ok) {
        alert("Registrasi Berhasil! Silakan Login.")
        setIsRegisterMode(false) // Kembalikan ke form login
      } else {
        alert("Gagal registrasi. Pastikan email belum digunakan.")
      }
    } catch (err) {
      alert("Koneksi gagal!")
    }
  }

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-600 transition-all duration-500">
        <h1 className="text-3xl font-black text-center tracking-tight text-slate-900">
          Project <span className="text-blue-600">MEUBEL</span>
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium text-sm mt-1">
          {isRegisterMode ? 'Buat Akun Baru' : 'Sistem Inventaris Furniture'}
        </p>
        
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 ml-1">Email</label>
              <input type="email" placeholder="Masukkan email" required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium mt-1" onChange={e => setLoginData({...loginData, email: e.target.value})} />
            </div>
          )}
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 ml-1">Username</label>
            <input type="text" placeholder="Masukkan username" required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium mt-1" onChange={e => setLoginData({...loginData, username: e.target.value})} />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 ml-1">Password</label>
            <input type="password" placeholder="••••••••" required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium mt-1" onChange={e => setLoginData({...loginData, password: e.target.value})} />
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 mt-4 uppercase">
            {isRegisterMode ? 'DAFTAR SEKARANG' : 'LOGIN SEKARANG'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm font-medium text-slate-500">
          {isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?'} 
          <button onClick={() => setIsRegisterMode(!isRegisterMode)} type="button" className="text-blue-600 font-bold ml-1 hover:underline">
            {isRegisterMode ? 'Login di sini' : 'Daftar di sini'}
          </button>
        </p>
      </div>
    </div>
  )
}