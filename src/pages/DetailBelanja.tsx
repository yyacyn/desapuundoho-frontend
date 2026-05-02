import { useEffect, useMemo, useState } from "react"
import { Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

interface ProductDetail {
  id: number
  nama: string
  rating: number
  harga: number
  description: string
  kontak: string
  image_url: string
}

const formatRupiah = (value: number): string => `Rp. ${Number(value || 0).toLocaleString("id-ID")}`

const FALLBACK_IMAGE = "/assets/belanja/Buyung-upik-susu-coklat 1.png"

export default function DetailBelanja() {
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await apiFetch("/produk-desa")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Gagal memuat detail produk")
        }

        const products: ProductDetail[] = Array.isArray(data?.produk)
          ? data.produk.map((item: any) => ({
            id: Number(item.id),
            nama: String(item.nama || "Produk Desa"),
            rating: Number(item.rating || 0),
            harga: Number(item.harga || 0),
            description: String(item.deskripsi || ""),
            kontak: String(item.kontak || ""),
            image_url: String(item.image_url || ""),
          }))
          : []

        const found = products.find((item) => String(item.id) === String(productId)) || null
        setProduct(found)
        if (!found) {
          setError("Produk tidak ditemukan")
        }
      } catch (err) {
        setProduct(null)
        setError(err instanceof Error ? err.message : "Gagal memuat detail produk")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const imageList = useMemo(() => {
    const sourceImage = product?.image_url || FALLBACK_IMAGE
    return [sourceImage, sourceImage, sourceImage, sourceImage]
  }, [product])

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const mainImage = imageList[activeImageIndex] ?? imageList[0]

  return (
    <>
      <Navbar />

      <section className="w-full bg-[#f2f2f2] px-4 pb-16 pt-24 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/belanja")}
            className="mb-5 text-sm font-semibold text-[#298064] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]/40"
            aria-label="Kembali ke halaman Belanja"
          >
            Kembali ke Belanja
          </button>

          {loading ? (
            <div className="rounded-2xl border border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
              Memuat detail produk...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
              {error}
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
              <div>
                <div className="rounded-2xl border border-gray-300 bg-[#e9e9e9] p-8">
                  <img
                    src={mainImage}
                    alt={`${product.nama} gambar utama`}
                    className="mx-auto h-72 w-auto object-contain"
                  />
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-4">
                  {imageList.slice(0, 3).map((image, index) => {
                    const isActive = index === activeImageIndex

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`rounded-xl border bg-[#e9e9e9] p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]/40 ${isActive ? "border-[#298064]" : "border-gray-300"
                          }`}
                        aria-label={`Lihat gambar ${index + 1}`}
                        aria-pressed={isActive}
                      >
                        <img
                          src={image}
                          alt={`${product.nama} thumbnail ${index + 1}`}
                          className="mx-auto h-14 w-auto object-contain"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-[46px] font-bold leading-tight text-black">{product.nama}</h1>

                <div className="mt-3 flex items-center gap-2" aria-label={`Rating produk ${product.rating.toFixed(1)} dari 5`}>
                  {Array.from({ length: Math.max(1, Math.floor(product.rating)) }, (_, index) => (
                    <Star key={`star-${index}`} size={18} className="text-[#f6ba00]" fill="currentColor" />
                  ))}
                  <span className="ml-1 text-base text-gray-500">{product.rating.toFixed(1)} Rating</span>
                </div>

                <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">{product.description || "Tidak ada deskripsi produk."}</p>

                <p className="mt-5 text-[46px] font-bold text-[#298064]">{formatRupiah(product.harga)}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex min-w-64 items-center justify-center rounded-xl bg-[#298064] px-8 py-3 text-[22px] font-bold text-white transition hover:bg-[#216c54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5f4a] focus-visible:ring-offset-2"
                    aria-label="Buy Now"
                  >
                    Buy Now
                  </button>
                  {product.kontak && (
                    <a
                      href={`tel:${product.kontak}`}
                      className="inline-flex items-center justify-center rounded-xl border border-[#298064] px-6 py-3 text-sm font-semibold text-[#298064] transition hover:bg-[#298064]/10"
                    >
                      Hubungi Penjual
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
