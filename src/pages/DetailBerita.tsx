import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsDetailPage() {
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
              Lorem ipsum dolor sit amet Lorem ipsum dolor Lorem ipsum dolor sit
            </h1>

            <p className="text-gray-500 mt-3 text-sm">
              By admin - 1 Januari 2026
            </p>

            {/* Image */}
            <div className="mt-6 rounded-xl overflow-hidden">
              <img
                src="./assets/home/berita.jpg"
                alt="news"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>

            {/* Article */}
            <div className="mt-6 space-y-6 text-gray-600 leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>

              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Tags */}
            <div className="flex gap-3 mt-8">
              <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
                Kesehatan
              </span>
              <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
                Pengumuman
              </span>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            
            {/* Popular */}
            <div className="bg-emerald-600 text-white p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Popular</h3>

              <div className="space-y-4">
                {[1,2,3,4,5].map((item)=>(
                  <div key={item} className="flex gap-4 border-b border-white/30 pb-3">
                    <span className="text-xl font-bold">{item}</span>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit
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
                    <button className="flex items-center gap-5 bg-[#2D7A5F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group">
                        <span className="bg-white text-[#2D7A5F] rounded-full p-1 group-hover:-translate-x-1 transition-transform">
                            <ChevronLeft size={20} />
                        </span>
                        Prev Post
                    </button>
                </div>

                <div className="">
                    <button className="flex items-center gap-5 bg-[#2D7A5F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#235d49] transition shadow-lg group">
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