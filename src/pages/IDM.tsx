import { useEffect, useMemo, useState } from "react"
import { Download } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

interface IdmMetricCard {
  label: string
  value: string
}

interface IdmYearScore {
  year: number
  score: number
}

interface IdmSummary {
  STATUS?: string
  SKOR_SAAT_INI?: string | number
  TARGET_STATUS?: string
  SKOR_MINIMAL?: string | number
  PENAMBAHAN?: string | number
}

interface IdmRow {
  NO?: number | string | null
  INDIKATOR?: string
  KETERANGAN?: string
  KEGIATAN?: string
  SKOR?: string | number
}

interface IdmApiResponse {
  error?: string
  mapData?: {
    SUMMARIES?: IdmSummary
    ROW?: IdmRow[]
  }
}

interface ChartPoint {
  x: number
  y: number
  year: number
  score: number
}

const IDM_YEARS = [2025, 2024, 2023, 2022, 2021, 2020]
const GRID_TICKS: number[] = Array.from({ length: 11 }, (_, index) => index / 10)

function formatScore(value: number): string {
  return value.toFixed(4)
}

function IdmTrendChart({ yearlyScores }: { yearlyScores: IdmYearScore[] }) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

  const chartConfig = {
    width: 980,
    height: 360,
    marginTop: 28,
    marginRight: 46,
    marginBottom: 48,
    marginLeft: 70,
  }

  const points = useMemo<ChartPoint[]>(() => {
    const plotWidth = chartConfig.width - chartConfig.marginLeft - chartConfig.marginRight
    const plotHeight = chartConfig.height - chartConfig.marginTop - chartConfig.marginBottom

    return yearlyScores.map((item, index) => {
      const x =
        chartConfig.marginLeft +
        (index / Math.max(yearlyScores.length - 1, 1)) * plotWidth
      const y = chartConfig.marginTop + (1 - item.score) * plotHeight

      return {
        x,
        y,
        year: item.year,
        score: item.score,
      }
    })
  }, [chartConfig.height, chartConfig.marginBottom, chartConfig.marginLeft, chartConfig.marginRight, chartConfig.marginTop, chartConfig.width])

  const hoveredPoint = points.find((point) => point.year === hoveredYear) ?? null
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ")

  return (
    <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)] p-4 md:p-6">
      <div className="relative w-full overflow-x-auto">
        <svg
          className="w-full min-w-[680px]"
          viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
          role="img"
          aria-label="Grafik skor IDM tahunan dari 2021 hingga 2026"
        >
          {/* Grid */}
          {GRID_TICKS.map((tick) => {
            const y =
              chartConfig.marginTop +
              (1 - tick) *
              (chartConfig.height - chartConfig.marginTop - chartConfig.marginBottom)

            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={chartConfig.marginLeft}
                  y1={y}
                  x2={chartConfig.width - chartConfig.marginRight}
                  y2={y}
                  stroke="#d3d3d3"
                  strokeWidth={1}
                />
                <text
                  x={chartConfig.marginLeft - 14}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={12}
                  fill="#1f2937"
                >
                  {tick === 0 ? "0" : tick.toFixed(1)}
                </text>
              </g>
            )
          })}

          {/* Axis labels */}
          <text
            x={chartConfig.marginLeft - 30}
            y={chartConfig.marginTop - 10}
            fontSize={12}
            fill="#111827"
            fontWeight={500}
          >
            Skor
          </text>
          <text
            x={chartConfig.width - chartConfig.marginRight + 10}
            y={chartConfig.height - 10}
            fontSize={12}
            fill="#111827"
            fontWeight={500}
          >
            Tahun
          </text>

          {/* Line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#0f7a60"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Points and year labels */}
          {points.map((point) => {
            const isHovered = hoveredYear === point.year

            return (
              <g key={point.year}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#22c58b" : "#4b5563"}
                  className="cursor-pointer transition-all duration-150"
                  tabIndex={0}
                  role="button"
                  aria-label={`Skor tahun ${point.year}: ${formatScore(point.score)}`}
                  onMouseEnter={() => setHoveredYear(point.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  onFocus={() => setHoveredYear(point.year)}
                  onBlur={() => setHoveredYear(null)}
                />
                <text
                  x={point.x}
                  y={chartConfig.height - chartConfig.marginBottom + 18}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#111827"
                >
                  {point.year}
                </text>
              </g>
            )
          })}
        </svg>

        {hoveredPoint && (
          <div
            className="pointer-events-none absolute rounded-md bg-[#1f2937] px-2 py-1 text-xs text-white shadow-lg"
            style={{
              left: `${(hoveredPoint.x / chartConfig.width) * 100}%`,
              top: `${(hoveredPoint.y / chartConfig.height) * 100}%`,
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            {`Skor ${formatScore(hoveredPoint.score)}`}
          </div>
        )}
      </div>
    </div>
  )
}

function MainInfoCard({ label, value }: IdmMetricCard) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)] px-6 py-4">
      <p className="text-sm font-semibold text-black md:text-base">{label}</p>
      <p className="mt-4 text-right text-3xl font-bold text-[#298064] md:text-[2.15rem]">{value}</p>
    </div>
  )
}

function MetricCard({ label, value }: IdmMetricCard) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)] px-5 py-4 md:px-6">
      <p className="text-base font-medium text-black">{label}</p>
      <p className="mt-3 text-right text-[2rem] font-bold leading-tight text-[#298064]">{value}</p>
    </div>
  )
}

function scoreColor(score: number): string {
  if (score >= 4) return "bg-[#298064] text-white"
  if (score >= 3) return "bg-yellow-500/20 text-yellow-500"
  return "bg-red-500/20 text-red-400"
}

export default function IDM() {
  const [idmYear, setIdmYear] = useState<number>(2024)
  const [idmData, setIdmData] = useState<IdmApiResponse | null>(null)
  const [yearlyScores, setYearlyScores] = useState<IdmYearScore[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTrend, setLoadingTrend] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdmByYear = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await apiFetch(`/idm?tahun=${idmYear}`)
        if (!res.ok) {
          throw new Error(`Gagal mengambil data IDM tahun ${idmYear}`)
        }

        const json = (await res.json()) as IdmApiResponse
        if (json.error || !json.mapData || Object.keys(json.mapData).length === 0) {
          setIdmData(null)
          setError(`Data IDM untuk tahun ${idmYear} belum tersedia atau tidak dirilis.`)
        } else {
          setIdmData(json)
        }
      } catch (err) {
        console.error(err)
        setIdmData(null)
        setError("Gagal terhubung ke server untuk IDM.")
      } finally {
        setLoading(false)
      }
    }

    fetchIdmByYear()
  }, [idmYear])

  useEffect(() => {
    const fetchTrend = async () => {
      setLoadingTrend(true)
      try {
        const results = await Promise.all(
          IDM_YEARS.map(async (year) => {
            const res = await apiFetch(`/idm?tahun=${year}`)
            if (!res.ok) return null
            const json = (await res.json()) as IdmApiResponse
            const value = Number(json?.mapData?.SUMMARIES?.SKOR_SAAT_INI || 0)
            if (!value) return null
            return { year, score: value }
          })
        )

        const valid = results
          .filter((item): item is IdmYearScore => item !== null)
          .sort((a, b) => a.year - b.year)

        setYearlyScores(valid)
      } catch (err) {
        console.error(err)
        setYearlyScores([])
      } finally {
        setLoadingTrend(false)
      }
    }

    fetchTrend()
  }, [])

  const summaries = idmData?.mapData?.SUMMARIES || {}
  const rows = idmData?.mapData?.ROW || []

  const IKS = Number(rows.find((r) => r.INDIKATOR?.includes("IKS"))?.SKOR || 0)
  const IKE = Number(rows.find((r) => r.INDIKATOR?.includes("IKE"))?.SKOR || 0)
  const IKL = Number(rows.find((r) => r.INDIKATOR?.includes("IKL"))?.SKOR || 0)

  const summaryCards: IdmMetricCard[] = [
    { label: "Target Status", value: summaries.TARGET_STATUS ? String(summaries.TARGET_STATUS) : "-" },
    { label: "Skor Minimal", value: Number(summaries.SKOR_MINIMAL || 0).toFixed(4) },
    { label: "Penambahan", value: Number(summaries.PENAMBAHAN || 0).toFixed(4) },
    { label: "Skor IKS", value: IKS.toFixed(4) },
    { label: "Skor IKE", value: IKE.toFixed(4) },
    { label: "Skor IKL", value: IKL.toFixed(4) },
  ]

  const currentStatus = summaries.STATUS ? String(summaries.STATUS) : "-"
  const currentScore = Number(summaries.SKOR_SAAT_INI || 0)

  return (
    <>
      <Navbar />

      <section className="w-full bg-[#f2f2f2] pt-24 md:pt-30 pb-14 px-4 md:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="text-4xl font-bold text-[#298064] md:text-5xl">IDM Puundoho</h1>
            <div className="flex items-center gap-3">
              <label htmlFor="idm-year" className="text-sm font-semibold text-gray-700">Tahun Data</label>
              <select
                id="idm-year"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#298064]"
                value={idmYear}
                onChange={(e) => setIdmYear(Number(e.target.value))}
              >
                {IDM_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-black md:text-lg">
            Indeks Desa Membangun (IDM) merupakan indeks komposit yang dibentuk dari tiga indeks, yaitu Indeks Ketahanan Sosial,
            Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
          </p>

          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="grid grid-cols-1 gap-4">
              <MainInfoCard label={`SKOR IDM ${idmYear}`} value={loading ? "Memuat..." : currentScore.toFixed(4)} />
              <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)] px-6 py-4">
                <p className="text-sm font-semibold text-black md:text-base">STATUS IDM {idmYear}</p>
                <p className="mt-4 text-center text-4xl font-bold text-[#298064]">{loading ? "Memuat..." : currentStatus}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-transparent bg-[#f2f2f2] p-2 md:p-3">
              <img
                src="/assets/idm/IDM ilust.png"
                alt="Ilustrasi IDM"
                className="h-auto w-full rounded-2xl object-contain"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#298064] px-8 py-4 text-lg font-bold text-white shadow-[0_6px_20px_rgba(41,128,100,0.32)] transition hover:bg-[#216c54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5f4a] focus-visible:ring-offset-2"
            aria-label="Download IDM"
          >
            Download IDM
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#298064]">
              <Download size={16} aria-hidden="true" />
            </span>
          </button>

          <div className="mt-14">
            <h2 className="text-4xl font-bold text-[#298064]">Skor IDM tahun ke tahun</h2>
            <div className="mt-3">
              {loadingTrend ? (
                <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] p-6 text-sm font-medium text-gray-600">Memuat trend IDM...</div>
              ) : yearlyScores.length === 0 ? (
                <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] p-6 text-sm font-medium text-gray-600">Data trend IDM belum tersedia.</div>
              ) : (
                <IdmTrendChart yearlyScores={yearlyScores} />
              )}
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-[#298064] md:text-4xl">Indikator Rekomendasi Pembangunan</h2>
            <p className="text-sm leading-relaxed text-black md:text-base">
              Rekomendasi dari pusat berdasarkan kekurangan pilar penunjang Indeks Desa Membangun.
            </p>

            <div className="rounded-xl overflow-hidden border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#4A977E] text-[10px] uppercase tracking-wider text-[#FFFFFF] sm:text-xs">
                    <tr>
                      <th className="border-b border-[#4A977E] p-4">Indikator Terukur</th>
                      <th className="border-b border-[#4A977E] p-4">Keterangan Saat Ini</th>
                      <th className="w-28 border-b border-[#4A977E] p-4 text-center">Skor</th>
                      <th className="border-b border-[#4A977E] p-4">Saran Kegiatan Intervensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.filter((row) => row.NO !== null && row.NO !== undefined).map((row, idx) => {
                      const rowScore = Number(row.SKOR || 0)

                      return (
                        <tr key={`${row.INDIKATOR || "row"}-${idx}`} className="border-b border-[#E5E7EB] bg-[#F8F8F8] transition-colors hover:bg-white">
                          <td className="max-w-[220px] truncate p-4 font-medium text-black" title={row.INDIKATOR}>{row.INDIKATOR || "-"}</td>
                          <td className="max-w-[280px] truncate p-4 text-xs text-gray-700" title={row.KETERANGAN}>{row.KETERANGAN || "-"}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block h-6 w-6 rounded leading-6 text-xs font-semibold font-mono ${scoreColor(rowScore)}`}>
                              {rowScore}
                            </span>
                          </td>
                          <td className={`max-w-[340px] truncate p-4 text-xs ${row.KEGIATAN === "-" ? "italic text-[#6B6B70]" : "text-orange-500"}`} title={row.KEGIATAN}>
                            {row.KEGIATAN && row.KEGIATAN !== "-" ? row.KEGIATAN : "Sudah memenuhi / Tidak Butuh Intervensi"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
