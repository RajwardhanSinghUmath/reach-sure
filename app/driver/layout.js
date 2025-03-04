"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaTachometerAlt, FaBell, FaUserPlus, FaSignOutAlt } from "react-icons/fa"

export default function DriverLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", path: "/driver/dashboard", icon: <FaTachometerAlt /> },
    { name: "Notifications", path: "/driver/notifications", icon: <FaBell /> },
    { name: "Onboarding", path: "/driver/onboarding", icon: <FaUserPlus /> },
  ]

  const isActive = (path) => pathname === path

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚑</span>
            <span className="font-bold text-xl text-red-600">ReachSure</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path) ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🚑</span>
          <span className="font-bold text-xl text-red-600">ReachSure</span>
        </Link>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path) ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

