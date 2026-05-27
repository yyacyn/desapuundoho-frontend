import { useMemo, useState } from "react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { TrendingUp, TrendingDown, Wallet, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { useAPBDes } from "../context/APBDesaContext"

interface ProgressItemProps {
  label: string
  percentage: number
  color: string
}

interface ChartData {
  year: string
  pendapatan: number
  belanja: number
}

interface PendapatanUraianItem {
  uraian: string
  anggaran: string
}

interface PendapatanKategoriItem {
  id: string
  label: string
  chartLabel: string
  amount: string
  totalValue: number
  detail: PendapatanUraianItem[]
  totalAnggaran: string
}

interface BelanjaUraianItem {
  id: string
  uraian: string
  anggaran: string
  percentage: number
}

interface BelanjaKategoriItem {
  id: string
  label: string
  chartLabel: string
  amount: string
  totalValue: number
  detail: BelanjaUraianItem[]
  totalAnggaran: string
}

interface PembiayaanUraianItem {
  id: string
  uraian: string
  anggaran: string
  percentage: number
}

interface PembiayaanKategoriItem {
  id: string
  label: string
  chartLabel: string
  amount: string
  totalValue: number
  detail: PembiayaanUraianItem[]
  totalAnggaran: string
}

interface ApbdEntry {
  id: number
  tahun: number
  total_pendapatan: number
  total_pengeluaran: number
}

interface PendapatanEntry {
  id: number
  kategori: string
  jumlah: number
}

interface PengeluaranEntry {
  id: number
  bidang: string
  jumlah: number
}

const CHART_MIN_TICK_STEP = 100_000_000

const getChartScale = (maxValue: number) => {
  const tickStep = maxValue > 0 ? Math.max(CHART_MIN_TICK_STEP, 10 ** Math.floor(Math.log10(maxValue))) : CHART_MIN_TICK_STEP
  const roundedMaxValue = Math.max(tickStep, Math.ceil(maxValue / tickStep) * tickStep)
  const ticks = Array.from(
    { length: Math.floor(roundedMaxValue / tickStep) + 1 },
    (_, index) => index * tickStep
  )

  return { tickStep, roundedMaxValue, ticks }
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, percentage, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
)

const BarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const maxDataValue = data.length > 0 ? Math.max(...data.flatMap(d => [d.pendapatan, d.belanja])) : 0
  const { roundedMaxValue, ticks: yAxisLabels } = useMemo(() => getChartScale(maxDataValue), [maxDataValue])
  const [hoveredBar, setHoveredBar] = useState<{ type: "pendapatan" | "belanja"; year: string; value: number; x: number; y: number } | null>(null)

  const formatCurrency = (value: number): string => {
    return `Rp ${value.toLocaleString("id-ID")}`
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 relative">
      <h3 className="text-lg font-bold text-gray-800 mb-8">{title}</h3>
      <div className="flex items-end gap-4 h-80">
        {/* Y-Axis Labels - positioned using bottom percentage for exact alignment */}
        <div className="relative h-64 text-sm text-gray-600 pr-4 w-32 flex-shrink-0">
          {yAxisLabels.map((value, index) => (
            <span
              key={index}
              className="absolute right-0 font-medium leading-none"
              style={{
                bottom: `${(value / roundedMaxValue) * 100}%`,
                transform: 'translateY(50%)'
              }}
            >
              {formatCurrency(value)}
            </span>
          ))}
        </div>
        {/* Vertical Separator Line */}
        <div className="h-64 w-px bg-gray-300 flex-shrink-0" />
        {/* Bars with Grid Lines */}
        <div className="relative flex-1 h-64 overflow-visible">
          {/* Horizontal Grid Lines - positioned using bottom percentage for exact alignment */}
          <div className="absolute inset-0 pointer-events-none">
            {yAxisLabels.map((value, index) => (
              <div
                key={index}
                className="absolute w-full"
                style={{
                  bottom: `${(value / roundedMaxValue) * 100}%`,
                  borderBottom: '1px solid #e5e7eb'
                }}
              />
            ))}
          </div>
          {/* Bars - bottom-0 aligns bar base exactly with the Rp 0 grid line */}
          {data.map((item, index) => (
            <div
              key={index}
              className="absolute bottom-0 h-full flex items-end justify-center"
              style={{ left: `${(index + 0.5) * (100 / data.length)}%`, transform: 'translateX(-50%)' }}
            >
              <div className="flex gap-3 items-end h-full justify-center">
                {/* Pendapatan Bar */}
                <div
                  className={`w-10 rounded-t-md transition-all duration-300 cursor-pointer ${hoveredBar?.type === "pendapatan" && hoveredBar?.year === item.year
                    ? "bg-emerald-400"
                    : "bg-emerald-500"
                    }`}
                  style={{ height: `${(item.pendapatan / roundedMaxValue) * 100}%` }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredBar({
                      type: "pendapatan",
                      year: item.year,
                      value: item.pendapatan,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    })
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                {/* Belanja Bar */}
                <div
                  className={`w-10 rounded-t-md transition-all duration-300 cursor-pointer ${hoveredBar?.type === "belanja" && hoveredBar?.year === item.year
                    ? "bg-red-400"
                    : "bg-red-500"
                    }`}
                  style={{ height: `${(item.belanja / roundedMaxValue) * 100}%` }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredBar({
                      type: "belanja",
                      year: item.year,
                      value: item.belanja,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    })
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                />
              </div>
            </div>
          ))}
          {/* X-axis Year Labels - rendered below the chart area with a clear gap */}
          {data.map((item, index) => (
            <span
              key={`year-${index}`}
              className="absolute text-sm font-semibold text-gray-700 whitespace-nowrap"
              style={{
                top: 'calc(100% + 10px)',
                left: `${(index + 0.5) * (100 / data.length)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {item.year}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded" />
          <span className="text-sm font-medium text-gray-700">Pendapatan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-sm font-medium text-gray-700">Belanja</span>
        </div>
      </div>
      {/* Tooltip */}
      {hoveredBar && (
        <div
          className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 pointer-events-none"
          style={{
            left: `${hoveredBar.x}px`,
            top: `${hoveredBar.y - 50}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold">{hoveredBar.type === "pendapatan" ? "Pendapatan" : "Belanja"}</div>
          <div className="text-sm">{formatCurrency(hoveredBar.value)}</div>
          <div className="text-xs text-gray-300">Tahun {hoveredBar.year}</div>
        </div>
      )}
    </div>
  )
}

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; color: string }> = ({ data, color }) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="flex items-end justify-around gap-2 h-40">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-full rounded-t-md transition-all duration-500 ${color}`}
            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
            title={`${item.label}: ${item.value.toLocaleString()}`}
          />
          <span className="text-xs font-medium text-gray-600 text-center truncate w-full">{item.label.split(' ').pop()}</span>
        </div>
      ))}
    </div>
  )
}

export default function APBDesa() {
  const {
    apbdList,
    pendapatanData,
    pengeluaranData,
    selectedYear,
    setSelectedYear,
    loading,
    subLoading,
  } = useAPBDes()

  const [openPendapatanId, setOpenPendapatanId] = useState<string | null>(null)
  const [hoveredPendapatanBarId, setHoveredPendapatanBarId] = useState<string | null>(null)
  const [openBelanjaId, setOpenBelanjaId] = useState<string | null>(null)
  const [hoveredBelanjaBarId, setHoveredBelanjaBarId] = useState<string | null>(null)
  const [openPembiayaanId, setOpenPembiayaanId] = useState<string | null>(null)
  const [hoveredPembiayaanBarId, setHoveredPembiayaanBarId] = useState<string | null>(null)

  const typedApbdList = apbdList as ApbdEntry[]
  const typedPendapatanData = pendapatanData as PendapatanEntry[]
  const typedPengeluaranData = pengeluaranData as PengeluaranEntry[]

  const selectedApbd = useMemo(
    () => typedApbdList.find((item) => item.id === selectedYear) || null,
    [typedApbdList, selectedYear]
  )
  const selectedYearLabel = selectedApbd?.tahun?.toString() ?? ""

  const totalPendapatan = useMemo(
    () => typedPendapatanData.reduce((sum, item) => sum + Number(item.jumlah || 0), 0),
    [typedPendapatanData]
  )

  const totalBelanja = useMemo(
    () => typedPengeluaranData.reduce((sum, item) => sum + Number(item.jumlah || 0), 0),
    [typedPengeluaranData]
  )

  const totalSurplus = totalPendapatan - totalBelanja

  const chartDataYearly: ChartData[] = useMemo(
    () => [...typedApbdList]
      .sort((a, b) => a.tahun - b.tahun)
      .map((item) => ({
        year: String(item.tahun),
        pendapatan: Number(item.total_pendapatan || 0),
        belanja: Number(item.total_pengeluaran || 0),
      }))
      .slice(-5),
    [typedApbdList]
  )

  const years = useMemo(
    () => [...typedApbdList].map((item) => String(item.tahun)).sort((a, b) => Number(b) - Number(a)),
    [typedApbdList]
  )

  const isDataLoading = loading || subLoading

  const formatRupiah = (value: number): string => `Rp ${value.toLocaleString("id-ID")}`
  const parseRupiah = (value: string): number => {
    const digitsOnly = value.replace(/[^\d]/g, "")
    return digitsOnly ? Number(digitsOnly) : 0
  }

  const getAmountTextClass = (value: number): string => {
    if (value >= 1_000_000_000) {
      return "text-sm md:text-sm"
    }

    if (value >= 10_000_000) {
      return "text-lg md:text-base"
    }

    return "text-lg md:text-base"
  }

  // Pembiayaan dihitung dari 100% pendapatan dan pengeluaran
  const pembiayaanPenerimaanValue = totalPendapatan
  const pembiayaanPengeluaranValue = totalBelanja

  const summaryData = {
    pendapatan: formatRupiah(totalPendapatan),
    belanja: formatRupiah(totalBelanja),
    pembiayaan: {
      penerimaan: formatRupiah(pembiayaanPenerimaanValue),
      pengeluaran: formatRupiah(pembiayaanPengeluaranValue),
    },
    surplus: formatRupiah(totalSurplus),
  }

  const pendapatan2025Data: PendapatanKategoriItem[] = useMemo(() => {
    const grouped = typedPendapatanData.reduce<Record<string, number>>((acc, item) => {
      const key = item.kategori || "Lainnya"
      acc[key] = (acc[key] || 0) + Number(item.jumlah || 0)
      return acc
    }, {})

    return Object.entries(grouped).map(([kategori, jumlah], index) => ({
      id: `pendapatan-${index}`,
      label: kategori,
      chartLabel: kategori,
      amount: formatRupiah(jumlah),
      totalValue: jumlah,
      detail: [{ uraian: kategori, anggaran: formatRupiah(jumlah) }],
      totalAnggaran: formatRupiah(jumlah),
    }))
  }, [typedPendapatanData])

  const totalPendapatanValue = pendapatan2025Data.reduce((sum, item) => sum + item.totalValue, 0)
  const maxPendapatanValue = Math.max(...pendapatan2025Data.map((item) => item.totalValue), CHART_MIN_TICK_STEP)
  const { roundedMaxValue: roundedPendapatanMaxValue, ticks: pendapatanChartTicks } = useMemo(
    () => getChartScale(maxPendapatanValue),
    [maxPendapatanValue]
  )

  const belanjaSectionData: BelanjaKategoriItem[] = useMemo(() => {
    const grouped = typedPengeluaranData.reduce<Record<string, number>>((acc, item) => {
      const key = item.bidang || "Lainnya"
      acc[key] = (acc[key] || 0) + Number(item.jumlah || 0)
      return acc
    }, {})

    return Object.entries(grouped).map(([bidang, jumlah], index) => ({
      id: `belanja-${index}`,
      label: bidang,
      chartLabel: bidang,
      amount: formatRupiah(jumlah),
      totalValue: jumlah,
      detail: [{ id: `detail-${index}`, uraian: bidang, anggaran: formatRupiah(jumlah), percentage: 100 }],
      totalAnggaran: formatRupiah(jumlah),
    }))
  }, [typedPengeluaranData])

  const totalBelanjaSectionValue = belanjaSectionData.reduce((sum, item) => sum + item.totalValue, 0)
  const maxBelanjaValue = Math.max(...belanjaSectionData.map((item) => item.totalValue), CHART_MIN_TICK_STEP)
  const getPercentageFromTotal = (value: number, total: number): number => {
    if (total <= 0) return 0
    return Math.round((value / total) * 100)
  }
  const { roundedMaxValue: roundedBelanjaMaxValue, ticks: belanjaChartTicks } = useMemo(
    () => getChartScale(maxBelanjaValue),
    [maxBelanjaValue]
  )

  const pembiayaanSectionData: PembiayaanKategoriItem[] = useMemo(() => {
    const pembiayaanPenerimaan10Pct = Math.round(pembiayaanPenerimaanValue * 0.55)
    const pembiayaanPenerimaan20Pct = pembiayaanPenerimaanValue - pembiayaanPenerimaan10Pct

    const pembiayaanPengeluaran100Pct = pembiayaanPengeluaranValue

    return [
      {
        id: "penerimaan",
        label: "Penerimaan",
        chartLabel: "Penerimaan",
        amount: formatRupiah(pembiayaanPenerimaanValue),
        totalValue: pembiayaanPenerimaanValue,
        detail: [
          { id: "silpa", uraian: "SILPA tahun sebelumnya", anggaran: formatRupiah(pembiayaanPenerimaan10Pct), percentage: 55 },
          { id: "pencairan", uraian: "Pencairan dana cadangan", anggaran: formatRupiah(pembiayaanPenerimaan20Pct), percentage: 45 },
        ],
        totalAnggaran: formatRupiah(pembiayaanPenerimaanValue),
      },
      {
        id: "pengeluaran",
        label: "Pengeluaran",
        chartLabel: "Pengeluaran",
        amount: formatRupiah(pembiayaanPengeluaranValue),
        totalValue: pembiayaanPengeluaranValue,
        detail: [
          { id: "modal", uraian: "Penyertaan modal desa", anggaran: formatRupiah(pembiayaanPengeluaran100Pct), percentage: 100 },
        ],
        totalAnggaran: formatRupiah(pembiayaanPengeluaranValue),
      },
    ]
  }, [pembiayaanPenerimaanValue, pembiayaanPengeluaranValue])

  const totalPembiayaanSectionValue = useMemo(
    () => pembiayaanSectionData.reduce((sum, item) => sum + item.totalValue, 0),
    [pembiayaanSectionData]
  )
  const maxPembiayaanValue = useMemo(
    () => Math.max(...pembiayaanSectionData.map((item) => item.totalValue), CHART_MIN_TICK_STEP),
    [pembiayaanSectionData]
  )
  const { roundedMaxValue: roundedPembiayaanMaxValue, ticks: pembiayaanChartTicks } = useMemo(
    () => getChartScale(maxPembiayaanValue),
    [maxPembiayaanValue]
  )

  return (
    <>
      <Navbar />
      <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-28 md:pt-30">
        {/* Header with Year Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="invisible">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              APB Desa Puundhoho
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Desa Puundhoho, Kecamatan Pakue Utara, Kabupaten Kolaka Utara, Provinsi Sulawesi Tenggara
            </p>
          </div>
          <div className="relative">
            <select
              value={selectedYearLabel}
              onChange={(e) => {
                const target = typedApbdList.find((item) => String(item.tahun) === e.target.value)
                if (target) setSelectedYear(target.id)
              }}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Top Section: Left (Title + Illustration) | Right (Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side: Title, Subtitle and Illustration Image */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                APB Desa Puundhoho
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Desa Puundhoho, Kecamatan Pakue Utara, Kabupaten Kolaka Utara, Provinsi Sulawesi Tenggara
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 overflow-hidden">
              <img
                src="/assets/apbdesa/ilustration apbdesa.png"
                alt="Ilustrasi APBDesa"
                className="w-full h-auto max-h-48 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          </div>

          {/* Right Side: Cards */}
          <div className="flex flex-col gap-4">
            {/* Top Row: Pendapatan & Belanja */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pendapatan Card */}
              <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <ArrowUp size={22} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Pendapatan</span>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-800">{isDataLoading ? "Memuat..." : summaryData.pendapatan}</p>
              </div>
              {/* Belanja Card */}
              <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                    <ArrowDown size={22} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Belanja</span>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-800">{isDataLoading ? "Memuat..." : summaryData.belanja}</p>
              </div>
            </div>

            {/* Middle Row: Pembiayaan (split Penerimaan/Pengeluaran) */}
            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Wallet size={22} />
                </div>
                <span className="text-sm font-medium text-gray-600">Pembiayaan</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Penerimaan */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Penerimaan</span>
                  <p className="text-base md:text-lg font-bold text-emerald-600">{summaryData.pembiayaan.penerimaan}</p>
                </div>
                {/* Pengeluaran */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Pengeluaran</span>
                  <p className="text-base md:text-lg font-bold text-red-600">{summaryData.pembiayaan.pengeluaran}</p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Surplus/Defisit */}
            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <TrendingUp size={22} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Surplus / Defisit</span>
                </div>
                <p className={`text-lg md:text-xl font-bold ${totalSurplus >= 0 ? "text-emerald-600" : "text-red-600"}`}>{isDataLoading ? "Memuat..." : summaryData.surplus}</p>
              </div>
            </div>
          </div>
        </div>


        {/* Pendapatan Desa */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pendapatan Desa tahun {selectedYearLabel || "-"}
          </h2>
          <div className="space-y-6">
            <div className="relative bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 overflow-visible">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-2 md:gap-3">
                <div className="relative h-72 text-[10px] md:text-xs text-gray-500">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {pendapatanChartTicks.map((tick) => (
                      <span
                        key={tick}
                        className="absolute right-0 pr-1 leading-none whitespace-nowrap"
                        style={{
                          bottom: `${(tick / roundedPendapatanMaxValue) * 100}%`,
                          transform: "translateY(50%)",
                        }}
                      >
                        {formatRupiah(tick)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative h-72 border border-gray-200 bg-gray-50 rounded-lg overflow-visible">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {pendapatanChartTicks.map((tick) => (
                      <div
                        key={`grid-${tick}`}
                        className="absolute inset-x-0 border-b border-gray-200"
                        style={{ bottom: `${(tick / roundedPendapatanMaxValue) * 100}%` }}
                      />
                    ))}

                    <div className="absolute inset-x-3 md:inset-x-6 bottom-0 top-0 flex items-end gap-3 md:gap-8">
                      {pendapatan2025Data.map((item) => (
                        <div key={item.id} className="flex-1 flex justify-center h-full items-end">
                          <div className="relative w-full max-w-[280px] h-full overflow-visible">
                            <button
                              type="button"
                              className={`absolute left-0 right-0 bottom-0 rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${hoveredPendapatanBarId === item.id ? "bg-emerald-500" : "bg-emerald-600"
                                }`}
                              style={{
                                height: `${(item.totalValue / roundedPendapatanMaxValue) * 100}%`,
                                minHeight: item.totalValue === 0 ? "4px" : undefined,
                              }}
                              aria-label={`${item.chartLabel}: ${formatRupiah(item.totalValue)}`}
                              onMouseEnter={() => setHoveredPendapatanBarId(item.id)}
                              onMouseLeave={() => setHoveredPendapatanBarId(null)}
                              onFocus={() => setHoveredPendapatanBarId(item.id)}
                              onBlur={() => setHoveredPendapatanBarId(null)}
                            />

                            {hoveredPendapatanBarId === item.id && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${(item.totalValue / roundedPendapatanMaxValue) * 100}% + 8px)` }}
                              >
                                {formatRupiah(item.totalValue)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="ml-[104px] md:ml-[162px] mt-3 grid gap-4 text-center"
                style={{ gridTemplateColumns: `repeat(${Math.max(1, pendapatan2025Data.length)}, minmax(0, 1fr))` }}
              >
                {pendapatan2025Data.map((item) => (
                  <div key={`axis-${item.id}`} className="px-2">
                    <p className="text-sm font-medium text-gray-600">{item.amount}</p>
                    <p className="text-sm text-gray-600 leading-snug">{item.chartLabel}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {pendapatan2025Data.map((item) => {
                const isOpen = openPendapatanId === item.id
                const percentage = getPercentageFromTotal(item.totalValue, totalPendapatanValue)

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden">
                    <button
                      type="button"
                      className="w-full px-3 md:px-5 py-3.5 md:py-4 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-4 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      aria-label={`Tampilkan detail ${item.label}`}
                      aria-expanded={isOpen}
                      aria-controls={`detail-${item.id}`}
                      onClick={() => setOpenPendapatanId((prev) => (prev === item.id ? null : item.id))}
                    >
                      <div className="md:w-64 flex-shrink-0">
                        <p className="text-base md:text-lg text-gray-800 leading-snug">{item.label}</p>
                      </div>

                      <div className="flex-1 flex items-center gap-2.5">
                        <div className="flex-1 w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-gray-700 w-10 md:w-12 text-right">{percentage}%</span>
                      </div>

                      <div className="md:w-40 flex items-center justify-end gap-2 md:gap-2.5">
                        <span className={`whitespace-nowrap tabular-nums leading-none text-gray-900 ${getAmountTextClass(item.totalValue)}`}>
                          {item.amount}
                        </span>
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
                      <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 md:gap-x-8 gap-y-2">
                          <p className="text-sm font-semibold text-gray-700">Uraian</p>
                          <p className="text-sm font-semibold text-gray-700 text-left md:text-right">Anggaran</p>

                          {item.detail.map((detailItem) => {
                            const detailValue = parseRupiah(detailItem.anggaran)
                            const detailPercentage = Math.min(
                              100,
                              Math.max(0, getPercentageFromTotal(detailValue, totalPendapatanValue))
                            )

                            return (
                              <div
                                key={`${item.id}-${detailItem.uraian}-row`}
                                className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 md:gap-8"
                              >
                                <p className="text-sm text-gray-700 leading-snug">{detailItem.uraian}</p>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-700 text-left md:text-right leading-snug">{detailItem.anggaran}</p>
                                  <div className="flex items-center gap-2 md:justify-end">
                                    <div className="w-full md:w-56 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                      <div
                                        className="h-2.5 bg-emerald-600 rounded-full transition-all duration-500"
                                        style={{ width: `${detailPercentage}%` }}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">{detailPercentage}%</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                          <div className="col-span-1 md:col-span-2 mt-2 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
                            <div aria-hidden="true" />
                            <div className="flex items-center justify-between md:justify-end gap-3">
                              <span className="text-sm font-semibold text-gray-700">Total</span>
                              <span className="text-sm font-bold text-gray-900">{item.totalAnggaran}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Belanja Desa */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Belanja Desa
          </h2>
          <div className="space-y-6">
            <div className="relative bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 overflow-visible">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-2 md:gap-3">
                <div className="relative h-72 text-[10px] md:text-xs text-gray-500">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {belanjaChartTicks.map((tick) => (
                      <span
                        key={tick}
                        className="absolute right-0 pr-1 leading-none whitespace-nowrap"
                        style={{
                          bottom: `${(tick / roundedBelanjaMaxValue) * 100}%`,
                          transform: "translateY(50%)",
                        }}
                      >
                        {formatRupiah(tick)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative h-72 border border-gray-200 bg-gray-50 rounded-lg overflow-visible">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {belanjaChartTicks.map((tick) => (
                      <div
                        key={`belanja-grid-${tick}`}
                        className="absolute inset-x-0 border-b border-gray-200"
                        style={{ bottom: `${(tick / roundedBelanjaMaxValue) * 100}%` }}
                      />
                    ))}

                    <div className="absolute inset-x-3 md:inset-x-6 bottom-0 top-0 flex items-end gap-2 md:gap-6">
                      {belanjaSectionData.map((item) => (
                        <div key={item.id} className="flex-1 flex justify-center h-full items-end">
                          <div className="relative w-full max-w-[220px] h-full overflow-visible">
                            <button
                              type="button"
                              className={`absolute left-0 right-0 bottom-0 rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${hoveredBelanjaBarId === item.id ? "bg-emerald-500" : "bg-emerald-600"
                                }`}
                              style={{
                                height: `${(item.totalValue / roundedBelanjaMaxValue) * 100}%`,
                                minHeight: item.totalValue === 0 ? "4px" : undefined,
                              }}
                              aria-label={`${item.chartLabel}: ${formatRupiah(item.totalValue)}`}
                              onMouseEnter={() => setHoveredBelanjaBarId(item.id)}
                              onMouseLeave={() => setHoveredBelanjaBarId(null)}
                              onFocus={() => setHoveredBelanjaBarId(item.id)}
                              onBlur={() => setHoveredBelanjaBarId(null)}
                            />

                            <span
                              className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-700 whitespace-nowrap pointer-events-none"
                              style={{ bottom: `calc(${(item.totalValue / roundedBelanjaMaxValue) * 100}% + 2px)` }}
                            >
                              {formatRupiah(item.totalValue)},00
                            </span>

                            {hoveredBelanjaBarId === item.id && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${(item.totalValue / roundedBelanjaMaxValue) * 100}% + 24px)` }}
                              >
                                {formatRupiah(item.totalValue)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="ml-[104px] md:ml-[162px] mt-3 grid gap-2 md:gap-3 text-center"
                style={{ gridTemplateColumns: `repeat(${Math.max(1, belanjaSectionData.length)}, minmax(0, 1fr))` }}
              >
                {belanjaSectionData.map((item) => (
                  <div key={`belanja-axis-${item.id}`} className="px-1">
                    <p className="text-[11px] md:text-xs text-gray-600 leading-tight break-words">{item.chartLabel}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {belanjaSectionData.map((item) => {
                const isOpen = openBelanjaId === item.id
                const percentage = getPercentageFromTotal(item.totalValue, totalBelanjaSectionValue)

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden">
                    <button
                      type="button"
                      className="w-full px-3 md:px-5 py-3.5 md:py-4 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-4 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      aria-label={`Tampilkan detail ${item.label}`}
                      aria-expanded={isOpen}
                      aria-controls={`belanja-detail-${item.id}`}
                      onClick={() => setOpenBelanjaId((prev) => (prev === item.id ? null : item.id))}
                    >
                      <div className="md:w-64 flex-shrink-0">
                        <p className="text-base md:text-lg text-gray-800 leading-snug">{item.label}</p>
                      </div>

                      <div className="flex-1 flex items-center gap-2.5">
                        <div className="flex-1 w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-gray-700 w-10 md:w-12 text-right">{percentage}%</span>
                      </div>

                      <div className="md:w-40 flex items-center justify-end gap-2 md:gap-2.5">
                        <span className={`whitespace-nowrap tabular-nums leading-none text-gray-900 ${getAmountTextClass(item.totalValue)}`}>
                          {item.amount}
                        </span>
                        <span className="p-0.5 rounded-md text-gray-700" aria-hidden="true">
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </span>
                      </div>
                    </button>

                    <div
                      id={`belanja-detail-${item.id}`}
                      className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 md:gap-x-8 gap-y-2">
                          <p className="text-sm font-semibold text-gray-700">Uraian</p>
                          <p className="text-sm font-semibold text-gray-700 text-left md:text-right">Anggaran</p>

                          {item.detail.map((detailItem) => (
                            <div
                              key={`${item.id}-${detailItem.id}-row`}
                              className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 md:gap-8"
                            >
                              <p className="text-sm text-gray-700 leading-snug">{detailItem.uraian}</p>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 text-left md:text-right leading-snug">{detailItem.anggaran}</p>
                                <div className="flex items-center gap-2 md:justify-end">
                                  <div className="w-full md:w-80 lg:w-[420px] bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                      className="h-2.5 bg-emerald-600 rounded-full transition-all duration-500"
                                      style={{ width: `${detailItem.percentage}%` }}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 w-10 text-right">{detailItem.percentage}%</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="col-span-1 md:col-span-2 mt-2 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
                            <div aria-hidden="true" />
                            <div className="flex items-center justify-between md:justify-end gap-3">
                              <span className="text-sm font-semibold text-gray-700">Total</span>
                              <span className="text-sm font-bold text-gray-900">{item.totalAnggaran}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pembiayaan Desa */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pembiayaan Desa
          </h2>
          <div className="space-y-6">
            <div className="relative bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 overflow-visible">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-2 md:gap-3">
                <div className="relative h-72 text-[10px] md:text-xs text-gray-500">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {pembiayaanChartTicks.map((tick) => (
                      <span
                        key={tick}
                        className="absolute right-0 pr-1 leading-none whitespace-nowrap"
                        style={{
                          bottom: `${(tick / roundedPembiayaanMaxValue) * 100}%`,
                          transform: "translateY(50%)",
                        }}
                      >
                        {formatRupiah(tick)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative h-72 border border-gray-200 bg-gray-50 rounded-lg overflow-visible">
                  <div className="absolute inset-x-0 top-4 bottom-4">
                    {pembiayaanChartTicks.map((tick) => (
                      <div
                        key={`pembiayaan-grid-${tick}`}
                        className="absolute inset-x-0 border-b border-gray-200"
                        style={{ bottom: `${(tick / roundedPembiayaanMaxValue) * 100}%` }}
                      />
                    ))}

                    <div className="absolute inset-x-3 md:inset-x-6 bottom-0 top-0 flex items-end gap-4 md:gap-8">
                      {pembiayaanSectionData.map((item) => (
                        <div key={item.id} className="flex-1 flex justify-center h-full items-end">
                          <div className="relative w-full max-w-[320px] h-full overflow-visible">
                            <button
                              type="button"
                              className={`absolute left-0 right-0 bottom-0 rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${hoveredPembiayaanBarId === item.id ? "bg-emerald-500" : "bg-emerald-600"
                                }`}
                              style={{
                                height: `${(item.totalValue / roundedPembiayaanMaxValue) * 100}%`,
                                minHeight: item.totalValue === 0 ? "4px" : undefined,
                              }}
                              aria-label={`${item.chartLabel}: ${formatRupiah(item.totalValue)}`}
                              onMouseEnter={() => setHoveredPembiayaanBarId(item.id)}
                              onMouseLeave={() => setHoveredPembiayaanBarId(null)}
                              onFocus={() => setHoveredPembiayaanBarId(item.id)}
                              onBlur={() => setHoveredPembiayaanBarId(null)}
                            />

                            {hoveredPembiayaanBarId === item.id && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md whitespace-nowrap pointer-events-none"
                                style={{ bottom: `calc(${(item.totalValue / roundedPembiayaanMaxValue) * 100}% + 8px)` }}
                              >
                                {formatRupiah(item.totalValue)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-[104px] md:ml-[162px] mt-3 grid grid-cols-2 gap-4 text-center">
                {pembiayaanSectionData.map((item) => (
                  <div key={`pembiayaan-axis-${item.id}`} className="px-2">
                    <p className="text-sm font-medium text-gray-600">{item.amount}</p>
                    <p className="text-sm text-gray-600 leading-snug">{item.chartLabel}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {pembiayaanSectionData.map((item) => {
                const isOpen = openPembiayaanId === item.id
                const percentage = getPercentageFromTotal(item.totalValue, totalPembiayaanSectionValue)

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden">
                    <button
                      type="button"
                      className="w-full px-3 md:px-5 py-3.5 md:py-4 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-4 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      aria-label={`Tampilkan detail ${item.label}`}
                      aria-expanded={isOpen}
                      aria-controls={`pembiayaan-detail-${item.id}`}
                      onClick={() => setOpenPembiayaanId((prev) => (prev === item.id ? null : item.id))}
                    >
                      <div className="md:w-64 flex-shrink-0">
                        <p className="text-base md:text-lg text-gray-800 leading-snug">{item.label}</p>
                      </div>

                      <div className="flex-1 flex items-center gap-2.5">
                        <div className="flex-1 w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-gray-700 w-10 md:w-12 text-right">{percentage}%</span>
                      </div>

                      <div className="md:w-40 flex items-center justify-end gap-2 md:gap-2.5">
                        <span className={`whitespace-nowrap tabular-nums leading-none text-gray-900 ${getAmountTextClass(item.totalValue)}`}>
                          {item.amount}
                        </span>
                        <span className="p-0.5 rounded-md text-gray-700" aria-hidden="true">
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </span>
                      </div>
                    </button>

                    <div
                      id={`pembiayaan-detail-${item.id}`}
                      className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 md:gap-x-8 gap-y-2">
                          <p className="text-sm font-semibold text-gray-700">Uraian</p>
                          <p className="text-sm font-semibold text-gray-700 text-left md:text-right">Anggaran</p>

                          {item.detail.map((detailItem) => (
                            <div
                              key={`${item.id}-${detailItem.id}-row`}
                              className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 md:gap-8"
                            >
                              <p className="text-sm text-gray-700 leading-snug">{detailItem.uraian}</p>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 text-left md:text-right leading-snug">{detailItem.anggaran}</p>
                                <div className="flex items-center gap-2 md:justify-end">
                                  <div className="w-full md:w-80 lg:w-[420px] bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                      className="h-2.5 bg-emerald-600 rounded-full transition-all duration-500"
                                      style={{ width: `${detailItem.percentage}%` }}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 w-10 text-right">{detailItem.percentage}%</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="col-span-1 md:col-span-2 mt-2 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
                            <div aria-hidden="true" />
                            <div className="flex items-center justify-between md:justify-end gap-3">
                              <span className="text-sm font-semibold text-gray-700">Total</span>
                              <span className="text-sm font-bold text-gray-900">{item.totalAnggaran}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pendapatan dan Belanja Desa dari 5 Tahun Terakhir */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pendapatan dan Belanja Desa dari 5 Tahun Terakhir
          </h2>
          <BarChart data={chartDataYearly} title="Perbandingan Pendapatan dan Belanja" />
        </div>
      </section>
      <Footer siteSettings={undefined} />
    </>
  )
}
