# Piano di Migrazione Full-Stack - ArtFlow App

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
- [x] **2.3** Implementare autenticazione base (JWT) con TypeScript
  - [x] POST `/api/auth/register` (nome, email, password) → crea User (password hashata con bcrypt) + UserSettings default; ritorna `{ user, token }`
  - [x] POST `/api/auth/login` (email, password) → verifica credenziali, ritorna `{ user, token }`
  - [x] GET `/api/auth/me` (header `Authorization: Bearer <token>`) → dati utente corrente
  - [x] POST `/api/auth/logout` (opzionale, gestito lato client: rimuovere token)
- [x] **2.10** Implementare API Profilo Utente (unica chiamata per aggiornamento)
  - [x] GET `/api/profile` (dati utente corrente: nome, email, profilePicture)
  - [x] PUT `/api/profile` (aggiorna profilo con un'unica chiamata; body parziale: `name?`, `email?`, `password?`, `profilePicture?`; per email/password richiedere `currentPassword`; per rimuovere foto inviare `profilePicture: null`)
- [x] **2.4** Implementare API Projects
  - [x] GET `/api/projects` (lista progetti utente)
  - [x] GET `/api/projects/:id` (dettaglio progetto)
  - [x] POST `/api/projects` (crea progetto)
  - [x] PUT `/api/projects/:id` (aggiorna progetto)
  - [x] DELETE `/api/projects/:id` (elimina progetto)
  - [x] PUT `/api/projects/:id/steps/:stepId` (toggle step)
- [x] **2.5** Implementare API Content Ideas
  - [x] GET `/api/content-ideas`
  - [x] POST `/api/content-ideas`
  - [x] PUT `/api/content-ideas/:id`
  - [x] DELETE `/api/content-ideas/:id`
  - [x] PUT `/api/content-ideas/:id/toggle` (toggle done)
- [x] **2.6** Implementare API Prompts
  - [x] GET `/api/prompts`
  - [x] POST `/api/prompts`
  - [x] PUT `/api/prompts/:id`
  - [x] DELETE `/api/prompts/:id`
  - [x] PUT `/api/prompts/reorder` (per drag & drop)
- [x] **2.7** Implementare API Settings
  - [x] GET `/api/settings`
  - [x] PUT `/api/settings` (dark mode, language)

### Fase 3: Integrazione Frontend-Backend (Priorità Alta)
- [x] **3.1** Creare service layer nel frontend (`src/services/api.ts`)
- [x] **3.2** Configurare base URL API (variabile d'ambiente)
- [x] **3.3** Sostituire useState con chiamate API ✅ **COMPLETATO AL 100%**
  - [x] Projects (GET, POST, PUT, DELETE, toggle step)
  - [x] Content Ideas (GET, POST, PUT, DELETE, toggle)
  - [x] Prompts (GET, POST, PUT, DELETE, reorder)
  - [x] Auth (login, register, me)
  - [x] Settings (GET, PUT - dark mode, language)
  - [x] Profile (GET, PUT - nome, email, foto profilo predefinita)
  - [x] Password (PUT /api/profile/password con validazione bcrypt)
  - [x] Foto profilo: solo selezione tra immagini predefinite (1.png - 10.png)
  - [x] Rimossa password da UserInfo frontend (sicurezza)
- [x] **3.4** Implementare loading states 
- [ ] **3.5** Aggiungere React Query o SWR per cache e sincronizzazione
- [ ] **3.6** Creare context per autenticazione
- [x] **3.7** Integrare login/register pages esistenti con API
- [x] **3.8** Proteggere routes con autenticazione
- [x] **3.9** Integrare ProfileModal con API backend
- [x] **3.10** Migliorare UX con toast notifications per error handling
- [x] **3.11** Aggiungere ricerca/filtri
- [ ] **3.12** Aggiungere test (Jest, Supertest)


### Fase 6: Deploy e DevOps (Priorità Media)
- [ ] **6.1** Setup variabili d'ambiente (.env files)
- [ ] **6.2** Deploy backend su cloud (Railway, Render, Vercel)
- [ ] **6.3** Setup database PostgreSQL cloud (Supabase, Neon, Railway)
- [ ] **6.4** Configurare CORS per produzione
- [ ] **6.5** Setup CI/CD (GitHub Actions)
- [ ] **6.6** Aggiungere documentazione API (Swagger/OpenAPI)

---


## 📚 Risorse Utili

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **JWT Authentication**: https://jwt.io/
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/
- **React Query**: https://tanstack.com/query/latest

---

### Considerazioni per Portfolio
1. **Codice pulito**: Usa TypeScript, commenti, struttura organizzata
2. **Documentazione**: README dettagliato, commenti nel codice
3. **Best practices**: Error handling, validazione, sicurezza
4. **Testing**: Aggiungi almeno test base per dimostrare competenze
5. **Deploy**: Mostra che sai deployare un'app completa

---

## Guida implementazione 3.5, 3.6, 3.12

### 3.5 – React Query per cache e sincronizzazione

**Obiettivo:** Sostituire le chiamate manuali `fetch` + `useState`/`useEffect` con React Query per cache, refetch e stati di loading/error centralizzati.

**Passi:**

1. **Installare dipendenze (frontend):**
   ```bash
   npm install @tanstack/react-query
   ```

2. **Provider in `src/app.tsx` (o in `renderer.tsx`):**
   - Creare un `QueryClient` e avvolgere l’app con `QueryClientProvider`.
   - Esempio:
   ```ts
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: { staleTime: 60 * 1000, retry: 1 },
     },
   });
   // Nel render: <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
   ```

3. **Query keys:** Definire una factory in `src/services/queryKeys.ts` (es. `projects: { all: ['projects'], detail: (id) => ['projects', id] }`, `contentIdeas`, `prompts`, `settings`, `auth`).

4. **Sostituire i dati “lettura” con `useQuery`:**
   - **Progetti:** `useQuery({ queryKey: ['projects'], queryFn: getProjects, enabled: isAuthenticated })`
   - **Content ideas:** `useQuery({ queryKey: ['contentIdeas'], queryFn: getContentIdeas, enabled: isAuthenticated })`
   - **Prompts:** `useQuery({ queryKey: ['prompts'], queryFn: getPrompts, enabled: isAuthenticated })`
   - **Settings:** `useQuery({ queryKey: ['settings'], queryFn: getSettings, enabled: isAuthenticated })`
   - **Utente corrente:** gestirlo nel context auth (vedi 3.6) con `useQuery({ queryKey: ['auth', 'me'], queryFn: authMe, enabled: !!getStoredToken() })`.

5. **Sostituire le mutazioni con `useMutation`:**
   - Per ogni azione che modifica dati (login, register, create/update/delete project/content/prompts, update settings, update profile) usare `useMutation`.
   - In `onSuccess` chiamare `queryClient.invalidateQueries({ queryKey: [...] })` per le query correlate (es. dopo `createProject` invalidare `['projects']`), così la cache si aggiorna e l’UI resta sincronizzata.

6. **Rimuovere da `App`:** gli `useEffect` che fanno `loadProjects`, `loadContentIdeas`, `loadPrompts`, `loadSettings` e gli stati `projects`, `contentIdeas`, `prompts`, `settings` (e relativi loading) sostituendoli con i risultati di `useQuery`/`useMutation` (anche tramite un custom hook che usa il context auth per `enabled`).

**Risultato:** Un solo punto di verità per i dati, refetch automatico (stale-while-revalidate), loading/error da React Query invece che da useState manuale.

---

### 3.6 – Context per autenticazione

**Obiettivo:** Centralizzare stato utente e metodi di login/logout in un context, così tutti i componenti accedono a `user`, `isAuthenticated`, `login`, `logout` senza prop drilling.

**Passi:**

1. **Creare `src/contexts/AuthContext.tsx`:**
   - Stato: `user` (nome, email, profilePicture da `authMe`), `isAuthenticated` (derivato da `user !== null`), `isLoading` (durante il primo `authMe`), eventualmente `authPage: 'login' | 'register'` se lo tieni nel context.
   - Metodi: `login(email, password)`, `register(name, email, password)`, `logout()` (chiamare `clearStoredToken()` da `api.ts` e azzerare `user`), `refetchUser()` (richiamare `authMe` e aggiornare `user`).
   - All’avvio: se c’è `getStoredToken()`, chiamare `authMe()` e impostare `user`; altrimenti `user = null`. Usare un `useEffect` per questo e `isLoading` fino al primo risultato.

2. **Provider in albero React:**
   - Avvolgere l’app (sotto `QueryClientProvider` se usi 3.5) con `AuthProvider`. I figli useranno `useAuth()` per leggere `user`, `isAuthenticated`, `login`, `logout`, `register`, `refetchUser`.

3. **Sostituire in `App`:**
   - Rimuovere `useState` per `isAuthenticated`, `userInfo`, `authPage`, `loginError`, `registerError`.
   - Usare `const { user, isAuthenticated, isLoading, login, register, logout } = useAuth()`.
   - Mappare `user` su `userInfo` (nome, email, profilePicture) per Sidebar e ProfileModal, oppure passare direttamente `user` dove serve.
   - Le pagine Login/Register ricevono `onLogin`/`onRegister` che chiamano `login`/`register` del context; gli errori possono essere gestiti nel context (es. stato `loginError`/`registerError`) o restituiti dalle funzioni e mostrati in pagina.

4. **Integrazione con React Query (se fatto 3.5):**
   - Nel context puoi usare `useQuery({ queryKey: ['auth', 'me'], queryFn: authMe, enabled: !!getStoredToken(), retry: false })` e derivare `user` da `data`, `isLoading` da `isLoading`/`isFetching`. Dopo `login`/`register` fare `setStoredToken(token)` e poi `queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })` (o `refetch`) per popolare `user` senza duplicare la logica di fetch.

**Risultato:** Un solo posto per lo stato auth; Login, Register, Sidebar, ProfileModal e protezione route leggono tutto da `useAuth()`.

---

### 3.12 – Test (Jest + Supertest)

**Obiettivo:** Test automatici per il backend (API) e, opzionalmente, per componenti frontend.

#### Backend (Jest + Supertest)

1. **Installare dipendenze in `backend/`:**
   ```bash
   cd backend
   npm install -D jest ts-jest supertest
   npm install -D @types/jest @types/supertest
   ```

2. **Configurare Jest:** Creare `backend/jest.config.js` (o `jest.config.ts` con ts-node):
   - `preset: 'ts-jest'`, `testEnvironment: 'node'`, `roots: ['<rootDir>/src']`, `testMatch: ['**/*.test.ts']`, `modulePathIgnorePatterns: ['node_modules', 'dist']`.
   - Così i file `*.test.ts` nella cartella `src` verranno eseguiti.

3. **Script in `backend/package.json`:**
   ```json
   "test": "jest",
   "test:watch": "jest --watch"
   ```

4. **Export dell’app:** In `backend/src/app.ts` l’app Express è già esportata (`export default app`). In `index.ts` si avvia il server; i test importano solo `app` da `./app` e non avviano `listen`, così Supertest invia richieste all’app senza aprire una porta.

5. **Test API con Supertest:**
   - Creare ad es. `backend/src/__tests__/health.test.ts`:
     - `import request from 'supertest'; import app from '../app';`
     - Test: `GET /health` ritorna 200 e body con `success: true`.
   - Creare `backend/src/__tests__/auth.test.ts`:
     - `POST /api/auth/register` con nome, email, password → 200, body con `user` e `token`.
     - `POST /api/auth/login` con stessa email/password → 200, stesso formato.
     - `GET /api/auth/me` con header `Authorization: Bearer <token>` → 200, dati utente.
     - `GET /api/auth/me` senza token o token invalido → 401.
   - Usare un database di test (es. PostgreSQL separato o SQLite in memoria con Prisma) per non sporcare i dati di sviluppo. In test impostare `process.env.DATABASE_URL` (o variabile usata da Prisma) su DB di test e, se serve, eseguire migrazioni prima dei test.

6. **Isolamento DB:** Per ogni test suite puoi usare `beforeAll`/`afterAll` per migrare e pulire il DB, oppure transazioni che fanno rollback. Così i test sono ripetibili e non dipendono dall’ordine.

#### Frontend (opzionale)

- Jest + React Testing Library: `npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest`.
- Configurare Jest per l’ambiente jsdom e i path/alias TypeScript come in webpack.
- Testare componenti isolati (es. LoginPage con mock di `login()` e verificare messaggi di errore e chiamate).

**Risultato:** Suite di test backend eseguibile con `npm run test` in `backend/`; eventuale estensione ai componenti React.

---

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


