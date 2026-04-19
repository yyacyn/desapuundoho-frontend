import { useMemo, useState, type ReactNode } from "react"
import {
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChevronDown, Mars, Users, Venus, Home, Cross, Church, MoonStar } from "lucide-react"
import { FaOm, FaDharmachakra, FaToriiGate } from "react-icons/fa"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface DemografiCard {
  label: string
  value: number
  icon: ReactNode
}

interface AgeGroupData {
  usia: string
  lakiLaki: number
  perempuan: number
}

interface DusunData {
  name: string
  population: number
  color: string
  colorName: string
  polygonPoints: string
  labelX: number
  labelY: number
}

interface EducationData {
  name: string
  value: number
}

interface JobData {
  name: string
  value: number
  color: string
}

interface WajibPilihData {
  year: string
  value: number
  color: string
}

interface ReligionData {
  name: string
  value: string
  icon: ReactNode
}

interface PendidikanHoverState {
  value: number
  x: number
  y: number
}

interface PendidikanBarShapeData {
  value?: number | string | [number, number]
  x?: number
  y?: number
  width?: number
}

const demografiCards: DemografiCard[] = [
  { label: "Total Penduduk", value: 1136, icon: <Users size={58} strokeWidth={1.9} aria-hidden="true" /> },
  { label: "Kepala Keluarga", value: 349, icon: <Home size={58} strokeWidth={1.9} aria-hidden="true" /> },
  { label: "Perempuan", value: 569, icon: <Venus size={58} strokeWidth={1.9} aria-hidden="true" /> },
  { label: "Laki-Laki", value: 575, icon: <Mars size={58} strokeWidth={1.9} aria-hidden="true" /> },
]

const ageGroupData: AgeGroupData[] = [
  { usia: "0-4", lakiLaki: 50, perempuan: 12 },
  { usia: "5-9", lakiLaki: 61, perempuan: 46 },
  { usia: "10-14", lakiLaki: 48, perempuan: 61 },
  { usia: "15-19", lakiLaki: 18, perempuan: 61 },
  { usia: "20-24", lakiLaki: 64, perempuan: 47 },
  { usia: "25-29", lakiLaki: 48, perempuan: 50 },
  { usia: "30-34", lakiLaki: 49, perempuan: 40 },
  { usia: "35-39", lakiLaki: 40, perempuan: 40 },
  { usia: "40-44", lakiLaki: 40, perempuan: 33 },
  { usia: "45-49", lakiLaki: 37, perempuan: 38 },
  { usia: "50-54", lakiLaki: 22, perempuan: 52 },
  { usia: "55-59", lakiLaki: 22, perempuan: 15 },
  { usia: "60-64", lakiLaki: 19, perempuan: 18 },
  { usia: "65-69", lakiLaki: 9, perempuan: 4 },
  { usia: "70-74", lakiLaki: 7, perempuan: 6 },
  { usia: "75+", lakiLaki: 5, perempuan: 2 },
]

const agePyramidData = ageGroupData.map((item) => ({
  usia: item.usia,
  lakiLaki: -item.lakiLaki,
  perempuan: item.perempuan,
  lakiLakiAbs: item.lakiLaki,
}))

const dusunData: DusunData[] = [
  {
    name: "Riorita",
    population: 458,
    color: "#4066e0",
    colorName: "blue",
    polygonPoints: "210,90 340,120 460,155 620,190 545,245 365,190 250,210 200,240 170,250 170,190 200,160",
    labelX: 352,
    labelY: 174,
  },
  {
    name: "Sipatokkong",
    population: 213,
    color: "#88c070",
    colorName: "green",
    polygonPoints: "170,250 200,240 250,210 365,190 545,245 520,360 430,345 360,370 330,430 360,490 305,460 250,470 190,430 175,360 140,320 150,240",
    labelX: 310,
    labelY: 315,
  },
  {
    name: "Sipakainge",
    population: 378,
    color: "#f6c74b",
    colorName: "yellow",
    polygonPoints: "620,190 700,265 670,360 610,430 560,480 520,360 545,245",
    labelX: 615,
    labelY: 305,
  },
  {
    name: "Pakkarauew",
    population: 87,
    color: "#de595e",
    colorName: "red",
    polygonPoints: "520,360 560,480 470,500 420,470 360,490 330,430 360,370 430,345",
    labelX: 450,
    labelY: 430,
  },
]

const pendidikanData: EducationData[] = [
  { name: "Tidak Sekolah", value: 550 },
  { name: "Belum Tuntas SD", value: 450 },
  { name: "Tamat SD", value: 220 },
  { name: "SLTP Sederajat", value: 450 },
  { name: "Diploma III", value: 660 },
  { name: "Diploma IV", value: 830 },
  { name: "S1/Sarjana", value: 120 },
  { name: "Sarjana I", value: 550 },
  { name: "Sarjana II", value: 300 },
]

const pekerjaanData: JobData[] = [
  { name: "Belum Bekerja", value: 280, color: "#6378E5" },
  { name: "Mengurus Rumah Tangga", value: 250, color: "#69C68A" },
  { name: "Pelajar/Mahasiswa", value: 252, color: "#F7A945" },
  { name: "Petani/Pekebun", value: 213, color: "#1FBEE2" },
  { name: "Wiraswasta", value: 53, color: "#8E77E8" },
]

const wajibPilihData: WajibPilihData[] = [
  { year: "2024", value: 540, color: "#2f8a6b" },
  { year: "2025", value: 450, color: "#2f8a6b" },
  { year: "2029", value: 260, color: "#39b38a" },
]

const agamaData: ReligionData[] = [
  { name: "Islam", value: "1.122", icon: <MoonStar size={34} aria-hidden="true" /> },
  { name: "Kristen", value: "14", icon: <Cross size={34} aria-hidden="true" /> },
  { name: "Katolik", value: "0", icon: <Church size={34} aria-hidden="true" /> },
  { name: "Hindu", value: "0", icon: <FaOm size={34} aria-hidden="true" /> },
  { name: "Budha", value: "0", icon: <FaDharmachakra size={34} aria-hidden="true" /> },
  { name: "Konghucu", value: "0", icon: <FaToriiGate size={34} aria-hidden="true" /> },
]

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-2xl font-bold text-[#298064]">{title}</h2>
}

function CollapseItem({
  title,
  content,
  isOpen,
  onToggle,
  panelId,
}: {
  title: string
  content: string
  isOpen: boolean
  onToggle: () => void
  panelId: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-black transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#298064]"
        aria-label={title}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-gray-200 px-4 py-4 text-sm leading-relaxed text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  )
}

export default function Penduduk() {
  const [openMale, setOpenMale] = useState(false)
  const [openFemale, setOpenFemale] = useState(false)
  const [hoveredDusun, setHoveredDusun] = useState<string | null>(null)
  const [hoveredPendidikan, setHoveredPendidikan] = useState<PendidikanHoverState | null>(null)
  const [hoveredWajibPilih, setHoveredWajibPilih] = useState<PendidikanHoverState | null>(null)

  const maxPyramidValue = useMemo(() => {
    const values = ageGroupData.flatMap((item) => [item.lakiLaki, item.perempuan])
    return Math.max(...values) + 10
  }, [])

  const formatNumber = (value: number): string => new Intl.NumberFormat("id-ID").format(value)

  return (
    <>
      <Navbar />

      <section className="w-full bg-[#f2f2f2] px-4 pb-16 pt-28 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl space-y-14">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_minmax(0,1fr)] lg:gap-12">
            <div className="pr-0 lg:pr-6">
              <div className="h-[5px] w-[120px] rounded-full bg-[#298064]" aria-hidden="true" />
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[#298064] md:text-4xl">Demografi Penduduk</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#111111] md:text-base">
                Desa Puundoho, Kecamatan Pakue Utara, Kabupaten Kolaka Utara, Provinsi Sulawesi Tenggara
              </p>

              <div className="mt-8 max-w-[280px] pl-1 sm:max-w-[340px] lg:max-w-[420px] md:mt-10">
                <img
                  src="/assets/penduduk/ilust penduduk.png"
                  alt="Ilustrasi infografis demografi penduduk Desa Puundoho"
                  className="h-auto max-w-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {demografiCards.map((card) => (
                <article
                  key={card.label}
                  className="flex min-h-[150px] items-center gap-6 rounded-3xl border border-[#d1d5db] bg-[#f9f9f9] px-8 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  <span className="text-[#298064]" aria-hidden="true">
                    {card.icon}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-[#298064] md:text-base">
                      {card.label}
                    </p>
                    <p className="mt-2 text-lg font-bold leading-none md:text-xl">
                      <span className="text-[#298064]">{card.value}</span>{" "}
                      <span className="font-medium text-[#111111]">Jiwa</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Kelompok Umur" />
            <div className="mt-4 rounded-2xl border border-gray-300 bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.08)] md:p-5">
              <div className="h-[520px] w-full" role="img" aria-label="Grafik piramida penduduk berdasarkan kelompok umur">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agePyramidData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8d8d8" />
                    <XAxis
                      type="number"
                      domain={[-maxPyramidValue, maxPyramidValue]}
                      tickFormatter={(value: number) => Math.abs(value).toString()}
                      tick={{ fontSize: 11, fill: "#4b5563" }}
                    />
                    <YAxis dataKey="usia" type="category" tick={{ fontSize: 11, fill: "#4b5563" }} width={52} />
                    <Tooltip
                      formatter={(value: number | string | undefined, name: string | undefined) => [Math.abs(Number(value ?? 0)), name === "lakiLaki" ? "Laki-Laki" : "Perempuan"]}
                      labelFormatter={(label) => `Usia ${label}`}
                      contentStyle={{ fontSize: "12px" }}
                      itemStyle={{ fontSize: "12px" }}
                      labelStyle={{ fontSize: "12px" }}
                    />
                    <Legend
                      formatter={(value) => (value === "lakiLaki" ? "Laki-Laki" : "Perempuan")}
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Bar dataKey="lakiLaki" name="lakiLaki" fill="#6BB8A8" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="perempuan" name="perempuan" fill="#F2AE95" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <CollapseItem
                title="Penduduk Lak-laki"
                content="Untuk jenis kelamin laki-laki, kelompok umur 20-24 adalah kelompok umur tertinggi dengan jumlah 64 orang atau 11.13%. Sedangkan, kelompok umur 80-84 adalah yang terendah dengan jumlah 2 orang atau 0.35%."
                isOpen={openMale}
                onToggle={() => setOpenMale((prev) => !prev)}
                panelId="detail-laki-laki"
              />
              <CollapseItem
                title="Penduduk Perempuan"
                content="Untuk jenis kelamin perempuan, kelompok umur 15-19 adalah kelompok umur tertinggi dengan jumlah 61 orang atau 10.87%. Sedangkan, kelompok umur 80-84 adalah yang terendah dengan jumlah 2 orang atau 0.36%."
                isOpen={openFemale}
                onToggle={() => setOpenFemale((prev) => !prev)}
                panelId="detail-perempuan"
              />
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Dusun" />
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div
                className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                role="img"
                aria-label="Peta interaktif sebaran penduduk berdasarkan dusun"
              >
                <svg viewBox="0 0 860 560" className="h-[420px] w-full bg-[#f6f4ed]">
                  <rect x="0" y="0" width="860" height="560" fill="#f6f4ed" />

                  <g opacity="0.65">
                    <path d="M70 40 L180 95 L240 150 L305 190 L345 260 L360 335 L330 430 L250 515" stroke="#d6d3ca" strokeWidth="3" fill="none" />
                    <path d="M210 35 L250 75 L295 110 L365 135 L430 165 L505 175 L585 210 L670 265 L745 350" stroke="#d6d3ca" strokeWidth="3" fill="none" />
                    <path d="M85 265 L160 255 L245 258 L330 273 L410 302 L520 332 L650 344 L790 338" stroke="#d6d3ca" strokeWidth="3" fill="none" />
                    <path d="M150 450 L220 410 L305 392 L390 396 L470 425 L555 470 L640 505" stroke="#d6d3ca" strokeWidth="3" fill="none" />
                  </g>

                  <g opacity="0.95">
                    <path d="M30 210 C120 230, 210 250, 290 235 C365 220, 430 175, 495 205 C560 236, 605 322, 690 342 C750 357, 805 338, 845 322" stroke="#9cc3f4" strokeWidth="3" fill="none" />
                    <path d="M335 160 C315 190, 315 222, 350 244 C380 262, 430 254, 452 230" stroke="#a5cdf8" strokeWidth="2.5" fill="none" />
                    <path d="M460 250 C430 275, 424 306, 450 332 C478 355, 525 360, 570 350" stroke="#a5cdf8" strokeWidth="2.5" fill="none" />
                  </g>

                  <defs>
                    <clipPath id="puundohoBoundary">
                      <path d="M210 90 L340 120 L460 155 L620 190 L700 265 L670 360 L610 430 L560 480 L470 500 L420 470 L360 490 L305 460 L250 470 L190 430 L175 360 L140 320 L150 240 L170 190 L200 160 Z" />
                    </clipPath>
                  </defs>

                  <g clipPath="url(#puundohoBoundary)">
                    <rect x="130" y="80" width="590" height="430" fill="#f0efe8" />

                    {dusunData.map((dusun) => {
                      const isHovered = hoveredDusun === dusun.name
                      return (
                        <polygon
                          key={`zone-${dusun.name}`}
                          points={dusun.polygonPoints}
                          fill={dusun.color}
                          stroke={isHovered ? "#0f172a" : "#ffffff"}
                          strokeWidth={isHovered ? 2.6 : 1.4}
                          fillOpacity={isHovered ? 0.84 : 0.7}
                          className="cursor-pointer transition-all duration-150 focus-visible:outline-none"
                          tabIndex={0}
                          role="button"
                          aria-label={`${dusun.name} ${formatNumber(dusun.population)} penduduk`}
                          onMouseEnter={() => setHoveredDusun(dusun.name)}
                          onMouseLeave={() => setHoveredDusun(null)}
                          onFocus={() => setHoveredDusun(dusun.name)}
                          onBlur={() => setHoveredDusun(null)}
                        />
                      )
                    })}
                  </g>

                  <path d="M210 90 L340 120 L460 155 L620 190 L700 265 L670 360 L610 430 L560 480 L470 500 L420 470 L360 490 L305 460 L250 470 L190 430 L175 360 L140 320 L150 240 L170 190 L200 160 Z" fill="none" stroke="#8f8b82" strokeWidth="1.7" />

                  {dusunData.map((dusun) => {
                    const isHovered = hoveredDusun === dusun.name
                    return (
                      <g key={dusun.name}>
                        <text
                          x={dusun.labelX}
                          y={dusun.labelY}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontSize="14"
                          fontWeight="600"
                          opacity={isHovered ? 1 : 0.9}
                        >
                          {dusun.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {hoveredDusun && (
                  <div className="pointer-events-none absolute right-4 top-14 rounded-md bg-[#1f2937] px-3 py-2 text-xs text-white shadow-lg">
                    <p className="text-xs font-semibold">{hoveredDusun}</p>
                    <p>
                      {formatNumber(dusunData.find((item) => item.name === hoveredDusun)?.population ?? 0)} Penduduk
                    </p>
                  </div>
                )}
              </div>

              <aside className="rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]" aria-label="Keterangan warna dusun">
                <h3 className="text-base font-semibold text-black">Keterangan</h3>
                <ul className="mt-4 space-y-4">
                  {dusunData.map((dusun) => (
                    <li key={dusun.name} className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-sm" style={{ backgroundColor: dusun.color }} aria-hidden="true" />
                      <span className="text-sm text-gray-700">
                        {dusun.name} - {formatNumber(dusun.population)} Penduduk ({dusun.colorName})
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Pendidikan" />
            <div className="mt-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)] md:p-5">
              <div className="relative h-[360px] w-full" role="img" aria-label="Grafik jumlah penduduk berdasarkan tingkat pendidikan">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pendidikanData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                    onMouseLeave={() => setHoveredPendidikan(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8d8d8" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4b5563" }} interval={0} angle={-10} textAnchor="end" height={56} />
                    <YAxis tick={{ fontSize: 11, fill: "#4b5563" }} />
                    <Bar
                      dataKey="value"
                      fill="#2f8a6b"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={36}
                      onMouseEnter={(barData: PendidikanBarShapeData) => {
                        if (
                          typeof barData.x === "number" &&
                          typeof barData.y === "number" &&
                          typeof barData.width === "number"
                        ) {
                          const barValue = Array.isArray(barData.value) ? barData.value[1] : barData.value
                          setHoveredPendidikan({
                            value: Number(barValue ?? 0),
                            x: barData.x + barData.width / 2,
                            y: Math.max(barData.y - 10, 8),
                          })
                        }
                      }}
                      onMouseLeave={() => setHoveredPendidikan(null)}
                    />
                  </BarChart>
                </ResponsiveContainer>

                {hoveredPendidikan && (
                  <div
                    className="pointer-events-none absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
                    style={{
                      left: `${hoveredPendidikan.x}px`,
                      top: `${hoveredPendidikan.y}px`,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <p className="text-center font-semibold leading-none">{formatNumber(hoveredPendidikan.value)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Pekerjaan" />
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <table className="w-full border-collapse text-left" aria-label="Tabel jumlah penduduk berdasarkan pekerjaan">
                  <thead>
                    <tr className="bg-[#2f8a6b] text-white">
                      <th scope="col" className="px-4 py-3 text-sm font-semibold">Jenis Pekerjaan</th>
                      <th scope="col" className="px-4 py-3 text-sm font-semibold">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pekerjaanData.map((item) => (
                      <tr key={item.name} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">{item.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{formatNumber(item.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="h-[330px]" role="img" aria-label="Diagram pai distribusi pekerjaan">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value: number | string | undefined, name: string | undefined) => [formatNumber(Number(value ?? 0)), name ?? "Kategori"]}
                        contentStyle={{ fontSize: "11px" }}
                        itemStyle={{ fontSize: "11px" }}
                        labelStyle={{ fontSize: "11px" }}
                      />
                      <Pie
                        data={pekerjaanData}
                        cx="34%"
                        cy="50%"
                        outerRadius={86}
                        dataKey="value"
                        nameKey="name"
                        label={({ x, y, percent }) => (
                          <text
                            x={Number(x)}
                            y={Number(y)}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#374151"
                            fontSize={11}
                            fontWeight={500}
                          >
                            {(Number(percent ?? 0) * 100).toFixed(0)}%
                          </text>
                        )}
                        labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                      >
                        {pekerjaanData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: "11px", lineHeight: "1.45" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Wajib Pilih" />
            <div className="mt-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)] md:p-5">
              <div className="relative h-[320px]" role="img" aria-label="Grafik jumlah wajib pilih berdasarkan tahun">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={wajibPilihData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    onMouseLeave={() => setHoveredWajibPilih(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8d8d8" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#4b5563" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#4b5563" }} />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={72}
                      onMouseEnter={(barData: PendidikanBarShapeData) => {
                        if (
                          typeof barData.x === "number" &&
                          typeof barData.y === "number" &&
                          typeof barData.width === "number"
                        ) {
                          const barValue = Array.isArray(barData.value) ? barData.value[1] : barData.value
                          setHoveredWajibPilih({
                            value: Number(barValue ?? 0),
                            x: barData.x + barData.width / 2,
                            y: Math.max(barData.y - 10, 8),
                          })
                        }
                      }}
                      onMouseLeave={() => setHoveredWajibPilih(null)}
                    >
                      {wajibPilihData.map((entry) => (
                        <Cell key={entry.year} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {hoveredWajibPilih && (
                  <div
                    className="pointer-events-none absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
                    style={{
                      left: `${hoveredWajibPilih.x}px`,
                      top: `${hoveredWajibPilih.y}px`,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <p className="text-center font-semibold leading-none">{formatNumber(hoveredWajibPilih.value)} Penduduk</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <SectionTitle title="Berdasarkan Agama" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {agamaData.map((item) => (
                <article
                  key={item.name}
                  className="flex items-center gap-4 rounded-xl border border-gray-300 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <span className="text-[#2f8a6b]">{item.icon}</span>
                  <div>
                    <p className="text-sm text-[#2f8a6b]">{item.name}</p>
                    <p className="text-lg font-bold leading-tight text-[#2f8a6b] md:text-xl">{item.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
