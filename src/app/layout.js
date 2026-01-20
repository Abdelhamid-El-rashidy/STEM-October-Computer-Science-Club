import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import Header from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron'
})

export const metadata = {
  title: 'Certificate Verification | STEM CS Club',
  description: 'Verify STEM Computer Science Club certificates securely and instantly',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
