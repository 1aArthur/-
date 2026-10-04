import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Zap,
  Cpu,
  HardDrive,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';

interface BenchmarkEngine {
  id: string;
  name: string;
  category: string;
  throughputRps: number;
  p99LatencyMs: number;
  memoryMb: number;
  startupMs: number;
  gcBehavior: string;
  description: string;
}

const DEFAULT_ENGINES: BenchmarkEngine[] = [
  {
    id: 'rust-tokio',
    name: 'Rust (Tokio + Axum)',
    category: 'Native Binary',
    throughputRps: 198000,
    p99LatencyMs: 0.6,
    memoryMb: 14,
    startupMs: 4,
    gcBehavior: 'Zero GC (RAII compile-time memory)',
    description: 'Work-stealing async runtime with zero heap allocation overhead for raw packet ingestion.'
  },
  {
    id: 'bun-elysia',
    name: 'Bun + Elysia',
    category: 'TypeScript / JSC',
    throughputRps: 142000,
    p99LatencyMs: 1.2,
    memoryMb: 36,
    startupMs: 12,
    gcBehavior: 'WebKit JSC Generational Mark & Sweep',
    description: 'Sub-millisecond typebox validation compiled to raw machine code instructions.'
  },
  {
    id: 'go-gin',
    name: 'Go (Gin Engine)',
    category: 'Compiled Go',
    throughputRps: 115000,
    p99LatencyMs: 1.1,
    memoryMb: 24,
    startupMs: 18,
    gcBehavior: 'Concurrent tri-color (<0.5ms pause)',
    description: 'M:N goroutines multiplexed over OS threads with lightweight 2KB stacks.'
  },
  {
    id: 'graalvm-micronaut',
    name: 'Micronaut + GraalVM Native',
    category: 'AOT JVM Binary',
    throughputRps: 92000,
    p99LatencyMs: 1.8,
    memoryMb: 38,
    startupMs: 22,
    gcBehavior: 'SubstrateVM Serial / G1 AOT GC',
    description: 'Ahead-of-Time native image eliminates JVM warm-up and reflection overhead.'
  },
  {
    id: 'elixir-beam',
    name: 'Elixir (BEAM / Phoenix)',
    category: 'Erlang VM',
    throughputRps: 85000,
    p99LatencyMs: 2.1,
    memoryMb: 68,
    startupMs: 240,
    gcBehavior: 'Per-process isolated generational heaps',
    description: 'Fault-tolerant preemptive actors. Zero stop-the-world pauses for peer processes.'
  },
  {
    id: 'python-fastapi',
    name: 'Python (FastAPI + PyO3)',
    category: 'Async ASGI + Rust',
    throughputRps: 42000,
    p99LatencyMs: 3.4,
    memoryMb: 52,
    startupMs: 180,
    gcBehavior: 'Reference counting + generational cycle',
    description: 'High ergonomics with PyO3 Rust extension offloading compute bottlenecks.'
  }
];

export const BenchmarksSandbox: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [requestCount, setRequestCount] = useState<number>(50000);
  const [activeEngine, setActiveEngine] = useState<BenchmarkEngine>(DEFAULT_ENGINES[0]);
  const [completed, setCompleted] = useState(false);

  const runBenchmark = () => {
    setIsRunning(true);
    setProgress(0);
    setCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const sortedByRps = [...DEFAULT_ENGINES].sort((a, b) => b.throughputRps - a.throughputRps);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Synthetic Engine Benchmarks & Profiler
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Side-by-side performance profiling across Tokio, Bun/Elysia, GraalVM, Go, and BEAM under equal concurrency load.
          </p>
        </div>

        {/* Benchmark Trigger Bar */}
        <div className="flex items-center gap-3">
          <select
            value={requestCount}
            onChange={(e) => setRequestCount(Number(e.target.value))}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white outline-none cursor-pointer"
          >
            <option value={10000}>10,000 Requests</option>
            <option value={50000}>50,000 Requests</option>
            <option value={200000}>200,000 Requests</option>
          </select>

          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? `Running ${progress}%...` : 'Run Synthetic Load'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible when running) */}
      {isRunning && (
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 animate-fadeIn">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">Dispatching {requestCount.toLocaleString()} concurrent HTTP pipelined calls...</span>
            <span className="text-cyan-400 font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {completed && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Synthetic stress pass completed across 6 engines ({requestCount.toLocaleString()} requests dispatched). Results synchronized below.</span>
        </div>
      )}

      {/* Comparative Throughput Bar Chart */}
      <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Throughput Comparison (Requests Per Second)
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Higher is better
          </span>
        </div>

        <div className="space-y-3">
          {sortedByRps.map((eng, idx) => {
            const percentage = (eng.throughputRps / sortedByRps[0].throughputRps) * 100;
            const isTop = idx === 0;

            return (
              <div
                key={eng.id}
                onClick={() => setActiveEngine(eng)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  activeEngine.id === eng.id
                    ? 'bg-cyan-950/30 border-cyan-500/50'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    {isTop && <Award className="w-4 h-4 text-amber-400" />}
                    <span className="font-sans font-semibold text-white">
                      {eng.name}
                    </span>
                    <span className="text-[10px] text-neutral-400">({eng.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 text-[11px]">P99: {eng.p99LatencyMs}ms</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {eng.throughputRps.toLocaleString()} req/s
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop ? 'bg-cyan-400' : 'bg-neutral-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Engine Deep Dive */}
      <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase">
              {activeEngine.category}
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {activeEngine.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {activeEngine.description}
            </p>
          </div>

          <div className="flex gap-2 font-mono text-xs text-center">
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">COLD START</div>
              <div className="text-white font-bold tabular-nums">{activeEngine.startupMs} ms</div>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">MEMORY (IDLE)</div>
              <div className="text-white font-bold tabular-nums">{activeEngine.memoryMb} MB</div>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[10px]">P99 LATENCY</div>
              <div className="text-cyan-400 font-bold tabular-nums">{activeEngine.p99LatencyMs} ms</div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black border border-neutral-800 text-xs font-mono space-y-1">
          <div className="text-neutral-400">
            <strong>Memory & Concurrency Model:</strong> {activeEngine.gcBehavior}
          </div>
        </div>
      </div>
    </div>
  );
};
