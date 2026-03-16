import { useState, useRef, useEffect, ReactNode } from "react"
import { Link } from "react-router-dom"
import { Users, Activity, FileText, HeartHandshake, Target } from "lucide-react"

interface DropdownItem {
  name: string
  href: string
  icon: ReactNode
}

interface DropdownMenuProps {
  items?: DropdownItem[]
  onItemSelected?: (href: string) => void
}

const defaultDropdownItems: DropdownItem[] = [
  { name: "Penduduk Desa", href: "/infografis/penduduk-desa", icon: <Users size={20} /> },
  { name: "Stunting", href: "/infografis/stunting", icon: <Activity size={20} /> },
  { name: "APBDesa", href: "/infografis/apbdesa", icon: <FileText size={20} /> },
  { name: "Bansos", href: "/infografis/bansos", icon: <HeartHandshake size={20} /> },
  { name: "SDGS", href: "/infografis/sdgs", icon: <Target size={20} /> },
]

export default function DropdownMenu({ items = defaultDropdownItems, onItemSelected }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
      // Allow browser to render the element first, then trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      closeTimerRef.current = setTimeout(() => {
        setShouldRender(false)
        setIsAnimating(false)
      }, 200)
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("scroll", handleScroll, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  const handleItemClick = (href: string) => {
    setIsOpen(false)
    onItemSelected?.(href)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        className="relative group"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Infografis</span>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
      </button>

      {/* Dropdown Panel */}
      {shouldRender && (
        <div
          className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 ease-out ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>

          {/* Grid Menu */}
          <div className="relative p-4 grid grid-cols-2 gap-3">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => handleItemClick(item.href)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group select-text"
              >
                {/* Icon Container */}
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors duration-200">
                  {item.icon}
                </div>
                {/* Text */}
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 select-text">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
