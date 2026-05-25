export default function VisiMisi() {
  return (
    <section className="max-w-7xl mx-auto px-2 md:px-6 py-10">
      <div className="bg-[#2f7f67] text-white rounded-3xl p-10 md:p-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-shrink-0 px-2 md:px-10">
          <img
            src="./assets/logo-puundoho.png"
            alt="Logo Desa"
            width={160}
            height={160}
            className="pt-5"
          />
        </div>
        <div className="space-y-10 px-0 md:px-20">
          <div>
            <h2 className="text-3xl font-bold mb-2">Visi</h2>
            <p className="text-gray-200">
              Terwujudnya Desa Puundoho yang Maju, Berkualitas, Berbudaya dan Religius
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-3">Misi</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li>Meningkatkan kecakapan, pengetahuan, dan keahlian tenaga kerja produktif di
              </li>
              <li>Mempercepat pembangunan sarana dan prasarana fisik desa yang merata guna memperlancar mobilitas warga dan mendukung perekonomian lokal.
              </li>
              <li>Membangun sistem pelayanan publik yang ramah, profesional, jujur, dan tanggap terhadap kebutuhan masyarakat desa.
              </li>
              <li>Mendorong pertumbuhan ekonomi warga dengan membina UMKM, pertanian, serta mengoptimalkan usaha desa secara mandiri dan inovatif.
              </li>
              <li>Menjaga, melestarikan, dan menghormati nilai-nilai adat serta kebudayaan lokal sebagai bagian dari identitas sosial kemasyarakatan yang luhur.
              </li>
              <li>Mempererat tali silaturahmi, kekompakan, dan keharmonisan antarwarga melalui kegiatan sosial, olahraga, dan keagamaan bersama secara berkala.
              </li>
              <li>Membudayakan gerakan kebersihan, kelestarian alam, dan pemanfaatan pekarangan untuk menciptakan lingkungan desa yang asri, bersih, dan sehat.
              </li>
              <li>Menjadikan nilai-nilai moral keagamaan dan ketuhanan sebagai basis utama dalam membangun karakter warga serta arah pembangunan desa yang berkelanjutan.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}