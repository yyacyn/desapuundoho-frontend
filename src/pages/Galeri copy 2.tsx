import Navbar from "../components/navbar";
import Footer from "../components/footer";
import GaleriItem from "../components/galeriitem";
import { useEffect, useState } from "react";
// import { apiFetch } from "../../../puundoho-dashboard/src/api";
import { apiFetch } from "../api";

type GalleryItemData = {
  id?: number
  caption?: string
  created_at?: string
  imageUrl?: string
  images?: string[]
}

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItemData[]>([])
  const [loading, setLoading] = useState(true)
  const fetchGallery = async () => {
    try {
      const res = await apiFetch('/galeri')
      const data = await res.json()
      setItems(data.galeri || [])
    } catch (err) {
      console.error('Failed to fetch gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGallery() }, [])

  const filtered = items
    .filter(item => Boolean((item.caption || '').trim()))
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* HERO */}
        <section className="relative h-[320px] md:h-[530px] flex items-center justify-center text-white py-20">
          <img
            src="./assets/galeri/galeri-thumbnail.png"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Galeri</h1>
            <div className="w-32 h-1 bg-emerald-400 mx-auto mt-4 rounded-full"></div>
          </div>

        </section>


        {/* GALLERY */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((item, index) =>
                item.images && item.images.length > 0 ? (
                  <GaleriItem
                    key={item.id ?? index}
                    imageUrl={item.imageUrl || item.images[0]}
                    altText="Galeri"
                    caption={item.caption || ""}
                  />
                ) : null
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer siteSettings={undefined} />
    </>
  );
}