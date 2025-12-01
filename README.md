# Чистая Планета - Clean Planet

Платформа для приема и обработки заявок на вывоз металлолома.

## 🚀 Быстрый старт

### Требования
- Docker и Docker Compose
- Node.js 20+ (для локальной разработки)
- Git

### Локальная разработка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/enkinvsh/cleanplanetru.git
cd cleanplanetru
```

2. **Создайте .env файл:**
```bash
cp .env.example .env
# Отредактируйте .env и добавьте переменные
```

3. **Запустите сервисы:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

4. **Откройте в браузере:**
- Frontend: http://localhost:3000
- CRM: http://localhost:8080

### Production деплой

См. подробные инструкции в разделе [Деплой](#деплой)

---

## 📁 Структура проекта

```
clean-planet/
├── scripts/              # Скрипты для настройки сервера
│   ├── server-setup.sh   # Установка Docker, firewall, безопасность
│   ├── ssh-hardening.sh  # Усиление SSH безопасности
│   ├── certbot-init.sh   # Получение SSL сертификатов
│   └── deploy.sh         # Автодеплой из Git
├── infra/
│   └── nginx/            # Nginx конфигурация
├── services/
│   ├── frontend/         # Next.js приложение
│   └── crm/              # EspoCRM кастомизации
├── volumes/              # Docker volumes (не коммитится)
└── docker-compose.yml    # Production конфигурация
```

---

## 🛠 Технологический стек

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, PWA
- **Backend:** EspoCRM (PHP CRM система)
- **Database:** MySQL 8.0
- **Infrastructure:** Docker, Nginx, Let's Encrypt
- **CI/CD:** GitHub Actions

---

## 🔒 Деплой на production сервер

### 1. Подготовка сервера (Ubuntu 24.04)

**SSH подключение:**
```bash
ssh root@46.8.29.27
```

**Запуск скрипта настройки:**
```bash
# Клонируем репозиторий
cd /opt
git clone https://github.com/enkinvsh/cleanplanetru.git cleanplanet
cd cleanplanet

# Запускаем установку
sudo bash scripts/server-setup.sh
```

Скрипт установит:
- Docker и Docker Compose
- UFW firewall (порты 22, 80, 443)
- fail2ban для защиты от брутфорса
- Автоматические обновления безопасности
- Создаст пользователя `deploy`

**Настройка SSH (ВАЖНО!):**

⚠️ **ВНИМАНИЕ:** После выполнения этого скрипта доступ по паролю будет отключен!

```bash
# Сначала скопируйте свой SSH ключ на сервер:
ssh-copy-id root@46.8.29.27

# Затем запустите:
sudo bash scripts/ssh-hardening.sh

# Проверьте подключение в новом терминале:
ssh deploy@46.8.29.27
```

### 2. Настройка окружения

**Создайте production .env файл:**
```bash
cd /opt/cleanplanet
cp .env.example .env.production
nano .env.production
```

**Сгенерируйте безопасные пароли:**
```bash
# Пример генерации паролей
openssl rand -base64 32  # Для DB_ROOT_PASSWORD
openssl rand -base64 32  # Для DB_PASSWORD
openssl rand -base64 32  # Для ESPO_ADMIN_PASSWORD
```

**Важные переменные:**
- `DB_ROOT_PASSWORD` - пароль root для MySQL
- `DB_PASSWORD` - пароль для пользователя БД
- `ESPO_ADMIN_PASSWORD` - пароль админа CRM
- `TELEGRAM_BOT_TOKEN` - токен вашего бота
- `ESPO_API_KEY` - будет создан после установки CRM

### 3. SSL сертификаты

**Получение Let's Encrypt сертификатов:**

1. Отредактируйте скрипт certbot-init.sh и укажите email:
```bash
nano scripts/certbot-init.sh
# Измените EMAIL="your-email@example.com"
```

2. Запустите:
```bash
sudo bash scripts/certbot-init.sh
```

Сертификаты будут автоматически обновляться каждые 12 часов.

### 4. Запуск приложения

```bash
cd /opt/cleanplanet

# Скопируйте production env
cp .env.production .env

# Запустите все сервисы
docker compose up -d

# Проверьте статус
docker compose ps

# Просмотр логов
docker compose logs -f
```

### 5. Настройка EspoCRM

1. Откройте https://crm.clean.meybz.asia
2. Войдите с учетными данными из `.env.production`
3. Перейдите в **Administration → API Users**
4. Создайте нового API пользователя
5. Скопируйте API Key
6. Добавьте в `.env.production`:
   ```
   ESPO_API_KEY=your_api_key_here
   ```
7. Перезапустите frontend:
   ```bash
   docker compose restart frontend
   ```

---

## 🔄 Автоматический деплой

### Настройка GitHub Actions

1. **Создайте SSH ключ для деплоя:**
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

2. **Добавьте публичный ключ на сервер:**
```bash
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@46.8.29.27
```

3. **Добавьте приватный ключ в GitHub Secrets:**
   - Откройте Settings → Secrets and variables → Actions
   - Создайте secrets:
     - `SSH_PRIVATE_KEY` - содержимое `~/.ssh/github_deploy`
     - `SSH_HOST` - `46.8.29.27`
     - `SSH_USER` - `deploy`

После настройки, каждый push в `main` ветку будет автоматически деплоить изменения.

---

## 🧪 Тестирование

### Локально

```bash
# TypeScript проверка
cd services/frontend
npm run type-check

# Сборка
npm run build
```

### Production

```bash
# Health check
curl https://clean.meybz.asia/api/health

# SSL проверка
curl -I https://clean.meybz.asia

# Docker статус
docker compose ps

# Логи
docker compose logs --tail=100 frontend
```

---

## 📱 PWA (Progressive Web App)

Приложение можно установить на мобильные устройства:

**iOS:**
1. Откройте clean.meybz.asia в Safari
2. Нажмите "Поделиться"
3. Выберите "На экран Домой"

**Android:**
1. Откройте clean.meybz.asia в Chrome
2. Нажмите "Установить приложение"

---

## 🔧 Обслуживание

### Резервное копирование

**Backup базы данных:**
```bash
docker exec cleanplanet_db mysqldump -u root -p cleanplanet > backup_$(date +%Y%m%d).sql
```

**Восстановление:**
```bash
docker exec -i cleanplanet_db mysql -u root -p cleanplanet < backup_20250102.sql
```

### Обновление

```bash
cd /opt/cleanplanet
bash scripts/deploy.sh
```

### Мониторинг

```bash
# Использование ресурсов
docker stats

# Логи с фильтрацией
docker compose logs -f --tail=100 frontend | grep ERROR

# Проверка дискового пространства
df -h
du -sh volumes/
```

---

## 🆘 Troubleshooting

### Frontend не стартует

```bash
# Проверьте логи
docker compose logs frontend

# Пересоберите образ
docker compose build --no-cache frontend
docker compose up -d frontend
```

### CRM недоступен

```bash
# Проверьте статус БД
docker compose logs db

# Проверьте EspoCRM
docker compose logs espocrm

# Перезапустите
docker compose restart espocrm
```

### SSL сертификаты не обновляются

```bash
# Проверьте Certbot логи
docker compose logs certbot

# Вручную обновите
docker compose run --rm certbot renew
docker compose restart nginx
```

---

## 📞 Контакты

- **Разработчик:** enkinvsh
- **Репозиторий:** https://github.com/enkinvsh/cleanplanetru
- **Сервер:** 46.8.29.27
- **Домены:** 
  - https://clean.meybz.asia
  - https://crm.clean.meybz.asia

---

## 📄 Лицензия

Проприетарный проект. Все права защищены.
