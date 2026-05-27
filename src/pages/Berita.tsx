import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, LayoutGrid, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiFetch } from "../api";
import { useNews } from "../context/NewsContext";

// Data dummy untuk berita
const dummyPosts = [
  {
    id: 1,
    category: "Kegiatan Desa",
    title: "Gotong Royong Membersihkan Lingkungan Desa Puundoho",
    date: "27 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 2,
    category: "Pengumuman",
    title: "Pembagian Bantuan Sosial Tahap 1 Tahun 2026",
    date: "25 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 3,
    category: "Kegiatan Desa",
    title: "Musyawarah Perencanaan Pembangunan Desa",
    date: "23 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 4,
    category: "Berita",
    title: "Pelatihan UMKM untuk Ibu-Ibu PKK",
    date: "20 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 5,
    category: "Kegiatan Desa",
    title: "Peringatan Hari Kemerdekaan RI ke-81",
    date: "17 Agustus 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 6,
    category: "Pengumuman",
    title: "Jadwal Posyandu Bulan Maret 2026",
    date: "15 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
  {
    id: 7,
    category: "Berita",
    title: "Panen Raya Padi Bersama Kelompok Tani",
    date: "10 Juli 2026",
    image: "/assets/home/berita.jpg",
    link: "#",
  },
];

type Article = {
  id: number | string
  title: string
  excerpt?: string
  status?: string
  created_at?: string
  cover_image?: string
  link?: string
  date?: string
  category?: string
}

export default function Berita() {
  const { articles, loading } = useNews();
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortDir, setSortDir] = useState('desc')
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const categories = ["Semua", ...Array.from(new Set(articles.filter(a => a.status !== "draft").map(a => a.category).filter(Boolean)))];

  // Popular section (overall latest/popular articles: filtered only by search and status)
  const popularFiltered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = a.status !== "draft";
    return matchesSearch && matchesStatus;
  });

  const mainPost = popularFiltered[0]; // Section Popular
  const sidePosts = popularFiltered.slice(1, 5); // 4 berita setelah yang utama

  // New Release section (filtered by search, status AND selectedCategory, showing ALL)
  const newReleaseFiltered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || a.category === selectedCategory;
    const matchesStatus = a.status !== "draft";
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handlePostClick = (post: { id: number | string;[key: string]: unknown }) => {
    navigate(`/detail-berita/${post.id}`, { state: { post } });
  };

  const getArticleDate = (post: Article) =>
    post.date ?? (post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) : "-");

  const totalPages = Math.max(1, Math.ceil(newReleaseFiltered.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);

  const pagedNewReleasePosts = useMemo<Article[]>(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return newReleaseFiltered.slice(start, start + PAGE_SIZE);
  }, [activePage, newReleaseFiltered]);

  const hasNoResults = popularFiltered.length === 0;

  if (loading) return <div className="text-center py-20">Memuat Halaman Berita...</div>;

  // Section New Release (mulai dari post ke-6 biar ga double)
  // const newReleasePosts = filteredPosts.slice(5, 5 + visibleCount);

  return (
    <>
      <Navbar />
      <section className="bg-white py-12 px-4 md:px-28 pt-28 md:pt-30 w-full mx-auto">
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

        {/* No results message */}
        {hasNoResults && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada berita yang ditemukan</p>
            <p className="text-gray-400 text-sm mt-2">Coba dengan kata kunci lainnya</p>
          </div>
        )}

        {!hasNoResults && (
          <>
            {/* Popular */}
            {popularFiltered.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6 relative">
                  <h2 className="text-2xl font-bold text-[#298064]">Popular</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                  {/* Main Popular */}
                  {mainPost && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostClick(mainPost);
                      }}
                      className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden md:col-span-1 cursor-pointer"
                    >
                      <img
                        src={mainPost.cover_image ?? "./assets/home/berita.jpg"}
                        alt={mainPost.title}
                        className="w-full h-80 object-cover"
                      />

                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{mainPost.category ?? "Category"}</p>

                        <h3 className="text-2xl font-bold text-[#298064] leading-snug">
                          {mainPost.title}
                        </h3>

                        <p className="text-xs text-gray-400 text-end mt-20">{getArticleDate(mainPost)}</p>
                      </div>
                    </a>
                  )}

                  {/* Side Popular */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    {sidePosts.map((post) => (
                      <a
                        key={post.id}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePostClick(post);
                        }}
                        className="flex gap-4 shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-3 hover:shadow-md transition w-full cursor-pointer"
                      >
                        <img
                          src={post.cover_image ?? "./assets/home/berita.jpg"}
                          alt={post.title}
                          className="w-28 h-23 rounded-lg object-cover flex-shrink-0"
                        />

                        <div>
                          <p className="text-xs text-gray-500 pt-1">{post.category ?? "Category"}</p>

                          <h4 className="text-lg font-semibold text-[#298064] leading-snug line-clamp-2">
                            {post.title}
                          </h4>

                          <p className="text-xs text-gray-400 mt-1">
                            {getArticleDate(post)}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                </div>
              </>
            )}

            {/* New Release */}
            <div className="flex items-center justify-between mt-12 mb-6 relative">
              <h2 className="text-2xl font-bold">
                <span className="text-[#298064]">New</span> Release
              </h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-[#F1F3F4] px-4 py-2 rounded-2xl text-[#5F6368] font-medium transition-all hover:bg-gray-200"
                >
                  <LayoutGrid size={20} />
                  <span className="text-base">{selectedCategory === "Semua" ? "Kategori" : selectedCategory}</span>
                  <ChevronDown size={18} className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#298064] hover:text-white transition-colors ${
                          selectedCategory === cat ? 'bg-[#298064]/10 font-bold text-[#298064]' : ''
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {newReleaseFiltered.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Tidak ada berita untuk kategori ini.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {pagedNewReleasePosts.map((post) => (
                    <article
                      key={post.id}
                      className="flex flex-col justify-between h-full bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="w-full text-left flex flex-col flex-grow">
                        <div className="rounded-xl border border-gray-100 bg-[#f9f9f9] flex items-center justify-center w-full aspect-[16/10] overflow-hidden">
                          <img
                            src={post.cover_image || "./assets/home/berita.jpg"}
                            alt={post.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <p className="text-xs text-[#298064] font-semibold mt-4">
                          {post.category ?? "Kategori"}
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-black hover:text-[#298064] transition-colors">
                          {post.title}
                        </h3>
                      </div>

                      <p className="mt-4 text-xs text-gray-400 font-medium">
                        {getArticleDate(post)}
                      </p>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination berita">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(activePage - 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#298064] transition hover:bg-gray-100 disabled:opacity-50"
                      disabled={activePage === 1}
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                      const isActive = pageNumber === activePage

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setCurrentPage(pageNumber)}
                          aria-current={isActive ? "page" : undefined}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                            isActive
                              ? "bg-[#298064] text-white"
                              : "text-[#298064] hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(activePage + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#298064] transition hover:bg-gray-100 disabled:opacity-50"
                      disabled={activePage === totalPages}
                      aria-label="Halaman berikutnya"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </>
        )}

      </section>
      <Footer siteSettings={undefined} />
    </>
  );
}
