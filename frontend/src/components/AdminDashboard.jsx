import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  
  // State Gambar
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    nama: '', jenis: 'kasur', harga: '', warna: '', tanggal_masuk: new Date().toISOString().split('T')[0], stok: ''
  })

  useEffect(() => {
    if (!localStorage.getItem('adminToken') || localStorage.getItem('userRole') !== 'admin') {
      navigate('/login')
    } else {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/products')
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) { setLoading(false) }
  }

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar dari sistem Admin?")) {
      localStorage.clear()
      navigate('/login')
    }
  }

  const resetForm = () => {
    setIsEditMode(false); setEditId(null);
    setImageFile(null); // Reset input gambar
    setFormData({ nama: '', jenis: 'kasur', harga: '', warna: '', tanggal_masuk: new Date().toISOString().split('T')[0], stok: '' })
  }

  const filteredProducts = products.filter(item => {
    const namaBarang = (item.nama || item.nama_produk || "").toLowerCase()
    return namaBarang.includes(searchTerm.toLowerCase())
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // MENGGUNAKAN FORMDATA UNTUK UPLOAD FILE
    const dataToSend = new FormData()
    dataToSend.append('nama', formData.nama)
    dataToSend.append('nama_produk', formData.nama)
    dataToSend.append('jenis', formData.jenis)
    dataToSend.append('harga', formData.harga)
    dataToSend.append('warna', formData.warna)
    dataToSend.append('stok', formData.stok)
    dataToSend.append('tanggal_masuk', formData.tanggal_masuk)
    
    // Jika ada file gambar yang dipilih, masukkan ke FormData
    if (imageFile) {
      dataToSend.append('image', imageFile)
    }

    // KHUSUS UPDATE: Laravel butuh spoofing method _METHOD: PUT jika pakai FormData
    const url = isEditMode ? `http://127.0.0.1:8000/api/products/${editId}` : 'http://127.0.0.1:8000/api/products'
    
    if (isEditMode) {
        dataToSend.append('_method', 'PUT')
    }

    try {
      const res = await fetch(url, {
        method: 'POST', // Tetap POST karena FormData memerlukan ini, tapi di-spoof jadi PUT di atas
        body: dataToSend
        // Headers Content-Type dihapus karena browser akan mengaturnya otomatis untuk FormData
      })
      
      if (res.ok) {
        alert(isEditMode ? "Barang berhasil diupdate!" : "Barang berhasil disimpan!")
        resetForm(); fetchProducts()
      } else { alert("Gagal menyimpan data ke database.") }
    } catch (error) { console.error("Error:", error) }
  }

  const handleEdit = (item) => {
    setIsEditMode(true); setEditId(item.id);
    setFormData({
      nama: item.nama || item.nama_produk, jenis: item.jenis || 'kasur', harga: item.harga, warna: item.warna,
      tanggal_masuk: item.tanggal_masuk?.split(' ')[0] || new Date().toISOString().split('T')[0], stok: item.stok
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus barang ini?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) fetchProducts()
    }
  }

  if (loading) return <div className="p-20 text-center font-bold text-blue-600">Menghubungkan ke server...</div>

  return (
    <div className="w-screen min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project <span className="text-blue-600">MEUBEL</span> <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-md ml-2 uppercase">Admin Panel</span></h1>
            <p className="text-slate-500 font-medium mt-1">
              Sistem Inventaris Furniture
              <button onClick={handleLogout} className="ml-4 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 transition-all bg-red-50 px-3 py-1.5 rounded-lg uppercase">🔴 Keluar</button>
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative w-full md:w-96">
            <input type="text" placeholder="Cari barang..." className="w-full pl-6 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* TABEL BARANG */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Daftar Stok</h2>
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Total: {products.length} Item</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-black">
                    <tr>
                      <th className="px-6 py-4">Foto</th>
                      <th className="px-6 py-4">Nama Produk</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Harga & Stok</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(item => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-all">
                        <td className="px-6 py-4">
                          {item.image ? (
                            <img src={`http://127.0.0.1:8000/storage/products/${item.image}`} alt="img" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] text-slate-400 font-bold uppercase tracking-tighter">No Image</div>
                          )}
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-800 uppercase">{item.nama || item.nama_produk}</td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-blue-600 uppercase italic tracking-tighter">{item.jenis}</p>
                          <p className="text-sm text-slate-500">{item.warna}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-black text-slate-900">Rp {parseInt(item.harga).toLocaleString()}</p>
                          <p className={`text-xs font-bold ${item.stok < 5 ? 'text-red-500' : 'text-emerald-500'}`}>{item.stok} unit tersedia</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all">✏️</button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FORM INPUT / EDIT BARANG */}
          <div className="xl:col-span-1">
            <div className={`${isEditMode ? 'bg-amber-600' : 'bg-slate-900'} p-8 rounded-3xl shadow-2xl text-white sticky top-8 transition-all duration-500`}>
              <h2 className="text-2xl font-bold mb-6 italic">{isEditMode ? '✏️ Edit Barang' : '📥 Input Baru'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Nama Barang</label>
                  <input type="text" className="w-full bg-white/10 border-none rounded-xl p-4 text-white placeholder:text-slate-500 mt-1 outline-none focus:ring-2 focus:ring-white/50" placeholder="Contoh: Kursi Kayu" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Jenis</label>
                  <select className="w-full bg-white/10 border-none rounded-xl p-4 text-white mt-1 outline-none" value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})}>
                      <option className="text-black" value="kasur">Kasur</option><option className="text-black" value="lemari">Lemari</option><option className="text-black" value="kursi">Kursi</option><option className="text-black" value="rak piring">Rak Piring</option>
                  </select>
                </div>
                
                {/* INPUT GAMBAR TAMBAHAN */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Foto Produk</label>
                  <input type="file" className="w-full bg-white/10 border-none rounded-xl p-4 text-white mt-1 outline-none text-xs" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400">Warna</label>
                    <input type="text" className="w-full bg-white/10 border-none rounded-xl p-4 text-white mt-1 outline-none" placeholder="Coklat" value={formData.warna} onChange={(e) => setFormData({...formData, warna: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400">Stok</label>
                    <input type="number" className="w-full bg-white/10 border-none rounded-xl p-4 text-white mt-1 outline-none" placeholder="0" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Harga Satuan (Rp)</label>
                  <input type="number" className="w-full bg-white/10 border-none rounded-xl p-4 text-white mt-1 outline-none" placeholder="100000" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} required />
                </div>
                
                <button type="submit" className="w-full bg-white text-slate-900 font-black py-4 rounded-xl shadow-lg uppercase transition-all hover:bg-slate-200 active:scale-95 mt-4">
                  {isEditMode ? 'Update Data' : 'Simpan Barang'}
                </button>
                {isEditMode && (
                  <button type="button" onClick={resetForm} className="w-full bg-transparent border border-white/30 text-white font-bold py-2 rounded-xl mt-2 text-xs hover:bg-white/10 transition-all">
                    Batal Edit / Tambah Baru
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}