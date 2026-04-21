import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Berita from './pages/Berita'
import DetailBerita from './pages/DetailBerita'
import Galeri from './pages/Galeri'
import Profil from './pages/Profil'
import APBDesa from './pages/APBDesa'
import Stunting from './pages/Stunting'
import Bansos from './pages/Bansos'
import SDGs from './pages/SDGs'
import IDM from './pages/IDM'

function App() {
  const location = useLocation()

  useEffect(() => {
    console.log("Pathname detected by React:", location.pathname)
  }, [location])

  return (
    <div className="min-h-screen font-['Inter',sans-serif]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/detail-berita/:id" element={<DetailBerita />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/idm" element={<IDM />} />
        
        {/* Infografis Group */}
        <Route path="/infografis/apbdesa" element={<APBDesa />} />
        <Route path="/infografis/stunting" element={<Stunting />} />
        <Route path="/infografis/bansos" element={<Bansos />} />
        <Route path="/infografis/sdgs" element={<SDGs />} />

        {/* Debug Catch-all: Show exactly what path React is seeing */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold text-[#298064] mb-4">404 - Path Tidak Terdaftar</h1>
            <p className="text-gray-600 mb-8">
              React Router melihat path: <code className="bg-gray-100 px-2 py-1 rounded font-mono text-lg">"{location.pathname}"</code>
            </p>
            <p className="text-sm text-gray-400 mb-8">
              (Jika ini seharusnya "/berita", berarti ada masalah dengan konfigurasi domain di cPanel)
            </p>
            <a href="/" className="bg-[#298064] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#226b53] transition-colors">
              Kembali ke Beranda
            </a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
