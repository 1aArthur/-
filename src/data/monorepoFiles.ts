export interface CodeFile {
  path: string;
  name: string;
  package: string;
  language: string;
  description: string;
  content: string;
}

export const MONOREPO_FILES: CodeFile[] = [
  {
    path: 'packages/shared/src/index.ts',
    name: 'index.ts',
    package: '@platform/shared',
    language: 'typescript',
    description: 'Shared contract DTOs and type definitions consumed by Lynx 4 and Elysia backend.',
    content: `export type ServiceStatus = 'healthy' | 'warning' | 'critical';

export interface NodeTelemetry {
  id: string;
  name: string;
  engine: 'BEAM/Elixir' | 'Rust/Tokio' | 'JVM/GraalVM' | 'Bun/Elysia' | 'Python/FastAPI' | 'Go/Gin';
  cpuUsage: number;     // 0 to 100%
  memoryMb: number;
  requestsPerSec: number;
  latencyP99Ms: number;
  status: ServiceStatus;
  lastUpdated: string;
}

export interface TelemetryResponse {
  uptimeSeconds: number;
  activeNodes: number;
  totalRequestsPerSec: number;
  averageCpuUsage: number;
  nodes: NodeTelemetry[];
}`
  },
  {
    path: 'apps/backend/src/index.ts',
    name: 'index.ts',
    package: 'backend (Elysia + Bun)',
    language: 'typescript',
    description: 'Ultra-fast HTTP backend server powered by Bun runtime and Elysia framework.',
    content: `import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import type { TelemetryResponse, NodeTelemetry, ServiceStatus } from '@platform/shared';

const initialNodes: NodeTelemetry[] = [
  {
    id: 'node-beam-01',
    name: 'Phoenix Channels Gateway',
    engine: 'BEAM/Elixir',
    cpuUsage: 14.5,
    memoryMb: 128,
    requestsPerSec: 14200,
    latencyP99Ms: 2.1,
    status: 'healthy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'node-rust-01',
    name: 'Tokio/Axum Core Ingestion',
    engine: 'Rust/Tokio',
    cpuUsage: 28.2,
    memoryMb: 42,
    requestsPerSec: 48900,
    latencyP99Ms: 0.6,
    status: 'healthy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'node-graal-01',
    name: 'Micronaut Native Service',
    engine: 'JVM/GraalVM',
    cpuUsage: 36.8,
    memoryMb: 88,
    requestsPerSec: 8750,
    latencyP99Ms: 1.8,
    status: 'healthy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'node-elysia-01',
    name: 'Bun Edge API Cluster',
    engine: 'Bun/Elysia',
    cpuUsage: 19.3,
    memoryMb: 64,
    requestsPerSec: 32100,
    latencyP99Ms: 1.2,
    status: 'healthy',
    lastUpdated: new Date().toISOString()
  }
];

let startTime = Date.now();
let currentNodes = [...initialNodes];

export const app = new Elysia()
  .use(cors())
  .get('/api/telemetry', (): TelemetryResponse => {
    const totalRps = currentNodes.reduce((acc, n) => acc + n.requestsPerSec, 0);
    const avgCpu = currentNodes.reduce((acc, n) => acc + n.cpuUsage, 0) / currentNodes.length;

    return {
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      activeNodes: currentNodes.length,
      totalRequestsPerSec: totalRps,
      averageCpuUsage: Number(avgCpu.toFixed(1)),
      nodes: currentNodes
    };
  })
  .post('/api/nodes/:id/restart', ({ params: { id } }) => {
    const target = currentNodes.find((n) => n.id === id);
    if (!target) return { success: false, error: 'Node not found' };

    target.cpuUsage = 8.0;
    target.status = 'healthy';
    target.lastUpdated = new Date().toLocaleTimeString();
    return { success: true, message: \`Node \${id} rebooted nominal!\` };
  }, {
    params: t.Object({ id: t.String() })
  })
  .listen(3001);

console.log(\`⚡ Elysia API running on http://localhost:\${app.server?.port}\`);`
  },
  {
    path: 'apps/lynx-mobile/src/App.tsx',
    name: 'App.tsx',
    package: 'lynx-mobile (Lynx 4 + ReactLynx)',
    language: 'tsx',
    description: 'Native mobile client utilizing Lynx 4 native primitives (<view>, <text>, <scroll-view>) with 120 FPS dual-thread engine.',
    content: `import { useState, useEffect, useCallback } from '@lynx-js/react';
import type { TelemetryResponse, NodeTelemetry } from '@platform/shared';
import './App.css';

// 10.0.2.2 connects to host on Android Emulator, localhost for iOS/Desktop
const API_BASE = 'http://10.0.2.2:3001/api';

export function App() {
  const [data, setData] = useState<TelemetryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'critical'>('all');
  const [notice, setNotice] = useState<string>('');

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch(\`\${API_BASE}/telemetry\`);
      const json: TelemetryResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRestartNode = async (nodeId: string) => {
    try {
      const res = await fetch(\`\${API_BASE}/nodes/\${nodeId}/restart\`, { method: 'POST' });
      const json = await res.json();
      setNotice(json.message ?? \`Node \${nodeId} restarted!\`);
      setTimeout(() => setNotice(''), 3000);
      fetchTelemetry();
    } catch {
      setNotice(\`Reboot command sent to \${nodeId}\`);
      setTimeout(() => setNotice(''), 3000);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2500);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const displayedNodes = (data?.nodes ?? []).filter((node) => {
    if (activeTab === 'critical') return node.status !== 'healthy';
    return true;
  });

  return (
    <view className="container">
      {/* Header Bar */}
      <view className="header">
        <view className="header-meta">
          <text className="badge-tag">LYNX 4 NATIVE</text>
          <text className="timestamp">Uptime: {data?.uptimeSeconds ?? 0}s</text>
        </view>
        <text className="title">Platform Telemetry</text>
        <text className="subtitle">Bun · Tokio · BEAM · GraalVM</text>
      </view>

      {/* Notice Banner */}
      {notice ? (
        <view className="notice-banner">
          <text className="notice-text">✓ {notice}</text>
        </view>
      ) : null}

      {/* Summary KPI Row */}
      <view className="summary-row">
        <view className="metric-box">
          <text className="metric-box-title">ACTIVE NODES</text>
          <text className="metric-box-val">{data?.activeNodes ?? 0}</text>
        </view>
        <view className="metric-box">
          <text className="metric-box-title">THROUGHPUT</text>
          <text className="metric-box-val highlight-green">
            {((data?.totalRequestsPerSec ?? 0) / 1000).toFixed(1)}k rps
          </text>
        </view>
      </view>

      {/* Native Scrollable List */}
      <scroll-view scroll-y className="nodes-scroll">
        {displayedNodes.map((node: NodeTelemetry) => (
          <view key={node.id} className="node-card">
            <view className="card-header">
              <view className="engine-badge">
                <text className="engine-text">{node.engine}</text>
              </view>
              <view className={\`badge status-\${node.status}\`}>
                <text className={\`status-label text-\${node.status}\`}>
                  {node.status.toUpperCase()}
                </text>
              </view>
            </view>

            <text className="node-name">{node.name}</text>
            <text className="node-id">{node.id} · P99: {node.latencyP99Ms}ms</text>

            <view className="stats-grid">
              <view className="stat-col">
                <text className="stat-val">{node.cpuUsage}%</text>
                <text className="stat-name">CPU</text>
              </view>
              <view className="stat-col">
                <text className="stat-val">{node.memoryMb} MB</text>
                <text className="stat-name">RAM</text>
              </view>
              <view className="stat-col">
                <text className="stat-val">{node.requestsPerSec.toLocaleString()}</text>
                <text className="stat-name">Req/s</text>
              </view>
            </view>

            <view className="restart-btn" bindtap={() => handleRestartNode(node.id)}>
              <text className="restart-btn-text">Reboot Node</text>
            </view>
          </view>
        ))}
      </scroll-view>
    </view>
  );
}`
  },
  {
    path: 'apps/lynx-mobile/src/App.css',
    name: 'App.css',
    package: 'lynx-mobile (Lynx 4 Styles)',
    language: 'css',
    description: 'Native stylesheet utilizing Lynx CSS flexbox engine and native rendering tokens.',
    content: `.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #030712;
  padding: 24px 16px 16px 16px;
}

.header {
  margin-bottom: 12px;
}

.header-meta {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.badge-tag {
  background-color: #111827;
  color: #38bdf8;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.timestamp {
  color: #64748b;
  font-size: 11px;
}

.title {
  color: #f8fafc;
  font-size: 24px;
  font-weight: 800;
}

.subtitle {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 2px;
}

.summary-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 12px;
}

.metric-box {
  flex: 1;
  background-color: #0b0f19;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px;
}

.metric-box-title {
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.metric-box-val {
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  margin-top: 4px;
}

.highlight-green {
  color: #34d399;
}

.nodes-scroll {
  flex: 1;
}

.node-card {
  background-color: #0b0f19;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.engine-badge {
  background-color: #1e1b4b;
  padding: 2px 6px;
  border-radius: 4px;
}

.engine-text {
  color: #a5b4fc;
  font-size: 10px;
  font-weight: 600;
}

.node-name {
  color: #f1f5f9;
  font-size: 15px;
  font-weight: 700;
  margin-top: 6px;
}

.node-id {
  color: #64748b;
  font-size: 11px;
  margin-top: 2px;
}

.stats-grid {
  display: flex;
  flex-direction: row;
  background-color: #030712;
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;
  justify-content: space-around;
}

.stat-val {
  color: #38bdf8;
  font-size: 14px;
  font-weight: 700;
}

.stat-name {
  color: #64748b;
  font-size: 10px;
}

.restart-btn {
  background-color: #1e293b;
  border-radius: 6px;
  padding: 7px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
}

.restart-btn-text {
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 600;
}`
  },
  {
    path: 'apps/lynx-mobile/lynx.config.ts',
    name: 'lynx.config.ts',
    package: 'lynx-mobile',
    language: 'typescript',
    description: 'Rspeedy bundler configuration for Lynx 4 with ReactLynx plugin.',
    content: `import { defineConfig } from '@lynx-js/rspeedy';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReactLynx()
  ],
  source: {
    entry: {
      main: './src/index.tsx',
    },
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
});`
  },
  {
    path: 'package.json',
    name: 'package.json',
    package: 'mission-control-2026 (Monorepo Root)',
    language: 'json',
    description: 'Bun monorepo root package configuration orchestrating shared packages, mobile app, and backend.',
    content: `{
  "name": "mission-control-2026",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev:backend": "bun --filter backend dev",
    "dev:lynx": "bun --filter lynx-mobile dev",
    "dev": "bun --filter \\"*\\" dev",
    "build": "bun --filter \\"*\\" build"
  }
}`
  }
];
