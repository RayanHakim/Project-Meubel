import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  // FITUR FILTER: State untuk kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const categories = ['Semua', 'kasur', 'lemari', 'kursi', 'rak piring']

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
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
    } catch (error) { console.error("Error loading data:", error) }
  }

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar dari sistem?")) {
      localStorage.clear()
      navigate('/login')
    }
  }

  // LOGIKA FILTER: Menggabungkan search bar dan kategori
  const filteredProducts = products.filter(item => {
    const namaBarang = (item.nama || item.nama_produk || "").toLowerCase()
    const matchSearch = namaBarang.includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'Semua' || item.jenis === selectedCategory
    
    return matchSearch && matchCategory
  })

  return (
    <div className="w-screen min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project <span className="text-blue-600">MEUBEL</span></h1>
            <p className="text-slate-500 font-medium mt-1">
              Katalog Furniture
              <button onClick={handleLogout} className="ml-4 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 transition-all bg-red-50 px-3 py-1.5 rounded-lg uppercase">🔴 Keluar</button>
            </p>
          </div>
          <input 
            type="text" 
            placeholder="Cari furniture impianmu..." 
            className="mt-4 md:mt-0 w-full md:w-96 pl-6 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </header>

        {/* FITUR FILTER: Tombol Kategori */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300 hover:text-blue-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* KATALOG GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              
              <div className="w-full h-56 bg-slate-100 rounded-[1.5rem] mb-5 flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
                {item.image ? (
                  <img 
                    src={`http://127.0.0.1:8000/storage/products/${item.image}`} 
                    alt={item.nama} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-slate-300 font-bold uppercase italic">No Image</span>
                )}
              </div>

              <div className="px-2 pb-2">
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">{item.jenis}</span>
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-tighter mt-3 line-clamp-1">{item.nama || item.nama_produk}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase">{item.warna}</p>
                <div className="flex justify-between items-end mt-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Harga</p>
                    <p className="text-2xl font-black text-slate-900">Rp {parseInt(item.harga).toLocaleString()}</p>
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-xs font-black uppercase ${item.stok > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    Stok: {item.stok}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-bold italic">Barang tidak ditemukan di kategori ini...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}