import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home'
import Berita from './pages/Berita'
import DetailBerita from './pages/DetailBerita'
import Galeri from './pages/Galeri'
import Profil from './pages/Profil'
import APBDesa from './pages/APBDesa' // Added APBDesa page import
import Stunting from './pages/Stunting'
import Bansos from './pages/Bansos'
import SDGs from './pages/SDGs'
import IDM from './pages/IDM'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/detail-berita" element={<DetailBerita />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/idm" element={<IDM />} />
        {/* Added route for APBDesa page - accessible at /infografis/apbdesa */}
        <Route path="/infografis/apbdesa" element={<APBDesa />} />
        <Route path="/infografis/stunting" element={<Stunting />} />
        <Route path="/infografis/bansos" element={<Bansos />} />
        <Route path="/infografis/sdgs" element={<SDGs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
