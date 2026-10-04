import React from 'react';
import { Activity, Flame, ShieldAlert, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'architecture' | 'cluster' | 'monorepo' | 'benchmarks';
  setActiveTab: (tab: 'simulator' | 'architecture' | 'cluster' | 'monorepo' | 'benchmarks') => void;
  isSurgeActive: boolean;
  onToggleSurge: () => void;
  isChaosActive: boolean;
  onToggleChaos: () => void;
  onResetCluster: () => void;
  totalRps: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSurgeActive,
  onToggleSurge,
  isChaosActive,
  onToggleChaos,
  onResetCluster,
  totalRps
}) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black/90 px-6 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark (strict Top Bar Contract) */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
          <Activity className="h-4 w-4" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          Mission Control 2026
        </span>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`transition-colors cursor-pointer py-1 ${
            activeTab === 'simulator'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Lynx 4 Studio
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`transition-colors cursor-pointer py-1 ${
            activeTab === 'architecture'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Platform Stacks
        </button>
        <button
          onClick={() => setActiveTab('cluster')}
          className={`transition-colors cursor-pointer py-1 ${
            activeTab === 'cluster'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Cluster Telemetry
        </button>
        <button
          onClick={() => setActiveTab('monorepo')}
          className={`transition-colors cursor-pointer py-1 ${
            activeTab === 'monorepo'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Monorepo Files
        </button>
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`transition-colors cursor-pointer py-1 ${
            activeTab === 'benchmarks'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Benchmarks
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSurge}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
            isSurgeActive
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-neutral-500 hover:text-white'
          }`}
          title="Simulate +25,000 req/s load spike across cluster"
        >
          <Flame className={`h-3.5 w-3.5 ${isSurgeActive ? 'animate-pulse text-amber-400' : ''}`} />
          <span>{isSurgeActive ? 'Surge Active' : 'Inject Surge'}</span>
        </button>

        <button
          onClick={onToggleChaos}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
            isChaosActive
              ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-sm shadow-red-500/20'
              : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-neutral-500 hover:text-white'
          }`}
          title="Simulate random node degradation or failover"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>{isChaosActive ? 'Chaos Running' : 'Chaos Monkey'}</span>
        </button>

        <button
          onClick={onResetCluster}
          className="p-1.5 text-neutral-400 hover:text-white rounded-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
          title="Rebalance & reset all nodes"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
};
