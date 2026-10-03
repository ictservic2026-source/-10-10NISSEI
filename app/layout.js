import './globals.css'
export const metadata = { title: 'NISSEI 10:10 Staff Drop', description: 'เสื้อพนักงาน Limited Edition' }
export default function Layout({ children }) {
  return (<html lang="th"><head>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@500;700;900&family=Noto+Sans+Thai:wght@400;600;800&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>)
}
