import { useEffect, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import DropdownMenu from "./DropdownMenu"

interface NavLink {
  name: string
  href: string
  isDropdown?: boolean
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isHomePage = location.pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    // Hanya tambahkan event listener scroll jika di halaman Home
    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Infografis", href: "#", isDropdown: true },
    { name: "IDM", href: "/idm" },
    { name: "Berita", href: "/berita" },
    { name: "Belanja", href: "/belanja" },
    { name: "Galeri", href: "/galeri" },
  ]

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled
            ? "bg-[#298064] shadow-lg"
            : "bg-transparent"
          : "bg-[#298064] shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo-puundoho.png"
            alt="Logo"
            width={45}
            height={45}
            className="object-contain"
          />
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Desa Puundoho
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-white font-medium">
          {navLinks.map((link, index) => (
            <li key={index}>
              {link.isDropdown ? (
                <DropdownMenu />
              ) : (
                <Link
                  to={link.href}
                  className={`relative group ${location.pathname === link.href ? 'text-white font-bold' : ''}`}
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#298064] px-6 pb-6">
          <ul className="flex flex-col gap-4 text-white font-medium">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block hover:translate-x-2 transition-all duration-300 ${location.pathname === link.href ? 'font-bold' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {/* Infografis Submenu for Mobile */}
            <li className="pl-4 border-l-2 border-white/30">
              <div className="text-sm font-medium text-white/80 mb-2">Infografis</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    to="/infografis/penduduk-desa"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm hover:translate-x-2 transition-all duration-300"
                  >
                    Penduduk Desa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/infografis/stunting"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm hover:translate-x-2 transition-all duration-300"
                  >
                    Stunting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/infografis/apbdesa"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm hover:translate-x-2 transition-all duration-300"
                  >
                    APBDesa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/infografis/bansos"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm hover:translate-x-2 transition-all duration-300"
                  >
                    Bansos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/infografis/sdgs"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm hover:translate-x-2 transition-all duration-300"
                  >
                    SDGS
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}