# 🎙️ VoiceNote AI

Мобильное веб-приложение для голосовых заметок с AI-обработкой.

## Стек
- **Фронт**: React + Vite + Tailwind CSS + Zustand
- **Бек**: Node.js + Express
- **БД**: PostgreSQL + Prisma ORM
- **AI**: OpenAI Whisper (транскрипция) + GPT-4o (анализ)

## Быстрый старт

### 1. База данных
```bash
# Установи PostgreSQL и создай БД
createdb voicenote_ai
```

### 2. Бекенд
```bash
cd server
cp .env.example .env
# Заполни DATABASE_URL, JWT_SECRET, OPENAI_API_KEY

npm install
npx prisma db push
npm run dev
```

### 3. Фронтенд
```bash
cd client
npm install
npm run dev
```

Открой http://localhost:5173

## Структура
```
voicenote-ai/
├── client/          # React фронт
│   └── src/
│       ├── api/     # axios запросы
│       ├── components/
│       ├── pages/   # все страницы
│       ├── store/   # Zustand
│       └── hooks/   # useAudioRecorder
└── server/          # Express бек
    ├── prisma/      # схема БД
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/
        └── services/  # Whisper + GPT
```

## API
| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Логин |
| GET | /api/notes | Все заметки |
| POST | /api/audio/upload | Загрузить аудио → AI |
| GET | /api/chat/:noteId | История чата |
| POST | /api/chat/:noteId | Сообщение AI |
