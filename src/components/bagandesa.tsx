import { useEffect, useState } from "react"
import { apiFetch } from "../api"

interface StrukturOrganisasiItem {
  id: number
  image_url: string
  caption: string
  created_at: string
  updated_at: string
}

export default function BaganDesa() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<StrukturOrganisasiItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchStrukturOrganisasi = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiFetch("/struktur-organisasi", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json.error || "Gagal mengambil data struktur organisasi")
        }
        setItems((json.struktur_organisasi || []) as StrukturOrganisasiItem[])
      } catch (err) {
        console.error(err)
        setError("Gagal terhubung ke server untuk data struktur organisasi.")
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchStrukturOrganisasi()
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const currentItem = items.length > 0 ? items[currentIndex] : null

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
      <h2 className="text-3xl font-bold text-[#2f7f67] mb-2">
        Bagan Desa
      </h2>
      <p className="text-gray-700 mb-8">
        {loading ? "Memuat..." : error ? error : currentItem?.caption || "Struktur Organisasi Pemerintahan Desa"}
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f7f67] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat gambar...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96 bg-red-50 rounded-xl">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
          <p className="text-gray-600">Tidak ada data struktur organisasi</p>
        </div>
      ) : (
        <div className="relative flex items-center justify-center group">
          {items.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-10 bg-white hover:bg-[#2f7f67] hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full p-3 transition-all duration-300 transform hover:scale-110"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <img
            key={currentItem?.id}
            src={currentItem?.image_url}
            alt={currentItem?.caption || "Struktur Organisasi"}
            width={800}
            height={500}
            className="rounded-xl max-w-full h-auto object-cover transition-opacity duration-500"
          />

          {items.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 bg-white hover:bg-[#2f7f67] hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full p-3 transition-all duration-300 transform hover:scale-110"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}

      {!loading && !error && items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#2f7f67] w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </section>
  )
}