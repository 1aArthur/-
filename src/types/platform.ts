export type ServiceStatus = 'healthy' | 'warning' | 'critical';

export type EngineType =
  | 'BEAM/Elixir'
  | 'Rust/Tokio'
  | 'JVM/GraalVM'
  | 'Bun/Elysia'
  | 'Python/FastAPI'
  | 'Go/Gin';

export interface NodeTelemetry {
  id: string;
  name: string;
  engine: EngineType;
  role: string;
  cpuUsage: number; // 0 to 100%
  memoryMb: number;
  requestsPerSec: number;
  latencyP99Ms: number;
  status: ServiceStatus;
  lastUpdated: string;
  threadCount: number;
  uptimeSeconds: number;
  details: {
    runtime: string;
    concurrencyModel: string;
    gcModel: string;
    memoryLimitMb: number;
    connections: number;
    errorRate: number; // percentage
  };
}

export interface TelemetryResponse {
  uptimeSeconds: number;
  activeNodes: number;
  totalRequestsPerSec: number;
  averageCpuUsage: number;
  nodes: NodeTelemetry[];
  timestamp: string;
}

export interface ClusterEvent {
  id: string;
  timestamp: string;
  nodeId: string;
  type: 'restart' | 'surge' | 'warning' | 'recovery' | 'info';
  message: string;
}

export interface LynxThreadEvent {
  id: string;
  timestamp: number;
  thread: 'ui_native' | 'background_js' | 'tasm_compiler';
  type: 'render' | 'diff' | 'ipc_dispatch' | 'state_update' | 'layout';
  durationMs: number;
  details: string;
}

export interface PlatformStack {
  id: string;
  category: string;
  title: string;
  runtime: string;
  primaryUse: string[];
  strengths: string[];
  benchmarks: {
    startupMs: number;
    idleMemoryMb: number;
    rpsThroughput: number;
    p99LatencyMs: number;
  };
  sampleCode: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface StackCombination {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  layers: {
    layerName: string;
    tech: string;
    role: string;
  }[];
  description: string;
  whyItExcels: string;
}
