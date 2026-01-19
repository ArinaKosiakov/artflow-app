# Piano di Migrazione Full-Stack - ArtFlow App

## 📋 Analisi dell'App Attuale

### Funzionalità Esistenti
L'app **ArtFlow** è attualmente un'applicazione Electron con frontend React che gestisce:

1. **Projects (Progetti)**
   - Titolo, descrizione, deadline, status
   - Steps (checklist) con stato done/undone
   - Progress tracking

2. **Content Ideas (Idee Contenuti)**
   - Titolo, piattaforma (YouTube, TikTok, Instagram, Twitter, Facebook)
   - Deadline, stato done/undone
   - Dettagli opzionali

3. **Prompts/Idee (Prompt AI)**
   - Titolo, testo del prompt
   - Data di salvataggio
   - Drag & drop per riordinamento

4. **AI Assistant (Chat)**
   - Messaggi utente/assistente
   - Attualmente mock (risposte hardcoded)

6. **Settings**
   - Dark mode (salvato in localStorage)

### Stato Attuale
- ✅ Frontend React + TypeScript + Tailwind CSS
- ✅ Electron per desktop app
- ✅ i18n (inglese/italiano)
- ✅ Pagine Login e Registrazione (UI completa)
- ✅ Sezione Profilo nella Sidebar
- ✅ Modal Profilo (foto, nome, email, password)
- ✅ Gestione Dark Mode
- ✅ Versione app nella Sidebar
- ❌ Nessun backend
- ❌ Nessun database
- ❌ Dati solo in memoria (useState)
- ❌ Autenticazione solo mock (frontend)
- ❌ Nessuna sincronizzazione

---

## 🛠️ Stack Tecnologico Scelto

**Backend:**
- **Node.js + Express** o **Next.js API Routes**
- **TypeScript** (per coerenza con il frontend)
- **Prisma ORM** (type-safe, ottimo per portfolio)
- **PostgreSQL** (database relazionale robusto)

**Vantaggi:**
- TypeScript end-to-end
- Prisma genera types automaticamente
- PostgreSQL è industry standard
- Facile da deployare (Vercel, Railway, Render)

---

## 🗄️ Schema Database

### PostgreSQL con Prisma

#### 1. **Users Table** (per autenticazione)
```sql
- id: UUID (primary key)
- email: String (unique)
- password: String (hashed)
- name: String (per visualizzazione nella sidebar)
- profilePicture: String? (URL o path alla foto profilo)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 2. **Projects Table**
```sql
- id: UUID (primary key)
- userId: UUID (foreign key -> Users.id)
- title: String (required)
- description: String (optional)
- deadline: Date (optional)
- status: Enum ('not-started', 'in-progress', 'completed')
- createdAt: DateTime
- updatedAt: DateTime
- order: Int (per ordinamento personalizzato)
```

#### 3. **ProjectSteps Table**
```sql
- id: UUID (primary key)
- projectId: UUID (foreign key -> Projects.id)
- text: String (required)
- done: Boolean (default: false)
- order: Int (per ordinamento)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 4. **ContentIdeas Table**
```sql
- id: UUID (primary key)
- userId: UUID (foreign key -> Users.id)
- title: String (required)
- platform: Enum ('youtube', 'tiktok', 'instagram', 'twitter', 'facebook')
- deadline: Date (optional)
- done: Boolean (default: false)
- details: String (optional, text)
- createdAt: DateTime
- updatedAt: DateTime
- order: Int
```

#### 5. **Prompts Table**
```sql
- id: UUID (primary key)
- userId: UUID (foreign key -> Users.id)
- title: String (optional)
- text: String (required)
- saved: Date (default: now)
- order: Int (per drag & drop)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 6. **ChatMessages Table** (per AI Assistant)
```sql
- id: UUID (primary key)
- userId: UUID (foreign key -> Users.id)
- role: Enum ('user', 'assistant')
- text: String (required)
- conversationId: UUID (per raggruppare messaggi)
- createdAt: DateTime
```

#### 7. **UserSettings Table**
```sql
- id: UUID (primary key)
- userId: UUID (foreign key -> Users.id, unique)
- darkMode: Boolean (default: false)
- language: String (default: 'en')
- createdAt: DateTime
- updatedAt: DateTime
```

### Relazioni
- User 1:N Projects
- User 1:N ContentIdeas
- User 1:N Prompts
- User 1:N ChatMessages
- User 1:1 UserSettings
- Project 1:N ProjectSteps

---

## 📝 Lista Task da Completare

### Fase 1: Setup Backend (Priorità Alta)
- [x] **1.1** Creare cartella `backend/` o `server/` nel progetto
- [x] **1.2** Inizializzare progetto Node.js con TypeScript
- [x] **1.3** Installare dipendenze: Express, Prisma, dotenv, cors, bcrypt, jsonwebtoken
- [x] **1.4** Configurare Prisma (`prisma init`)
- [x] **1.5** Creare schema Prisma con tutte le tabelle (basato su PostgreSQL)
- [x] **1.6** Setup database PostgreSQL (locale o cloud: Supabase, Railway, Neon)
- [x] **1.7** Eseguire migrazione Prisma (`prisma migrate dev`)
- [x] **1.8** Generare Prisma Client (`prisma generate`)

### Fase 2: API Endpoints (Priorità Alta)
- [x] **2.1** Setup Express server con TypeScript e middleware (cors, json, error handling)
- [x] **2.2** Creare struttura cartelle backend (routes, controllers, services, middleware, types)
- [ ] **2.3** Implementare autenticazione base (JWT) con TypeScript
  - [ ] POST `/api/auth/register` (nome, email, password)
  - [ ] POST `/api/auth/login` (email, password)
  - [ ] GET `/api/auth/me` (middleware auth)
  - [ ] POST `/api/auth/logout` (opzionale, gestito lato client)
- [ ] **2.10** Implementare API Profilo Utente
  - [ ] GET `/api/profile` (dati utente corrente)
  - [ ] PUT `/api/profile/name` (aggiorna nome)
  - [ ] PUT `/api/profile/email` (aggiorna email, richiede password)
  - [ ] PUT `/api/profile/password` (aggiorna password, richiede password corrente)
  - [ ] POST `/api/profile/picture` (upload foto profilo)
  - [ ] DELETE `/api/profile/picture` (rimuovi foto profilo)
- [ ] **2.4** Implementare API Projects
  - [ ] GET `/api/projects` (lista progetti utente)
  - [ ] GET `/api/projects/:id` (dettaglio progetto)
  - [ ] POST `/api/projects` (crea progetto)
  - [ ] PUT `/api/projects/:id` (aggiorna progetto)
  - [ ] DELETE `/api/projects/:id` (elimina progetto)
  - [ ] PUT `/api/projects/:id/steps/:stepId` (toggle step)
- [ ] **2.5** Implementare API Content Ideas
  - [ ] GET `/api/content-ideas`
  - [ ] POST `/api/content-ideas`
  - [ ] PUT `/api/content-ideas/:id`
  - [ ] DELETE `/api/content-ideas/:id`
  - [ ] PUT `/api/content-ideas/:id/toggle` (toggle done)
- [x] **2.6** Implementare API Prompts
  - [x] GET `/api/prompts`
  - [x] POST `/api/prompts`
  - [x] PUT `/api/prompts/:id`
  - [x] DELETE `/api/prompts/:id`
  - [x] PUT `/api/prompts/reorder` (per drag & drop)
- [ ] **2.7** Implementare API Chat Messages
  - [ ] GET `/api/chat/messages`
  - [ ] POST `/api/chat/messages`
- [x] **2.8** Implementare API Settings
  - [x] GET `/api/settings`
  - [x] PUT `/api/settings` (dark mode, language)

### Fase 3: Integrazione Frontend-Backend (Priorità Alta)
- [ ] **3.1** Creare service layer nel frontend (`src/services/api.ts`)
- [ ] **3.2** Configurare base URL API (variabile d'ambiente)
- [ ] **3.3** Sostituire useState con chiamate API
- [ ] **3.4** Implementare loading states e error handling
- [ ] **3.5** Aggiungere React Query o SWR per cache e sincronizzazione
- [ ] **3.6** Creare context per autenticazione
- [ ] **3.7** Integrare login/register pages esistenti con API
- [ ] **3.8** Proteggere routes con autenticazione
- [ ] **3.9** Integrare ProfileModal con API backend
- [ ] **3.10** Gestire upload foto profilo (FormData)

### Fase 4: Miglioramenti e Features (Priorità Media)
- [ ] **4.1** Implementare sincronizzazione real-time (opzionale: Socket.io)
- [ ] **4.2** Aggiungere validazione input (Zod o Yup)
- [ ] **4.3** Implementare paginazione per liste lunghe
- [ ] **4.4** Aggiungere ricerca/filtri
- [ ] **4.5** Implementare export/import dati (JSON, CSV)
- [ ] **4.6** Aggiungere logging e monitoring
- [ ] **4.7** Implementare rate limiting
- [ ] **4.8** Aggiungere test (Jest, Supertest)

### Fase 5: AI Assistant Integration (Priorità Bassa)
- [ ] **5.1** Integrare API AI reale (OpenAI, Anthropic, etc.)
- [ ] **5.2** Salvare conversazioni nel database
- [ ] **5.3** Implementare context-aware responses
- [ ] **5.4** Aggiungere streaming responses

### Fase 6: Deploy e DevOps (Priorità Media)
- [ ] **6.1** Setup variabili d'ambiente (.env files)
- [ ] **6.2** Deploy backend su cloud (Railway, Render, Vercel)
- [ ] **6.3** Setup database PostgreSQL cloud (Supabase, Neon, Railway)
- [ ] **6.4** Configurare CORS per produzione
- [ ] **6.5** Setup CI/CD (GitHub Actions)
- [ ] **6.6** Aggiungere documentazione API (Swagger/OpenAPI)

### Fase 7: Web App (Opzionale)
- [ ] **7.1** Decidere se mantenere Electron o passare a web app
- [ ] **7.2** Se web app: configurare Next.js (per coerenza con stack scelto) o Vite
- [ ] **7.3** Adattare UI per web (responsive design)
- [ ] **7.4** Deploy frontend (Vercel, Netlify)

---

## 🎯 Priorità Immediate (MVP)

Per avere un MVP funzionante, concentrarsi su:

1. **Setup base backend** (Fase 1)
2. **API Projects e Content Ideas** (Fase 2.4, 2.5)
3. **Integrazione frontend base** (Fase 3.1-3.4)
4. **Autenticazione semplice** (Fase 2.3, 3.6-3.7)

Questo ti darà un'app funzionante con persistenza dati.

---

## 📚 Risorse Utili

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **JWT Authentication**: https://jwt.io/
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/
- **React Query**: https://tanstack.com/query/latest

---

## 💡 Note Aggiuntive

### Considerazioni per Portfolio
1. **Codice pulito**: Usa TypeScript, commenti, struttura organizzata
2. **Documentazione**: README dettagliato, commenti nel codice
3. **Best practices**: Error handling, validazione, sicurezza
4. **Testing**: Aggiungi almeno test base per dimostrare competenze
5. **Deploy**: Mostra che sai deployare un'app completa

### Sicurezza
- Hash passwords con bcrypt
- Usa JWT per autenticazione
- Validare tutti gli input
- Sanitizzare output
- Rate limiting
- CORS configurato correttamente

### Performance
- Index database fields usati per query
- Paginazione per liste
- Cache dove appropriato
- Lazy loading per immagini/risorse

---

**Prossimo Step**: Inizia con la Fase 1 - Setup Backend! 🚀

