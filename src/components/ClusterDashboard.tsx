import React, { useState } from 'react';
import { NodeTelemetry, ClusterEvent } from '../types/platform';
import { TelemetryHistoryPoint } from '../services/telemetryService';
import {
  Activity,
  Cpu,
  HardDrive,
  Clock,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Server,
  Zap,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface ClusterDashboardProps {
  nodes: NodeTelemetry[];
  uptimeSeconds: number;
  totalRps: number;
  avgCpu: number;
  totalMemoryMb: number;
  history: TelemetryHistoryPoint[];
  events: ClusterEvent[];
  onRestartNode: (id: string) => void;
  onTriggerSurge: () => void;
  isSurgeActive: boolean;
  onResetCluster: () => void;
}

export const ClusterDashboard: React.FC<ClusterDashboardProps> = ({
  nodes,
  uptimeSeconds,
  totalRps,
  avgCpu,
  totalMemoryMb,
  history,
  events,
  onRestartNode,
  onTriggerSurge,
  isSurgeActive,
  onResetCluster
}) => {
  const [filterEngine, setFilterEngine] = useState<string>('all');
  const [restartingId, setRestartingId] = useState<string | null>(null);

  const handleRestart = (nodeId: string) => {
    setRestartingId(nodeId);
    setTimeout(() => {
      onRestartNode(nodeId);
      setRestartingId(null);
    }, 600);
  };

  const filteredNodes = filterEngine === 'all'
    ? nodes
    : nodes.filter((n) => n.engine.toLowerCase().includes(filterEngine.toLowerCase()));

  // SVG Chart Calculation for RPS history
  const maxRps = Math.max(...history.map((h) => h.totalRps), 150000);
  const minRps = Math.min(...history.map((h) => h.totalRps), 40000);
  const chartHeight = 80;
  const chartWidth = 400;

  const points = history.map((pt, i) => {
    const x = (i / Math.max(history.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((pt.totalRps - minRps) / Math.max(maxRps - minRps, 1)) * chartHeight;
    return `${x},${Math.max(Math.min(y, chartHeight), 4)}`;
  }).join(' ');

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto">
      {/* Title & Global Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Cluster Telemetry & Infrastructure Mesh
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Active Nodes: {nodes.length} · Uptime: {Math.floor(uptimeSeconds / 60)}m {uptimeSeconds % 60}s · Cluster Health: 100%
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerSurge}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSurgeActive
                ? 'bg-amber-950/40 text-amber-200 border-amber-500/60'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isSurgeActive ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>{isSurgeActive ? 'Surge Active' : 'Load Surge (+25k rps)'}</span>
          </button>

          <button
            onClick={onResetCluster}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rebalance All</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Throughput */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              AGGREGATED THROUGHPUT
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {(totalRps / 1000).toFixed(1)}k <span className="text-xs text-neutral-400 font-normal">req/s</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Across Bun, Tokio, BEAM & GraalVM nodes
          </p>
        </div>

        {/* KPI 2: Average CPU */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              CLUSTER AVERAGE CPU
            </span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            avgCpu > 75 ? 'text-red-400' : avgCpu > 55 ? 'text-amber-400' : 'text-cyan-400'
          }`}>
            {avgCpu.toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-400">
            Preemptive BEAM & Tokio work-stealing
          </p>
        </div>

        {/* KPI 3: Memory Footprint */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              TOTAL RESIDENT RAM
            </span>
            <HardDrive className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalMemoryMb} <span className="text-xs text-neutral-400 font-normal">MB</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            SubstrateVM AOT & Rust zero-GC profile
          </p>
        </div>

        {/* KPI 4: P99 Latency */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              CLUSTER P99 LATENCY
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            1.4 <span className="text-xs text-neutral-400 font-normal">ms</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Zero-allocation Tokio pipelines
          </p>
        </div>
      </div>

      {/* Real-time SVG Stream Chart */}
      <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Real-Time Throughput Trend (RPS)
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Live updates every 2000ms · {history.length} samples
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              Throughput Curve
            </span>
            <span className="tabular-nums text-white font-semibold">
              Peak: {Math.round(maxRps).toLocaleString()} req/s
            </span>
          </div>
        </div>

        <div className="h-24 w-full bg-black rounded-lg border border-neutral-800/80 p-2 relative overflow-hidden flex items-end">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#1e293b" strokeDasharray="3 3" />
            {/* Gradient Area */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00f3ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="#00f3ff"
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* High-Density Data Grid (frontend-design: compact rows, tabular numerals, proper alignment) */}
      <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">
            Cluster Nodes Directory
          </h3>

          {/* Engine Filter */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'beam', 'rust', 'graal', 'bun', 'fastapi'].map((eng) => (
              <button
                key={eng}
                onClick={() => setFilterEngine(eng)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer capitalize font-mono ${
                  filterEngine === eng
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-neutral-800'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px]">
                <th className="pb-2.5 font-semibold">Node Name & ID</th>
                <th className="pb-2.5 font-semibold">Engine Runtime</th>
                <th className="pb-2.5 font-semibold text-right">CPU Load</th>
                <th className="pb-2.5 font-semibold text-right">RAM (MB)</th>
                <th className="pb-2.5 font-semibold text-right">Throughput</th>
                <th className="pb-2.5 font-semibold text-right">P99 Latency</th>
                <th className="pb-2.5 font-semibold text-center">Status</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {filteredNodes.map((node) => {
                const isCritical = node.status === 'critical';
                const isWarning = node.status === 'warning';
                const isRestarting = restartingId === node.id;

                return (
                  <tr key={node.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-sans font-semibold text-white text-xs">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {node.id} · {node.details.concurrencyModel.split(' ')[0]}
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 text-cyan-300 border border-neutral-800 font-medium">
                        {node.engine}
                      </span>
                    </td>

                    <td className="py-3 pr-4 text-right tabular-nums">
                      <span className={`font-semibold ${
                        node.cpuUsage > 80 ? 'text-red-400' : node.cpuUsage > 60 ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {node.cpuUsage}%
                      </span>
                    </td>

                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">
                      {node.memoryMb} MB
                    </td>

                    <td className="py-3 pr-4 text-right tabular-nums text-emerald-400 font-semibold">
                      {node.requestsPerSec.toLocaleString()}
                    </td>

                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">
                      {node.latencyP99Ms} ms
                    </td>

                    <td className="py-3 px-2 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-sans font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Critical
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-sans font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Nominal
                        </span>
                      )}
                    </td>

                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => handleRestart(node.id)}
                        disabled={isRestarting}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-sans font-medium transition-colors cursor-pointer border border-neutral-700"
                      >
                        {isRestarting ? 'Rebooting...' : 'Reboot'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cluster Event Stream Log */}
      <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-white">
              Cluster Audit Event Log
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {events.length} Events Logged
          </span>
        </div>

        <div className="bg-black rounded-lg border border-neutral-800/80 p-3 font-mono text-xs text-neutral-400 max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-start gap-2">
              <span className="text-neutral-500 shrink-0 text-[11px]">
                [{ev.timestamp}]
              </span>
              <span className={`px-1 rounded text-[10px] uppercase font-bold shrink-0 ${
                ev.type === 'restart'
                  ? 'bg-cyan-950 text-cyan-300'
                  : ev.type === 'surge'
                  ? 'bg-amber-950 text-amber-300'
                  : ev.type === 'warning'
                  ? 'bg-red-950 text-red-300'
                  : 'bg-neutral-800 text-neutral-300'
              }`}>
                {ev.type}
              </span>
              <span className="text-neutral-300 truncate">
                {ev.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
