import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface IdmMetricCard {
  label: string
  value: string
}

interface IdmYearScore {
  year: number
  score: number
}

interface ChartPoint {
  x: number
  y: number
  year: number
  score: number
}

const yearlyScores: IdmYearScore[] = [
  { year: 2021, score: 0.4152 },
  { year: 2022, score: 0.4318 },
  { year: 2023, score: 0.4784 },
  { year: 2024, score: 0.5361 },
  { year: 2025, score: 0.6073 },
  { year: 2026, score: 0.6998 },
]

const summaryCards: IdmMetricCard[] = [
  { label: "Target Status", value: "Berkembang" },
  { label: "Skor Minimal", value: "0.7073" },
  { label: "Penambahan", value: "0.0075" },
  { label: "Skor IKS", value: "0.7829" },
  { label: "Skor IKE", value: "0.7167" },
  { label: "Skor IKL", value: "0.6000" },
]

const GRID_TICKS: number[] = Array.from({ length: 11 }, (_, index) => index / 10)

function formatScore(value: number): string {
  return value.toFixed(4)
}

function IdmTrendChart() {
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

export default function IDM() {
  return (
    <>
      <Navbar />

      <section className="w-full bg-[#f2f2f2] pt-24 md:pt-30 pb-14 px-4 md:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="text-4xl font-bold text-[#298064] md:text-5xl">IDM Puundoho</h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-black md:text-lg">
            Indeks Desa Membangun (IDM) merupakan indeks komposit yang dibentuk dari tiga indeks, yaitu Indeks Ketahanan Sosial,
            Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="grid grid-cols-1 gap-4">
              <MainInfoCard label="SKOR IDM 2026" value="0.6998" />
              <div className="rounded-2xl border border-gray-300 bg-[#f8f8f8] shadow-[0_0_15px_rgba(0,0,0,0.08)] px-6 py-4">
                <p className="text-sm font-semibold text-black md:text-base">STATUS IDM 2026</p>
                <p className="mt-4 text-center text-4xl font-bold text-[#298064]">Berkembang</p>
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
              <IdmTrendChart />
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
