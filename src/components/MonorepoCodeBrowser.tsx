import React, { useState } from 'react';
import { MONOREPO_FILES, CodeFile } from '../data/monorepoFiles';
import {
  FolderTree,
  FileCode,
  Copy,
  Check,
  Download,
  Package,
  Layers,
  Terminal
} from 'lucide-react';

export const MonorepoCodeBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(MONOREPO_FILES[2]); // Default to Lynx App.tsx
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto">
      {/* Title */}
      <div className="space-y-1 border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Mission Control Monorepo Architecture
        </h1>
        <p className="text-xs text-neutral-400 max-w-3xl leading-relaxed">
          Explore the production-ready codebase structuring Bun, Elysia, and Lynx 4 into unified workspaces with shared TypeScript contracts.
        </p>
      </div>

      {/* Main Split Layout: Left File Explorer / Right Code View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Monorepo Workspaces & File Tree */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-xs font-semibold text-white uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Workspace Structure</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto font-mono text-xs">
            {MONOREPO_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-white truncate text-xs">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                      {file.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase">
                      {file.language}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans truncate">
                    {file.package}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {file.path}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Monorepo Execution Commands */}
          <div className="p-3 rounded-lg bg-black border border-neutral-800 text-xs font-mono space-y-1.5">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" /> Bun Workspace Commands
            </span>
            <div className="text-neutral-300 text-[11px]">$ bun install</div>
            <div className="text-neutral-400 text-[11px]">$ bun --filter backend dev</div>
            <div className="text-neutral-400 text-[11px]">$ bun --filter lynx-mobile dev</div>
          </div>
        </div>

        {/* Right: Code Viewer & Header */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-3">
          {/* File Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {selectedFile.path}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-neutral-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors cursor-pointer border border-neutral-700"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formatted Code Block with Line Numbers */}
          <div className="flex-1 rounded-lg bg-black border border-neutral-800 p-4 font-mono text-xs overflow-auto max-h-[560px] scrollbar-thin">
            <div className="table w-full">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-neutral-900/60">
                  <span className="table-cell pr-4 text-right select-none text-neutral-600 text-[11px] w-8">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre text-neutral-300">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
