import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import { AuthProvider } from "./contexts/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "ReachSure - Emergency Ambulance Service",
  description: "Book ambulances quickly in emergency situations",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}

