import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsDetailPage() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const post = location.state?.post;

  // Data dummy untuk berita (sama seperti di Berita.tsx)
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

  // Cari post berdasarkan ID dari URL parameter
  const currentPost = post || dummyPosts.find((p) => p.id === parseInt(id || ""));

  // Cari prev dan next post
  const currentIndex = dummyPosts.findIndex((p) => p.id === currentPost?.id);
  const prevPost = currentIndex > 0 ? dummyPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < dummyPosts.length - 1 ? dummyPosts[currentIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevPost) {
      navigate(`/detail-berita/${prevPost.id}`, { state: { post: prevPost } });
    }
  };

  const handleNextClick = () => {
    if (nextPost) {
      navigate(`/detail-berita/${nextPost.id}`, { state: { post: nextPost } });
    }
  };

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
                  src={currentPost?.image || "./assets/home/berita.jpg"}
                  alt={currentPost?.title || "news"}
                  width={800}
                  height={400}
                  className="w-full object-cover"
                />
              </div>

              {/* Article */}
              <div className="mt-6 space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Pemerintah Desa Puundoho terus berupaya meningkatkan kualitas kehidupan masyarakat melalui berbagai program dan kegiatan yang melibatkan seluruh lapisan warga. Kegiatan ini merupakan wujud nyata komitmen pemerintah desa dalam mewujudkan visi Desa Puundoho yang maju, berkualitas, berbudaya, dan religius.
                </p>

                <p>
                  Melalui semangat gotong royong dan partisipasi aktif masyarakat, berbagai program pembangunan desa terus berjalan dengan baik. Kerja sama antara pemerintah desa, lembaga kemasyarakatan, serta seluruh warga menjadi kunci keberhasilan setiap program yang dilaksanakan.
                </p>

                <p>
                  Pemerintah Desa Puundoho mengajak seluruh warga untuk terus berpartisipasi aktif dalam setiap kegiatan desa demi terciptanya lingkungan yang harmonis, bersih, dan sejahtera. Informasi lebih lanjut dapat diperoleh melalui Kantor Desa Puundoho atau media sosial resmi desa.
                </p>

                <p>
                  Demikian informasi yang dapat kami sampaikan. Semoga bermanfaat bagi seluruh warga Desa Puundoho dan masyarakat sekitar. Terima kasih atas perhatian dan dukungannya.
                </p>
              </div>

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

              {/* Popular */}
              <div className="bg-emerald-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Popular</h3>

                <div className="space-y-4">
                  {dummyPosts.slice(0, 5).map((item, index) => (
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