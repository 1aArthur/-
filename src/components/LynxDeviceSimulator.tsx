import React, { useState } from 'react';
import { NodeTelemetry, LynxThreadEvent } from '../types/platform';
import { ReactLynxApp } from './ReactLynxApp';
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  Zap,
  Activity,
  Download,
  Wifi,
  Radio,
  Sliders,
  Maximize2
} from 'lucide-react';

interface LynxDeviceSimulatorProps {
  nodes: NodeTelemetry[];
  uptimeSeconds: number;
  totalRps: number;
  onRestartNode: (id: string) => void;
  onTriggerSurge: () => void;
  isSurgeActive: boolean;
  onToggleChaos: () => void;
  isChaosActive: boolean;
  onResetCluster: () => void;
  lynxEvents: LynxThreadEvent[];
}

export const LynxDeviceSimulator: React.FC<LynxDeviceSimulatorProps> = ({
  nodes,
  uptimeSeconds,
  totalRps,
  onRestartNode,
  onTriggerSurge,
  isSurgeActive,
  onToggleChaos,
  isChaosActive,
  onResetCluster,
  lynxEvents
}) => {
  const [deviceType, setDeviceType] = useState<'iphone' | 'pixel' | 'tablet'>('iphone');
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState<number>(1.0);
  const [fps, setFps] = useState<number>(119.8);

  const exportTelemetry = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      totalRps,
      activeNodes: nodes.length,
      nodes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lynx-platform-telemetry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dimensions based on device
  let widthPx = 390;
  let heightPx = 800;

  if (deviceType === 'pixel') {
    widthPx = 412;
    heightPx = 820;
  } else if (deviceType === 'tablet') {
    widthPx = 640;
    heightPx = 840;
  }

  if (isLandscape && deviceType !== 'tablet') {
    const temp = widthPx;
    widthPx = heightPx;
    heightPx = temp;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 p-6 overflow-y-auto">
      {/* Left: Device Canvas & Frame */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-[750px]">
        {/* Device Controls Bar */}
        <div className="flex items-center justify-between w-full max-w-xl mb-4 px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs">
          {/* Device Model Selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                deviceType === 'iphone'
                  ? 'bg-neutral-800 text-cyan-300 font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 16 Pro</span>
            </button>
            <button
              onClick={() => setDeviceType('pixel')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                deviceType === 'pixel'
                  ? 'bg-neutral-800 text-cyan-300 font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pixel 9 Pro</span>
            </button>
            <button
              onClick={() => setDeviceType('tablet')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                deviceType === 'tablet'
                  ? 'bg-neutral-800 text-cyan-300 font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Lynx Tablet</span>
            </button>
          </div>

          {/* Orientation & Scale */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Rotate Device Orientation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
              <button
                onClick={() => setScale(0.85)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${scale === 0.85 ? 'bg-neutral-800 text-white' : 'hover:text-white'}`}
              >
                85%
              </button>
              <button
                onClick={() => setScale(1.0)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${scale === 1.0 ? 'bg-neutral-800 text-white' : 'hover:text-white'}`}
              >
                100%
              </button>
            </div>
          </div>
        </div>

        {/* Physical Device Frame with Bezel */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease, width 0.3s ease, height 0.3s ease'
          }}
          className="relative transition-all"
        >
          {/* Outer Bezel */}
          <div
            style={{ width: `${widthPx}px`, height: `${heightPx}px` }}
            className="relative rounded-[48px] p-3.5 bg-neutral-950 border-[6px] border-neutral-800 shadow-2xl shadow-cyan-950/20 ring-1 ring-neutral-700/60 flex flex-col overflow-hidden"
          >
            {/* Device Hardware Top: Speaker & Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
              <div className="w-24 h-5 rounded-full bg-black border border-neutral-800 flex items-center justify-between px-2">
                <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
                <div className="w-2 h-2 rounded-full bg-cyan-950 border border-cyan-800 animate-pulse" />
              </div>
            </div>

            {/* Device Native Screen */}
            <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-[#030712] border border-neutral-900">
              <ReactLynxApp
                nodes={nodes}
                uptimeSeconds={uptimeSeconds}
                totalRps={totalRps}
                onRestartNode={onRestartNode}
                onTriggerSurge={onTriggerSurge}
                isSurgeActive={isSurgeActive}
                lynxEvents={lynxEvents}
              />
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 w-32 h-1 rounded-full bg-neutral-600" />
          </div>
        </div>
      </div>

      {/* Right: Lynx 4 Runtime Engine & Architecture Telemetry */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        {/* Engine Specs Card */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Lynx 4 Native Engine
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              Active · 120 FPS
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Unlike React Native or Flutter, <strong>Lynx 4</strong> separates DOM-like tree generation from painting using an ultra-low latency C++ rendering engine with native platform views.
          </p>

          {/* Engine Realtime Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 uppercase">UI Native Thread</span>
              <div className="text-emerald-400 font-bold text-sm mt-0.5 tabular-nums">
                119.8 FPS
              </div>
              <span className="text-[10px] text-neutral-400">Frame: 8.3ms</span>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 uppercase">JS Script Thread</span>
              <div className="text-cyan-400 font-bold text-sm mt-0.5 tabular-nums">
                QuickJS/V8
              </div>
              <span className="text-[10px] text-neutral-400">IPC: Direct C++</span>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 uppercase">Rspeedy Bundler</span>
              <div className="text-white font-bold text-sm mt-0.5">
                HMR Sync
              </div>
              <span className="text-[10px] text-neutral-400">Bundle: 184 KB</span>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 uppercase">Startup Latency</span>
              <div className="text-white font-bold text-sm mt-0.5 tabular-nums">
                14 ms
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Instant AOT</span>
            </div>
          </div>
        </div>

        {/* Cluster Quick Actions */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Cluster Test Workbench
          </h3>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={onTriggerSurge}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                isSurgeActive
                  ? 'bg-amber-950/40 text-amber-200 border-amber-500/60 shadow-sm'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
              }`}
            >
              <span>{isSurgeActive ? 'Stop Traffic Surge' : 'Inject Load Surge (+25k req/s)'}</span>
              <Zap className={`w-3.5 h-3.5 ${isSurgeActive ? 'text-amber-400 animate-bounce' : 'text-neutral-500'}`} />
            </button>

            <button
              onClick={onToggleChaos}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                isChaosActive
                  ? 'bg-red-950/40 text-red-200 border-red-500/60 shadow-sm'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
              }`}
            >
              <span>{isChaosActive ? 'Disable Chaos Monkey' : 'Trigger Node Degradation'}</span>
              <Activity className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            <button
              onClick={exportTelemetry}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Export Telemetry Snapshot (JSON)</span>
              <Download className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Recent IPC Telemetry Log */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              IPC Dispatch Stream
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">Live</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] max-h-48 overflow-y-auto scrollbar-thin">
            {lynxEvents.slice(0, 6).map((ev) => (
              <div
                key={ev.id}
                className="p-1.5 rounded bg-neutral-950 border border-neutral-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      ev.thread === 'ui_native' ? 'bg-cyan-400' : 'bg-violet-400'
                    }`}
                  />
                  <span className="text-neutral-300 truncate">{ev.details}</span>
                </div>
                <span className="text-[10px] text-neutral-400 tabular-nums shrink-0 ml-1">
                  {ev.durationMs}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
