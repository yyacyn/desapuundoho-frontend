import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

interface SdgsItem {
  id: number
  title: string
  value: string
  colorClass: string
}

interface SdgApiItem {
  goals: number
  title: string
  score: number
  image?: string
}

interface SdgApiResponse {
  average?: number
  data?: SdgApiItem[]
}

const getGoalColorClass = (goal: number): string => {
  const colorMap: Record<number, string> = {
    1: "text-red-500 bg-red-500",
    2: "text-amber-500 bg-amber-500",
    3: "text-green-600 bg-green-600",
    4: "text-rose-600 bg-rose-600",
    5: "text-red-500 bg-red-500",
    6: "text-sky-500 bg-sky-500",
    7: "text-yellow-500 bg-yellow-500",
    8: "text-rose-800 bg-rose-800",
    9: "text-orange-500 bg-orange-500",
    10: "text-pink-600 bg-pink-600",
    11: "text-amber-500 bg-amber-500",
    12: "text-yellow-700 bg-yellow-700",
    13: "text-green-700 bg-green-700",
    14: "text-blue-600 bg-blue-600",
    15: "text-green-600 bg-green-600",
    16: "text-blue-800 bg-blue-800",
    17: "text-indigo-800 bg-indigo-800",
    18: "text-teal-600 bg-teal-600",
  }

  return colorMap[goal] || "text-[#298064] bg-[#298064]"
}

export default function SDGs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sdgResponse, setSdgResponse] = useState<SdgApiResponse | null>(null)

  useEffect(() => {
    const fetchSdg = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await apiFetch("/sdgs")
        if (!res.ok) {
          throw new Error("Gagal mengambil data SDGs")
        }

        const json = (await res.json()) as SdgApiResponse
        setSdgResponse(json)
      } catch (err) {
        console.error(err)
        setError("Gagal terhubung ke server untuk SDGs.")
      } finally {
        setLoading(false)
      }
    }

    fetchSdg()
  }, [])

  const sdgsItems: SdgsItem[] = useMemo(() => {
    const list = sdgResponse?.data || []

    return list.map((item) => ({
      id: item.goals,
      title: item.title,
      value: Number(item.score || 0).toFixed(2),
      colorClass: getGoalColorClass(item.goals),
    }))
  }, [sdgResponse])

  const averageScore = useMemo(() => Number(sdgResponse?.average || 0).toFixed(2), [sdgResponse])

  return (
    <>
      <Navbar />

      <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-28 md:pt-30">
        <div className="flex justify-center mb-8 md:mb-10">
          <img
            src="/assets/sgds/sgds-illust.png?v=1"
            alt="Ilustrasi SDGs"
            className="mx-auto h-auto object-contain max-w-xl md:max-w-2xl px-15 md:px-0"
          />
        </div>

        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">SDGs Desa Puundoho</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-10 items-center">
          <div>
            <p className="text-base text-gray-900 leading-relaxed mb-6 text-justify">
              SDGs Desa mengacu pada upaya yang dilakukan di tingkat Desa untuk mencapai Tujuan Pembangunan
              Berkelanjutan (Sustainable Development Goals/SDGs). SDGs merupakan agenda global yang ditetapkan oleh
              Perserikatan Bangsa-Bangsa (PBB) untuk mengatasi berbagai tantangan sosial, ekonomi, dan lingkungan di
              seluruh dunia.
            </p>

            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5 md:p-6 max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-2xl md:text-3xl font-medium text-[#298064] leading-tight">Skor SDGs Desa Puunduho</p>
                <p className="text-4xl md:text-5xl font-bold text-[#298064] leading-none">{loading ? "..." : averageScore}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/assets/sgds/stats-illust.png?v=1"
              alt="Ilustrasi Statistik SDGs"
              className="mx-auto w-auto h-auto object-contain max-w-[260px] md:max-w-[340px] lg:max-w-[420px] max-h-[180px] md:max-h-[240px] lg:max-h-[280px]"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#298064]">Detail SDGs</h2>
        </div>

        {error && <p className="mb-6 text-red-600 font-medium">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {sdgsItems.map((item, index) => {
              const isSeventeenth = index === 16
              const isEighteenth = index === 17

              return (
                <article
                  key={item.id}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.08)] p-4 min-h-[130px] flex flex-col justify-between ${isSeventeenth ? "xl:col-start-2" : ""} ${isEighteenth ? "xl:col-start-3" : ""}`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>

                  <div className="flex items-end justify-between gap-4 mt-4">
                    <div className="w-12 h-12 rounded-sm overflow-hidden flex items-center justify-center">
                      <img
                        src={`/assets/sgds/sgds${item.id}.png?v=1`}
                        alt={`Logo SDGs ${item.id}`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-700 leading-none mb-1">Nilai</p>
                      <p className={`text-4xl font-bold leading-none ${item.colorClass.split(" ")[0]}`}>{item.value}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
