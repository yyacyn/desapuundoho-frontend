import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { LayoutGrid, ChevronDown } from "lucide-react";

// Data dummy untuk berita
const dummyPosts = [
  {
    id: 1,
    category: "Kegiatan Desa",
    title: "Gotong Royong Membersihkan Lingkungan Desa Puundoho",
    date: "27 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 2,
    category: "Pengumuman",
    title: "Pembagian Bantuan Sosial Tahap 1 Tahun 2026",
    date: "25 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 3,
    category: "Kegiatan Desa",
    title: "Musyawarah Perencanaan Pembangunan Desa",
    date: "23 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 4,
    category: "Berita",
    title: "Pelatihan UMKM untuk Ibu-Ibu PKK",
    date: "20 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 5,
    category: "Kegiatan Desa",
    title: "Peringatan Hari Kemerdekaan RI ke-81",
    date: "17 Agustus 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 6,
    category: "Pengumuman",
    title: "Jadwal Posyandu Bulan Maret 2026",
    date: "15 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 7,
    category: "Berita",
    title: "Panen Raya Padi Bersama Kelompok Tani",
    date: "10 Juli 2026",
    image: "./assets/home/berita.jpg",
    link: "#",
  },
];

export default function Berita() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredPosts = dummyPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  // Section Popular
  const mainPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1, 5);

  // Section New Release (mulai dari post ke-6 biar ga double)
  const newReleasePosts = filteredPosts.slice(5, 5 + visibleCount);

  return (
    <>
    <Navbar />
    <section className="w-full bg-gray-50 md:pt-30 pt-15">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">
          Berita
        </h1>

        {/* Breadcrumb */}
        <p className="mt-2 text-sm md:text-base text-black">
          <RouterLink to="/" className="text-gray-700 hover:text-[#298064]">
            Home
          </RouterLink>{" "}
          /{" "}
          <span className="text-[#298064] font-medium">Berita</span>
        </p>
      </div>
      {/* Bottom shadow-[0_0_15px_rgba(0,0,0,0.1)] */}
      <div className="h-6 md:h-12 bg-[#298064] mt-5" />
    </section>

    <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto">
    {/* Search */}
    <div className="relative mb-10">
        <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)]  py-3 pl-4 pr-10 text-gray-700"
        />
        <Search className="absolute right-3 top-3.5 text-gray-400" size={20} />
    </div>

    {/* Popular */}
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#298064]">Popular</h2>
        <button className="flex items-center gap-3 bg-[#F1F3F4] px-4 py-2 rounded-2xl text-[#5F6368] font-medium transition-all hover:bg-gray-200">
          <LayoutGrid size={20} />
              <span className="text-base">Kategori</span>
          <ChevronDown size={18} className="ml-1" />
        </button>
    </div>

    <div className="grid md:grid-cols-3 gap-6">

        {/* Main Popular */}
        {mainPost && (
        <a
            href={mainPost.link}
            className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden md:col-span-1"
        >
            <img
            src={mainPost.image}
            alt={mainPost.title}
            className="w-full h-80 object-cover"
            />

            <div className="p-4">
            <p className="text-xs text-gray-500 mb-1">Category</p>

            <h3 className="text-2xl font-bold text-[#298064] leading-snug">
                {mainPost.title}
            </h3>

            <p className="text-xs text-gray-400 text-end mt-20">{mainPost.date}</p>
            </div>
        </a>
        )}

        {/* Side Popular */}
        <div className="md:col-span-2 grid gap-4">
        {sidePosts.map((post) => (
            <a
            key={post.id}
            href={post.link}
            className="flex gap-4 shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-3 hover:shadow-md transition w-full"
            >
            <img
                src={post.image}
                alt={post.title}
                className="w-28 h-23 rounded-lg object-cover flex-shrink-0"
            />

            <div>
                <p className="text-xs text-gray-500 pt-1">Category</p>

                <h4 className="text-lg font-semibold text-[#298064] leading-snug line-clamp-2">
                {post.title}
                </h4>

                <p className="text-xs text-gray-400 mt-1">
                {post.date}
                </p>
            </div>
            </a>
        ))}
        </div>

    </div>


    {/* New Release */}
    <h2 className="text-2xl font-bold mt-12 mb-6">
        <span className="text-[#298064]">New</span> Realease
    </h2>

    {newReleasePosts.map((post) => (
        <a
        key={post.id}
        href={post.link}
        className="flex flex-col md:flex-row gap-4 md:gap-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-4 hover:shadow-md transition mb-6"
        >
        <img
            src={post.image}
            alt={post.title}
            className="w-full md:w-60 h-48 md:h-32 object-cover rounded-lg flex-shrink-0"
        />
        <div>
            <p className="text-xs text-gray-500 pt-1">Category</p>

            <h3 className="text-[#298064] font-semibold leading-snug text-lg">
            {post.title}
            </h3>

            <p className="text-xs text-gray-400 mt-2">{post.date}</p>
        </div>
        </a>
    ))}

    </section>
    <Footer siteSettings={undefined} />
    </>
  );
}
  