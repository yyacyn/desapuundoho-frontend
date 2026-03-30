import { useState, useRef, useEffect, ReactNode } from "react"
import { Link } from "react-router-dom"
import { Users, Activity, FileText, HeartHandshake, Target, ChevronDown } from "lucide-react"

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
      {/* Trigger */}
      <button
        className="flex items-center gap-2 relative"
        onClick={toggleDropdown}
      >
        <span>Infografis</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
        />
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
      </button>

      {/* Dropdown */}
      {shouldRender && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[520px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 transition-all duration-200 ease-out ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

          {/* Content */}
          <div className="p-6 grid grid-cols-2 gap-6">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => handleItemClick(item.href)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-emerald-100/80 rounded-xl flex items-center justify-center text-emerald-600 transition-all duration-200 group-hover:bg-emerald-200">
                  {item.icon}
                </div>

                {/* Text */}
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
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