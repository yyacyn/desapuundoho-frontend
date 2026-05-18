import { useEffect, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import DropdownMenu from "./DropdownMenu"

interface NavItem {
  name: string
  href: string
  isDropdown?: boolean
}

const mobileInfografisItems = [
  { name: "Penduduk", href: "/penduduk" },
  { name: "Stunting", href: "/infografis/stunting" },
  { name: "APBDesa", href: "/infografis/apbdesa" },
  { name: "Bansos", href: "/infografis/bansos" },
  { name: "SDGS", href: "/infografis/sdgs" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isInfografisOpen, setIsInfografisOpen] = useState(false)
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

  // Tutup mobile menu saat route berubah
  useEffect(() => {
    setIsOpen(false)
    setIsInfografisOpen(false)
  }, [location.pathname])

  const navLinks: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Infografis", href: "#", isDropdown: true },
    { name: "IDM", href: "/idm" },
    { name: "Berita", href: "/berita" },
    { name: "Belanja", href: "/belanja" },
    { name: "Galeri", href: "/galeri" },
    { name: "Listing", href: "/listing" },
  ]

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${isHomePage
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
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `relative group ${isActive ? 'text-white font-bold' : ''}`
                  }
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#298064] px-6 pb-6">
          <ul className="flex flex-col gap-1 text-white font-medium">
            {navLinks.map((link, index) => (
              link.isDropdown ? (
                /* Infografis accordion */
                <li key={index}>
                  <button
                    onClick={() => setIsInfografisOpen(!isInfografisOpen)}
                    className="flex items-center justify-between w-full py-3 hover:translate-x-2 transition-all duration-300"
                  >
                    <span>Infografis</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isInfografisOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Sub-menu Infografis */}
                  {isInfografisOpen && (
                    <ul className="flex flex-col gap-1 pl-4 border-l-2 border-white/30 mb-2">
                      {mobileInfografisItems.map((item, i) => (
                        <li key={i}>
                          <NavLink
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              `block py-2 text-sm hover:translate-x-2 transition-all duration-300 ${isActive ? 'font-bold' : 'text-white/90'}`
                            }
                          >
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                /* Item biasa */
                <li key={index}>
                  <NavLink
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 hover:translate-x-2 transition-all duration-300 ${isActive ? 'font-bold' : ''}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}