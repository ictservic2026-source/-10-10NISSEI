# NISSEI 10:10 Staff Drop
1. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ SUPABASE_SECRET_KEY และ ADMIN_PASSWORD
2. `npm install && npm run dev` แล้วเปิด http://localhost:3000 (แอดมิน: /admin)
3. ขึ้น Vercel: push ขึ้น GitHub > Import ใน Vercel > ใส่ Environment Variables ตาม .env.example > Deploy
