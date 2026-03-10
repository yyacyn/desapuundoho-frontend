export default function BaganDesa() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
      <h2 className="text-3xl font-bold text-[#2f7f67] mb-2">
        Bagan Desa
      </h2>
      <p className="text-gray-700 mb-8">
        Struktur Organisasi Pemerintahan Desa
      </p>
      <div className="relative flex items-center justify-center group">
        <button
          className="absolute left-4 bg-white hover:bg-[#2f7f67] hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full p-3 transition-all duration-300 transform hover:scale-110"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <img
          src="./assets/profil/bagan-desa.png"
          alt="Struktur Desa"
          width={800}
          height={500}
          className="rounded-xl"
        />
        <button
          className="absolute right-4 bg-white hover:bg-[#2f7f67] hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full p-3 transition-all duration-300 transform hover:scale-110"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}