import Navbar from "../components/navbar"
import Header, { TentangKami, Sambutan, APBDesa, BeritaSection, GaleriSection } from "../components/home"
import Footer from "../components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <TentangKami />
      <Sambutan />
      <APBDesa />
      <BeritaSection />
      <GaleriSection />
      <Footer siteSettings={undefined} />
    </>
  )
}
