import { useEffect, useMemo, useState, type MouseEvent } from "react"
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

interface Product {
  id: number
  nama: string
  rating: number
  price: number
  deskripsi: string
  kontak: string
  image_url: string
}

const PRICE_MIN = 0
const PRICE_MAX = 10000000
const PAGE_SIZE = 6

const formatRupiah = (value: number): string => `Rp. ${Number(value || 0).toLocaleString("id-ID")}`

const mapProduct = (item: any): Product => ({
  id: Number(item.id),
  nama: String(item.nama || "Produk Desa"),
  rating: Number(item.rating || 0),
  price: Number(item.harga || 0),
  deskripsi: String(item.deskripsi || ""),
  kontak: String(item.kontak || ""),
  image_url: String(item.image_url || ""),
})

export default function Belanja() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN)
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduk = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await apiFetch("/produk-desa")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Gagal memuat data produk desa")
        }

        const parsedProducts = Array.isArray(data?.produk) ? data.produk.map(mapProduct) : []
        setProducts(parsedProducts)
      } catch (err) {
        setProducts([])
        setError(err instanceof Error ? err.message : "Gagal memuat data produk desa")
      } finally {
        setLoading(false)
      }
    }

    fetchProduk()
  }, [])

  const normalizedMin = Math.min(minPrice, maxPrice)
  const normalizedMax = Math.max(minPrice, maxPrice)
  const totalPriceRange = PRICE_MAX - PRICE_MIN
  const minPercent = ((normalizedMin - PRICE_MIN) / totalPriceRange) * 100
  const maxPercent = ((normalizedMax - PRICE_MIN) / totalPriceRange) * 100

  const filteredProducts = useMemo<Product[]>(() => {
    return products.filter((product) => {
      const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= normalizedMin && product.price <= normalizedMax

      return matchesSearch && matchesPrice
    })
  }, [normalizedMax, normalizedMin, products, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const activePage = Math.min(currentPage, totalPages)

  const pagedProducts = useMemo<Product[]>(() => {
    const start = (activePage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [activePage, filteredProducts])

  const handleOpenDetail = (productId: number): void => {
    navigate(`/detail-belanja/${productId}`)
  }

  const handleBuyNow = (event: MouseEvent<HTMLButtonElement>, productId: number): void => {
    event.stopPropagation()
    navigate(`/detail-belanja/${productId}`)
  }

  const goToPage = (page: number): void => {
    if (page < 1 || page > totalPages) {
      return
    }
    setCurrentPage(page)
  }

  const handleMinPriceChange = (value: number): void => {
    setCurrentPage(1)
    setMinPrice(Math.min(value, maxPrice))
  }

  const handleMaxPriceChange = (value: number): void => {
    setCurrentPage(1)
    setMaxPrice(Math.max(value, minPrice))
  }

  return (
    <>
      <Navbar />

      {error && (
        <section className="w-full px-4 pt-4 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </section>
      )}

      <section className="w-full bg-[#f2f2f2] px-4 pb-16 pt-28 md:pt-30 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative">
            <label htmlFor="search-product" className="sr-only">
              Cari Produk
            </label>
            <input
              id="search-product"
              type="text"
              placeholder="Cari Produk"
              value={searchTerm}
              onChange={(event) => {
                setCurrentPage(1)
                setSearchTerm(event.target.value)
              }}
              className="w-full rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)]  py-3 pl-4 pr-10 text-gray-700"
            />
            <Search
              size={20}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside aria-label="Filter produk">
              <h2 className="text-[30px] font-bold leading-[1.2] text-black">Filter Option</h2>
              <div className="mt-2 h-px w-full bg-black/80" />

              <fieldset className="mt-7">
                <legend className="text-[22px] font-bold leading-[1.25] text-black">Price</legend>
                <p className="mt-2 text-[18px] font-medium leading-[1.3] text-[#9a9a9a]" aria-live="polite">
                  Rp. {normalizedMin.toLocaleString("id-ID")} - Rp. {normalizedMax.toLocaleString("id-ID")}
                </p>
                <div className="relative mt-4 h-10" aria-label="Filter rentang harga">
                  <div className="absolute left-0 right-0 top-1/2 h-[8px] -translate-y-1/2 rounded-full bg-[#cfcfcf]" />
                  <div
                    className="absolute top-1/2 h-[8px] -translate-y-1/2 rounded-full bg-[#2f8a6b]"
                    style={{
                      left: `${minPercent}%`,
                      width: `${Math.max(maxPercent - minPercent, 0)}%`,
                    }}
                    aria-hidden="true"
                  />

                  <label htmlFor="price-min" className="sr-only">
                    Harga minimum
                  </label>
                  <input
                    id="price-min"
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={10000}
                    value={normalizedMin}
                    onChange={(event) => handleMinPriceChange(Number(event.target.value))}
                    className="belanja-range-input absolute left-0 top-1/2 z-20 w-full -translate-y-1/2"
                    aria-label="Harga minimum"
                    aria-valuemin={PRICE_MIN}
                    aria-valuemax={normalizedMax}
                    aria-valuenow={normalizedMin}
                  />
                  <label htmlFor="price-max" className="sr-only">
                    Harga maksimum
                  </label>
                  <input
                    id="price-max"
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={10000}
                    value={normalizedMax}
                    onChange={(event) => handleMaxPriceChange(Number(event.target.value))}
                    className="belanja-range-input absolute left-0 top-1/2 z-10 w-full -translate-y-1/2"
                    aria-label="Harga maksimum"
                    aria-valuemin={normalizedMin}
                    aria-valuemax={PRICE_MAX}
                    aria-valuenow={normalizedMax}
                  />
                </div>
              </fieldset>
            </aside>

            <div>
              {loading ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                  Memuat produk desa...
                </div>
              ) : null}

              {!loading && pagedProducts.length === 0 && (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                  Tidak ada produk desa yang ditemukan.
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pagedProducts.map((product) => (
                  <article key={product.id} className="rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(product.id)}
                      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]/40"
                      aria-label={`Buka detail ${product.nama}`}
                    >
                      <div className="rounded-2xl border border-gray-300 bg-[#e9e9e9] p-6">
                        <img
                          src={product.image_url || "/assets/belanja/Buyung-upik-susu-coklat 1.png"}
                          alt={product.nama}
                          className="mx-auto h-72 w-auto object-contain"
                        />
                      </div>

                      <h3 className="mt-5 line-clamp-2 text-[22px] font-bold leading-[1.25] text-black">
                        {product.nama}
                      </h3>

                      <div className="mt-4 flex items-center gap-2" aria-label={`Rating produk ${product.rating.toFixed(1)}`}>
                        <Star size={20} className="text-[#f6ba00]" fill="currentColor" aria-hidden="true" />
                        <span className="text-[18px] font-semibold text-[#9a9a9a]">{product.rating.toFixed(1)}</span>
                      </div>

                      <p className="mt-5 text-[22px] font-medium leading-[1.25] text-[#298064]">{formatRupiah(product.price)}</p>
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleBuyNow(event, product.id)}
                      className="mt-8 w-full rounded-[2rem] bg-[#2f8a6b] py-5 text-[18px] font-bold text-white transition hover:bg-[#216c54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5f4a] focus-visible:ring-offset-2"
                      aria-label={`Buy Now ${product.nama}`}
                    >
                      Buy Now
                    </button>
                  </article>
                ))}
              </div>

              <nav className="mt-9 flex items-center justify-center gap-2" aria-label="Pagination produk">
                <button
                  type="button"
                  onClick={() => goToPage(activePage - 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#298064] transition hover:bg-white disabled:opacity-50"
                  disabled={activePage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>

                {[1, 2, 3].map((pageNumber) => {
                  const isActive = pageNumber === activePage

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[22px] font-semibold transition ${isActive ? "bg-[#298064] text-white" : "text-[#298064] hover:bg-white"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => goToPage(activePage + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#298064] transition hover:bg-white disabled:opacity-50"
                  disabled={activePage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .belanja-range-input {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          height: 32px;
          margin: 0;
          pointer-events: none;
        }

        .belanja-range-input:focus {
          outline: none;
        }

        .belanja-range-input::-webkit-slider-runnable-track {
          height: 10px;
          background: transparent;
          border-radius: 9999px;
        }

        .belanja-range-input::-moz-range-track {
          height: 10px;
          background: transparent;
          border-radius: 9999px;
          border: none;
        }

        .belanja-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #2f8a6b;
          border: 2px solid #2f8a6b;
          box-shadow: 0 0 0 2px rgba(47, 138, 107, 0.18);
          margin-top: -5px;
          cursor: pointer;
          position: relative;
          z-index: 2;
          pointer-events: auto;
        }

        .belanja-range-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #2f8a6b;
          border: 2px solid #2f8a6b;
          box-shadow: 0 0 0 2px rgba(47, 138, 107, 0.18);
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>

      <Footer siteSettings={undefined} />
    </>
  )
}
