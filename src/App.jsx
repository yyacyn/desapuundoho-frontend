import { useState } from 'react'
import Navbar from "./components/navbar"
import Header, { TentangKami, Sambutan, APBDesa, BeritaSection, GaleriSection } from "./components/home"
import Footer from "./components/footer"

function App() {
  return (
    <>
      <Navbar />
      <Header />
      <TentangKami />
      <Sambutan />
      <APBDesa />
      <BeritaSection />
      <GaleriSection />
      <Footer />
    </>
  )
}

export default App
