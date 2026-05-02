import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface SdgsItem {
  id: number
  title: string
  value: string
  colorClass: string
}

const sdgsItems: SdgsItem[] = [
  { id: 1, title: "Desa tanpa kemiskinan", value: "28.96", colorClass: "text-red-500 bg-red-500" },
  { id: 2, title: "Desa tanpa Kelaparan", value: "34.15", colorClass: "text-amber-500 bg-amber-500" },
  { id: 3, title: "Desa sehat dan sejahtera", value: "73.51", colorClass: "text-green-600 bg-green-600" },
  { id: 4, title: "Pendidikan Desa Berkualitas", value: "37.28", colorClass: "text-rose-600 bg-rose-600" },
  { id: 5, title: "Keterlibatan Perempuan Desa", value: "35.96", colorClass: "text-red-500 bg-red-500" },
  { id: 6, title: "Desa Layak Air bersih dan sanitasi", value: "60.29", colorClass: "text-sky-500 bg-sky-500" },
  { id: 7, title: "Desa Berenergi Bersih dan Terbarukan", value: "98.7", colorClass: "text-yellow-500 bg-yellow-500" },
  { id: 8, title: "Pertumbuhan Ekonomi Desa Merata", value: "46.48", colorClass: "text-rose-800 bg-rose-800" },
  { id: 9, title: "Infrastruktur dan Inovasi Desa Sesuai Kebutuhan", value: "13.38", colorClass: "text-orange-500 bg-orange-500" },
  { id: 10, title: "Desa Tanpa Kesenjangan", value: "32.68", colorClass: "text-pink-600 bg-pink-600" },
  { id: 11, title: "Kawasan Pemukiman Desa Aman dan Nyaman", value: "48.18", colorClass: "text-amber-500 bg-amber-500" },
  { id: 12, title: "Konsumsi dan Produksi Desa Sadar Lingkungan", value: "0", colorClass: "text-yellow-700 bg-yellow-700" },
  { id: 13, title: "Desa Tanggap Perubahan Iklim", value: "0", colorClass: "text-green-700 bg-green-700" },
  { id: 14, title: "Desa Peduli Lingkungan Laut", value: "50", colorClass: "text-blue-600 bg-blue-600" },
  { id: 15, title: "Desa Peduli Lingkungan Darat", value: "0.3", colorClass: "text-green-600 bg-green-600" },
  { id: 16, title: "Desa Damai Berkeadilan", value: "73.24", colorClass: "text-blue-800 bg-blue-800" },
  { id: 17, title: "Kemitraan untuk pembangunan desa", value: "60", colorClass: "text-indigo-800 bg-indigo-800" },
  { id: 18, title: "Kelembagaan Desa Dinamis dan Budaya Desa Adaptif", value: "71.9", colorClass: "text-teal-600 bg-teal-600" },
]

export default function SDGs() {
  return (
    <>
      <Navbar />

      <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-20">
        <div className="flex justify-center mb-8 md:mb-10">
          <img
            src="/assets/sgds/sgds illust.png"
            alt="Ilustrasi SDGs"
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">SDGs Desa Puundaho</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-10 items-center">
          <div>
            <p className="text-base text-gray-900 leading-relaxed mb-6 text-justify">
              SDGs Desa mengacu pada upaya yang dilakukan di tingkat Desa untuk mencapai Tujuan Pembangunan
              Berkelanjutan (Sustainable Development Goals/SDGs). SDGs merupakan agenda global yang ditetapkan oleh
              Perserikatan Bangsa-Bangsa (PBB) untuk mengatasi berbagai tantangan sosial, ekonomi, dan lingkungan di
              seluruh dunia.
            </p>

            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-5 md:p-6 max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-2xl md:text-3xl font-medium text-[#298064] leading-tight">Skor SDGs Desa Puundaho</p>
                <p className="text-4xl md:text-5xl font-bold text-[#298064] leading-none">42.50</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/assets/sgds/stats illust.png"
              alt="Ilustrasi Statistik SDGs"
              className="w-full max-w-sm md:max-w-md h-auto object-contain"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#298064]">Detail SDGs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {sdgsItems.map((item, index) => {
            const isSeventeenth = index === 16
            const isEighteenth = index === 17

            return (
              <article
                key={item.id}
                className={`bg-white rounded-2xl border border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.08)] p-4 min-h-[130px] flex flex-col justify-between ${
                  isSeventeenth ? "xl:col-start-2" : ""
                } ${isEighteenth ? "xl:col-start-3" : ""}`}
              >
                <h3 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>

                <div className="flex items-end justify-between gap-4 mt-4">
                  <div className="w-12 h-12 rounded-sm overflow-hidden flex items-center justify-center">
                    <img
                      src={`/assets/sgds/sgds${item.id}.png`}
                      alt={`Logo SDGs ${item.id}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-700 leading-none mb-1">Nilai</p>
                    <p className={`text-4xl font-bold leading-none ${item.colorClass.split(" ")[0]}`}>{item.value}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <Footer siteSettings={undefined} />
    </>
  )
}
