import React from "react";
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
} from 'recharts';

// Berita
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewsCard from "./newscard";
import GaleriItem from "./galeriitem";
import { Link } from "react-router-dom";

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

          <Link to="/profil" className="mt-8 flex items-center gap-3 bg-[#298064] text-white px-6 py-3 rounded-full hover:bg-emerald-800 transition-all group shadow-md">
            Lihat Selengkapnya

            <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </span>
          </Link>
        </div>

        <div className="relative">
          <img
            src="/assets/home/tentang.png"
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
  // Data untuk grafik interaktif
  const data = [
    { hari: 'Senin', pengunjung: 80 },
    { hari: 'Selasa', pengunjung: 100 },
    { hari: 'Rabu', pengunjung: 90 },
    { hari: 'Kamis', pengunjung: 110 },
    { hari: 'Jumat', pengunjung: 122 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* Sisi Kiri: Informasi Keuangan */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
            <h1 className="text-[#2D7A5F] text-4xl font-bold">APB DESA 2026</h1>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Akses cepat dan transparan terhadap APB Desa serta proyek pembangunan
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Card Pendapatan */}
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
              <p className="text-gray-700 font-medium mb-2">Pendapatan Desa</p>
              <h2 className="text-[#2D7A5F] text-3xl md:text-4xl font-bold">
                Rp569.000.000,00
              </h2>
            </div>

            {/* Card Belanja */}
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
              <p className="text-gray-700 font-medium mb-2">Belanja Desa</p>
              <h2 className="text-[#2D7A5F] text-3xl md:text-4xl font-bold">
                Rp569.000.000,00
              </h2>
            </div>
          </div>

          <Link to="/infografis/apbdesa" className="flex items-center gap-3 bg-[#2D7A5F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#235d49] transition-colors group">
            Lihat Selengkapnya
            <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>

        {/* Sisi Kanan: Grafik Interaktif */}
        <div className="w-full lg:w-1/2 h-100 bg-white relative mt-15">
          <div className="absolute left-0 top-1/2 -rotate-90 origin-left text-xs font-medium text-gray-500 -translate-y-12">
            Jumlah Pengunjung
          </div>

          <ResponsiveContainer 
            width="100%" 
            height="100%"
            style={{ outline: 'none' }}
          >
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis
                dataKey="hari"
                axisLine={{ stroke: '#999' }}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                label={{ value: 'Hari', position: 'insideBottom', offset: -10, fontSize: 12 }}
              />
              <YAxis
                domain={[70, 130]}
                axisLine={{ stroke: '#999' }}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#EAB308', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="pengunjung"
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
  const newsData = [
    {
      id: 1,
      category: "Category",
      title: "Lowongan Kerja di PT Kodehana cabang kota Bogor",
      date: "22 Februari 2026",
      imageUrl: "https://via.placeholder.com/400x300?text=Stay+Healthy",
    },
    {
      id: 2,
      category: "Category",
      title: "Lowongan Kerja di PT Kodehana cabang kota Bogor",
      date: "22 Februari 2026",
      imageUrl: "https://via.placeholder.com/400x300?text=Stay+Healthy",
    },
    {
      id: 3,
      category: "Category",
      title: "Lowongan Kerja di PT Kodehana cabang kota Bogor",
      date: "22 Februari 2026",
      imageUrl: "https://via.placeholder.com/400x300?text=Stay+Healthy",
    },
  ];

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
                <button className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition shadow-md">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition shadow-md">
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
          {newsData.map((item) => (
            <NewsCard
              key={item.id}
              category={item.category}
              title={item.title}
              date={item.date}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12 pb-16">
          <Link to="/berita" className="flex items-center gap-3 bg-[#2D7A5F] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group">
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
  // Data dummy foto galeri
  const photos = [
    { id: 1, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 1" },
    { id: 2, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 2" },
    { id: 3, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 3" },
    { id: 4, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 4" },
    { id: 5, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 5" },
    { id: 6, src: "/assets/home/tentang.png", alt: "Gedung Serbaguna 6" },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-20 max-w-7xl mx-auto">
      {/* Header Galeri */}
      <div className="flex flex-col items-center mb-12 relative">
        <div className="w-16 h-1 bg-[#2D7A5F] mb-4"></div>
        <h2 className="text-[#2D7A5F] text-4xl font-bold">Galeri</h2>
        
        {/* Tombol Navigasi (Kanan Atas) */}
        <div className="hidden md:flex gap-3 absolute right-0 top-1/2 -translate-y-1/2">
          <button className="p-2 bg-[#2D7A5F] text-white rounded-full hover:bg-[#235d49] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button className="p-2 bg-[#2D7A5F] text-white rounded-full hover:bg-[#235d49] transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Grid Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <GaleriItem 
            key={photo.id}
            imageUrl={photo.src}
            altText={photo.alt} caption={undefined} />
        ))}
      </div>

      {/* Navigasi Mobile (Muncul hanya di layar kecil) */}
      <div className="flex justify-center gap-4 mt-8 md:hidden">
        <button className="p-3 bg-[#2D7A5F] text-white rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button className="p-3 bg-[#2D7A5F] text-white rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};


