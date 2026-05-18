import { useEffect, useState, useMemo } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { apiFetch } from "../api"

// Leaflet CSS
import "leaflet/dist/leaflet.css"

// Fix missing marker icons in React Leaflet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import iconUrl from "leaflet/dist/images/marker-icon.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"

// CSS to fix z-index for Leaflet
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

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = customIcon

interface ListingItem {
    id: number
    nama: string
    koordinat: string
    image_url: string
    created_at: string
}

interface MapBoundsProps {
    listings: ListingItem[]
}

// Component to dynamically set map view bounds to markers
function MapBounds({ listings }: MapBoundsProps) {
    const map = useMap()
    useEffect(() => {
        if (!listings || listings.length === 0) return
        const validCoords = listings.map(l => {
            const parts = l.koordinat.split(',').map(s => parseFloat(s.trim()))
            return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : null
        }).filter(Boolean)

        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords as any)
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
        }
    }, [listings, map])
    return null
}

export default function Listing() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [listings, setListings] = useState<ListingItem[]>([])
    const [selectedListingId, setSelectedListingId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Inject Leaflet z-index fixes
    useEffect(() => {
        const style = document.createElement('style')
        style.textContent = leafletStyleFix
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await apiFetch("/listings", { cache: "no-store" })
                const json = await res.json()
                if (!res.ok) {
                    throw new Error(json.error || "Gagal mengambil data listing")
                }
                setListings((json.listings || []) as ListingItem[])
            } catch (err) {
                console.error(err)
                setError("Gagal terhubung ke server untuk data listing.")
                setListings([])
            } finally {
                setLoading(false)
            }
        }

        fetchListings()
    }, [])

    const filteredListings = useMemo(() => {
        return listings
            .filter((item) =>
                item.nama.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }, [listings, searchTerm])

    const selectedListing = listings.find((item) => item.id === selectedListingId)

    return (
        <>
            <Navbar />

            <section className="bg-white py-12 px-4 md:px-28 w-full mx-auto pt-28 md:pt-30 relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#298064]">Peta Lokasi Fasilitas</h1>
                    {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f7f67] mx-auto mb-4"></div>
                            <p className="text-gray-600">Memuat peta dan lokasi...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-96 bg-red-50 rounded-xl">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
                        <p className="text-gray-600">Tidak ada data lokasi fasilitas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-0">
                        {/* Sidebar dengan daftar listing */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6 h-full">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Cari fasilitas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f7f67] text-sm"
                                    />
                                </div>

                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredListings.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">Tidak ada hasil pencarian</p>
                                    ) : (
                                        filteredListings.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setSelectedListingId(item.id)}
                                                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 border-l-4 ${selectedListingId === item.id
                                                    ? "bg-green-50 border-l-[#2f7f67] text-[#2f7f67] font-medium"
                                                    : "bg-gray-50 border-l-gray-300 text-gray-800 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <p className="font-semibold text-sm">{item.nama}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                                                </p>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden h-96 md:h-[500px] relative z-0">
                                <MapContainer
                                    center={[-8.8499, 115.2863]}
                                    zoom={13}
                                    className="w-full h-full relative"
                                    style={{ zIndex: 1 }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    {listings.map((item) => {
                                        const coordParts = item.koordinat.split(",").map((v) => parseFloat(v.trim()))
                                        if (coordParts.length !== 2 || isNaN(coordParts[0]) || isNaN(coordParts[1])) {
                                            return null
                                        }
                                        const [lat, lng] = coordParts

                                        return (
                                            <Marker
                                                key={item.id}
                                                position={[lat, lng]}
                                                icon={selectedListingId === item.id ? createHighlightedIcon() : customIcon}
                                                eventHandlers={{
                                                    click: () => setSelectedListingId(item.id),
                                                }}
                                            >
                                                <Popup>
                                                    <div className="p-2 text-sm">
                                                        <p className="font-semibold text-[#2f7f67]">{item.nama}</p>
                                                        {item.image_url && (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.nama}
                                                                className="w-48 h-32 object-cover rounded mt-2"
                                                            />
                                                        )}
                                                        <p className="text-xs text-gray-600 mt-2">
                                                            {lat.toFixed(4)}, {lng.toFixed(4)}
                                                        </p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        )
                                    })}

                                    <MapBounds listings={listings} />
                                </MapContainer>
                            </div>

                            {/* Info Panel untuk listing yang dipilih */}
                            {selectedListing && (
                                <div className="mt-4 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 md:p-6">
                                    <h3 className="text-lg font-semibold text-[#2f7f67] mb-3">{selectedListing.nama}</h3>

                                    {selectedListing.image_url && (
                                        <img
                                            src={selectedListing.image_url}
                                            alt={selectedListing.nama}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 font-medium">Koordinat</p>
                                            <p className="text-gray-800 mt-1">{selectedListing.koordinat}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Tanggal Ditambahkan</p>
                                            <p className="text-gray-800 mt-1">
                                                {new Date(selectedListing.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <Footer siteSettings={undefined} />
        </>
    )
}

// Helper function untuk icon yang highlighted
function createHighlightedIcon() {
    return new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [32, 50],
        iconAnchor: [16, 50],
        popupAnchor: [1, -40],
        shadowSize: [50, 50],
    })
}
