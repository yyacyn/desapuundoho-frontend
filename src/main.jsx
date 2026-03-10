import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home'
import Berita from './pages/Berita'
import DetailBerita from './pages/DetailBerita'
import Galeri from './pages/Galeri'
import Profil from './pages/Profil'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/detail-berita" element={<DetailBerita />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
