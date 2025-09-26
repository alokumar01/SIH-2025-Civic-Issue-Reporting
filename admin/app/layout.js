import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/MainSidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Sahyogi",
  description: "Civic Issue Reporting Platform",
  appleWebApp: {
    title: "Sahyogi",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/app/icons/favicon.ico" },
      { url: "/app/icons/icon0.svg" },
      { url: "/app/icons/icon1.png" }
    ],
    apple: { url: "/app/icons/apple-icon.png" },
    other: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  manifest: "/app/icons/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
