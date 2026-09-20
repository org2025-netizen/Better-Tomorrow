# 🏫 Better Tomorrow School

### *Nurturing Tomorrow's Leaders Today*

Better Tomorrow School is a complete digital platform for managing early childhood education. Built with modern web technologies, it provides a seamless experience for administrators, teachers, parents, and students.

---

## 🌐 Three Integrated Systems

### 1. Public Website
- School information and about page
- News and announcements
- Events calendar
- Photo gallery
- Contact information and inquiry forms
- Admissions portal

### 2. Admin Dashboard
- Student enrollment and management
- Teacher and staff management
- Fee management and payment tracking
- Academic year and term management
- Class and subject management
- Attendance tracking
- Report card generation
- Event management
- Gallery management
- System settings and configuration

### 3. Parent Portal
- View child's profile and academic progress
- Fee statements and payment history
- Attendance records
- Teacher communication
- Event notifications
- Report card downloads

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **File Upload** | Multer |
| **Email** | Nodemailer |
| **API Docs** | Swagger/OpenAPI |

---

## 📁 Project Structure

```
Better Tomorrow/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service calls
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── index.html
├── server/                    # Backend (Express + Prisma)
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/         # Custom middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript type definitions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seed data
│   └── uploads/               # Uploaded files
├── package.json               # Root workspace config
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher
- **Git** (for version control)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/better-tomorrow-school.git
cd better-tomorrow-school
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install server dependencies

```bash
cd server
npm install
cd ..
```

### 4. Install client dependencies

```bash
cd client
npm install
cd ..
```

### 5. Or install all at once

```bash
npm run install:all
```

---

## ⚙️ Environment Setup

### Server environment

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/bts_school?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"
```

### Client environment

```bash
cd client
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Setup

### 1. Create PostgreSQL database

```sql
CREATE DATABASE bts_school;
```

### 2. Generate Prisma client

```bash
npm run db:generate
```

### 3. Run migrations

```bash
npm run db:migrate
```

### 4. Seed the database

```bash
npm run db:seed
```

### Other database commands

```bash
# Open Prisma Studio (visual database browser)
npm run db:studio

# Reset database (drops and recreates)
npm run db:reset
```

---

## ▶️ Running Development Servers

### Start both frontend and backend

```bash
npm run dev
```

### Start individually

```bash
# Backend only (http://localhost:5000)
npm run dev:server

# Frontend only (http://localhost:5173)
npm run dev:client
```

---

## 🔐 Default Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@bts.ac.ke |
| **Password** | Admin@123 |

> ⚠️ Change these credentials immediately in production!

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy

### Backend (Render / Railway)

#### Option A: Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Port**: 5000
4. Add environment variables (copy from `.env.example` and update values)
5. Deploy

#### Option B: Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Add a PostgreSQL database service
4. Configure environment variables
5. Deploy

### Database (Neon / Supabase)

For a free PostgreSQL database:
- **Neon**: [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)

Update `DATABASE_URL` in your environment variables accordingly.

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-backend-url.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/auth/register` | Register new user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | List all students |
| GET | `/students/:id` | Get student by ID |
| POST | `/students` | Create new student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### Fee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fees` | List all fee records |
| GET | `/fees/:id` | Get fee by ID |
| POST | `/fees` | Create fee record |
| PUT | `/fees/:id` | Update fee record |
| POST | `/fees/:id/pay` | Process payment |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events |
| GET | `/events/:id` | Get event by ID |
| POST | `/events` | Create new event |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

### News Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/news` | List all news posts |
| GET | `/news/:id` | Get news by ID |
| POST | `/news` | Create news post |
| PUT | `/news/:id` | Update news post |
| DELETE | `/news/:id` | Delete news post |

### Gallery Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gallery` | List all gallery items |
| POST | `/gallery` | Upload gallery item |
| DELETE | `/gallery/:id` | Delete gallery item |

### Contact Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit contact form |
| GET | `/contact` | List all inquiries (admin) |
| PUT | `/contact/:id` | Update inquiry status |

### Settings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get school settings |
| PUT | `/settings` | Update school settings (admin) |

---

## ✨ Features

### Admin Features
- ✅ Dashboard with analytics overview
- ✅ Student enrollment and management
- ✅ Teacher and staff management
- ✅ Class and subject management
- ✅ Academic year and term management
- ✅ Fee management with payment tracking
- ✅ Attendance tracking and reports
- ✅ Report card generation
- ✅ Event creation and management
- ✅ News and announcement publishing
- ✅ Photo gallery management
- ✅ Contact inquiry management
- ✅ School settings configuration
- ✅ User role management

### Parent Features
- ✅ Parent portal dashboard
- ✅ View child's profile and progress
- ✅ Fee statements and payment history
- ✅ Attendance records
- ✅ Event notifications
- ✅ Report card downloads

### Public Features
- ✅ Responsive school website
- ✅ News and announcements
- ✅ Events calendar
- ✅ Photo gallery
- ✅ Contact form
- ✅ Admissions information

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation as needed
- Test your changes before submitting
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 Better Tomorrow School

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Better Tomorrow School**

- 📍 Address: P.O. Box 12345, Nairobi, Kenya
- 📧 Email: info@bts.ac.ke
- 📱 Phone: +254 700 123 456
- 🌐 Website: [www.bts.ac.ke](https://www.bts.ac.ke)

---

## 🙏 Acknowledgments

- Built with ❤️ for the Better Tomorrow School community
- Special thanks to all teachers, parents, and students
