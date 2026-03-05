import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Infografis", href: "/infografis" },
    { name: "IDM", href: "/idm" },
    { name: "Berita", href: "/berita" },
    { name: "Belanja", href: "/belanja" },
    { name: "Galeri", href: "/galeri" },
  ]

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#298064] shadow-lg" : "bg-transparent"
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
              <a
                href={link.href}
                className="relative group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
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
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block hover:translate-x-2 transition-all duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}