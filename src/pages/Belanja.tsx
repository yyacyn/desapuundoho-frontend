import { useMemo, useState, type MouseEvent } from "react"
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface Product {
  id: string
  name: string
  rating: number
  price: number
  priceLabel: string
  category: string
  image: string
}

const PRODUCT_NAME = "Jamu Buyung Upi Desa Puundoho"
const PRODUCT_IMAGE = "/assets/belanja/Buyung-upik-susu-coklat 1.png"

const PRODUCTS: Product[] = [
  { id: "1", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 1", image: PRODUCT_IMAGE },
  { id: "2", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 1", image: PRODUCT_IMAGE },
  { id: "3", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 2", image: PRODUCT_IMAGE },
  { id: "4", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 2", image: PRODUCT_IMAGE },
  { id: "5", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 3", image: PRODUCT_IMAGE },
  { id: "6", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 4", image: PRODUCT_IMAGE },
  { id: "7", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 1", image: PRODUCT_IMAGE },
  { id: "8", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 2", image: PRODUCT_IMAGE },
  { id: "9", name: PRODUCT_NAME, rating: 5, price: 1000000, priceLabel: "Rp. 20.000.000", category: "Category 3", image: PRODUCT_IMAGE },
]

const CATEGORIES: string[] = ["Category 1", "Category 2", "Category 3", "Category 4"]

const PRICE_MIN = 20000
const PRICE_MAX = 1000000
const PAGE_SIZE = 6

export default function Belanja() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN)
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX)
  const [currentPage, setCurrentPage] = useState<number>(2)

  const normalizedMin = Math.min(minPrice, maxPrice)
  const normalizedMax = Math.max(minPrice, maxPrice)
  const totalPriceRange = PRICE_MAX - PRICE_MIN
  const minPercent = ((normalizedMin - PRICE_MIN) / totalPriceRange) * 100
  const maxPercent = ((normalizedMax - PRICE_MIN) / totalPriceRange) * 100

  const filteredProducts = useMemo<Product[]>(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesPrice = product.price >= normalizedMin && product.price <= normalizedMax

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [maxPrice, minPrice, normalizedMax, normalizedMin, searchTerm, selectedCategories])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const activePage = Math.min(currentPage, totalPages)

  const pagedProducts = useMemo<Product[]>(() => {
    const start = (activePage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [activePage, filteredProducts])

  const toggleCategory = (category: string): void => {
    setCurrentPage(1)
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    )
  }

  const handleOpenDetail = (productId: string): void => {
    navigate(`/detail-belanja/${productId}`)
  }

  const handleBuyNow = (event: MouseEvent<HTMLButtonElement>, productId: string): void => {
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

      <section className="w-full bg-[#f2f2f2] px-4 pb-16 pt-24 md:pt-30 md:px-8 lg:px-10">
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
              className="w-full rounded-xl border border-gray-300 bg-[#e8eaeb] py-3 pl-5 pr-11 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#298064] focus:outline-none focus:ring-2 focus:ring-[#298064]/30"
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

              <fieldset className="mt-5">
                <legend className="text-[22px] font-bold leading-[1.25] text-black">By Category</legend>
                <div className="mt-3 space-y-2">
                  {CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-3 text-[18px] font-medium leading-[1.35] text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-gray-400 accent-[#298064]"
                        aria-label={category}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </fieldset>

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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pagedProducts.map((product) => (
                  <article key={product.id} className="rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(product.id)}
                      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]/40"
                      aria-label={`Buka detail ${product.name}`}
                    >
                      <div className="rounded-2xl border border-gray-300 bg-[#e9e9e9] p-6">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="mx-auto h-72 w-auto object-contain"
                        />
                      </div>

                      <h3 className="mt-5 line-clamp-2 text-[22px] font-bold leading-[1.25] text-black">
                        {product.name}
                      </h3>

                      <div className="mt-4 flex items-center gap-2" aria-label={`Rating produk ${product.rating.toFixed(1)}`}>
                        <Star size={20} className="text-[#f6ba00]" fill="currentColor" aria-hidden="true" />
                        <span className="text-[18px] font-semibold text-[#9a9a9a]">{product.rating.toFixed(1)}</span>
                      </div>

                      <p className="mt-5 text-[22px] font-medium leading-[1.25] text-[#298064]">{product.priceLabel}</p>
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleBuyNow(event, product.id)}
                      className="mt-8 w-full rounded-[2rem] bg-[#2f8a6b] py-5 text-[18px] font-bold text-white transition hover:bg-[#216c54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5f4a] focus-visible:ring-offset-2"
                      aria-label={`Buy Now ${product.name}`}
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
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[22px] font-semibold transition ${
                        isActive ? "bg-[#298064] text-white" : "text-[#298064] hover:bg-white"
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
