import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientNavbar from "@/components/ClientNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Civic Issue Portal - Report & Track Community Issues",
  description: "A platform for citizens to report civic issues and track their resolution status. Help improve your community by reporting problems and monitoring progress.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
