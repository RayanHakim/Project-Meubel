import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Ambil data login dari localStorage
  const role = localStorage.getItem('userRole')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    // Pastikan user sudah login, kalau belum tendang ke login
    if (!localStorage.getItem('adminToken')) {
      navigate('/login')
    } else {
      fetchHistory()
    }
  }, [])

  const fetchHistory = async () => {
    try {
      // Logika: Admin lihat semua, User lihat miliknya sendiri
      const url = role === 'admin' 
        ? 'http://127.0.0.1:8000/api/transactions' 
        : `http://127.0.0.1:8000/api/transactions/user/${userId}`
        
      const res = await fetch(url)
      const data = await res.json()
      
      if (res.ok) {
        setTransactions(data)
      }
      setLoading(false)
    } catch (error) {
      console.error("Gagal ambil history:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              RIWAYAT <span className="text-blue-600">TRANSAKSI</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              {role === 'admin' ? 'Mode Monitor Admin' : 'Daftar Pembelian Anda'}
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            ⬅️ KEMBALI
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 font-bold text-blue-600 animate-pulse uppercase tracking-widest">
            Menghubungkan ke server...
          </div>
        ) : transactions.length > 0 ? (
          <div className="grid gap-4">
            {transactions.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:border-blue-300 transition-all">
                <div className="flex items-center gap-6">
                  {/* Icon Pengganti Gambar */}
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.product?.jenis === 'kasur' ? '🛏️' : '🪑'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">
                      {item.product?.nama || item.product?.nama_produk || 'Produk Tidak Diketahui'}
                    </h3>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                        {item.product?.jenis || 'mebel'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {role === 'admin' && (
                      <p className="text-[10px] font-black text-slate-400 mt-2 uppercase">
                        👤 Pembeli: <span className="text-slate-900">{item.user?.name || 'User'}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 md:mt-0 text-center md:text-right border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pembayaran</p>
                  <p className="text-2xl font-black text-slate-900">
                    Rp {parseInt(item.total_harga).toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center justify-center md:justify-end gap-2 text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {item.jumlah} Unit • Berhasil
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">Belum ada data transaksi ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  )
}