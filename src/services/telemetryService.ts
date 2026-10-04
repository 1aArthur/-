import { NodeTelemetry, ServiceStatus, ClusterEvent, LynxThreadEvent } from '../types/platform';

export interface TelemetryHistoryPoint {
  time: string;
  totalRps: number;
  avgCpu: number;
  totalMemoryMb: number;
  avgP99Latency: number;
}

export const INITIAL_NODES: NodeTelemetry[] = [
  {
    id: 'node-beam-01',
    name: 'Phoenix Channels Gateway',
    engine: 'BEAM/Elixir',
    role: 'Massive WebSocket & Realtime PubSub Broker',
    cpuUsage: 14.5,
    memoryMb: 128,
    requestsPerSec: 14200,
    latencyP99Ms: 2.1,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 240,
    uptimeSeconds: 84320,
    details: {
      runtime: 'Erlang/OTP 27 BEAM Scheduler',
      concurrencyModel: 'Preemptive Actor Mailbox (140k lightweight processes)',
      gcModel: 'Per-process generational heap (Zero STW)',
      memoryLimitMb: 512,
      connections: 18450,
      errorRate: 0.01
    }
  },
  {
    id: 'node-rust-01',
    name: 'Tokio/Axum Core Ingestion',
    engine: 'Rust/Tokio',
    role: 'Stateless Low-Latency Protocol Engine',
    cpuUsage: 28.2,
    memoryMb: 42,
    requestsPerSec: 48900,
    latencyP99Ms: 0.6,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 16,
    uptimeSeconds: 124500,
    details: {
      runtime: 'Native x86_64 / aarch64 Machine Code',
      concurrencyModel: 'Tokio Work-Stealing Async Task Pool',
      gcModel: 'Compile-time RAII (Zero GC overhead)',
      memoryLimitMb: 256,
      connections: 42000,
      errorRate: 0.00
    }
  },
  {
    id: 'node-graal-01',
    name: 'Micronaut Native Service',
    engine: 'JVM/GraalVM',
    role: 'Enterprise Business Rules & Transaction Core',
    cpuUsage: 36.8,
    memoryMb: 88,
    requestsPerSec: 8750,
    latencyP99Ms: 1.8,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 32,
    uptimeSeconds: 61200,
    details: {
      runtime: 'GraalVM Native Image (SubstrateVM)',
      concurrencyModel: 'Virtual Threads (Project Loom AOT)',
      gcModel: 'Serial / G1 AOT Garbage Collector',
      memoryLimitMb: 512,
      connections: 9200,
      errorRate: 0.02
    }
  },
  {
    id: 'node-elysia-01',
    name: 'Bun Edge API Cluster',
    engine: 'Bun/Elysia',
    role: 'Edge REST & WebSocket Gateway with TypeBox Validation',
    cpuUsage: 19.3,
    memoryMb: 64,
    requestsPerSec: 32100,
    latencyP99Ms: 1.2,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 8,
    uptimeSeconds: 43200,
    details: {
      runtime: 'Bun v1.2 (WebKit JavaScriptCore JSC)',
      concurrencyModel: 'Event Loop with libuv & uWebSockets C++ engine',
      gcModel: 'JSC Generational Mark & Sweep',
      memoryLimitMb: 256,
      connections: 28400,
      errorRate: 0.01
    }
  },
  {
    id: 'node-fastapi-01',
    name: 'PyO3 AI Acceleration Worker',
    engine: 'Python/FastAPI',
    role: 'Pydantic Model Inference & Vector Dispatch',
    cpuUsage: 44.1,
    memoryMb: 142,
    requestsPerSec: 4200,
    latencyP99Ms: 3.4,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 12,
    uptimeSeconds: 31200,
    details: {
      runtime: 'CPython 3.12 + PyO3 Native Rust Extension',
      concurrencyModel: 'Asyncio Event Loop + Rust ThreadPoolExecutor',
      gcModel: 'Reference Counting + Cycle Detector',
      memoryLimitMb: 1024,
      connections: 3200,
      errorRate: 0.04
    }
  },
  {
    id: 'node-gin-01',
    name: 'Cloud Infrastructure Coordinator',
    engine: 'Go/Gin',
    role: 'Raft Cluster Consensus & Health Discovery',
    cpuUsage: 16.4,
    memoryMb: 34,
    requestsPerSec: 21500,
    latencyP99Ms: 1.0,
    status: 'healthy',
    lastUpdated: 'Just now',
    threadCount: 48,
    uptimeSeconds: 98000,
    details: {
      runtime: 'Go 1.24 Native Binary',
      concurrencyModel: 'Goroutines (M:N preemptive scheduler)',
      gcModel: 'Concurrent Mark-Sweep (<0.5ms pauses)',
      memoryLimitMb: 256,
      connections: 16800,
      errorRate: 0.00
    }
  }
];

export function generateNextMetrics(
  prevNodes: NodeTelemetry[],
  isSurgeActive: boolean,
  chaosActive: boolean
): NodeTelemetry[] {
  return prevNodes.map((node) => {
    let cpuDelta = (Math.random() * 6 - 3);
    let rpsDelta = (Math.random() * 1200 - 600);
    let latencyDelta = (Math.random() * 0.4 - 0.2);

    if (isSurgeActive) {
      cpuDelta += Math.random() * 12 + 4;
      rpsDelta += Math.random() * 6000 + 2000;
      latencyDelta += Math.random() * 1.2;
    }

    if (chaosActive && Math.random() > 0.85) {
      cpuDelta += 35;
      latencyDelta += 4.5;
    }

    const newCpu = Math.min(Math.max(node.cpuUsage + cpuDelta, 4.0), 99.4);
    const newRps = Math.max(Math.round(node.requestsPerSec + rpsDelta), 800);
    const newLatency = Math.max(Number((node.latencyP99Ms + latencyDelta).toFixed(2)), 0.35);

    let status: ServiceStatus = 'healthy';
    if (newCpu > 82 || newLatency > 5.0) {
      status = 'critical';
    } else if (newCpu > 62 || newLatency > 2.8) {
      status = 'warning';
    }

    return {
      ...node,
      cpuUsage: Number(newCpu.toFixed(1)),
      requestsPerSec: newRps,
      latencyP99Ms: newLatency,
      memoryMb: Math.round(node.memoryMb + (Math.random() * 4 - 2)),
      status,
      lastUpdated: new Date().toLocaleTimeString()
    };
  });
}

export function createLynxThreadEvent(
  thread: 'ui_native' | 'background_js' | 'tasm_compiler',
  type: 'render' | 'diff' | 'ipc_dispatch' | 'state_update' | 'layout',
  durationMs: number,
  details: string
): LynxThreadEvent {
  return {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    thread,
    type,
    durationMs,
    details
  };
}
