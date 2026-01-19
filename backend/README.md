# ArtFlow Backend API

Backend API per l'applicazione ArtFlow, costruito con Node.js, Express, TypeScript, Prisma e PostgreSQL.

## 🚀 Setup

### Prerequisiti
- Node.js (v18 o superiore)
- PostgreSQL (locale o cloud)
- npm o yarn

### Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. Configura le variabili d'ambiente:
```bash
cp .env.example .env
```

3. Modifica il file `.env` con le tue configurazioni:
   - `DATABASE_URL`: URL di connessione al database PostgreSQL
   - `JWT_SECRET`: Chiave segreta per JWT (usa una stringa casuale sicura)
   - `PORT`: Porta del server (default: 3001)
   - `CORS_ORIGIN`: URL del frontend (default: http://localhost:3000)

4. Inizializza Prisma:
```bash
npm run prisma:generate
```

5. Esegui le migrazioni del database:
```bash
npm run prisma:migrate
```

## 📝 Scripts Disponibili

- `npm run dev` - Avvia il server in modalità sviluppo con hot-reload
- `npm run build` - Compila TypeScript in JavaScript
- `npm start` - Avvia il server in produzione (dopo il build)
- `npm run prisma:generate` - Genera il Prisma Client
- `npm run prisma:migrate` - Esegue le migrazioni del database
- `npm run prisma:studio` - Apre Prisma Studio per visualizzare il database

## 🏗️ Struttura del Progetto

```
backend/
├── src/
│   ├── index.ts          # Entry point del server
│   ├── routes/           # Route handlers
│   ├── controllers/      # Business logic
│   ├── services/         # Servizi (es. auth, database)
│   ├── middleware/       # Middleware personalizzati
│   └── types/            # TypeScript types
├── prisma/
│   └── schema.prisma     # Schema del database
├── dist/                 # Build output (generato)
├── .env                  # Variabili d'ambiente (non committare)
├── tsconfig.json         # Configurazione TypeScript
└── package.json
```

## 🔗 Endpoints

- `GET /health` - Health check
- `GET /` - Informazioni API

