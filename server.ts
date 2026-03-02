import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import os from "os";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const db = new Database("adizilla.db");

// Initialize VFS table
db.exec(`
  CREATE TABLE IF NOT EXISTS vfs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    parentId TEXT,
    owner TEXT NOT NULL,
    permissions TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  
  -- Insert root directory if not exists
  INSERT OR IGNORE INTO vfs (id, name, type, parentId, owner, permissions, createdAt, updatedAt)
  VALUES ('root', '/', 'directory', NULL, 'root', 'rwx------', datetime('now'), datetime('now'));
`);

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = 3000;

// Real-time Metrics Simulation (representing the C daemon data)
const getSystemMetrics = () => {
  const cpus = os.cpus();
  const load = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const uptime = os.uptime();

  return {
    cpu: Math.round((load[0] / cpus.length) * 100),
    memory: Math.round(((totalMem - freeMem) / totalMem) * 100),
    uptime: Math.floor(uptime),
    processes: Math.floor(Math.random() * 50) + 100, // Simulated process count
    latency: Math.floor(Math.random() * 20) + 5,
    timestamp: Date.now(),
  };
};

// Neural Event Pipeline
const events: any[] = [];
const pushEvent = (type: string, severity: "low" | "medium" | "high", source: string, message: string) => {
  const event = {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    type,
    severity,
    source,
    message,
    ai_analysis: "Analyzing...",
  };
  events.unshift(event);
  if (events.length > 50) events.pop();
  io.emit("system_event", event);
  return event;
};

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const metricsInterval = setInterval(() => {
    socket.emit("metrics_update", getSystemMetrics());
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(metricsInterval);
    console.log("Client disconnected");
  });

  socket.on("shell_command", async (command: string) => {
    // AI logic moved to frontend to comply with guidelines
    console.log("Shell command received (relay not implemented, frontend should handle):", command);
  });
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "operational", system: "ADIZILLA_OS" });
});

app.get("/api/events", (req, res) => {
  res.json(events);
});

// VFS Endpoints
app.get("/api/vfs", (req, res) => {
  const nodes = db.prepare("SELECT * FROM vfs").all();
  res.json(nodes);
});

app.post("/api/vfs", (req, res) => {
  const { id, name, type, content, parentId, owner, permissions } = req.body;
  const now = new Date().toISOString();
  try {
    db.prepare(`
      INSERT INTO vfs (id, name, type, content, parentId, owner, permissions, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, type, content, parentId, owner, permissions, now, now);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/vfs/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM vfs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`ADIZILLA_OS Core running on http://localhost:${PORT}`);
  });
}

setupVite();
