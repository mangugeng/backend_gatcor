# Gatcor Backend API

## Daftar Isi
1. [Deskripsi](#deskripsi)
2. [Fitur Utama](#fitur-utama)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Persyaratan Sistem](#persyaratan-sistem)
5. [Instalasi](#instalasi)
6. [Struktur Proyek](#struktur-proyek)
7. [API Endpoints](#api-endpoints)
8. [Sistem Tambahan](#sistem-tambahan)
9. [Kontribusi](#kontribusi)
10. [Lisensi](#lisensi)

## Deskripsi
Gatcor Backend API adalah sistem backend yang komprehensif untuk aplikasi Gatcor, menyediakan berbagai fitur dan layanan untuk mendukung operasi aplikasi. API ini dibangun dengan Node.js dan Express, menggunakan Prisma sebagai ORM untuk interaksi database.

## Fitur Utama
- Sistem Autentikasi dan Otorisasi
- Manajemen Pengguna (Customer, Driver, Admin)
- Manajemen Pesanan dan Transaksi
- Sistem Notifikasi
- Manajemen Lokasi dan Geofencing
- Sistem Pembayaran
- Manajemen Promosi dan Diskon
- Sistem Rating dan Review
- Manajemen Laporan dan Analytics
- Sistem Gamifikasi
- Manajemen Survey dan Feedback
- Dokumentasi API
- Manajemen Konten
- Manajemen Aset
- Manajemen Katalog
- Manajemen Template
- Manajemen Workflow

## Teknologi yang Digunakan
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Socket.io
- AWS S3
- SendGrid
- Twilio
- Google Maps API
- Midtrans
- Firebase Cloud Messaging

## Persyaratan Sistem
- Node.js v18.0.0 atau lebih tinggi
- PostgreSQL v14.0 atau lebih tinggi
- Redis v6.0 atau lebih tinggi
- npm v8.0.0 atau lebih tinggi

## Instalasi
1. Clone repositori:
```bash
git clone https://github.com/yourusername/gatcor-backend.git
cd gatcor-backend
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment:
```bash
cp .env.example .env
```
Edit file `.env` dengan konfigurasi yang sesuai.

4. Setup database:
```bash
npx prisma migrate dev
```

5. Jalankan aplikasi:
```bash
npm run dev
```

## Struktur Proyek
```
gatcor-backend/
├── src/
│   ├── api/                    # API endpoints dan routes
│   │   ├── v1/                # API version 1
│   │   │   ├── auth/          # Autentikasi routes
│   │   │   ├── customer/      # Customer routes
│   │   │   ├── driver/        # Driver routes
│   │   │   ├── admin/         # Admin routes
│   │   │   ├── order/         # Order routes
│   │   │   ├── payment/       # Payment routes
│   │   │   ├── promotion/     # Promotion routes
│   │   │   ├── rating/        # Rating routes
│   │   │   ├── notification/  # Notification routes
│   │   │   ├── report/        # Report routes
│   │   │   ├── location/      # Location routes
│   │   │   ├── gamification/  # Gamification routes
│   │   │   ├── survey/        # Survey routes
│   │   │   ├── content/       # Content routes
│   │   │   ├── asset/         # Asset routes
│   │   │   ├── catalog/       # Catalog routes
│   │   │   ├── template/      # Template routes
│   │   │   └── workflow/      # Workflow routes
│   │   └── docs/              # API documentation
│   ├── config/                # Konfigurasi aplikasi
│   │   ├── database.ts        # Konfigurasi database
│   │   ├── redis.ts           # Konfigurasi Redis
│   │   ├── aws.ts             # Konfigurasi AWS
│   │   ├── email.ts           # Konfigurasi email
│   │   ├── sms.ts             # Konfigurasi SMS
│   │   ├── maps.ts            # Konfigurasi Maps
│   │   └── payment.ts         # Konfigurasi payment
│   ├── controllers/           # Logic bisnis
│   │   ├── auth/              # Auth controllers
│   │   ├── customer/          # Customer controllers
│   │   ├── driver/            # Driver controllers
│   │   ├── admin/             # Admin controllers
│   │   ├── order/             # Order controllers
│   │   ├── payment/           # Payment controllers
│   │   ├── promotion/         # Promotion controllers
│   │   ├── rating/            # Rating controllers
│   │   ├── notification/      # Notification controllers
│   │   ├── report/            # Report controllers
│   │   ├── location/          # Location controllers
│   │   ├── gamification/      # Gamification controllers
│   │   ├── survey/            # Survey controllers
│   │   ├── content/           # Content controllers
│   │   ├── asset/             # Asset controllers
│   │   ├── catalog/           # Catalog controllers
│   │   ├── template/          # Template controllers
│   │   └── workflow/          # Workflow controllers
│   ├── models/                # Model database
│   │   ├── user/              # User models
│   │   ├── order/             # Order models
│   │   ├── payment/           # Payment models
│   │   ├── promotion/         # Promotion models
│   │   ├── rating/            # Rating models
│   │   ├── notification/      # Notification models
│   │   ├── report/            # Report models
│   │   ├── location/          # Location models
│   │   ├── gamification/      # Gamification models
│   │   ├── survey/            # Survey models
│   │   ├── content/           # Content models
│   │   ├── asset/             # Asset models
│   │   ├── catalog/           # Catalog models
│   │   ├── template/          # Template models
│   │   └── workflow/          # Workflow models
│   ├── services/              # Layanan eksternal
│   │   ├── auth/              # Auth services
│   │   ├── email/             # Email services
│   │   ├── sms/               # SMS services
│   │   ├── payment/           # Payment services
│   │   ├── storage/           # Storage services
│   │   ├── maps/              # Maps services
│   │   ├── notification/      # Notification services
│   │   └── analytics/         # Analytics services
│   ├── middleware/            # Middleware
│   │   ├── auth.ts            # Auth middleware
│   │   ├── validation.ts      # Validation middleware
│   │   ├── error.ts           # Error handling middleware
│   │   ├── logging.ts         # Logging middleware
│   │   └── rate-limit.ts      # Rate limiting middleware
│   ├── utils/                 # Fungsi utilitas
│   │   ├── helpers/           # Helper functions
│   │   ├── validators/        # Validation functions
│   │   ├── constants/         # Constants
│   │   ├── types/             # Type definitions
│   │   └── enums/             # Enum definitions
│   ├── interfaces/            # Interface definitions
│   ├── types/                 # Type definitions
│   ├── enums/                 # Enum definitions
│   ├── constants/             # Constants
│   ├── schemas/               # Validation schemas
│   ├── seeds/                 # Database seeds
│   ├── migrations/            # Database migrations
│   └── app.ts                 # Aplikasi utama
├── tests/                     # Test cases
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   ├── e2e/                   # End-to-end tests
│   └── fixtures/              # Test fixtures
├── docs/                      # Dokumentasi
│   ├── api/                   # API documentation
│   ├── architecture/          # Architecture documentation
│   ├── deployment/            # Deployment documentation
│   └── development/           # Development documentation
├── scripts/                   # Scripts
│   ├── setup/                 # Setup scripts
│   ├── deployment/            # Deployment scripts
│   └── maintenance/           # Maintenance scripts
├── prisma/                    # Prisma configuration
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Prisma migrations
├── public/                    # File statis
│   ├── images/                # Images
│   ├── uploads/               # Uploads
│   └── assets/                # Assets
├── .env.example               # Environment variables example
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Package configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest configuration
├── docker-compose.yml         # Docker compose configuration
├── Dockerfile                 # Docker configuration
└── README.md                  # Project documentation
```

## API Endpoints

### 1. Autentikasi
#### Customer
- `POST /api/auth/customer/register` - Registrasi customer baru
- `POST /api/auth/customer/login` - Login customer
- `POST /api/auth/customer/verify-email` - Verifikasi email
- `POST /api/auth/customer/forgot-password` - Lupa password
- `POST /api/auth/customer/reset-password` - Reset password
- `POST /api/auth/customer/refresh-token` - Refresh token
- `POST /api/auth/customer/logout` - Logout

#### Driver
- `POST /api/auth/driver/register` - Registrasi driver baru
- `POST /api/auth/driver/login` - Login driver
- `POST /api/auth/driver/verify-email` - Verifikasi email
- `POST /api/auth/driver/forgot-password` - Lupa password
- `POST /api/auth/driver/reset-password` - Reset password
- `POST /api/auth/driver/refresh-token` - Refresh token
- `POST /api/auth/driver/logout` - Logout

#### Admin
- `POST /api/auth/admin/login` - Login admin
- `POST /api/auth/admin/forgot-password` - Lupa password
- `POST /api/auth/admin/reset-password` - Reset password
- `POST /api/auth/admin/refresh-token` - Refresh token
- `POST /api/auth/admin/logout` - Logout

### 2. Manajemen Customer
- `GET /api/customers` - Dapatkan semua customer
- `GET /api/customers/:id` - Dapatkan customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Hapus customer
- `GET /api/customers/:id/orders` - Dapatkan order history
- `GET /api/customers/:id/ratings` - Dapatkan rating history
- `GET /api/customers/:id/payments` - Dapatkan payment history

### 3. Manajemen Driver
- `GET /api/drivers` - Dapatkan semua driver
- `GET /api/drivers/:id` - Dapatkan driver by ID
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Hapus driver
- `GET /api/drivers/:id/orders` - Dapatkan order history
- `GET /api/drivers/:id/ratings` - Dapatkan rating history
- `GET /api/drivers/:id/earnings` - Dapatkan earning history
- `PUT /api/drivers/:id/status` - Update driver status
- `PUT /api/drivers/:id/location` - Update driver location

### 4. Manajemen Admin
#### Super Admin
- `POST /api/v1/admin` - Buat admin baru (Hanya Super Admin)
- `GET /api/v1/admin/:id` - Dapatkan admin by ID
- `PUT /api/v1/admin/:id` - Update admin (Hanya Super Admin)
- `DELETE /api/v1/admin/:id` - Hapus admin (Hanya Super Admin)
- `GET /api/v1/admin/role/:role` - Dapatkan admin berdasarkan role

#### Customer Service
- `GET /api/v1/admin/customer-service/tickets` - Kelola tiket customer service
- `GET /api/v1/admin/customer-service/tickets/:id` - Dapatkan detail tiket
- `PUT /api/v1/admin/customer-service/tickets/:id` - Update status tiket
- `POST /api/v1/admin/customer-service/tickets/:id/reply` - Balas tiket
- `GET /api/v1/admin/customer-service/statistics` - Statistik customer service

#### Admin Technical
- `GET /api/v1/admin/technical/issues` - Kelola masalah teknis
- `GET /api/v1/admin/technical/issues/:id` - Dapatkan detail masalah
- `PUT /api/v1/admin/technical/issues/:id` - Update status masalah
- `POST /api/v1/admin/technical/issues/:id/resolution` - Tambahkan solusi
- `GET /api/v1/admin/technical/statistics` - Statistik masalah teknis

#### Finance
- `GET /api/v1/admin/finance/transactions` - Kelola transaksi keuangan
- `GET /api/v1/admin/finance/transactions/:id` - Dapatkan detail transaksi
- `POST /api/v1/admin/finance/transactions` - Buat transaksi baru
- `PUT /api/v1/admin/finance/transactions/:id` - Update transaksi
- `GET /api/v1/admin/finance/reports` - Generate laporan keuangan
- `GET /api/v1/admin/finance/statistics` - Statistik keuangan

### 5. Manajemen Order
- `POST /api/orders` - Buat order baru
- `GET /api/orders` - Dapatkan semua orders
- `GET /api/orders/:id` - Dapatkan order by ID
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/tracking` - Track order
- `POST /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/rate` - Rate order

### 6. Manajemen Payment
- `POST /api/payments` - Buat payment baru
- `GET /api/payments` - Dapatkan semua payments
- `GET /api/payments/:id` - Dapatkan payment by ID
- `POST /api/payments/:id/process` - Process payment
- `POST /api/payments/:id/refund` - Refund payment
- `GET /api/payments/:id/history` - Dapatkan payment history

### 7. Manajemen Promosi
- `POST /api/promotions` - Buat promotion baru
- `GET /api/promotions` - Dapatkan semua promotions
- `GET /api/promotions/:id` - Dapatkan promotion by ID
- `PUT /api/promotions/:id` - Update promotion
- `DELETE /api/promotions/:id` - Hapus promotion
- `POST /api/promotions/:id/apply` - Apply promotion
- `GET /api/promotions/active` - Dapatkan active promotions

### 8. Manajemen Rating
- `POST /api/ratings` - Buat rating baru
- `GET /api/ratings` - Dapatkan semua ratings
- `GET /api/ratings/:id` - Dapatkan rating by ID
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Hapus rating
- `GET /api/ratings/user/:userId` - Dapatkan user ratings
- `GET /api/ratings/order/:orderId` - Dapatkan order rating

### 9. Manajemen Notifikasi
- `POST /api/notifications` - Buat notification baru
- `GET /api/notifications` - Dapatkan semua notifications
- `GET /api/notifications/:id` - Dapatkan notification by ID
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Hapus notification
- `GET /api/notifications/user/:userId` - Dapatkan user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### 10. Manajemen Laporan
- `GET /api/reports/orders` - Generate order report
- `GET /api/reports/payments` - Generate payment report
- `GET /api/reports/drivers` - Generate driver report
- `GET /api/reports/customers` - Generate customer report
- `GET /api/reports/promotions` - Generate promotion report
- `GET /api/reports/ratings` - Generate rating report
- `GET /api/reports/analytics` - Generate analytics report

### 11. Manajemen Lokasi
- `GET /api/locations/search` - Search locations
- `GET /api/locations/geocode` - Geocode address
- `GET /api/locations/reverse-geocode` - Reverse geocode coordinates
- `POST /api/locations/geofence` - Create geofence
- `GET /api/locations/geofence/:id` - Get geofence
- `PUT /api/locations/geofence/:id` - Update geofence
- `DELETE /api/locations/geofence/:id` - Delete geofence

### 12. Sistem Gamifikasi
- `GET /api/gamification/achievements` - Get all achievements
- `GET /api/gamification/achievements/:id` - Get achievement by ID
- `POST /api/gamification/achievements` - Create achievement
- `PUT /api/gamification/achievements/:id` - Update achievement
- `DELETE /api/gamification/achievements/:id` - Delete achievement
- `GET /api/gamification/rewards` - Get all rewards
- `GET /api/gamification/rewards/:id` - Get reward by ID
- `POST /api/gamification/rewards` - Create reward
- `PUT /api/gamification/rewards/:id` - Update reward
- `DELETE /api/gamification/rewards/:id` - Delete reward
- `GET /api/gamification/quests` - Get all quests
- `GET /api/gamification/quests/:id` - Get quest by ID
- `POST /api/gamification/quests` - Create quest
- `PUT /api/gamification/quests/:id` - Update quest
- `DELETE /api/gamification/quests/:id` - Delete quest

### 13. Sistem Survey & Feedback
- `GET /api/surveys` - Get all surveys
- `GET /api/surveys/:id` - Get survey by ID
- `POST /api/surveys` - Create survey
- `PUT /api/surveys/:id` - Update survey
- `DELETE /api/surveys/:id` - Delete survey
- `POST /api/surveys/:id/responses` - Submit survey response
- `GET /api/surveys/:id/responses` - Get survey responses
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### 14. Dokumentasi API
- `GET /api/docs` - Get API documentation
- `GET /api/docs/:version` - Get specific version documentation
- `POST /api/docs/test` - Test API endpoint
- `GET /api/docs/status` - Get API status
- `GET /api/docs/health` - Get API health check

### 15. Manajemen Konten
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get content by ID
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `GET /api/content/categories` - Get content categories
- `POST /api/content/categories` - Create content category
- `PUT /api/content/categories/:id` - Update content category
- `DELETE /api/content/categories/:id` - Delete content category

### 16. Manajemen Aset
- `POST /api/assets/upload` - Upload asset
- `GET /api/assets/:id` - Get asset by ID
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets` - Get all assets
- `PUT /api/assets/:id` - Update asset metadata
- `POST /api/assets/:id/process` - Process asset
- `GET /api/assets/:id/url` - Get asset URL

### 17. Manajemen Katalog
- `GET /api/catalog` - Get all catalog items
- `GET /api/catalog/:id` - Get catalog item by ID
- `POST /api/catalog` - Create catalog item
- `PUT /api/catalog/:id` - Update catalog item
- `DELETE /api/catalog/:id` - Delete catalog item
- `GET /api/catalog/categories` - Get catalog categories
- `POST /api/catalog/categories` - Create catalog category
- `PUT /api/catalog/categories/:id` - Update catalog category
- `DELETE /api/catalog/categories/:id` - Delete catalog category

### 18. Manajemen Template
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/use` - Use template
- `GET /api/templates/categories` - Get template categories
- `POST /api/templates/categories` - Create template category
- `PUT /api/templates/categories/:id` - Update template category
- `DELETE /api/templates/categories/:id` - Delete template category

### 19. Manajemen Workflow
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/:id` - Get workflow by ID
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/:id/status` - Get workflow status
- `GET /api/workflows/:id/history` - Get workflow history

## Sistem Tambahan
Sistem-sistem tambahan berikut telah diintegrasikan untuk meningkatkan fungsionalitas dan pengalaman pengguna:

1. **Gamification System**
   - Achievement tracking
   - Reward management
   - Quest system
   - Leaderboard
   - Progress tracking

2. **Survey & Feedback System**
   - Survey creation and management
   - Response collection
   - Feedback analysis
   - User satisfaction tracking
   - Improvement suggestions

3. **API Documentation System**
   - Swagger/OpenAPI integration
   - Endpoint testing
   - Version management
   - Health monitoring
   - Usage analytics

4. **Content Management System**
   - Content creation and editing
   - Version control
   - Category management
   - Content scheduling
   - Multi-language support

5. **Asset Management System**
   - File upload and storage
   - Media processing
   - Asset organization
   - Access control
   - CDN integration

6. **Catalog Management System**
   - Product/service management
   - Category organization
   - Pricing management
   - Inventory tracking
   - Availability management

7. **Template Management System**
   - Template creation
   - Version control
   - Category organization
   - Template usage tracking
   - Customization options

8. **Workflow Management System**
   - Process automation
   - Task management
   - Approval workflows
   - Status tracking
   - History logging

## Kontribusi
Kami menerima kontribusi dari komunitas. Untuk berkontribusi:
1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi
Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## Kontak
Untuk pertanyaan atau masukan, silakan hubungi:
- Email: support@gatcor.com
- Website: https://www.gatcor.com
- Twitter: @gatcor
- LinkedIn: Gatcor Company