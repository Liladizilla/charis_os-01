# ADIZILLA_OS

**ADIZILLA_OS** is a lightweight, AI-integrated operating system interface designed for real-time monitoring, neural reasoning, and high-performance system management. 

Created with passion by a **young developer from Kenya 🇰🇪**, this project blends a cyber-minimalist aesthetic with powerful modern web technologies to create an immersive "mission control" experience.

---

## 🛠️ Built With

- **Frontend Core**: React 19 & Vite
- **Styling**: Tailwind CSS v4 (Cyber-Minimal Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide-React
- **Real-Time Engine**: Socket.IO (WebSockets)
- **Backend**: Node.js & Express
- **Persistence**: SQLite (via Better-SQLite3)
- **Intelligence**: Google Gemini AI (gemini-3-flash-preview)

---

## 🚀 Core Functions

### 1. Virtual File System (VFS)
A persistent, hierarchical file system stored in a SQLite database.
- `ls` / `orodha`: List directory contents.
- `cd` / `ingia`: Navigate between directories.
- `mkdir` / `tengeneza_folda`: Create new directories.
- `touch` / `tengeneza_faili`: Create empty files.
- `cat` / `soma`: Read file contents.
- `rm` / `futa`: Delete files or directories.

### 2. Neural AI Shell
An advanced command interpreter powered by Gemini AI.
- **Natural Language**: Ask questions or give system instructions in plain English or Swahili.
- **Context Awareness**: The AI understands it is operating within ADIZILLA_OS.
- **Command Routing**: Interprets user intent and suggests system actions.

### 3. Integrity Matrix & Monitoring
Real-time hardware and network telemetry.
- **CPU & Memory**: Live usage tracking.
- **Latency**: Real-time network heartbeat monitoring.
- **Uptime**: Tracks system stability since boot.
- **Process Manager**: View active system tasks using the `ps` command.

### 4. Neural Event Pipeline
A live stream of system events and security logs.
- **AI Analysis**: Every system event is automatically analyzed for anomalies.
- **Severity Tagging**: Events are categorized as Low, Medium, or High priority.

### 5. Localization (Swahili Support)
The first OS interface with native Swahili command support.
- Type `swahili` to switch the system language.
- Type `english` to revert.
- Full Swahili AI reasoning and terminal responses.

### 6. Real-Time Intelligence APIs
- **Weather**: Live weather data via the `weather <city>` command.
- **Crypto**: Real-time price tracking via the `crypto <coin>` command.
- **Audit**: A secure log of all commands run during the session via the `audit` command.

---

## 🔐 Security & Architecture

- **Stateless Frontend**: AI calls are handled client-side for maximum speed and privacy.
- **Persistent Backend**: VFS state is maintained across sessions using a robust SQLite implementation.
- **Cyber UI**: Features a custom animated boot sequence, scanline overlays, and a glitch-text aesthetic that avoids "gamer cringe" in favor of professional operational density.

---

*Developed by ADIZILLA_CORP // Nairobi, Kenya*
