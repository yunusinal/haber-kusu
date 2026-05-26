# HaberKusu - Yapay Zeka Destekli Haber Platformu

**HaberKusu**, 270+ farklı Türk haber kaynağından haberleri toplayıp, yapay zeka ile kişiselleştirilmiş bir deneyim sunan haber aggregasyon platformudur. Kullanıcının okuma alışkanlıklarını analiz ederek ilgi alanlarına göre haber akışı oluşturur.

> **Backend:** Python / FastAPI · **Frontend:** Next.js 14 · **Veritabanı:** PostgreSQL · **Cache:** Redis

<p align="center">
  <img src="assets/homepage.png" alt="HaberKusu Ana Sayfa" width="100%" />
</p>


---

## Özellikler

### Kişiselleştirilmiş Haber Akışı
Okuma geçmişine ve beğenilerine göre yapay zeka tarafından seçilen haberler. Ne kadar çok okursan, algoritma o kadar iyi hale gelir.

<p align="center">
  <img src="assets/personalized-feed.png" alt="Sana Özel Feed" width="100%" />
</p>

### Haber Detay ve Etkileşim
Her haber için beğenme, kaydetme, paylaşma ve AI özet alma imkanı. Sağ panelde benzer haberler listelenir.

<p align="center">
  <img src="assets/article-detail.png" alt="Haber Detay Sayfası" width="100%" />
</p>

### Diğer Özellikler

| Özellik | Açıklama |
|---------|----------|
| **16 Kategori** | Gündem, Teknoloji, Finans, Spor, Bilim, Sağlık, Sinema, Kripto ve daha fazlası |
| **270+ Kaynak** | Türkiye'nin önde gelen haber kaynaklarından anlık veri toplama |
| **Tam Metin Arama** | Başlık ve içerik üzerinde arama |
| **Anonim Kullanıcı Takibi** | Kayıt olmadan kişiselleştirilmiş deneyim (UUID bazlı) |
| **Gerçek Zamanlı** | Dakikalar içinde sisteme eklenen güncel haberler |
| **Responsive Tasarım** | Mobil ve masaüstü uyumlu dark theme arayüz |

---

## Teknoloji Altyapısı

### Backend
- **FastAPI** — Async Python web framework
- **PostgreSQL** — Ana veritabanı (asyncpg driver)
- **SQLAlchemy 2.0** — Async ORM
- **Alembic** — Veritabanı migration yönetimi
- **Redis** — Cache ve session yönetimi

### Frontend
- **Next.js 14** — React framework (App Router)
- **TypeScript** — Tip güvenli frontend
- **Tailwind CSS** — Utility-first CSS framework
- **Server-Side Rendering** — SEO ve performans optimizasyonu

### Veri Toplama
- **RSS Feed Parser** — Çoklu kaynak desteği
- **Web Scraping** — HTML temizleme ve normalizasyon
- **ETL Pipeline** — Otomatik veri toplama, temizleme ve veritabanına aktarım (30 dk aralıkla)
- **Duplicate Detection** — URL hash ve content hash ile mükerrer haber engelleme

### Altyapı
- **Docker Compose** — PostgreSQL ve Redis container yönetimi

---

## Mimari

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  COLLECTOR   │────▶│  PROCESSOR  │────▶│   STORAGE   │────▶│     API     │
│  (Scraper)   │     │  (Cleaner)  │     │ (PostgreSQL)│     │  (FastAPI)  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                              ┌─────▼──────┐
                                                              │  FRONTEND  │
                                                              │  (Next.js) │
                                                              └────────────┘
```

**Akış:**
1. **Collector** — RSS feed'ler ve web scraping ile haber toplama
2. **Processor** — HTML temizleme, tarih normalizasyonu, duplicate filtreleme
3. **Storage** — PostgreSQL'e upsert (link uniqueness + content hash)
4. **API** — FastAPI ile RESTful endpoints
5. **Frontend** — Next.js 14 ile SSR destekli kullanıcı arayüzü

---

## Kurulum

### Gereksinimler
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

### 1. Altyapıyı Başlat

```bash
docker-compose up -d   # PostgreSQL (5432) + Redis (6379)
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt

# .env dosyası oluştur
cp .env.example .env   # DATABASE_URL ve REDIS_URL değerlerini düzenle

# Migration'ları uygula
alembic upgrade head

# Sunucuyu başlat
uvicorn app.main:app --reload   # http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install

# .env.local dosyası oluştur
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Geliştirme sunucusu
npm run dev   # http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/articles` | Sayfalanmış haber listesi (kategori filtresi destekler) |
| `GET` | `/api/articles/{id}` | Tekil haber detayı |
| `GET` | `/api/articles/search?q=...` | Tam metin arama (başlık + içerik) |
| `GET` | `/api/categories` | Tüm kategoriler |
| `GET` | `/api/sources` | Haber kaynakları listesi |
| `POST` | `/api/users/anonymous` | Anonim kullanıcı oturumu oluştur |
| `POST` | `/api/interactions` | Kullanıcı etkileşimi kaydet (görüntüleme, beğeni, kaydetme) |
| `GET` | `/api/recommendations` | Kişiselleştirilmiş haber önerileri |
| `GET` | `/health` | Sağlık kontrolü |

---

## Proje Yapısı

```
haberkusu/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI uygulama kurulumu
│   │   ├── database.py          # Async SQLAlchemy engine
│   │   ├── models.py            # ORM modelleri
│   │   ├── schemas.py           # Pydantic v2 şemaları
│   │   ├── exceptions.py        # Hata yönetimi
│   │   ├── routers/             # Endpoint handler'ları
│   │   │   ├── articles.py
│   │   │   ├── categories.py
│   │   │   ├── sources.py
│   │   │   ├── users.py
│   │   │   ├── interactions.py
│   │   │   └── recommendations.py
│   │   └── services/            # İş mantığı katmanı
│   │       ├── articles.py
│   │       ├── recommendations.py
│   │       └── ...
│   ├── alembic/                 # Veritabanı migration'ları
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router sayfaları
│   │   │   ├── page.tsx         # Ana sayfa
│   │   │   ├── articles/[id]/   # Haber detay sayfası
│   │   │   ├── sana-ozel/       # Kişiselleştirilmiş akış
│   │   │   └── search/          # Arama sonuçları
│   │   ├── components/          # React bileşenleri
│   │   │   ├── NewsCard.tsx
│   │   │   ├── ArticleActions.tsx
│   │   │   ├── RecommendationFeed.tsx
│   │   │   └── ...
│   │   └── lib/                 # Yardımcı fonksiyonlar
│   │       ├── api.ts           # API istemcisi
│   │       └── types.ts         # TypeScript tipleri
│   ├── package.json
│   └── tailwind.config.ts
│
└── docker-compose.yml           # PostgreSQL + Redis
```

---

## Veritabanı Şeması

```
categories ──┐
             ├──▶ sources ──▶ articles
             │                    │
             └────────────────────┤
                                  ▼
                    anonymous_users ──▶ interactions ──▶ recommendations
```

**Temel Tablolar:**
- `categories` — Haber kategorileri (16 adet)
- `sources` — Haber kaynakları (270+ adet), her biri bir kategoriye bağlı
- `articles` — Haberler (link unique, content_hash ile duplicate tespiti)
- `scrape_runs` — Veri toplama çalışma kayıtları
- `anonymous_users` — UUID bazlı anonim kullanıcılar
- `interactions` — Kullanıcı etkileşimleri (görüntüleme, beğeni, kaydetme, paylaşma)
- `recommendations` — Kişiselleştirilmiş öneri kayıtları

---

## Ortam Değişkenleri

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ainews_db
REDIS_URL=redis://localhost:6379
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Lisans

Bu proje eğitim ve portfolyo amaçlı geliştirilmiştir.
