# iLearn+ Frontend

Giao diện web cho nền tảng học tập iLearn+.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Axios
- React Router DOM

## Cài đặt local
```bash
git clone https://github.com/punnohoang/ilearn-frontend.git
cd ilearn-frontend
npm install
```

Tạo file `.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

Chạy:
```bash
npm run dev
```

Mở http://localhost:5173

## Tài khoản demo
- Student: đăng ký tài khoản mới
- Admin: admin@ilearn.com / admin123

## Cấu trúc thư mục
```
src/
├── api/          # Axios functions gọi backend
├── components/   # Reusable components
│   └── common/   # Layout, ProtectedRoute, ProgressBar, AiChat...
├── context/      # AuthContext
└── pages/        # Các trang chính
    ├── auth/     # Login, Register
    ├── admin/    # Admin Panel
    ├── CoursesPage.jsx
    ├── CourseDetailPage.jsx
    ├── LessonPage.jsx
    └── ProfilePage.jsx
```

## Deploy
- Platform: Vercel
- URL: https://ilearn-frontend.vercel.app