import { useEffect, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

interface StuntingYearData {
  year: string
  kasus: number
}

interface StuntingItem {
  id: number
  status: string
  created_at?: string
  tanggal_pemeriksaan?: string
}

interface StuntingDetailItem {
  id: string
  label: string
  percentage: number
  amount: string
}

interface StuntingAccordionItem {
  id: string
  title: string
  total: string
  details: StuntingDetailItem[]
}

const STATUS_ORDER = ["Stunting", "Beresiko", "Normal"]

const getNumericChartScale = (maxValue: number) => {
  const normalizedMax = Math.max(maxValue, 10)
  const step = normalizedMax <= 20 ? 5 : normalizedMax <= 100 ? 20 : normalizedMax <= 250 ? 50 : 100
  const roundedMax = Math.ceil(normalizedMax / step) * step
  const ticks = Array.from({ length: Math.floor(roundedMax / step) + 1 }, (_, i) => i * step)
  return { roundedMax, ticks }
}

export default function Stunting() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<StuntingItem[]>([])
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

  useEffect(() => {
    const fetchStunting = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiFetch("/stunting", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json.error || "Gagal mengambil data stunting")
        }
        setRecords((json.stunting || []) as StuntingItem[])
      } catch (err) {
        console.error(err)
        setError("Gagal terhubung ke server untuk data stunting.")
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchStunting()
  }, [])

  const stuntingData = useMemo<StuntingYearData[]>(() => {
    const grouped = records.reduce<Record<string, number>>((acc, item) => {
      const sourceDate = item.tanggal_pemeriksaan || item.created_at
      const year = sourceDate ? String(new Date(sourceDate).getFullYear()) : String(new Date().getFullYear())
      if (year === "NaN") return acc
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([year, kasus]) => ({ year, kasus }))
      .sort((a, b) => Number(a.year) - Number(b.year))
  }, [records])

  const { roundedMax: maxValue, ticks: yAxisTicks } = useMemo(() => {
    const maxChartValue = stuntingData.length > 0 ? Math.max(...stuntingData.map((item) => item.kasus)) : 0
    return getNumericChartScale(maxChartValue)
  }, [stuntingData])

  const statusSummaryData = useMemo<StuntingAccordionItem[]>(() => {
    const total = records.length
    const grouped = records.reduce<Record<string, number>>((acc, item) => {
      const key = item.status || "Normal"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const details: StuntingDetailItem[] = STATUS_ORDER.map((status) => {
      const count = grouped[status] || 0
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      return {
        id: status.toLowerCase(),
        label: status,
        percentage,
        amount: `${count} Anak`,
      }
    })

    return [
      {
        id: "status-summary",
        title: "Ringkasan Status Stunting",
        total: `${total} Anak`,
        details,
      },
    ]
  }, [records])

  return (
    <>
      <Navbar />

      <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-20 md:pt-30">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">Data Stunting</h1>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        </div>

        <div className="mb-8">
          <div className="relative bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 overflow-visible">
            <p className="text-sm font-medium text-gray-700 mb-2">Jumlah Kasus (Anak)</p>

            <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-2 md:gap-3">
              <div className="relative h-72 text-[10px] md:text-xs text-gray-500">
                <div className="absolute inset-x-0 top-4 bottom-4">
                  {yAxisTicks.map((tick) => (
                    <span
                      key={tick}
                      className="absolute right-0 pr-1 leading-none whitespace-nowrap"
                      style={{
                        bottom: `${(tick / maxValue) * 100}%`,
                        transform: "translateY(50%)",
                      }}
                    >
                      {tick}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative h-72 border border-gray-200 bg-gray-50 rounded-lg overflow-visible">
                <div className="absolute inset-x-0 top-4 bottom-4">
                  {yAxisTicks.map((tick) => (
                    <div
                      key={`grid-${tick}`}
                      className="absolute inset-x-0 border-b border-gray-200"
                      style={{ bottom: `${(tick / maxValue) * 100}%` }}
                    />
                  ))}

                  <div className="absolute inset-x-3 md:inset-x-6 bottom-0 top-0 flex items-end gap-2 md:gap-6">
                    {(stuntingData.length > 0 ? stuntingData : [{ year: "-", kasus: 0 }]).map((item) => {
                      const isHovered = hoveredYear === item.year

                      return (
                        <div key={item.year} className="flex-1 flex justify-center h-full items-end">
                          <div className="relative w-full max-w-[220px] h-full overflow-visible">
                            <button
                              type="button"
                              className={`absolute left-0 right-0 bottom-0 rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isHovered ? "bg-emerald-500" : "bg-emerald-600"
                                }`}
                              style={{
                                height: `${(item.kasus / maxValue) * 100}%`,
                                minHeight: item.kasus === 0 ? "4px" : undefined,
                              }}
                              aria-label={`${item.year}: ${item.kasus} Kasus`}
                              onMouseEnter={() => setHoveredYear(item.year)}
                              onMouseLeave={() => setHoveredYear(null)}
                              onFocus={() => setHoveredYear(item.year)}
                              onBlur={() => setHoveredYear(null)}
                            />

                            {isHovered && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${(item.kasus / maxValue) * 100}% + 8px)` }}
                              >
                                {item.kasus} Kasus
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="ml-[104px] md:ml-[162px] mt-3 grid gap-2 md:gap-3 text-center"
              style={{ gridTemplateColumns: `repeat(${Math.max(1, stuntingData.length)}, minmax(0, 1fr))` }}
            >
              {(stuntingData.length > 0 ? stuntingData : [{ year: "-", kasus: 0 }]).map((item) => (
                <div key={`axis-${item.year}`} className="px-1">
                  <p className="text-sm text-gray-600 leading-tight">{item.year}</p>
                </div>
              ))}
            </div>

            <div className="ml-[104px] md:ml-[162px] mt-1 flex justify-end">
              <span className="text-sm text-gray-700">Tahun</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {statusSummaryData.map((item) => {
            const isOpen = openAccordionId === item.id
            const headerPercentage = Math.min(
              100,
              Math.max(0, Math.round(item.details.reduce((sum, detail) => sum + detail.percentage, 0)))
            )

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden">
                <button
                  type="button"
                  className="w-full px-3 md:px-5 py-3.5 md:py-4 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-4 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={`Tampilkan detail ${item.title}`}
                  aria-expanded={isOpen}
                  aria-controls={`detail-${item.id}`}
                  onClick={() => setOpenAccordionId((prev) => (prev === item.id ? null : item.id))}
                >
                  <div className="md:w-64 flex-shrink-0">
                    <p className="text-base md:text-lg text-gray-800 leading-snug">{item.title}</p>
                  </div>

                  <div className="flex-1 flex md:justify-center" aria-hidden="true">
                    <div className="flex items-center gap-2 w-full md:justify-end">
                      <div className="flex-1 min-w-0">
                        <div className="w-full min-w-[180px] md:min-w-[240px] lg:min-w-[320px] max-w-[260px] md:max-w-[320px] lg:max-w-[420px] bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${headerPercentage}%` }}
                        />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{headerPercentage}%</span>
                    </div>
                  </div>

                  <div className="md:w-40 flex items-center justify-end gap-2 md:gap-2.5">
                    <span className="text-lg md:text-xl text-gray-900 leading-none">{item.total}</span>
                    <span className="p-0.5 rounded-md text-gray-700" aria-hidden="true">
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </span>
                  </div>
                </button>

                <div
                  id={`detail-${item.id}`}
                  className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  aria-hidden={!isOpen}
                >
                  <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50 space-y-4">
                    {item.details.map((detail) => (
                      <div
                        key={detail.id}
                        className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 md:gap-4"
                      >
                        <p className="text-base text-gray-800 leading-snug">{detail.label}</p>

                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${detail.percentage}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-gray-700 w-10 md:w-12 text-right">
                            {detail.percentage}%
                          </span>
                        </div>

                        <p className="text-sm md:text-base text-gray-800 text-left md:text-right whitespace-nowrap">
                          {detail.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
