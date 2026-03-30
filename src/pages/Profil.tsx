import Navbar from "../components/navbar";
import Footer from "../components/footer";
import VisiMisi from "../components/visimisi";
import SejarahDesa from "../components/sejarahdesa";
import BaganDesa from "../components/bagandesa";
import MapDesa from "../components/mapdesa";

export default function Profil() {
  return (
    <main className="bg-white">
        <Navbar />
        <VisiMisi />
        <BaganDesa />
        <SejarahDesa />
        <MapDesa />
        <Footer siteSettings={undefined} />
    </main>
  );
}