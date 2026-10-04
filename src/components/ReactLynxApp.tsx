import React, { useState } from 'react';
import { NodeTelemetry, LynxThreadEvent } from '../types/platform';
import {
  RotateCcw,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  X,
  Server,
  Activity
} from 'lucide-react';

interface ReactLynxAppProps {
  nodes: NodeTelemetry[];
  uptimeSeconds: number;
  totalRps: number;
  onRestartNode: (id: string) => void;
  onTriggerSurge: () => void;
  isSurgeActive: boolean;
  lynxEvents: LynxThreadEvent[];
}

export const ReactLynxApp: React.FC<ReactLynxAppProps> = ({
  nodes,
  uptimeSeconds,
  totalRps,
  onRestartNode,
  onTriggerSurge,
  isSurgeActive,
  lynxEvents
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'alerts' | 'threads'>('nodes');
  const [selectedNode, setSelectedNode] = useState<NodeTelemetry | null>(null);
  const [restartingId, setRestartingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRestart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRestartingId(nodeId);
    setToastMessage(`Dispatching restart signal to ${nodeId}...`);

    setTimeout(() => {
      onRestartNode(nodeId);
      setRestartingId(null);
      setToastMessage(`✓ Node ${nodeId} successfully rebooted nominal`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  const alertNodes = nodes.filter((n) => n.status !== 'healthy');
  const displayedNodes = activeTab === 'alerts' ? alertNodes : nodes;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#030712] text-slate-100 font-sans select-none overflow-hidden">
      {/* Lynx Native Top Bar */}
      <div className="shrink-0 px-4 pt-10 pb-3 bg-[#030712]/95 border-b border-neutral-900 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300 font-semibold tracking-wider">
              LYNX 4 · REACTLYNX
            </span>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-neutral-400">
            Uptime: {Math.floor(uptimeSeconds / 60)}m {uptimeSeconds % 60}s
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              Platform Telemetry
            </h1>
            <p className="text-xs text-neutral-400">
              Bun · Tokio · BEAM · GraalVM
            </p>
          </div>

          <button
            onClick={onTriggerSurge}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 cursor-pointer ${
              isSurgeActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>{isSurgeActive ? 'Surge ON' : 'Surge'}</span>
          </button>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="mt-2.5 px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn">
            <span className="truncate">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white ml-2">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* KPI Mini-Row */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80">
            <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Throughput
            </span>
            <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
              {(totalRps / 1000).toFixed(1)}k <span className="text-[10px] font-normal text-neutral-400">req/s</span>
            </div>
          </div>
          <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80">
            <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Engine Health
            </span>
            <div className="text-base font-bold font-mono text-white tabular-nums flex items-center gap-1.5">
              <span>{nodes.length - alertNodes.length}/{nodes.length}</span>
              <span className="text-[10px] text-cyan-400 font-normal">Active</span>
            </div>
          </div>
        </div>

        {/* Segmented Filter Bar */}
        <div className="flex p-0.5 mt-3 rounded bg-neutral-900 border border-neutral-800">
          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
              activeTab === 'nodes'
                ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Nodes ({nodes.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'alerts'
                ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Alerts</span>
            {alertNodes.length > 0 && (
              <span className="px-1 text-[10px] rounded bg-amber-500/20 text-amber-300 font-mono">
                {alertNodes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('threads')}
            className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
              activeTab === 'threads'
                ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Dual Thread
          </button>
        </div>
      </div>

      {/* Main Content Area: Emulating Lynx <scroll-view scroll-y> */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin">
        {activeTab === 'threads' ? (
          /* Dual Thread Inspector inside Lynx app */
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-xs font-semibold text-cyan-300 mb-1">
                Lynx Dual-Thread Engine Architecture
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Lynx decouples the <strong>Native UI Thread</strong> (which executes layout, Tasm tree diffing, and 120 FPS rasterization in C++) from the <strong>Background Script Thread</strong> (which executes ReactLynx JSX logic in QuickJS/V8).
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Live Thread Activity Stream
              </span>
              {lynxEvents.slice(0, 7).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded bg-neutral-950 border border-neutral-800/80 text-xs font-mono flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`px-1 py-0.5 rounded text-[9px] uppercase font-bold ${
                        ev.thread === 'ui_native'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-violet-500/20 text-violet-300'
                      }`}
                    >
                      {ev.thread === 'ui_native' ? 'UI Native' : 'Script JS'}
                    </span>
                    <span className="text-neutral-300 truncate text-[11px]">{ev.details}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 tabular-nums shrink-0 ml-2">
                    {ev.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : displayedNodes.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400/60" />
            No active alerts in the cluster. All nodes nominal.
          </div>
        ) : (
          displayedNodes.map((node) => {
            const isCritical = node.status === 'critical';
            const isWarning = node.status === 'warning';
            const isRestarting = restartingId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-lg border transition-all cursor-pointer active:scale-[0.99] ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/60'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-800 text-neutral-300">
                      {node.engine}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {node.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase">
                    {isCritical ? (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Critical
                      </span>
                    ) : isWarning ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Warning
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Nominal
                      </span>
                    )}
                  </div>
                </div>

                {/* Node Title & Role */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {node.name}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <p className="text-[11px] text-neutral-400 truncate mb-2.5">
                  {node.role}
                </p>

                {/* CPU Progress Bar */}
                <div className="space-y-1 mb-2.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-neutral-400">CPU LOAD</span>
                    <span className={`tabular-nums font-semibold ${
                      node.cpuUsage > 80 ? 'text-red-400' : node.cpuUsage > 60 ? 'text-amber-400' : 'text-cyan-400'
                    }`}>
                      {node.cpuUsage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        node.cpuUsage > 80
                          ? 'bg-red-500'
                          : node.cpuUsage > 60
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${node.cpuUsage}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded bg-neutral-950/80 border border-neutral-800/60 text-center font-mono text-[11px] mb-2">
                  <div>
                    <div className="text-neutral-400 text-[9px]">RAM</div>
                    <div className="text-slate-200 font-semibold tabular-nums">{node.memoryMb}MB</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[9px]">THROUGHPUT</div>
                    <div className="text-cyan-300 font-semibold tabular-nums">
                      {(node.requestsPerSec / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[9px]">P99 LATENCY</div>
                    <div className={`font-semibold tabular-nums ${
                      node.latencyP99Ms > 3.0 ? 'text-amber-300' : 'text-emerald-300'
                    }`}>
                      {node.latencyP99Ms}ms
                    </div>
                  </div>
                </div>

                {/* Native Action Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Updated: {node.lastUpdated}
                  </span>
                  <button
                    onClick={(e) => handleRestart(node.id, e)}
                    disabled={isRestarting}
                    className="px-2.5 py-1 text-[11px] font-medium rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  >
                    <RotateCcw className={`w-3 h-3 ${isRestarting ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{isRestarting ? 'Rebooting...' : 'Reboot Node'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Node Details Modal / Sheet */}
      {selectedNode && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-neutral-900 border-t border-neutral-700 rounded-t-xl p-4 max-h-[85%] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedNode.engine}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedNode.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Runtime Engine:</span>
                  <span className="text-slate-200 text-right">{selectedNode.details.runtime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Concurrency:</span>
                  <span className="text-slate-200 text-right text-[11px]">{selectedNode.details.concurrencyModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Garbage Collector:</span>
                  <span className="text-slate-200 text-right">{selectedNode.details.gcModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Active Connections:</span>
                  <span className="text-cyan-300 tabular-nums">{selectedNode.details.connections.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Memory Ceiling:</span>
                  <span className="text-slate-200 tabular-nums">{selectedNode.details.memoryLimitMb} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Error Rate:</span>
                  <span className="text-emerald-300 tabular-nums">{selectedNode.details.errorRate}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => {
                    handleRestart(selectedNode.id, e);
                    setSelectedNode(null);
                  }}
                  className="flex-1 py-2 text-xs font-semibold rounded bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Execute Node Reboot</span>
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 text-xs font-semibold rounded bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
