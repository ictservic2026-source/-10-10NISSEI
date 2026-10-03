# NISSEI 10:10 Staff Drop
1. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ SUPABASE_SECRET_KEY และ ADMIN_PASSWORD
2. `npm install && npm run dev` แล้วเปิด http://localhost:3000 (แอดมิน: /admin)
3. ขึ้น Vercel: push ขึ้น GitHub > Import ใน Vercel > ใส่ Environment Variables ตาม .env.example > Deploy

## ใส่ Art พื้นหลังหน้าปก
1. อัปโหลดรูปชื่อ `hero-bg.jpg` ไว้ในโฟลเดอร์ `public/` (แนะนำ 2400x1000 px ไม่เกิน 500 KB)
2. เปิด `app/globals.css` ตรงบล็อก `:root` บนสุด หา `--hero-art:none;--hero-overlay:none;` แล้วแทนที่ด้วยค่าสองบรรทัดที่อยู่ในคอมเมนต์ด้านบน
3. ไม่อยากให้มีลำแสงหมุน: เพิ่ม `.hero:before{display:none}` ท้ายไฟล์
