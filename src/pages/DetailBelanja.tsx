import { useMemo, useState } from "react"
import { Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface ProductDetail {
  id: string
  name: string
  rating: number
  reviewText: string
  priceLabel: string
  description: string
  images: string[]
}

const DETAIL_PRODUCTS: ProductDetail[] = [
  {
    id: "1",
    name: "Jamu Buyung Upi Desa Puundoho",
    rating: 5,
    reviewText: "5.0 (427 Review)",
    priceLabel: "Rp. 20.000.000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    images: [
      "/assets/belanja/Buyung-upik-susu-coklat 1.png",
      "/assets/belanja/Buyung-upik-susu-coklat 1.png",
      "/assets/belanja/Buyung-upik-susu-coklat 1.png",
      "/assets/belanja/Buyung-upik-susu-coklat 1.png",
    ],
  },
]

export default function DetailBelanja() {
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()

  const product = useMemo<ProductDetail>(() => {
    const found = DETAIL_PRODUCTS.find((item) => item.id === productId)
    if (found) {
      return found
    }
    return {
      id: "1",
      name: "Jamu Buyung Upi Desa Puundoho",
      rating: 5,
      reviewText: "5.0 (427 Review)",
      priceLabel: "Rp. 20.000.000",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      images: [
        "/assets/belanja/Buyung-upik-susu-coklat 1.png",
        "/assets/belanja/Buyung-upik-susu-coklat 1.png",
        "/assets/belanja/Buyung-upik-susu-coklat 1.png",
        "/assets/belanja/Buyung-upik-susu-coklat 1.png",
      ],
    }
  }, [productId])

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const mainImage = product.images[activeImageIndex] ?? product.images[0]

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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div>
              <div className="rounded-2xl border border-gray-300 bg-[#e9e9e9] p-8">
                <img
                  src={mainImage}
                  alt={`${product.name} gambar utama`}
                  className="mx-auto h-72 w-auto object-contain"
                />
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-4">
                {product.images.slice(0, 3).map((image, index) => {
                  const isActive = index === activeImageIndex

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`rounded-xl border bg-[#e9e9e9] p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]/40 ${
                        isActive ? "border-[#298064]" : "border-gray-300"
                      }`}
                      aria-label={`Lihat gambar ${index + 1}`}
                      aria-pressed={isActive}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="mx-auto h-14 w-auto object-contain"
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-[46px] font-bold leading-tight text-black">{product.name}</h1>

              <div className="mt-3 flex items-center gap-2" aria-label="Rating produk 5.0 dari 5">
                {Array.from({ length: Math.floor(product.rating) }, (_, index) => (
                  <Star key={`star-${index}`} size={18} className="text-[#f6ba00]" fill="currentColor" />
                ))}
                <span className="ml-1 text-base text-gray-500">{product.reviewText}</span>
              </div>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">{product.description}</p>

              <p className="mt-5 text-[46px] font-bold text-[#298064]">{product.priceLabel}</p>

              <button
                type="button"
                className="mt-4 inline-flex min-w-64 items-center justify-center rounded-xl bg-[#298064] px-8 py-3 text-[22px] font-bold text-white transition hover:bg-[#216c54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5f4a] focus-visible:ring-offset-2"
                aria-label="Buy Now"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
