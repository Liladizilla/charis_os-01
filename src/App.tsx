import React, { useEffect, useState, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Activity, 
  Terminal, 
  Shield, 
  Cpu, 
  Database, 
  Network, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  Maximize2,
  Settings,
  Folder,
  FileText,
  User,
  Power,
  Globe,
  Cloud,
  Bitcoin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { VNode, VProcess, VUser } from './types';

// --- Constants & Translations ---

const SWAHILI_MAP: Record<string, string> = {
  'ls': 'orodha',
  'cd': 'ingia',
  'mkdir': 'tengeneza_folda',
  'rm': 'futa',
  'cat': 'soma',
  'touch': 'tengeneza_faili',
  'ps': 'michakato',
  'kill': 'simamisha',
  'whoami': 'mimi_ni_nani',
  'weather': 'hali_ya_hewa',
  'crypto': 'sarafu_ya_kidijitali',
  'help': 'msaada',
  'clear': 'safisha'
};

const REVERSE_SWAHILI_MAP = Object.fromEntries(Object.entries(SWAHILI_MAP).map(([k, v]) => [v, k]));

// --- Components ---

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const bootLogs = [
    "INITIALIZING ADIZILLA_CORE v1.0.4...",
    "LOADING KERNEL MODULES...",
    "MOUNTING VIRTUAL FILE SYSTEM...",
    "ESTABLISHING NEURAL LINK...",
    "CHECKING SYSTEM INTEGRITY...",
    "STARTING PROCESS SCHEDULER...",
    "LOADING SWAHILI LANGUAGE PACK...",
    "ADIZILLA_OS READY."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center font-mono p-8">
      <div className="max-w-md w-full">
        <pre className="text-cyber-green text-[10px] mb-8 leading-none">
{`
    ___    ____  _________  ____  __    __    ___ 
   /   |  / __ \\/  _/_  __/ /_  __/ /   / /   /   |
  / /| | / / / // /  / /     / / / /   / /   / /| |
 / ___ |/ /_/ // /  / /     / / / /___/ /___/ ___ |
/_/  |_/_____/___/ /_/     /_/ /_____/_____/_/  |_|
                                                   
`}
        </pre>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-cyber-green text-xs"
            >
              <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </motion.div>
          ))}
        </div>
        <div className="mt-8 h-1 w-full bg-cyber-green/10 overflow-hidden">
          <motion.div 
            className="h-full bg-cyber-green"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: bootLogs.length * 0.4, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, unit, icon: Icon, color = "text-cyber-green" }: any) => (
  <div className="panel-border p-4 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
    <div className="flex justify-between items-center z-10">
      <span className="text-[10px] uppercase tracking-widest opacity-50">{label}</span>
      <Icon size={14} className={color} />
    </div>
    <div className="flex items-baseline gap-1 z-10">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-[10px] opacity-50">{unit}</span>
    </div>
    <div className="absolute bottom-0 left-0 h-1 bg-cyber-green/20 transition-all group-hover:bg-cyber-green/40" style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

const IntegrityMatrix = ({ metrics }: { metrics: any }) => {
  if (!metrics) return <div className="animate-pulse">Initializing Matrix...</div>;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard label="CPU Load" value={metrics.cpu} unit="%" icon={Cpu} />
      <MetricCard label="Memory" value={metrics.memory} unit="%" icon={Database} />
      <MetricCard label="Uptime" value={Math.floor(metrics.uptime / 3600)} unit="HRS" icon={Activity} />
      <MetricCard label="Processes" value={metrics.processes} unit="ID" icon={Settings} />
      <MetricCard label="Latency" value={metrics.latency} unit="MS" icon={Network} color="text-blue-400" />
      <MetricCard label="Integrity" value={98.4} unit="%" icon={Shield} color="text-emerald-400" />
    </div>
  );
};

const NeuralPipeline = ({ events }: { events: any[] }) => {
  return (
    <div className="panel-border rounded-lg flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-cyber-green/10 flex justify-between items-center bg-cyber-green/5">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-xs font-bold tracking-widest uppercase">Neural Event Pipeline</span>
        </div>
        <span className="text-[10px] opacity-50">LIVE_STREAM</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 border-l-2 bg-white/5 ${
                event.severity === 'high' ? 'border-red-500' : 
                event.severity === 'medium' ? 'border-yellow-500' : 'border-cyber-green'
              }`}
            >
              <div className="flex justify-between opacity-50 mb-1">
                <span>[{event.type}]</span>
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="font-bold">{event.message}</div>
              <div className="mt-1 text-[10px] text-blue-400 italic">
                AI_ANALYSIS: {event.ai_analysis}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CommandShell = ({ 
  socket, 
  vfs, 
  currentDir, 
  setCurrentDir, 
  user, 
  language, 
  setLanguage 
}: { 
  socket: Socket | null, 
  vfs: VNode[], 
  currentDir: string, 
  setCurrentDir: (id: string) => void,
  user: VUser,
  language: 'en' | 'sw',
  setLanguage: (l: 'en' | 'sw') => void
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'cmd' | 'res', text: string }[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeLocalCommand = async (cmdStr: string) => {
    const parts = cmdStr.trim().split(' ');
    let rawCmd = parts[0];
    const args = parts.slice(1);

    // Translate Swahili to English if needed
    if (language === 'sw' && REVERSE_SWAHILI_MAP[rawCmd]) {
      rawCmd = REVERSE_SWAHILI_MAP[rawCmd];
    }

    switch (rawCmd) {
      case 'clear':
        setHistory([]);
        return null;
      case 'ls':
        const children = vfs.filter(n => n.parentId === currentDir);
        return children.map(n => `${n.type === 'directory' ? 'DIR' : 'FILE'} ${n.name}`).join('\n') || "Empty directory.";
      case 'cd':
        if (!args[0] || args[0] === '/') {
          setCurrentDir('root');
          return "Moved to /";
        }
        if (args[0] === '..') {
          const current = vfs.find(n => n.id === currentDir);
          if (current?.parentId) setCurrentDir(current.parentId);
          return "Moved up.";
        }
        const target = vfs.find(n => n.name === args[0] && n.parentId === currentDir && n.type === 'directory');
        if (target) {
          setCurrentDir(target.id);
          return `Moved to ${target.name}`;
        }
        return `Directory not found: ${args[0]}`;
      case 'mkdir':
        if (!args[0]) return "Usage: mkdir <name>";
        const newDir: VNode = {
          id: Math.random().toString(36).substring(7),
          name: args[0],
          type: 'directory',
          parentId: currentDir,
          owner: user.username,
          permissions: 'rwx------',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await fetch('/api/vfs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDir)
        });
        // Update local state
        const updatedVfs = await fetch('/api/vfs').then(res => res.json());
        // Note: In a real app we'd use a state management lib or context, but this works for now
        window.dispatchEvent(new CustomEvent('vfs_update', { detail: updatedVfs }));
        return `Directory created: ${args[0]}`;
      case 'touch':
        if (!args[0]) return "Usage: touch <name>";
        const newFile: VNode = {
          id: Math.random().toString(36).substring(7),
          name: args[0],
          type: 'file',
          content: '',
          parentId: currentDir,
          owner: user.username,
          permissions: 'rw-------',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await fetch('/api/vfs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFile)
        });
        const updatedVfs2 = await fetch('/api/vfs').then(res => res.json());
        window.dispatchEvent(new CustomEvent('vfs_update', { detail: updatedVfs2 }));
        return `File created: ${args[0]}`;
      case 'cat':
        if (!args[0]) return "Usage: cat <name>";
        const file = vfs.find(n => n.name === args[0] && n.parentId === currentDir && n.type === 'file');
        return file ? (file.content || "Empty file.") : `File not found: ${args[0]}`;
      case 'rm':
        if (!args[0]) return "Usage: rm <name>";
        const toDelete = vfs.find(n => n.name === args[0] && n.parentId === currentDir);
        if (toDelete) {
          await fetch(`/api/vfs/${toDelete.id}`, { method: 'DELETE' });
          const updatedVfs3 = await fetch('/api/vfs').then(res => res.json());
          window.dispatchEvent(new CustomEvent('vfs_update', { detail: updatedVfs3 }));
          return `Deleted: ${args[0]}`;
        }
        return `Not found: ${args[0]}`;
      case 'ps':
        return "PID  NAME          STATUS   CPU  MEM\n1    init          running  0.1  1.2\n42   neural_link   running  4.5  12.8\n103  shell_daemon  running  1.2  4.5\n204  metrics_coll  running  0.8  2.1";
      case 'weather':
        if (!args[0]) return "Usage: weather <city>";
        try {
          const res = await fetch(`https://wttr.in/${args[0]}?format=3`);
          const text = await res.text();
          return text;
        } catch (e) {
          return "Error fetching weather data.";
        }
      case 'crypto':
        if (!args[0]) return "Usage: crypto <coin_id> (e.g., bitcoin, ethereum)";
        try {
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${args[0].toLowerCase()}&vs_currencies=usd`);
          const data = await res.json();
          if (data[args[0].toLowerCase()]) {
            return `${args[0].toUpperCase()}: $${data[args[0].toLowerCase()].usd}`;
          }
          return `Coin not found: ${args[0]}`;
        } catch (e) {
          return "Error fetching crypto data.";
        }
      case 'whoami':
        return `${user.username} [${user.role}]`;
      case 'swahili':
        setLanguage('sw');
        return "Mfumo sasa unatumia Kiswahili.";
      case 'english':
        setLanguage('en');
        return "System now using English.";
      case 'audit':
        return commandHistory.map((cmd, i) => `[${i}] ${cmd}`).reverse().join('\n') || "No history.";
      case 'help':
        return language === 'en' 
          ? "Commands: ls, cd, mkdir, rm, cat, touch, ps, kill, whoami, weather, crypto, swahili, english, audit, clear, help"
          : "Amri: orodha, ingia, tengeneza_folda, futa, soma, tengeneza_faili, michakato, simamisha, mimi_ni_nani, hali_ya_hewa, sarafu_ya_kidijitali, kiswahili, kiingereza, ukaguzi, safisha, msaada";
      default:
        return null; // Hand off to AI
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setHistory(prev => [...prev, { type: 'cmd', text: currentInput }]);
    setCommandHistory(prev => [currentInput, ...prev]);
    setHistoryIndex(-1);
    setInput('');
    setLoading(true);

    const localRes = await executeLocalCommand(currentInput);
    if (localRes !== null) {
      setHistory(prev => [...prev, { type: 'res', text: localRes }]);
      setLoading(false);
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `You are ADIZILLA_OS, a cyber-minimalist AI operating system. 
        Interpret the following user command: "${currentInput}". 
        Language: ${language === 'sw' ? 'Swahili' : 'English'}.
        If it's a system request, explain what you would do. 
        If it's a question, answer it concisely. 
        Keep the tone professional, technical, and slightly cold. 
        Use markdown for formatting.` }] }],
      });
      
      setHistory(prev => [...prev, { type: 'res', text: response.text || "No response from neural link." }]);
    } catch (error) {
      setHistory(prev => [...prev, { type: 'res', text: "ERROR: Neural link failure." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="panel-border rounded-lg flex flex-col h-full overflow-hidden bg-black/40">
      <div className="p-3 border-b border-cyber-green/10 flex items-center justify-between bg-cyber-green/5">
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span className="text-xs font-bold tracking-widest uppercase">AI Command Shell</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] opacity-50">
          <Globe size={10} />
          <span>{language.toUpperCase()}</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-4">
        <div className="text-cyber-green/60">ADIZILLA_OS v1.0.4 [STABLE_BUILD]</div>
        <div className="text-cyber-green/60">Neural link established. Awaiting input...</div>
        
        {history.map((item, i) => (
          <div key={i} className={item.type === 'cmd' ? 'text-white' : 'text-cyber-green'}>
            {item.type === 'cmd' ? (
              <div className="flex gap-2">
                <span className="text-cyber-green opacity-50">root@adizilla:~$</span>
                <span>{item.text}</span>
              </div>
            ) : (
              <div className="pl-4 border-l border-cyber-green/20 prose prose-invert prose-xs max-w-none">
                <ReactMarkdown>{item.text}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 animate-pulse">
            <span className="text-cyber-green opacity-50">root@adizilla:~$</span>
            <span className="w-2 h-4 bg-cyber-green" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-cyber-green/10 flex items-center gap-2">
        <ChevronRight size={14} className="text-cyber-green" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? "Enter command..." : "Ingiza amri..."}
          className="flex-1 bg-transparent border-none outline-none text-xs text-cyber-green placeholder:text-cyber-green/20"
          autoFocus
        />
      </form>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [booted, setBooted] = useState(false);
  const [vfs, setVfs] = useState<VNode[]>([]);
  const [currentDir, setCurrentDir] = useState('root');
  const [user, setUser] = useState<VUser>({ username: 'root', role: 'root', lastLogin: new Date().toISOString() });
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => setStatus('online'));
    newSocket.on('disconnect', () => setStatus('offline'));
    newSocket.on('metrics_update', (data: any) => setMetrics(data));
    newSocket.on('system_event', (event: any) => setEvents(prev => [event, ...prev].slice(0, 50)));

    // Initial VFS fetch
    fetch('/api/vfs').then(res => res.json()).then(data => setVfs(data));
    fetch('/api/events').then(res => res.json()).then(data => setEvents(data));

    const handleVfsUpdate = (e: any) => setVfs(e.detail);
    window.addEventListener('vfs_update', handleVfsUpdate);

    return () => { 
      newSocket.close(); 
      window.removeEventListener('vfs_update', handleVfsUpdate);
    };
  }, []);

  if (!booted) return <BootSequence onComplete={() => setBooted(true)} />;

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto relative">
      <div className="scanline" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tighter glitch-text flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-green rounded flex items-center justify-center text-black">
              <Activity size={20} />
            </div>
            ADIZILLA_OS
          </h1>
          <div className="h-8 w-[1px] bg-cyber-green/20" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest opacity-40">User: {user.username}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-40">Dir: /{(vfs.find(n => n.id === currentDir)?.name || '')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-cyber-green animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{status}</span>
            </div>
            <span className="text-[10px] opacity-30">CORE_SYNC_ACTIVE</span>
          </div>
          <div className="h-10 w-[1px] bg-cyber-green/10 hidden md:block" />
          <button className="p-2 panel-border rounded hover:bg-cyber-green/10 transition-colors" onClick={() => window.location.reload()}>
            <Power size={18} className="text-red-500" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Metrics & Events */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Integrity Matrix
              </h2>
              <span className="text-[10px] opacity-40">REAL_TIME_POLLING</span>
            </div>
            <IntegrityMatrix metrics={metrics} />
          </section>
          
          <section className="flex-1 min-h-[300px] overflow-hidden">
            <NeuralPipeline events={events} />
          </section>
        </div>

        {/* Right Column: Shell & Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <section className="flex-1 min-h-[400px]">
            <CommandShell 
              socket={socket} 
              vfs={vfs} 
              currentDir={currentDir} 
              setCurrentDir={setCurrentDir}
              user={user}
              language={language}
              setLanguage={setLanguage}
            />
          </section>
          
          {/* Bottom Visualizer (Simulated) */}
          <section className="h-32 panel-border rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Neural Frequency Monitor</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-[10px] opacity-50">
                  <Cloud size={10} />
                  <span>24°C</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] opacity-50">
                  <Bitcoin size={10} />
                  <span>$62,450</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-1">
              {Array.from({ length: 48 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-cyber-green/20 rounded-t"
                  animate={{ height: `${Math.random() * 100}%` }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cyber-green/5 to-transparent" />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center text-[10px] opacity-30 uppercase tracking-widest border-t border-cyber-green/10 pt-4">
        <div>© 2026 ADIZILLA_CORP // ALL RIGHTS RESERVED</div>
        <div className="flex gap-4">
          <span>SECURE_LINK: AES-256</span>
          <span>LOCATION: NAIROBI_NODE_01</span>
        </div>
      </footer>
    </div>
  );
}
