import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import geojsonData from "../assets/batas-desa.json"

const leafletStyleFix = `
  .leaflet-control {
    z-index: 10 !important;
  }
  .leaflet-popup {
    z-index: 12 !important;
  }
  .leaflet-tooltip {
    z-index: 11 !important;
  }
`

export default function MapDesa() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <style>{leafletStyleFix}</style>
      <div className="w-16 h-1 bg-[#2D7A5F] mb-3"></div>
      <h2 className="text-3xl font-bold text-[#2f7f67] mb-10">
        Peta Lokasi Desa
      </h2>

      <div className="grid md:grid-cols-3 gap-10 items-start">
        <div className="rounded-xl overflow-hidden shadow-lg h-[400px] md:col-span-2 relative z-0">
          <MapContainer
            center={[-3.111, 121.095]}
            zoom={13}
            className="w-full h-full relative"
            style={{ zIndex: 1 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON
              data={geojsonData}
              style={{
                color: "#2f7f67",
                weight: 3,
                opacity: 0.8,
                fillColor: "#2f7f67",
                fillOpacity: 0.2
              }}
            />
          </MapContainer>
        </div>

        <div className="w-full bg-gray-200 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg">Batas Desa:</h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mt-4 text-gray-800">

              <div className="flex flex-col">
                <span>Utara</span>
                <span>Desa Tetewari</span>
              </div>

              <div className="flex flex-col">
                <span>Selatan</span>
                <span>Desa Lawata</span>
              </div>

              <div className="flex flex-col">
                <span>Timur</span>
                <span>Kawasan Hutan</span>
              </div>

              <div className="flex flex-col">
                <span>Barat</span>
                <span>Teluk Bone</span>
              </div>

            </div>
          </div>

          <hr className="border-gray-400" />

          {/* Luas Desa */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Luas Desa:</span>
            <span>470,57 Ha</span>
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