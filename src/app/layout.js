import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Scriba - AI Medical Scribe',
  description: 'Automatic SOAP notes for healthcare professionals'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plus_jakarta_sans.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
