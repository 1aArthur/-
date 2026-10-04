import React, { useState, useEffect, useCallback } from 'react';
import { NodeTelemetry, ClusterEvent, LynxThreadEvent } from './types/platform';
import {
  INITIAL_NODES,
  generateNextMetrics,
  createLynxThreadEvent,
  TelemetryHistoryPoint
} from './services/telemetryService';
import { Header } from './components/Header';
import { LynxDeviceSimulator } from './components/LynxDeviceSimulator';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { ClusterDashboard } from './components/ClusterDashboard';
import { MonorepoCodeBrowser } from './components/MonorepoCodeBrowser';
import { BenchmarksSandbox } from './components/BenchmarksSandbox';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'simulator' | 'architecture' | 'cluster' | 'monorepo' | 'benchmarks'
  >('simulator');

  const [nodes, setNodes] = useState<NodeTelemetry[]>(INITIAL_NODES);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(84320);
  const [isSurgeActive, setIsSurgeActive] = useState<boolean>(false);
  const [isChaosActive, setIsChaosActive] = useState<boolean>(false);

  // History for trend charts
  const [history, setHistory] = useState<TelemetryHistoryPoint[]>([
    { time: '12:00', totalRps: 139850, avgCpu: 26.5, totalMemoryMb: 498, avgP99Latency: 1.4 },
    { time: '12:01', totalRps: 142100, avgCpu: 27.2, totalMemoryMb: 504, avgP99Latency: 1.3 },
    { time: '12:02', totalRps: 148500, avgCpu: 29.4, totalMemoryMb: 512, avgP99Latency: 1.5 },
    { time: '12:03', totalRps: 140300, avgCpu: 26.1, totalMemoryMb: 502, avgP99Latency: 1.4 }
  ]);

  // Cluster Audit Log
  const [events, setEvents] = useState<ClusterEvent[]>([
    {
      id: 'ev-init-1',
      timestamp: new Date().toLocaleTimeString(),
      nodeId: 'cluster',
      type: 'info',
      message: 'Platform 2026 Cluster initialized: Lynx 4, Bun/Elysia, Tokio, BEAM, GraalVM operational.'
    }
  ]);

  // Lynx Thread Events
  const [lynxEvents, setLynxEvents] = useState<LynxThreadEvent[]>([
    createLynxThreadEvent('ui_native', 'render', 8.2, 'Rasterized native <scroll-view> at 120 FPS'),
    createLynxThreadEvent('background_js', 'diff', 1.1, 'ReactLynx state reconciliation nominal'),
    createLynxThreadEvent('tasm_compiler', 'layout', 2.4, 'Lynx Tasm layout tree verified')
  ]);

  // Periodic Telemetry Simulation Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);

      setNodes((prevNodes) => {
        const nextNodes = generateNextMetrics(prevNodes, isSurgeActive, isChaosActive);

        // Record history snapshot
        const totalRps = nextNodes.reduce((acc, n) => acc + n.requestsPerSec, 0);
        const avgCpu = nextNodes.reduce((acc, n) => acc + n.cpuUsage, 0) / nextNodes.length;
        const totalMem = nextNodes.reduce((acc, n) => acc + n.memoryMb, 0);

        setHistory((prevH) => {
          const newPt: TelemetryHistoryPoint = {
            time: new Date().toLocaleTimeString(),
            totalRps,
            avgCpu: Number(avgCpu.toFixed(1)),
            totalMemoryMb: totalMem,
            avgP99Latency: 1.4
          };
          const trimmed = [...prevH, newPt];
          if (trimmed.length > 20) trimmed.shift();
          return trimmed;
        });

        // Add Lynx thread event
        setLynxEvents((prevE) => {
          const sample = [
            createLynxThreadEvent('ui_native', 'render', 8.3, '120 FPS native frame commit'),
            createLynxThreadEvent('background_js', 'state_update', 0.8, 'Elysia telemetry batch digested'),
            createLynxThreadEvent('ui_native', 'layout', 1.9, 'Tasm layout diff calculated in C++')
          ];
          const chosen = sample[Math.floor(Math.random() * sample.length)];
          const updated = [chosen, ...prevE];
          if (updated.length > 15) updated.pop();
          return updated;
        });

        return nextNodes;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isSurgeActive, isChaosActive]);

  // Node restart handler
  const handleRestartNode = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            cpuUsage: 9.5,
            latencyP99Ms: 0.8,
            status: 'healthy',
            lastUpdated: new Date().toLocaleTimeString()
          };
        }
        return n;
      })
    );

    setEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        nodeId,
        type: 'restart',
        message: `Node ${nodeId} received restart signal. Telemetry returned to nominal.`
      },
      ...prev.slice(0, 30)
    ]);
  }, []);

  // Surge handler
  const handleToggleSurge = useCallback(() => {
    setIsSurgeActive((prev) => {
      const next = !prev;
      setEvents((evs) => [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          nodeId: 'cluster',
          type: 'surge',
          message: next
            ? 'Traffic surge injected: +25,000 req/s simulated across cluster nodes.'
            : 'Traffic surge relieved: cluster returning to baseline load.'
        },
        ...evs.slice(0, 30)
      ]);
      return next;
    });
  }, []);

  // Chaos handler
  const handleToggleChaos = useCallback(() => {
    setIsChaosActive((prev) => {
      const next = !prev;
      setEvents((evs) => [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          nodeId: 'cluster',
          type: next ? 'warning' : 'recovery',
          message: next
            ? 'Chaos Monkey activated: random latency spikes and CPU degradations initiated.'
            : 'Chaos Monkey disabled: node self-healing active.'
        },
        ...evs.slice(0, 30)
      ]);
      return next;
    });
  }, []);

  // Reset cluster
  const handleResetCluster = useCallback(() => {
    setNodes(INITIAL_NODES);
    setIsSurgeActive(false);
    setIsChaosActive(false);
    setEvents((evs) => [
      {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        nodeId: 'cluster',
        type: 'recovery',
        message: 'Manual cluster rebalance triggered. All nodes reset to nominal state.'
      },
      ...evs.slice(0, 30)
    ]);
  }, []);

  const totalRps = nodes.reduce((acc, n) => acc + n.requestsPerSec, 0);
  const avgCpu = nodes.reduce((acc, n) => acc + n.cpuUsage, 0) / nodes.length;
  const totalMemoryMb = nodes.reduce((acc, n) => acc + n.memoryMb, 0);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-slate-100 overflow-hidden font-sans">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSurgeActive={isSurgeActive}
        onToggleSurge={handleToggleSurge}
        isChaosActive={isChaosActive}
        onToggleChaos={handleToggleChaos}
        onResetCluster={handleResetCluster}
        totalRps={totalRps}
      />

      {/* Main Tab Content Viewport */}
      <main className="flex-1 flex overflow-hidden bg-black">
        {activeTab === 'simulator' && (
          <LynxDeviceSimulator
            nodes={nodes}
            uptimeSeconds={uptimeSeconds}
            totalRps={totalRps}
            onRestartNode={handleRestartNode}
            onTriggerSurge={handleToggleSurge}
            isSurgeActive={isSurgeActive}
            onToggleChaos={handleToggleChaos}
            isChaosActive={isChaosActive}
            onResetCluster={handleResetCluster}
            lynxEvents={lynxEvents}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureExplorer />}

        {activeTab === 'cluster' && (
          <ClusterDashboard
            nodes={nodes}
            uptimeSeconds={uptimeSeconds}
            totalRps={totalRps}
            avgCpu={avgCpu}
            totalMemoryMb={totalMemoryMb}
            history={history}
            events={events}
            onRestartNode={handleRestartNode}
            onTriggerSurge={handleToggleSurge}
            isSurgeActive={isSurgeActive}
            onResetCluster={handleResetCluster}
          />
        )}

        {activeTab === 'monorepo' && <MonorepoCodeBrowser />}

        {activeTab === 'benchmarks' && <BenchmarksSandbox />}
      </main>
    </div>
  );
}
