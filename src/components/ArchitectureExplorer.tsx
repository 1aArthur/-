import React, { useState } from 'react';
import {
  PLATFORM_CATEGORIES,
  STACKS_CATALOG,
  STACK_COMBINATIONS
} from '../data/platformArchitecture';
import { PlatformStack, StackCombination } from '../types/platform';
import {
  Layers,
  Code2,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Cpu,
  Shield,
  Clock,
  HardDrive
} from 'lucide-react';

export const ArchitectureExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStack, setActiveStack] = useState<PlatformStack>(STACKS_CATALOG[0]);
  const [activeCombination, setActiveCombination] = useState<StackCombination>(STACK_COMBINATIONS[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredStacks = selectedCategory === 'All'
    ? STACKS_CATALOG
    : STACKS_CATALOG.filter((s) => s.category === selectedCategory);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8 overflow-y-auto">
      {/* Editorial Header (frontend-design: no code-comment titles, clean typography) */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Programming Platform 2026 Architecture Suite
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl leading-relaxed">
          The next-generation stack architecture specification: Lynx 4 native interfaces, Elysia & Bun high-throughput TypeScript backends, Tokio memory-safe ingestion, and BEAM distributed actor fault tolerance.
        </p>
      </div>

      {/* Section 1: Stack Combinations Blueprint */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <h2 className="text-base font-semibold text-white">
            01. Multi-Engine Stack Combinations
          </h2>
          <span className="text-xs text-neutral-400">
            Cross-Language Interoperability
          </span>
        </div>

        {/* Combinations Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {STACK_COMBINATIONS.map((combo) => {
            const isSelected = activeCombination.id === combo.id;
            return (
              <button
                key={combo.id}
                onClick={() => setActiveCombination(combo)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-sm shadow-cyan-950/50'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div>
                  <h3 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {combo.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                    {combo.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {combo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-neutral-300 border border-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Combination Deep Dive Box */}
        <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white">
                {activeCombination.title}
              </h3>
              <p className="text-xs text-neutral-400">
                {activeCombination.description}
              </p>
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium">
              Verified 2026 Interop
            </div>
          </div>

          {/* Layer Pipeline Flow */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Layer Composition Pipeline
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCombination.layers.map((layer, idx) => (
                <div
                  key={layer.layerName}
                  className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between relative"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                      Layer 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-medium">{layer.layerName}</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">
                    {layer.tech}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {layer.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why It Excels Architectural Commentary */}
          <div className="p-3.5 rounded-lg bg-black border border-neutral-800/80 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Architectural Advantage:</strong>{' '}
              {activeCombination.whyItExcels}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Catalog of Engines & Frameworks */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-2">
          <h2 className="text-base font-semibold text-white">
            02. Framework & Runtime Engine Catalog
          </h2>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900'
              }`}
            >
              All Stacks
            </button>
            {PLATFORM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master Catalog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stack List */}
          <div className="lg:col-span-1 space-y-2">
            {filteredStacks.map((stack) => {
              const isSelected = activeStack.id === stack.id;
              return (
                <div
                  key={stack.id}
                  onClick={() => setActiveStack(stack)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-sm'
                      : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="font-mono text-[10px] text-cyan-400 font-semibold uppercase">
                      {stack.category}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums">
                      {stack.benchmarks.rpsThroughput.toLocaleString()} req/s
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {stack.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {stack.runtime}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Specification & Code Preview */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase">
                  {activeStack.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeStack.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Runtime: {activeStack.runtime}
                </p>
              </div>

              {/* Benchmarks Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-center">
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">STARTUP</div>
                  <div className="text-white font-bold tabular-nums">{activeStack.benchmarks.startupMs}ms</div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">IDLE RAM</div>
                  <div className="text-white font-bold tabular-nums">{activeStack.benchmarks.idleMemoryMb}MB</div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">THROUGHPUT</div>
                  <div className="text-emerald-400 font-bold tabular-nums">
                    {(activeStack.benchmarks.rpsThroughput / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">P99 LATENCY</div>
                  <div className="text-cyan-400 font-bold tabular-nums">{activeStack.benchmarks.p99LatencyMs}ms</div>
                </div>
              </div>
            </div>

            {/* Strengths & Primary Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px]">
                  Core Capabilities & Strengths
                </span>
                <ul className="space-y-1.5 text-neutral-400">
                  {activeStack.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px]">
                  Primary Architectural Use
                </span>
                <ul className="space-y-1.5 text-neutral-400">
                  {activeStack.primaryUse.map((use, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Production Sample Code Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  {activeStack.sampleCode.filename} ({activeStack.sampleCode.language})
                </span>

                <button
                  onClick={() => copyCode(activeStack.sampleCode.code, activeStack.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied === activeStack.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-lg bg-black border border-neutral-800 p-4 font-mono text-xs text-neutral-300 overflow-x-auto max-h-80 scrollbar-thin">
                <pre>{activeStack.sampleCode.code}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
