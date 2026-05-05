import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface BansosYearData {
  year: string
  penduduk: number
}

interface BansosDetailItem {
  id: string
  label: string
  percentage: number
  amount: string
}

interface BansosAccordionItem {
  id: string
  title: string
  total: string
  details: BansosDetailItem[]
}

const bansosYearlyData: BansosYearData[] = [
  { year: "2021", penduduk: 170 },
  { year: "2022", penduduk: 310 },
  { year: "2023", penduduk: 350 },
  { year: "2024", penduduk: 450 },
  { year: "2025", penduduk: 540 },
  { year: "2026", penduduk: 600 },
]

const yAxisTicks: number[] = [0, 250, 500, 750, 1000]

const bansosAccordionData: BansosAccordionItem[] = [
  {
    id: "bansos",
    title: "Laporan Realisasi Anggaran Bansos`",
    total: "Rp 0,00",
    details: [
      {
        id: "dana-pemerintah",
        label: "Dana Pemerintah",
        percentage: 50,
        amount: "Rp 1.000.000",
      },
      {
        id: "dana-masyarakat",
        label: "Hasil Penggalangan Dana Masyarakat",
        percentage: 50,
        amount: "Rp 1.000.000",
      },
    ],
  },
]

export default function Bansos() {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)
  const [nikSearch, setNikSearch] = useState<string>("")

  const maxValue = 1000

  return (
    <>
      <Navbar />

      <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-20 md:pt-30">
        <div className="mb-6">
          <div className="h-1 w-24 bg-[#298064] mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">Cek Penerima Bansos</h1>
        </div>

        <div className="mb-6">
          <label htmlFor="nik-penerima-bansos" className="sr-only">
            Masukan NIK penerima Bansos
          </label>
          <div className="relative">
            <input
              id="nik-penerima-bansos"
              type="text"
              value={nikSearch}
              onChange={(event) => setNikSearch(event.target.value)}
              placeholder="Masukan NIK penerima Bansos"
              className="w-full h-12 rounded-xl bg-gray-100 border border-gray-100 px-6 pr-14 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={28} aria-hidden="true" />
          </div>
        </div>

        <div className="mb-8">
          <div className="relative bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 overflow-visible">
            <p className="text-sm font-medium text-gray-700 mb-2">Penduduk (Jiwa)</p>

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
                    {bansosYearlyData.map((item) => {
                      const isHovered = hoveredYear === item.year

                      return (
                        <div key={item.year} className="flex-1 flex justify-center h-full items-end">
                          <div className="relative w-full max-w-[220px] h-full overflow-visible">
                            <button
                              type="button"
                              className={`absolute left-0 right-0 bottom-0 rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                isHovered ? "bg-emerald-500" : "bg-emerald-600"
                              }`}
                              style={{
                                height: `${(item.penduduk / maxValue) * 100}%`,
                                minHeight: item.penduduk === 0 ? "4px" : undefined,
                              }}
                              aria-label={`${item.year}: ${item.penduduk} Penduduk`}
                              onMouseEnter={() => setHoveredYear(item.year)}
                              onMouseLeave={() => setHoveredYear(null)}
                              onFocus={() => setHoveredYear(item.year)}
                              onBlur={() => setHoveredYear(null)}
                            />

                            {isHovered && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${(item.penduduk / maxValue) * 100}% + 8px)` }}
                              >
                                {item.penduduk} Penduduk
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

            <div className="ml-[104px] md:ml-[162px] mt-3 grid grid-cols-6 gap-2 md:gap-3 text-center">
              {bansosYearlyData.map((item) => (
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
          {bansosAccordionData.map((item) => {
            const isOpen = openAccordionId === item.id

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

                  <div className="flex-1" aria-hidden="true" />

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
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
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
