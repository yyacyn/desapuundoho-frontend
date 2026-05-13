export default function MapDesa() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
      <h2 className="text-3xl font-bold text-[#2f7f67] mb-10">
        Peta Lokasi Desa
      </h2>

      <div className="grid md:grid-cols-3 gap-10 items-start">
        <div className="rounded-xl overflow-hidden shadow-lg h-[400px] md:col-span-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15978609.69911266!2d121.0!3d-2.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c210383c0c0c0c1%3A0x1234567890abcdef!2sIndonesia!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Peta Indonesia"
          ></iframe>
        </div>

        <div className="w-full bg-gray-200 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg">Batas Desa:</h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mt-4 text-gray-800">

              <div className="flex flex-col">
                <span>Utara</span>
                <span>-</span>
              </div>

              <div className="flex flex-col">
                <span>Selatan</span>
                <span>-</span>
              </div>

              <div className="flex flex-col">
                <span>Timur</span>
                <span>-</span>
              </div>

              <div className="flex flex-col">
                <span>Barat</span>
                <span>-</span>
              </div>

            </div>
          </div>

          <hr className="border-gray-400" />

          {/* Luas Desa */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Luas Desa:</span>
            <span>0m²</span>
          </div>

          <hr className="border-gray-400" />

          {/* Jumlah Penduduk */}
          <div>
            <p className="font-semibold text-lg">Jumlah Penduduk:</p>
            <p className="mt-2 text-lg">1.136 Jiwa</p>
          </div>

        </div>

      </div>
    </section>
  );
}