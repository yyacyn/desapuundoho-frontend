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
              Install the plugin and convert your designs to a responsive site.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-3">Misi</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li>Install the plugin and convert your designs to a responsive site.Install the plugin and convert your designs to a responsive site.</li>
              <li>Install the plugin and convert your designs to a responsive site.</li>
              <li>Install the plugin and convert your designs to a responsive site.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}