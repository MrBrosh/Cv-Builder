# CV Builder AI – Web app for building resumes with AI assistance

**Full-Stack project**: a web app for building professional resumes, with server-side saving, live Preview, and AI-powered text improvement (Google Gemini or OpenAI – you can enter an OpenAI key in the Admin page).

**For the lecturer:** Clone the repo, run `npm run install:all`, create `server/.env` from `server/.env.example`, add a `GEMINI_API_KEY`, then `npm run dev` from the project root. Open **http://localhost:5173** and log in with `admin@cvbuilder.local` / `Admin123!`.  
**To enter your OpenAI API key:** add **`/editor/admin`** to the local address — open **http://localhost:5173/editor/admin** in the browser. There you can paste your OpenAI key (from https://platform.openai.com/api-keys) and save it; the app will then use OpenAI for AI text improvement.

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Project structure](#project-structure)
3. [Installation and run](#installation-and-run)
4. [Environment variables](#environment-variables)
5. [Admin user (for lecturer)](#admin-user-for-lecturer)
6. [Technologies](#technologies)
7. [App structure](#app-structure)
8. [Admin page – OpenAI key](#admin-page--openai-key)
9. [API endpoints](#api-endpoints)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before running the project, install:

| Component | Minimum version | Notes |
|-----------|-----------------|--------|
| **Node.js** | v18+ | Required for Client and Server |
| **npm** | v9+ | Bundled with Node.js |

**Check installation:**
```bash
node --version   # e.g. v20.x.x
npm --version    # e.g. 10.x.x
```

---

## Project structure

```
CvBuilder/
├── package.json            # Single-command run: npm run dev
├── client/                 # Frontend – React + Vite + TypeScript
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── editor/     # Editor forms (PersonalInfo, Experience, Education, Skills...)
│   │   │   ├── layout/     # Layout, Header, Navigation
│   │   │   ├── preview/    # CV preview
│   │   │   └── ui/         # Base components (Button, Input, Card...)
│   │   ├── context/        # CVContext, AuthContext, PrintRefContext
│   │   ├── hooks/          # useAI
│   │   ├── lib/            # API, Schemas, Constants, Utils
│   │   └── pages/          # EditorPage, PreviewPage, AdminPage, LoginPage, RegisterPage
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                 # Backend – Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts        # Server entry point
│   │   ├── auth.ts         # Auth and admin user
│   │   ├── routes.ts       # API routes
│   │   └── schemas.ts      # Validation (Zod)
│   ├── .env.example        # Template for .env
│   ├── .env                # Environment variables (not in Git – create manually)
│   ├── package.json
│   └── tsconfig.json
│
└── README.md               # This file
```

---

## Installation and run

### Step 1: Clone or open the project

If the project is on GitHub:
```bash
git clone https://github.com/YOUR_USERNAME/CvBuilder.git
cd CvBuilder
```

If you have the folder locally, navigate to it:
```bash
cd CvBuilder
```

---

### Step 2: Install dependencies

**Option A – Install everything from project root:**

```bash
npm run install:all
```

This installs dependencies in the root (including `concurrently`), in `client`, and in `server`.

**Option B – Manual install:**

1. **Project root** (needed for single-command run):
   ```bash
   npm install
   ```
2. **Client:**
   ```bash
   cd client
   npm install
   cd ..
   ```
3. **Server:**
   ```bash
   cd server
   npm install
   ```
   Keep the terminal for the run step.

---

### Step 3: Server setup (environment variables)

1. Navigate to the Server folder (if not already there):
   ```bash
   cd server
   ```
2. Install dependencies (if you did not run `npm run install:all`):
   ```bash
   npm install
   ```
3. Create a `.env` file **in the `server` folder** from the template:
   - **Windows (PowerShell)** (run from project root or from `server`):
     ```powershell
     Copy-Item server\.env.example server\.env
     ```
     Or from inside `server`: `Copy-Item .env.example .env`
   - **Windows (CMD):**
     ```cmd
     copy server\.env.example server\.env
     ```
   - **Mac / Linux:**
     ```bash
     cp server/.env.example server/.env
     ```
4. Edit **`server/.env`** and set `GEMINI_API_KEY` to your key (see [How to get the API key](#how-to-get-the-api-key-gemini_api_key) below).

---

### Step 4: Run the app

**Recommended – single command (from project root):**

From the project root (`CvBuilder`):

```bash
npm run dev
```

This runs the Client (Vite on port 5173) and the Server (Express on port 3000) in parallel. Output appears in one terminal with `[client]` and `[server]` labels.

---

**Alternative – two terminals:**

To run Client and Server separately:

#### Terminal 1 – Server

```bash
cd server
npm run dev
```

You should see:
```
Server running on port 3000
```

#### Terminal 2 – Client

```bash
cd client
npm run dev
```

You should see something like:
```
  VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 5: Open the app in the browser

Go to:
```
http://localhost:5173
```

If everything is working:
- **Editor** on the left – form to enter details
- **Preview** on the right – live CV view
- On mobile – switch between Editor and Preview via the bottom nav

---

## Environment variables

The `.env` file lives **only** in the `server` folder (not in `client`).

| Where | Variable | Required | Description |
|-------|----------|----------|-------------|
| `server/.env` | `GEMINI_API_KEY` | Yes (for AI) | Google AI Studio key – used for text improvement if no OpenAI key is set in Admin |
| `server/.env` | `PORT` | No | Server port (default: 3000) |
| Admin page | OpenAI key | No | Optional – enter at http://localhost:5173/editor/admin; stored in server memory until restart |

### How to get the API key (GEMINI_API_KEY)

**⚠️ Do not put your key in the README, in code, or in Git – only in your local `.env` file.**

1. Go to [Google AI Studio – API Keys](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click “Create API key” (or “צור מפתח API”)
4. Select or create a project
5. Copy the key (it usually starts with `AIzaSy...`)
6. Open the `server` folder’s `.env` and add:
   ```
   GEMINI_API_KEY=your_key_here
   PORT=3000
   ```

**Example (no real key):**
```
GEMINI_API_KEY=your_key_from_google_ai_studio
PORT=3000
```

> **Important:** `.env` should not be in Git. It is in `.gitignore` so the key stays local and is not committed.

---

## Admin user (for lecturer)

On server startup a default **admin user** is created so you can share credentials with your lecturer.

| Field | Default value |
|-------|----------------|
| **Email** | `admin@cvbuilder.local` |
| **Password** | `Admin123!` |
| **Name** | Admin (lecturer) |

- Log in at `/login` (e.g. http://localhost:5173/login when running locally) with the email and password above.
- **To open the Admin page and enter your OpenAI key:** add **`/editor/admin`** to the local address — i.e. open **http://localhost:5173/editor/admin** in the browser. There you can paste your OpenAI API key and save it.
- To change admin credentials: set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and/or `ADMIN_NAME` in the server `.env` (the user is created on next server start with the new values).

---

## Technologies

### Client (Frontend)

| Technology | Use |
|------------|-----|
| React 18 | UI library |
| TypeScript | Typing |
| Vite | Build and dev server |
| React Router DOM | Navigation (Editor, Preview, Admin) |
| Tailwind CSS | Styling |
| React Hook Form + Zod | Forms and validation |
| Axios | API calls |
| Framer Motion | Animations |
| Lucide React | Icons |
| Sonner | Toast notifications |
| @hello-pangea/dnd | Drag & Drop |
| react-to-print | PDF download |

### Server (Backend)

| Technology | Use |
|------------|-----|
| Node.js | Runtime |
| Express | Web framework |
| TypeScript | Typing |
| openai | OpenAI API – text improvement (optional, set via Admin page) |
| @google/generative-ai | Google Gemini – text improvement when OpenAI key is not set |
| Zod | Validation |
| dotenv | Load environment variables |
| tsx | Run TypeScript in development |
| nodemon | Auto reload in dev |

---

## App structure

### Screens

| Path | Description |
|------|-------------|
| `/` | Redirects to `/editor` |
| `/editor` | CV editor |
| `/editor/admin` | Admin page – enter OpenAI key for text improvement |
| `/preview` | CV preview as document |

### Editor – main sections

1. **Theme Color** – theme color picker
2. **Personal details** – name, email, phone, location
3. **Professional summary** – summary + “Improve with AI” button
4. **Experience** – list of jobs with Drag & Drop
5. **Education** – institutions, degrees, dates (including datalist)
6. **Skills** – tags and quick suggestions
7. **Job sectors** – links to external job boards (Drushim, AllJobs, JobMaster, gov.il, LinkedIn, etc.). These open in a new tab; if a site is temporarily unavailable, the rest of the app works normally.

### Save and download

- **Save CV** – saves the CV on the server (in memory)
- **Download PDF** – opens print dialog → “Save as PDF”

---

## Admin page – OpenAI key

On the **Admin** page you can enter an **OpenAI** API key so the app uses OpenAI (model `gpt-4o-mini`) to improve the professional summary and experience descriptions.

- **Path:** `/editor/admin`. **For the lecturer:** add the word **admin** to the local link — open **http://localhost:5173/editor/admin** in the browser; there you can enter your OpenAI API key.
- **Access:** Logged-in users only (same “Admin” link in the top nav or bottom nav on mobile).
- **Usage:** Enter your OpenAI key (starts with `sk-...`) and click “Save key”. The key is stored **in server memory** for the current run; after a server restart you must enter it again from the Admin page.
- **Priority:** If a key is set in Admin, the server uses OpenAI; otherwise it uses Gemini (`GEMINI_API_KEY` in `server/.env`).

**Where to get an OpenAI key:** [OpenAI API Keys](https://platform.openai.com/api-keys) (OpenAI account required).

---

## API endpoints

When running locally, base URL is `http://localhost:3000`. The client is configured to use this in development.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cv` | Returns the saved CV |
| POST | `/api/cv/save` | Saves the CV (Body: CVData) |
| POST | `/api/improve-summary` | Improves summary (Body: `{ summary }`) |
| POST | `/api/improve-experience` | Improves experience description (Body: `{ role, company, description }`) |
| POST | `/api/admin/set-openai-key` | Saves OpenAI key (Body: `{ key }`) – requires auth |
| GET | `/api/admin/openai-status` | Checks if OpenAI key is set – requires auth |
| GET | `/health` | Health check |

---

## Troubleshooting

### 400 when saving CV or changing theme

- **Run from the CvBuilder folder:** Open the project folder `CvBuilder` (not a parent folder). Run `npm run dev` from there.
- **Restart the server:** Stop the process (Ctrl+C) and run `npm run dev` again so the latest server code is used.
- The server accepts any JSON body for save; if you still see 400, check the browser Network tab for the exact response body.

1. Ensure `GEMINI_API_KEY` is set in `server/.env`
2. Check that port 3000 is free
3. Run `npm install` in `server` again

### 500 error on AI improve

- Gemini quota may be exceeded
- Wait a few minutes or check your quota in Google AI Studio

### Client can’t reach server

- Ensure the server is running on port 3000
- If you changed PORT, update `baseURL` in `client/src/lib/api.ts`

### Empty PDF

- Open Preview before downloading
- Ensure the CV has content
- Check that the browser supports Print to PDF

---

## Available scripts

### Project root (`CvBuilder/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs Client and Server in parallel (single command) |
| `npm run install:all` | Installs dependencies in root, Client, and Server |

### Client (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |

### Server (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

---

## License

This project is for learning and demonstration purposes.
