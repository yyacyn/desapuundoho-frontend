import React, { useEffect, useMemo, useRef, useState } from "react";
// Tentang Kami
import {
  Users,
  Home,
  Briefcase,
  Mars,
  Venus,
  UserX,
  ArrowRight,
} from "lucide-react"
// APBDesa
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';

// Berita
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewsCard from "./newscard";
import GaleriItem from "./galeriitem";
import { Link, useNavigate } from "react-router-dom";
import { useGallery } from "../context/GalleryContext";
import { useNews } from "../context/NewsContext";
import { useAPBDes } from "../context/APBDesaContext";



// --------------------------------------------------------------
// Header
// --------------------------------------------------------------
export default function Header() {
  return (
    <header className="relative h-[100vh] flex items-center justify-center overflow-hidden">
      <img
        alt="Beautiful landscape of Desa Puundoho"
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/home/home-bg.png"
      />
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="relative z-10 text-center px-6">
        <p className="text-white text-lg md:text-2xl font-medium mb-2 opacity-90">
          Selamat Datang
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Website Resmi Desa Puundoho
        </h1>
      </div>
    </header>
  )
}

// --------------------------------------------------------------
// Tentang Kami
// --------------------------------------------------------------
export function TentangKami() {
  const stats = [
    { icon: Users, value: "1.136", label: "Penduduk" },
    { icon: Home, value: "349", label: "Keluarga" },
    { icon: Briefcase, value: "856", label: "Bekerja" },
    { icon: Mars, value: "140", label: "Laki-Laki" },
    { icon: Venus, value: "24", label: "Perempuan" },
    { icon: UserX, value: "280", label: "Tidak Bekerja" },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">

        <div >
          <div className="mb-8">
            <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
            <h2 className="text-3xl font-bold text-emerald-700 mb-4">
              Tentang Kami
            </h2>
            <p className="text-slate-600 leading-relaxed w-full">
              Melalui website ini Anda dapat menjelajahi segala hal yang terkait
              dengan Desa. Aspek pemerintahan, penduduk, demografi, potensi
              Desa, dan juga berita tentang Desa.
            </p>
          </div>

          <div className="bg-[#298064] rounded-xl p-6 grid grid-cols-2 lg:grid-cols-3 gap-10 text-white shadow-lg">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-emerald-900 p-3 rounded-lg">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-90">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/profil" className="mt-8 inline-flex items-center gap-3 bg-[#298064] text-white px-6 py-3 rounded-full hover:bg-emerald-800 transition-all group shadow-md">
            Lihat Selengkapnya

            <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </span>
          </Link>
        </div>

        <div className="relative">
          <img
            src="/assets/home/tentang2.jpeg"
            alt="Landscape"
            className="w-full h-140 object-cover rounded-xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  )
}


// --------------------------------------------------------------
// Sambutan
// --------------------------------------------------------------
export function Sambutan() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-white w-full flex flex-col md:flex-row gap-8 items-start relative">

        {/* Bagian Kiri: Foto dan Nama */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="border-2 border-gray-200 rounded-2xl w-full overflow-hidden shadow-sm">
            <img
              src="/assets/home/syamsir.png"
              alt="Syamsir Sabara"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="mt-4 bg-[#2D7A5F] text-white w-full py-3 rounded-xl text-center font-bold text-xl tracking-wide shadow-md">
            Syamsir Sabara
          </div>
        </div>

        {/* Bagian Kanan: Konten Teks */}
        <div className="w-full md:w-2/3 flex flex-col h-full self-stretch">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-[#2D7A5F]"></div>
            <span className="text-gray-700 font-medium text-sm md:text-base">
              Sambutan Kepala Desa Puundoho
            </span>
          </div>

          <h1 className="text-[#2D7A5F] text-2xl md:text-4xl font-bold leading-tight mb-6">
            Assalamu'alaikum<br />
            Warahmatullahi Wabarakatuh
          </h1>

          <div className="relative grow flex items-start gap-4">
            <div className="grow">
              <p className="text-gray-700 font-medium mb-4">
                Selamat datang di Website resmi Desa Puundoho
              </p>

              <div className="max-h-40 overflow-y-auto pr-4 custom-scrollbar">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                  Semoga memudahkan pengunjung untuk mencari informasi terkait desa Kami,
                  selain itu kami sementara berbenah untuk transformasi digital untuk desa mulai
                  dari pelayanan, pengelolaan administrasi dan keterbukaan informasi untuk
                  warga Kami. Semoga memudahkan pengunjung untuk mencari informasi terkait
                  desa Kami, selain itu kami sementara berbenah.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Kami berkomitmen untuk terus meningkatkan kualitas layanan publik melalui integrasi
                  teknologi informasi yang tepat sasaran demi kesejahteraan seluruh masyarakat Puundoho.
                </p>
              </div>

              <p className="mt-6 text-gray-800 font-medium italic">
                Terima kasih atas dukungan semua pihak
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2D7A5F;
          border-radius: 10px;
        }
      `}</style>
    </section>
  )
}


// --------------------------------------------------------------
// APBDesa
// --------------------------------------------------------------
export function APBDesa() {
  const { apbdList, pendapatanData, pengeluaranData, selectedYear, setSelectedYear, loading } = useAPBDes();

  const currentYear = new Date().getFullYear();

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Hanya jalankan jika ini mount pertama dan list sudah tersedia
    if (isInitialMount.current && apbdList.length > 0) {
      const currentAPBD = apbdList.find(a => a.tahun === currentYear);
      if (currentAPBD) {
        setSelectedYear(currentAPBD.id);
        isInitialMount.current = false; // Kunci agar tidak terpanggil lagi
      }
    }
  }, [apbdList, setSelectedYear, currentYear]);

  // Hitung Total Pendapatan & Belanja secara real-time dari data context
  const totalPendapatan = useMemo(() =>
    pendapatanData.reduce((acc, curr) => acc + curr.jumlah, 0),
    [pendapatanData]);

  const totalBelanja = useMemo(() =>
    pengeluaranData.reduce((acc, curr) => acc + curr.jumlah, 0),
    [pengeluaranData]);

  const selectedApbd = useMemo(() => {
    return apbdList.find(a => a.id === selectedYear) || null;
  }, [apbdList, selectedYear]);

  const selectedYearLabel = selectedApbd ? selectedApbd.tahun : currentYear;

  // Data untuk grafik tahunan dari apbdList
  const chartData = useMemo(() => {
    return [...apbdList]
      .sort((a, b) => a.tahun - b.tahun)
      .map((item) => ({
        tahun: String(item.tahun),
        pendapatan: Number(item.total_pendapatan || 0),
        belanja: Number(item.total_pengeluaran || 0),
      }));
  }, [apbdList]);

  // Fungsi helper format rupiah
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  // Formatter untuk YAxis ticks agar tidak terlalu panjang
  const formatYAxis = (tick: number) => {
    if (tick >= 1_000_000_000) {
      return `Rp ${(tick / 1_000_000_000).toFixed(1)} M`;
    }
    if (tick >= 1_000_000) {
      return `Rp ${(tick / 1_000_000).toFixed(0)} Jt`;
    }
    return `Rp ${tick.toLocaleString('id-ID')}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row gap-12 items-center">

        {/* Sisi Kiri: Informasi Keuangan */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
            <h1 className="text-[#2D7A5F] text-4xl font-bold">APB DESA {selectedYearLabel}</h1>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Akses cepat dan transparan terhadap APB Desa serta proyek pembangunan
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Card Pendapatan */}
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
              <p className="text-gray-700 font-medium mb-2">Pendapatan Desa</p>
              <h2 className="text-[#2D7A5F] text-3xl md:text-4xl font-bold">
                {loading ? "Memuat..." : formatRupiah(totalPendapatan)}
              </h2>
            </div>

            {/* Card Belanja */}
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
              <p className="text-gray-700 font-medium mb-2">Belanja Desa</p>
              <h2 className="text-[#2D7A5F] text-3xl md:text-4xl font-bold">
                {loading ? "Memuat..." : formatRupiah(totalBelanja)}
              </h2>
            </div>
          </div>

          <Link to="/infografis/apbdesa" className="inline-flex items-center gap-3 bg-[#2D7A5F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#235d49] transition-colors group">
            Lihat Selengkapnya
            <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>

        {/* Sisi Ranan: Grafik Interaktif */}
        <div className="w-full lg:w-1/2 h-100 bg-white relative">

          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ outline: 'none' }}
          >
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 35, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis
                dataKey="tahun"
                axisLine={{ stroke: '#999' }}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={{ stroke: '#999' }}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                width={85}
              >
                <Label
                  value="Nilai Anggaran"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  offset={10}
                />
              </YAxis>
              <Tooltip
                formatter={(value: any, name: string) => [formatRupiah(Number(value)), name === 'pendapatan' ? 'Pendapatan' : 'Belanja']}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{ stroke: '#2D7A5F', strokeWidth: 1 }}
                position={{ x: 0, y: 0 }}
              />
              <Legend align="center" verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="pendapatan"
                name="Pendapatan"
                stroke="#2D7A5F"
                strokeWidth={3}
                dot={{ r: 5, fill: '#2D7A5F', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="belanja"
                name="Belanja"
                stroke="#EAB308"
                strokeWidth={3}
                dot={{ r: 5, fill: '#EAB308', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}


// --------------------------------------------------------------
// Berita
// --------------------------------------------------------------
export const BeritaSection = () => {
  const { articles, loading } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  if (loading) return <div className="text-white text-center py-10">Memuat Berita...</div>;

  if (articles.length === 0) return null;

  // Tentukan berapa banyak gambar yang mau tampil (misal: 3)
  const itemsPerPage = 3;

  // Fungsi Navigasi
  const nextSlide = () => {
    if (currentIndex + itemsPerPage < articles.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);;
    } else {
      setCurrentIndex(0); // Ke halaman pertama jika mundur melampaui 0
    }
  };

  const handlePostClick = (post: { id: number | string;[key: string]: unknown }) => {
    navigate(`/detail-berita/${post.id}`, { state: { post } });
  };


  // Ambil 3 berita terbaru untuk di Home
  const latestNews = articles.slice(currentIndex, currentIndex + itemsPerPage);


  return (
    <section className="relative w-full">

      {/* Background Hijau */}
      <div className="bg-[#2D7A5F] pt-20 pb-40 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div className="space-y-4">
              <div className="w-16 h-1 bg-[#1a4d3c]" />
              <h2 className="text-white text-5xl font-bold">Berita</h2>

              <div className="flex gap-3">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  // className={`p-2 rounded-full transition-colors ${currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-[#2D7A5F] text-white hover:bg-[#235d49]'}`}
                  className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition shadow-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex + itemsPerPage >= articles.length}
                  // className={`p-2 rounded-full transition-colors ${currentIndex + itemsPerPage >= articles.length ? 'bg-gray-200 text-gray-400' : 'bg-[#2D7A5F] text-white hover:bg-[#235d49]'}`}
                  className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition shadow-md"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <p className="text-white/90 max-w-md leading-relaxed">
              Temukan berita di desa Puundoho untuk Anda yang ingin mengetahui informasi terbaru seputar desa, mulai dari kegiatan, pengumuman, hingga informasi penting lainnya.
            </p>

          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 -mt-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item) => (
            <a
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                handlePostClick(item);
              }}
            >
              <NewsCard
                key={item.id}
                id={item.id}
                category={item.category || "Berita"}
                title={item.title}
                date={(item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : "-")}
                imageUrl={item.cover_image || "/assets/home/berita.jpg"}
              />
            </a>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12 pb-16">
          <Link to="/berita" className="inline-flex items-center gap-3 bg-[#2D7A5F] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group">
            Lihat Selengkapnya
            <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={20} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};



// --------------------------------------------------------------
// Galeri
// --------------------------------------------------------------
export const GaleriSection = () => {
  const { items, loading } = useGallery();
  // State untuk melacak index gambar pertama yang tampil
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) return <div className="py-20 text-center">Memuat...</div>;
  if (items.length === 0) return null;

  // Tentukan berapa banyak gambar yang mau tampil (misal: 3)
  const itemsPerPage = 6;

  // Fungsi Navigasi
  const nextSlide = () => {
    if (currentIndex + itemsPerPage < items.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);;
    } else {
      setCurrentIndex(0); // Ke halaman pertama jika mundur melampaui 0
    }
  };

  // Ambil potongan data berdasarkan currentIndex
  const displayItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="bg-white py-16 px-6 md:px-20 max-w-7xl mx-auto">
      {/* Header Galeri */}
      <div className="flex flex-col items-center mb-12 relative">
        <div className="w-16 h-1 bg-[#2D7A5F] mb-4"></div>
        <h2 className="text-[#2D7A5F] text-4xl font-bold">Galeri</h2>

        {/* Tombol Navigasi (Kanan Atas) */}
        <div className="hidden md:flex gap-3 absolute right-0 top-1/2 -translate-y-1/2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition-colors ${currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-[#2D7A5F] text-white hover:bg-[#235d49]'}`}>
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + itemsPerPage >= items.length}
            className={`p-2 rounded-full transition-colors ${currentIndex + itemsPerPage >= items.length ? 'bg-gray-200 text-gray-400' : 'bg-[#2D7A5F] text-white hover:bg-[#235d49]'}`}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Grid Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item, index) => (
          <GaleriItem
            key={item.id ?? index}
            imageUrl={item.imageUrl || (item.images && item.images[0]) || ""}
            caption={item.caption || ""}
            altText={"Galeri"} />
        ))}
      </div>

      {/* Navigasi Mobile (Muncul hanya di layar kecil) */}
      <div className="flex justify-center gap-4 mt-8 md:hidden">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="p-3 bg-[#2D7A5F] text-white rounded-full active:bg-[#235d49]">
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex + itemsPerPage >= items.length}
          className="p-3 bg-[#2D7A5F] text-white rounded-full active:bg-[#235d49]"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};


