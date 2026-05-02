import { useEffect, useMemo, useState, type ReactNode } from "react"
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
import { apiFetch } from "../api"

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

interface PendudukRecord {
    id?: number
    nik?: string
    no_kk?: string
    nama?: string
    jenis_kelamin?: string
    status_kawin?: string
    tempat_lahir?: string
    tanggal_lahir?: string
    agama?: string
    pend_terakhir?: string
    pekerjaan?: string
    alamat?: string
}

interface DatasetInfo {
    id: number
    tahun?: number
}

const AGE_BUCKETS = [
    "0-4",
    "5-9",
    "10-14",
    "15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65-69",
    "70-74",
    "75+",
]

const EDUCATION_BUCKETS = [
    "Belum/Tidak Sekolah",
    "SD Sederajat",
    "SMP Sederajat",
    "SMA Sederajat",
    "D3",
    "D4",
    "S1",
    "Lainnya",
    "Tidak Diketahui",
]

const JOB_BUCKETS = [
    "Belum/Tidak Bekerja",
    "IRT",
    "Pelajar/Mahasiswa",
    "Petani",
    "Wiraswasta",
    "ASN/TNI/POLRI",
    "Perangkat Desa",
    "Pensiunan",
    "Tukang",
    "Sopir",
    "Honorer",
    "Karyawan",
    "Lainnya",
]

const RELIGION_BUCKETS = ["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Konghucu", "Tidak Diketahui"]

const DUSUN_TEMPLATE: DusunData[] = [
    {
        name: "Riorita",
        population: 0,
        color: "#4066e0",
        colorName: "blue",
        polygonPoints: "210,90 340,120 460,155 620,190 545,245 365,190 250,210 200,240 170,250 170,190 200,160",
        labelX: 352,
        labelY: 174,
    },
    {
        name: "Sipatokkong",
        population: 0,
        color: "#88c070",
        colorName: "green",
        polygonPoints: "170,250 200,240 250,210 365,190 545,245 520,360 430,345 360,370 330,430 360,490 305,460 250,470 190,430 175,360 140,320 150,240",
        labelX: 310,
        labelY: 315,
    },
    {
        name: "Sipakainge",
        population: 0,
        color: "#f6c74b",
        colorName: "yellow",
        polygonPoints: "620,190 700,265 670,360 610,430 560,480 520,360 545,245",
        labelX: 615,
        labelY: 305,
    },
    {
        name: "Pakkarauew",
        population: 0,
        color: "#de595e",
        colorName: "red",
        polygonPoints: "520,360 560,480 470,500 420,470 360,490 330,430 360,370 430,345",
        labelX: 450,
        labelY: 430,
    },
]

function normalizeText(value: unknown): string {
    return String(value ?? "").trim().toLowerCase()
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("id-ID").format(value)
}

function normalizeGender(value: unknown): "Laki-Laki" | "Perempuan" | "Tidak Diketahui" {
    const normalized = normalizeText(value)
    if (normalized.startsWith("l")) return "Laki-Laki"
    if (normalized.startsWith("p")) return "Perempuan"
    return "Tidak Diketahui"
}

function normalizeReligion(value: unknown): string {
    const normalized = normalizeText(value)
    if (normalized.includes("islam") || normalized.includes("jslam")) return "Islam"
    if (normalized.includes("kristen")) return "Kristen"
    if (normalized.includes("katolik")) return "Katolik"
    if (normalized.includes("hindu")) return "Hindu"
    if (normalized.includes("budha") || normalized.includes("buddha")) return "Budha"
    if (normalized.includes("konghucu")) return "Konghucu"
    return "Tidak Diketahui"
}

function normalizeEducation(value: unknown): string {
    const normalized = normalizeText(value)
    if (!normalized) return "Tidak Diketahui"
    if (normalized.includes("belum") || normalized.includes("tidak sekolah")) return "Belum/Tidak Sekolah"
    if (normalized.includes("tamat sd") || (normalized.includes("sd") && !normalized.includes("smp") && !normalized.includes("sma"))) return "SD Sederajat"
    if (normalized.includes("sltp") || normalized.includes("smp")) return "SMP Sederajat"
    if (normalized.includes("slta") || normalized.includes("sma")) return "SMA Sederajat"
    if (normalized.includes("diploma iii") || normalized.includes("d3")) return "D3"
    if (normalized.includes("diploma iv") || normalized.includes("d4")) return "D4"
    if (normalized.includes("strata") || normalized.includes("sarjana") || normalized.includes("s1")) return "S1"
    return "Lainnya"
}

function normalizeJob(value: unknown): string {
    const normalized = normalizeText(value)
    if (!normalized) return "Lainnya"
    if (
        normalized.includes("blm") ||
        normalized.includes("tdk") ||
        normalized.includes("tidak") ||
        normalized.includes("belum") ||
        normalized.includes("kerja")
    ) {
        return "Belum/Tidak Bekerja"
    }
    if (normalized.includes("irt") || normalized.includes("rumah tangga")) return "IRT"
    if (normalized.includes("pelaj") || normalized.includes("mahasiswa") || normalized.includes("mahasiswi")) return "Pelajar/Mahasiswa"
    if (normalized.includes("tani") || normalized.includes("pekebun")) return "Petani"
    if (normalized.includes("wasta") || normalized.includes("wiras")) return "Wiraswasta"
    if (normalized.includes("pns") || normalized.includes("p3k") || normalized.includes("abri") || normalized.includes("polri") || normalized.includes("asn")) return "ASN/TNI/POLRI"
    if (normalized.includes("desa")) return "Perangkat Desa"
    if (normalized.includes("pensiun")) return "Pensiunan"
    if (normalized.includes("tukang")) return "Tukang"
    if (normalized.includes("sopir") || normalized.includes("supir")) return "Sopir"
    if (normalized.includes("honorer")) return "Honorer"
    if (normalized.includes("karyawan")) return "Karyawan"
    return "Lainnya"
}

function parseBirthDate(value: unknown): Date | null {
    const text = String(value ?? "").trim()
    if (!text) return null

    const parsed = new Date(text)
    if (!Number.isNaN(parsed.getTime())) return parsed

    const normalized = text.includes("T") ? text.split("T")[0] : text
    const fallback = new Date(normalized)
    return Number.isNaN(fallback.getTime()) ? null : fallback
}

function calculateAgeAtYear(tanggalLahir: unknown, year: number): number | null {
    const birthDate = parseBirthDate(tanggalLahir)
    if (!birthDate) return null

    const age = year - birthDate.getFullYear()
    return age >= 0 ? age : null
}

function getAgeBucket(age: number): string {
    if (age <= 4) return "0-4"
    if (age <= 9) return "5-9"
    if (age <= 14) return "10-14"
    if (age <= 19) return "15-19"
    if (age <= 24) return "20-24"
    if (age <= 29) return "25-29"
    if (age <= 34) return "30-34"
    if (age <= 39) return "35-39"
    if (age <= 44) return "40-44"
    if (age <= 49) return "45-49"
    if (age <= 54) return "50-54"
    if (age <= 59) return "55-59"
    if (age <= 64) return "60-64"
    if (age <= 69) return "65-69"
    if (age <= 74) return "70-74"
    return "75+"
}

function normalizeDusun(value: unknown): string {
    const normalized = normalizeText(value)
    if (!normalized) return "Lainnya"

    if (normalized.includes("riorita") || /\bdusun\s*1\b/.test(normalized)) return "Riorita"
    if (normalized.includes("sipatokkong") || /\bdusun\s*2\b/.test(normalized)) return "Sipatokkong"
    if (normalized.includes("sipakainge") || /\bdusun\s*3\b/.test(normalized)) return "Sipakainge"
    if (normalized.includes("pakkarauew") || /\bdusun\s*[45]\b/.test(normalized)) return "Pakkarauew"

    return "Lainnya"
}

function getBucketCount(records: PendudukRecord[], selector: (record: PendudukRecord) => string, buckets: string[]): { name: string; value: number }[] {
    const counts = buckets.reduce<Record<string, number>>((acc, bucket) => {
        acc[bucket] = 0
        return acc
    }, {})

    records.forEach((record) => {
        const key = selector(record)
        if (key in counts) {
            counts[key] += 1
            return
        }

        if ("Lainnya" in counts) {
            counts.Lainnya += 1
            return
        }

        if ("Tidak Diketahui" in counts) {
            counts["Tidak Diketahui"] += 1
        }
    })

    return buckets.map((bucket) => ({ name: bucket, value: counts[bucket] || 0 }))
}

function getAgeSummary(data: AgeGroupData[], key: keyof Pick<AgeGroupData, "lakiLaki" | "perempuan">): string {
    const totals = data.map((item) => ({ usia: item.usia, value: item[key] }))
    if (totals.length === 0) return "Belum ada data umur yang tersedia."

    const total = totals.reduce((sum, item) => sum + item.value, 0)
    const highest = [...totals].sort((a, b) => b.value - a.value)[0]
    const lowest = [...totals].sort((a, b) => a.value - b.value)[0]

    return `Kelompok umur tertinggi adalah ${highest.usia} dengan ${formatNumber(highest.value)} orang (${total > 0 ? ((highest.value / total) * 100).toFixed(2) : "0.00"}%). Kelompok umur terendah adalah ${lowest.usia} dengan ${formatNumber(lowest.value)} orang (${total > 0 ? ((lowest.value / total) * 100).toFixed(2) : "0.00"}%).`
}

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
    const [records, setRecords] = useState<PendudukRecord[]>([])
    const [datasetYear, setDatasetYear] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const fetchPenduduk = async () => {
            setLoading(true)
            setErrorMessage("")

            try {
                const datasetRes = await apiFetch("/penduduk/datasets")
                if (!datasetRes.ok) {
                    throw new Error("Gagal memuat daftar dataset penduduk")
                }

                const datasetsJson = await datasetRes.json()
                const datasets: DatasetInfo[] = Array.isArray(datasetsJson)
                    ? datasetsJson
                    : Array.isArray(datasetsJson?.datasets)
                        ? datasetsJson.datasets
                        : []

                if (datasets.length === 0) {
                    setRecords([])
                    return
                }

                const latestDataset = [...datasets].sort((a, b) => Number(b.tahun || 0) - Number(a.tahun || 0))[0]
                setDatasetYear(Number(latestDataset.tahun || 0) || null)

                const recordsRes = await apiFetch(`/penduduk/datasets/${latestDataset.id}/records`)
                if (!recordsRes.ok) {
                    throw new Error("Gagal memuat data penduduk")
                }

                const recordsJson = await recordsRes.json()
                setRecords(Array.isArray(recordsJson?.penduduk) ? recordsJson.penduduk : [])
            } catch (error) {
                setRecords([])
                setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data penduduk")
            } finally {
                setLoading(false)
            }
        }

        fetchPenduduk()
    }, [])

    const ageGroupData = useMemo<AgeGroupData[]>(() => {
        const buckets = AGE_BUCKETS.map((usia) => ({ usia, lakiLaki: 0, perempuan: 0 }))

        records.forEach((record) => {
            const age = calculateAgeAtYear(record.tanggal_lahir, new Date().getFullYear())
            if (age === null) return

            const bucket = getAgeBucket(age)
            const target = buckets.find((item) => item.usia === bucket)
            if (!target) return

            const gender = normalizeGender(record.jenis_kelamin)
            if (gender === "Laki-Laki") {
                target.lakiLaki += 1
            } else if (gender === "Perempuan") {
                target.perempuan += 1
            }
        })

        return buckets
    }, [records])

    const agePyramidData = useMemo(
        () =>
            ageGroupData.map((item) => ({
                usia: item.usia,
                lakiLaki: -item.lakiLaki,
                perempuan: item.perempuan,
                lakiLakiAbs: item.lakiLaki,
            })),
        [ageGroupData]
    )

    const demografiCards = useMemo<DemografiCard[]>(() => {
        const totalPenduduk = records.length
        const uniqueFamilyHeads = new Set(records.map((record) => normalizeText(record.no_kk || record.nik || record.id))).size
        const perempuan = records.filter((record) => normalizeGender(record.jenis_kelamin) === "Perempuan").length
        const lakiLaki = records.filter((record) => normalizeGender(record.jenis_kelamin) === "Laki-Laki").length

        return [
            { label: "Total Penduduk", value: totalPenduduk, icon: <Users size={58} strokeWidth={1.9} aria-hidden="true" /> },
            { label: "Kepala Keluarga", value: uniqueFamilyHeads, icon: <Home size={58} strokeWidth={1.9} aria-hidden="true" /> },
            { label: "Perempuan", value: perempuan, icon: <Venus size={58} strokeWidth={1.9} aria-hidden="true" /> },
            { label: "Laki-Laki", value: lakiLaki, icon: <Mars size={58} strokeWidth={1.9} aria-hidden="true" /> },
        ]
    }, [records])

    const dusunData = useMemo<DusunData[]>(() => {
        const counts: Record<string, number> = {
            Riorita: 0,
            Sipatokkong: 0,
            Sipakainge: 0,
            Pakkarauew: 0,
        }

        records.forEach((record) => {
            const dusun = normalizeDusun(record.alamat)
            if (dusun in counts) {
                counts[dusun] += 1
            }
        })

        return DUSUN_TEMPLATE.map((dusun) => ({
            ...dusun,
            population: counts[dusun.name] || 0,
        }))
    }, [records])

    const pendidikanData = useMemo<EducationData[]>(() => getBucketCount(records, (record) => normalizeEducation(record.pend_terakhir), EDUCATION_BUCKETS), [records])

    const pekerjaanData = useMemo<JobData[]>(
        () =>
            getBucketCount(records, (record) => normalizeJob(record.pekerjaan), JOB_BUCKETS).map((item, index) => ({
                name: item.name,
                value: item.value,
                color: ["#6378E5", "#69C68A", "#F7A945", "#1FBEE2", "#8E77E8", "#D97706", "#14B8A6", "#EF4444", "#6B7280", "#84CC16", "#F97316", "#0EA5E9", "#A855F7"][index % 13],
            })),
        [records]
    )

    const agamaData = useMemo<ReligionData[]>(
        () =>
            getBucketCount(records, (record) => normalizeReligion(record.agama), RELIGION_BUCKETS).map((item) => ({
                name: item.name,
                value: formatNumber(item.value),
                icon:
                    item.name === "Islam" ? <MoonStar size={34} aria-hidden="true" /> :
                        item.name === "Kristen" ? <Cross size={34} aria-hidden="true" /> :
                            item.name === "Katolik" ? <Church size={34} aria-hidden="true" /> :
                                item.name === "Hindu" ? <FaOm size={34} aria-hidden="true" /> :
                                    item.name === "Budha" ? <FaDharmachakra size={34} aria-hidden="true" /> :
                                        item.name === "Konghucu" ? <FaToriiGate size={34} aria-hidden="true" /> :
                                            <Users size={34} aria-hidden="true" />,
            })),
        [records]
    )

    const wajibPilihData = useMemo<WajibPilihData[]>(() => {
        const currentYear = new Date().getFullYear()
        const forecastYears = [currentYear, currentYear + 1, currentYear + 5]

        return forecastYears.map((year, index) => ({
            year: String(year),
            value: records.filter((record) => {
                const age = calculateAgeAtYear(record.tanggal_lahir, year)
                return age !== null && age >= 17
            }).length,
            color: index === forecastYears.length - 1 ? "#39b38a" : "#2f8a6b",
        }))
    }, [records])

    const maxPyramidValue = useMemo(() => {
        const values = ageGroupData.flatMap((item) => [item.lakiLaki, item.perempuan])
        const maxValue = values.length > 0 ? Math.max(...values) : 0
        return maxValue + 10
    }, [ageGroupData])

    const maleSummary = useMemo(() => getAgeSummary(ageGroupData, "lakiLaki"), [ageGroupData])
    const femaleSummary = useMemo(() => getAgeSummary(ageGroupData, "perempuan"), [ageGroupData])

    return (
        <>
            <Navbar />

            <section className="w-full bg-[#f2f2f2] px-4 pb-16 pt-28 md:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-7xl space-y-14">
                    {errorMessage && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_minmax(0,1fr)] lg:gap-12">
                        <div className="pr-0 lg:pr-6">
                            <div className="h-[5px] w-[120px] rounded-full bg-[#298064]" aria-hidden="true" />
                            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#298064] md:text-4xl">Demografi Penduduk</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#111111] md:text-base">
                                Desa Puundoho, Kecamatan Pakue Utara, Kabupaten Kolaka Utara, Provinsi Sulawesi Tenggara
                            </p>
                            <p className="mt-2 text-sm text-[#4b5563]">
                                {loading ? "Memuat dataset penduduk terbaru..." : datasetYear ? `Dataset tahun ${datasetYear}` : "Dataset tidak tersedia"}
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
                                        <p className="text-sm font-medium text-[#298064] md:text-base">{card.label}</p>
                                        <p className="mt-2 text-lg font-bold leading-none md:text-xl">
                                            <span className="text-[#298064]">{formatNumber(card.value)}</span>{" "}
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
                                title="Penduduk Laki-laki"
                                content={maleSummary}
                                isOpen={openMale}
                                onToggle={() => setOpenMale((prev) => !prev)}
                                panelId="detail-laki-laki"
                            />
                            <CollapseItem
                                title="Penduduk Perempuan"
                                content={femaleSummary}
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
                                        <p>{formatNumber(dusunData.find((item) => item.name === hoveredDusun)?.population ?? 0)} Penduduk</p>
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
                                                if (typeof barData.x === "number" && typeof barData.y === "number" && typeof barData.width === "number") {
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
                                                cx="40%"
                                                cy="50%"
                                                outerRadius={100}
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
                                                if (typeof barData.x === "number" && typeof barData.y === "number" && typeof barData.width === "number") {
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