import React, { useEffect, useState, useRef } from 'react';
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
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Metrics {
  cpu: number;
  memory: number;
  uptime: number;
  processes: number;
  latency: number;
  timestamp: number;
}

interface SystemEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  source: string;
  message: string;
  ai_analysis: string;
}

// --- Components ---

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

const IntegrityMatrix = ({ metrics }: { metrics: Metrics | null }) => {
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

const NeuralPipeline = ({ events }: { events: SystemEvent[] }) => {
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

const CommandShell = ({ socket }: { socket: Socket | null }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'cmd' | 'res', text: string }[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setHistory(prev => [...prev, { type: 'cmd', text: currentInput }]);
    setCommandHistory(prev => [currentInput, ...prev]);
    setHistoryIndex(-1);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `You are ADIZILLA_OS, a cyber-minimalist AI operating system. 
        Interpret the following user command: "${currentInput}". 
        If it's a system request, explain what you would do. 
        If it's a question, answer it concisely. 
        Keep the tone professional, technical, and slightly cold. 
        Use markdown for formatting.` }] }],
      });
      
      setHistory(prev => [...prev, { type: 'res', text: response.text || "No response from neural link." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setHistory(prev => [...prev, { type: 'res', text: "ERROR: Neural link failure. Check API configuration or network status." }]);
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
      <div className="p-3 border-b border-cyber-green/10 flex items-center gap-2 bg-cyber-green/5">
        <Terminal size={14} />
        <span className="text-xs font-bold tracking-widest uppercase">AI Command Shell</span>
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
          placeholder="Enter command..."
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
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => setStatus('online'));
    newSocket.on('disconnect', () => setStatus('offline'));
    newSocket.on('metrics_update', (data: Metrics) => setMetrics(data));
    newSocket.on('system_event', (event: SystemEvent) => setEvents(prev => [event, ...prev].slice(0, 50)));

    // Initial events fetch
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));

    return () => { newSocket.close(); };
  }, []);

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto relative">
      <div className="scanline" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter glitch-text flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-green rounded flex items-center justify-center text-black">
              <Activity size={20} />
            </div>
            ADIZILLA_OS
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-1">
            Advanced Neural Intelligence & System Monitoring Interface
          </p>
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
          <button className="p-2 panel-border rounded hover:bg-cyber-green/10 transition-colors">
            <Settings size={18} />
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
            <CommandShell socket={socket} />
          </section>
          
          {/* Bottom Visualizer (Simulated) */}
          <section className="h-32 panel-border rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Neural Frequency Monitor</span>
              <Maximize2 size={12} className="opacity-30" />
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
          <span>LOCATION: CLOUD_NODE_04</span>
        </div>
      </footer>
    </div>
  );
}
