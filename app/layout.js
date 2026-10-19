import { Kanit, IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'

const display = Kanit({ subsets: ['thai', 'latin'], weight: ['500', '600', '700', '800'], variable: '--font-display', display: 'swap' })
const body = IBM_Plex_Sans_Thai({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' })

export const metadata = {
  title: 'NISSEI 40th Anniversary Jacket · 10:10 Staff Drop',
  description: 'แจ็คเก็ตพนักงาน NISSEI ครบรอบ 40 ปี Limited Edition — เปิดขาย 10:10 น. สั่งซื้อได้หลายตัว หลายไซส์',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1638c9',
}

export default function Layout({ children }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
