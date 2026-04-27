import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
//import DOMPurify from "dompurify";
import { useNews } from "../context/NewsContext";

export default function NewsDetailPage() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const post = location.state?.post;

  // Ambil data global
  const { articles, loading } = useNews();

  // 1. Prioritaskan data dari state navigasi, jika tidak ada cari di global context
  const postFromState = location.state?.post;
  const currentPost = postFromState || articles.find((p) => String(p.id) === String(id));

  // 2. Logika Navigasi (Prev/Next) menggunakan data asli dari API
  const currentIndex = articles.findIndex((p) => String(p.id) === String(currentPost?.id));
  const prevPost = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextPost = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevPost) {
      navigate(`/detail-berita/${prevPost.id}`, { state: { post: prevPost } });
      window.scrollTo(0, 0); // Scroll ke atas saat pindah berita
    }
  };

  const handleNextClick = () => {
    if (nextPost) {
      navigate(`/detail-berita/${nextPost.id}`, { state: { post: nextPost } });
      window.scrollTo(0, 0);
    }
  };

  // 3. Format Tanggal
  const formatDateIndo = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  };

  const rawContent = currentPost?.content || ""; // Pastikan field 'content' ada di API Anda
  // const sanitizedContent = DOMPurify.sanitize(rawContent);

  if (loading && !currentPost) {
    return <div className="py-40 text-center">Memuat Berita...</div>;
  }

  if (!currentPost) {
    return <div className="py-40 text-center">Berita tidak ditemukan.</div>;
  }

  return (
    <>
      <Navbar />
      <section className="bg-white py-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {currentPost?.title || "Detail Berita"}
              </h1>

              <p className="text-gray-500 mt-3 text-sm">
                By admin - {currentPost?.date || "1 Januari 2026"}
              </p>

              {/* Image */}
              <div className="mt-6 rounded-xl overflow-hidden">
                <img
                  src={currentPost?.cover_image || "./assets/home/berita.jpg"}
                  alt={currentPost?.title || "news"}
                  width={800}
                  height={400}
                  className="w-full object-cover"
                />
              </div>

              {/* Article */}
              {rawContent ? (
                <div
                  className="mt-6 text-gray-600 leading-8 [text-wrap:pretty] break-normal [word-break:normal] [overflow-wrap:break-word] [&>*]:mb-4 [&_*]:max-w-full [&_p]:whitespace-normal [&_p]:break-normal [&_p]:[word-break:normal] [&_p]:[overflow-wrap:break-word] [&_span]:whitespace-normal [&_span]: [word-break:normal] [&_span]:[overflow-wrap:break-word] [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_iframe]:max-w-full [&_video]:max-w-full [&_table]:w-full [&_table]:table-auto [&_table]:block [&_table]:overflow-x-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              ) : (
                <div className="mt-6 text-gray-600 leading-relaxed">Tidak ada Berita</div>
              )}

              {/* Tags */}
              <div className="flex gap-3 mt-8">
                <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
                  {currentPost?.category || "Kategori"}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
                  Desa
                </span>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              {/* Popular (Sekarang ambil dari 5 berita pertama di Global State) */}
              {/* Popular */}
              <div className="bg-emerald-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Popular</h3>

                <div className="space-y-4">
                  {articles.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-white/30 pb-3 cursor-pointer hover:opacity-80 transition"
                      onClick={() => navigate(`/detail-berita/${item.id}`, { state: { post: item } })}
                    >
                      <span className="text-xl font-bold">{index + 1}</span>
                      <p className="text-sm">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent flex-1 outline-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate('/berita', { state: { search: e.currentTarget.value } });
                    }
                  }}
                />
                <Search size={18} className="text-gray-500" />
              </div>

              {/* Category */}
              <div className="bg-gray-100 rounded-xl p-6 shadow">
                <h3 className="text-xl font-semibold text-emerald-700 mb-4">
                  Kategori
                </h3>

                <ul className="space-y-3 text-gray-600">
                  <li className="border-b pb-2">Kemerdekaan</li>
                  <li className="border-b pb-2">Event</li>
                  <li className="border-b pb-2">Keagamaan</li>
                  <li className="border-b pb-2">Pengumuman</li>
                  <li>Kesehatan</li>
                </ul>
              </div>

              {/* Prev Next */}
              <div className="flex justify-between gap-4">
                <div className="">
                  <button
                    onClick={handlePrevClick}
                    disabled={!prevPost}
                    className={`flex items-center gap-5 bg-[#2D7A5F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group ${!prevPost ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:-translate-x-1 transition-transform">
                      <ChevronLeft size={20} />
                    </span>
                    Prev Post
                  </button>
                </div>

                <div className="">
                  <button
                    onClick={handleNextClick}
                    disabled={!nextPost}
                    className={`flex items-center gap-5 bg-[#2D7A5F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group ${!nextPost ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next Post
                    <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={20} />
                    </span>
                  </button>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>
      <Footer siteSettings={undefined} />
    </>
  );
}