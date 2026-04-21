import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutGrid, ChevronDown } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiFetch } from "../api";

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
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortDir, setSortDir] = useState('desc')
  const [visibleCount, setVisibleCount] = useState(3);

  const fetchArticles = async () => {
    try {
      const res = await apiFetch('/articles')
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (err) {
      console.error('Failed to fetch articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  // Filter + search + sort (client-side on fetched data)
  const filtered = articles
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortDir === 'desc'
        ? new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
        : new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
    )
  const navigate = useNavigate();

  const filteredPosts = dummyPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePostClick = (post: { id: number | string;[key: string]: unknown }) => {
    navigate(`/detail-berita/${post.id}`, { state: { post } });
  };

  const getArticleDate = (post: Article) =>
    post.date ?? (post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID") : "-");

  // Section Popular
  const mainPost = filteredPosts[0];

  // Section New Release (mulai dari post ke-6 biar ga double)
  const newReleasePosts = filteredPosts.slice(5, 5 + visibleCount);

  return (
    <>
      <Navbar />
      <section className="bg-white py-12 px-4 md:px-28 md:pt-30 pt-15 w-full mx-auto">
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
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada berita yang ditemukan</p>
            <p className="text-gray-400 text-sm mt-2">Coba dengan kata kunci lainnya</p>
          </div>
        )}

        {filtered.length > 0 && (
          <>
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
                  onClick={(e) => {
                    e.preventDefault();
                    handlePostClick(mainPost);
                  }}
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
                {filtered.map((post) => (
                  <a
                    key={post.id}
                    href={post.link ?? "#"}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePostClick(post);
                    }}
                    className="flex gap-4 shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-3 hover:shadow-md transition w-full"
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


            {/* New Release */}
            <h2 className="text-2xl font-bold mt-12 mb-6">
              <span className="text-[#298064]">New</span> Realease
            </h2>

            {newReleasePosts.map((post) => (
              <a
                key={post.id}
                href={post.link}
                onClick={(e) => {
                  e.preventDefault();
                  handlePostClick(post);
                }}
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
          </>
        )}

      </section>
      <Footer siteSettings={undefined} />
    </>
  );
}
