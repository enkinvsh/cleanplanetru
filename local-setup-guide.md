# Руководство по локальному развертыванию проекта Clean Planet

## Для Planning Agent: Полная спецификация задачи

### Цель
Создать полностью рабочее локальное окружение проекта Clean Planet на macOS с Docker, включающее Next.js frontend, EspoCRM backend и MySQL/MariaDB базу данных.

### Технологический стек
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: EspoCRM (PHP-based CRM)
- **Database**: MySQL 8.0 или MariaDB (ESCPOCRM)
- **Инфраструктура**: Docker + Docker Compose
- **Package Manager**: npm

---

## Структура проекта для создания

```
clean-planet/
├── .env.example                    # Шаблон переменных окружения
├── .env                            # Реальные переменные (git ignore)
├── .gitignore
├── docker-compose.yml              # Основной файл для локальной разработки
├── README.md
│
├── infra/
│   ├── nginx.conf                  # Конфигурация Nginx
│   └── ssl/                        # Папка для SSL сертификатов (пустая для локалки)
│
├── services/
│   ├── frontend/                   # Next.js приложение
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   │
│   │   ├── public/
│   │   │   ├── images/
│   │   │   └── manifest.json       # PWA manifest
│   │   │
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── globals.css
│   │       │   │
│   │       │   ├── (site)/         # Публичный сайт
│   │       │   │   ├── page.tsx    # Главная страница
│   │       │   │   └── about/
│   │       │   │       └── page.tsx
│   │       │   │
│   │       │   ├── (tma)/          # Telegram Mini App
│   │       │   │   ├── layout.tsx
│   │       │   │   └── webapp/
│   │       │   │       └── page.tsx
│   │       │   │
│   │       │   └── api/            # API Routes (Middleware)
│   │       │       ├── health/
│   │       │       │   └── route.ts
│   │       │       ├── leads/
│   │       │       │   └── route.ts
│   │       │       └── webhook/
│   │       │           └── route.ts
│   │       │
│   │       ├── components/
│   │       │   ├── ui/             # shadcn/ui компоненты
│   │       │   │   ├── button.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   └── form.tsx
│   │       │   ├── forms/
│   │       │   │   └── LeadForm.tsx
│   │       │   ├── layout/
│   │       │   │   ├── Header.tsx
│   │       │   │   └── Footer.tsx
│   │       │   └── TelegramProvider.tsx
│   │       │
│   │       ├── lib/
│   │       │   ├── espo.ts         # EspoCRM API клиент
│   │       │   ├── validators.ts   # Zod схемы
│   │       │   ├── telegram.ts     # Валидация Telegram initData
│   │       │   ├── rate-limit.ts   # Rate limiting
│   │       │   └── logger.ts       # Winston/Pino логгер
│   │       │
│   │       └── types/
│   │           └── index.ts        # TypeScript типы
│   │
│   └── crm/                        # EspoCRM кастомизация
│       ├── Dockerfile              # (опционально, если нужны расширения)
│       ├── custom/
│       │   └── Espo/Custom/Resources/
│       │       └── metadata/
│       │           ├── entityDefs/
│       │           │   └── Lead.json
│       │           └── clientDefs/
│       │               └── Lead.json
│       └── data/
│           └── config.php
│
└── volumes/                        # Docker volumes (в .gitignore!)
    ├── mysql_data/
    └── espo_data/
```

---

## Спецификация файлов

### 1. docker-compose.yml

```yaml
version: '3.8'

services:
  # MySQL Database
  db:
    image: mysql:8.0
    container_name: cleanplanet_db
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./volumes/mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - cleanplanet_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # EspoCRM
  espocrm:
    image: espocrm/espocrm:latest
    container_name: cleanplanet_crm
    restart: unless-stopped
    environment:
      ESPOCRM_DATABASE_HOST: db
      ESPOCRM_DATABASE_NAME: ${DB_NAME}
      ESPOCRM_DATABASE_USER: ${DB_USER}
      ESPOCRM_DATABASE_PASSWORD: ${DB_PASSWORD}
      ESPOCRM_ADMIN_USERNAME: ${ESPO_ADMIN_USERNAME}
      ESPOCRM_ADMIN_PASSWORD: ${ESPO_ADMIN_PASSWORD}
      ESPOCRM_SITE_URL: http://localhost:8080
    volumes:
      - ./volumes/espo_data:/var/www/html/data
      - ./services/crm/custom:/var/www/html/custom
    ports:
      - "8080:80"
    networks:
      - cleanplanet_network
    depends_on:
      db:
        condition: service_healthy

  # Next.js Frontend
  frontend:
    build:
      context: ./services/frontend
      dockerfile: Dockerfile
    container_name: cleanplanet_frontend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      ESPO_API_URL: http://espocrm:80
      ESPO_API_KEY: ${ESPO_API_KEY}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      NEXT_PUBLIC_API_URL: http://localhost:3000
    volumes:
      - ./services/frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    networks:
      - cleanplanet_network
    depends_on:
      - espocrm
    command: npm run dev

networks:
  cleanplanet_network:
    driver: bridge

volumes:
  mysql_data:
  espo_data:
```

### 2. .env.example

```bash
# Database Configuration
DB_ROOT_PASSWORD=rootpassword123
DB_NAME=espocrm
DB_USER=espocrm_user
DB_PASSWORD=espocrm_pass123

# EspoCRM Configuration
ESPO_ADMIN_USERNAME=admin
ESPO_ADMIN_PASSWORD=admin123
ESPO_API_KEY=your_api_key_here

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Application URLs (for local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ESPO_SITE_URL=http://localhost:8080
```

### 3. services/frontend/Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Development image
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev"]

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
```

### 4. services/frontend/.dockerignore

```
node_modules
.next
.git
.gitignore
README.md
.env
.env.local
```

### 5. services/frontend/package.json

```json
{
  "name": "clean-planet-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zod": "^3.23.0",
    "lru-cache": "^10.2.0",
    "winston": "^3.13.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.378.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
```

### 6. services/frontend/next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:8080']
    }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### 7. services/frontend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 8. services/frontend/tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 9. Ключевые файлы приложения

#### src/lib/espo.ts
```typescript
const ESPO_API_URL = process.env.ESPO_API_URL;
const ESPO_API_KEY = process.env.ESPO_API_KEY;

export async function createLead(data: {
  name: string;
  phoneNumber: string;
  address?: string;
  description?: string;
}) {
  const response = await fetch(`${ESPO_API_URL}/api/v1/Lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': ESPO_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`EspoCRM API error: ${response.statusText}`);
  }

  return response.json();
}
```

#### src/lib/validators.ts
```typescript
import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона'),
  address: z.string().optional(),
  description: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
```

#### src/lib/telegram.ts
```typescript
import crypto from 'crypto';

export function validateTelegramWebAppData(initData: string): boolean {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return false;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) return false;

  urlParams.delete('hash');
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

#### src/lib/rate-limit.ts
```typescript
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 60000, // 1 минута
});

export function checkRateLimit(ip: string, limit = 5): boolean {
  const tokenCount = rateLimit.get(ip) || 0;
  if (tokenCount >= limit) return false;
  rateLimit.set(ip, tokenCount + 1);
  return true;
}
```

#### src/app/api/leads/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/lib/validators';
import { createLead } from '@/lib/espo';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Слишком много запросов. Попробуйте позже.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = leadFormSchema.parse(body);
    
    const lead = await createLead(validatedData);
    
    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Ошибка создания заявки' },
      { status: 500 }
    );
  }
}
```

---

## Инструкции по запуску

### Шаг 1: Предварительные требования
```bash
# Проверить установку Docker
docker --version

# Проверить Docker Compose
docker compose version

# Установить Node.js (если нужно)
brew install node@20
```

### Шаг 2: Создание проекта
```bash
# Создать структуру
mkdir -p clean-planet && cd clean-planet

# Скопировать .env.example в .env и заполнить значения
cp .env.example .env

# Отредактировать .env файл
nano .env  # или используйте VS Code
```

### Шаг 3: Запуск инфраструктуры
```bash
# Запустить все сервисы
docker compose up -d

# Проверить статус
docker compose ps

# Логи
docker compose logs -f frontend
```

### Шаг 4: Первоначальная настройка EspoCRM
1. Открыть http://localhost:8080
2. Войти (admin / admin123)
3. Перейти в Administration → API Users
4. Создать API пользователя, скопировать API Key
5. Добавить API Key в `.env` как `ESPO_API_KEY`

### Шаг 5: Перезапуск frontend с новым API ключом
```bash
docker compose restart frontend
```

### Шаг 6: Проверка
- Frontend: http://localhost:3000
- CRM: http://localhost:8080
- Health Check: http://localhost:3000/api/health

---

## Задачи для Planning Agent

1. **Создать структуру папок** согласно схеме выше
2. **Настроить Next.js проект** с указанными зависимостями
3. **Создать базовые компоненты**:
   - Layout (Header, Footer)
   - LeadForm с валидацией
   - TelegramProvider
4. **Реализовать API Routes**:
   - `/api/leads` - создание заявок
   - `/api/health` - проверка здоровья
5. **Добавить страницы**:
   - Главная (site)
   - Telegram Mini App (tma)
6. **Настроить shadcn/ui**:
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button input form
   ```
7. **Создать Docker конфигурацию**
8. **Добавить .gitignore** с volumes/, .env, node_modules

---

## Ожидаемый результат

После выполнения всех шагов должно быть:
- ✅ Рабочий Next.js сайт на http://localhost:3000
- ✅ EspoCRM на http://localhost:8080
- ✅ Работающая форма создания заявок
- ✅ Валидация всех входных данных
- ✅ Rate limiting на эндпоинтах
- ✅ Health check эндпоинт
- ✅ TypeScript без ошибок
- ✅ Готовность к добавлению Telegram Mini App функционала