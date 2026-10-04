import { PlatformStack, StackCombination } from '../types/platform';

export const PLATFORM_CATEGORIES = [
  'Web & TypeScript',
  'Rust Ecosystem',
  'Elixir & BEAM',
  'Java & GraalVM',
  'Python & AI',
  'Go Infrastructure',
  'Cross-Platform UI',
  'Graphics & GPU',
  'WebAssembly & Interop'
] as const;

export const STACKS_CATALOG: PlatformStack[] = [
  {
    id: 'lynx4-reactlynx',
    category: 'Cross-Platform UI',
    title: 'Lynx 4 + ReactLynx',
    runtime: 'Dual-Thread C++ Engine + QuickJS/V8',
    primaryUse: [
      'Native Android & iOS applications',
      'Desktop native applications',
      '120 FPS high-frame rate interfaces',
      'Zero-WebView mobile experiences'
    ],
    strengths: [
      'Dual-thread architecture isolates UI rendering from JS logic',
      'Native rendering engine (no DOM / no WebView overhead)',
      'Familiar React JSX syntax with native primitives (<view>, <text>, <scroll-view>)',
      'Fast startup time and ultra-low memory footprint compared to Electron/WebView'
    ],
    benchmarks: {
      startupMs: 14,
      idleMemoryMb: 28,
      rpsThroughput: 120, // FPS
      p99LatencyMs: 8.3 // Frame budget 8.3ms at 120 FPS
    },
    sampleCode: {
      filename: 'App.tsx',
      language: 'typescript',
      code: `import { useState, useEffect } from '@lynx-js/react';
import type { TelemetryResponse } from '@platform/shared';
import './App.css';

export function App() {
  const [data, setData] = useState<TelemetryResponse | null>(null);

  useEffect(() => {
    // In background script thread
    fetch('http://10.0.2.2:3001/api/telemetry')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <view className="container">
      <view className="header">
        <text className="title">Lynx 4 Native UI</text>
        <text className="badge">120 FPS Native Canvas</text>
      </view>
      <scroll-view scroll-y className="scroll-area">
        {data?.nodes.map(node => (
          <view key={node.id} className="node-card">
            <text className="name">{node.name}</text>
            <text className="metric">{node.cpuUsage}% CPU</text>
          </view>
        ))}
      </scroll-view>
    </view>
  );
}`
    }
  },
  {
    id: 'bun-elysia',
    category: 'Web & TypeScript',
    title: 'Bun + Elysia',
    runtime: 'Bun (JavaScriptCore JSC)',
    primaryUse: [
      'Hyper-fast REST & WebSocket APIs',
      'Microservices with strict TypeScript static typing',
      'Edge API gateways',
      'High-throughput I/O pipelines'
    ],
    strengths: [
      'Near-instant startup (<15ms)',
      'Sub-millisecond P99 response times',
      'TypeBox / Zod schema validation compile-time optimization',
      'Native Bun HTTP engine based on uWebSockets.js'
    ],
    benchmarks: {
      startupMs: 12,
      idleMemoryMb: 36,
      rpsThroughput: 142000,
      p99LatencyMs: 1.2
    },
    sampleCode: {
      filename: 'server.ts',
      language: 'typescript',
      code: `import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

export const app = new Elysia()
  .use(cors())
  .get('/api/telemetry', () => ({
    uptime: process.uptime(),
    status: 'healthy',
    timestamp: new Date().toISOString()
  }))
  .post('/api/nodes/:id/restart', ({ params: { id } }) => ({
    success: true,
    restarted: id
  }), {
    params: t.Object({ id: t.String() })
  })
  .listen(3001);

console.log('⚡ Elysia server running on port 3001');`
    }
  },
  {
    id: 'rust-tokio-axum',
    category: 'Rust Ecosystem',
    title: 'Tokio + Axum',
    runtime: 'Native Binary (Zero Runtime / Work-Stealing Pool)',
    primaryUse: [
      'Core event & telemetry ingestion',
      'High-concurrency streaming pipelines',
      'Zero-allocation networking servers',
      'Financial & low-latency gateways'
    ],
    strengths: [
      'Memory safety without garbage collection',
      'Work-stealing async scheduler via Tokio',
      'Type-safe routing and extractors via Axum & Tower',
      'Minimal CPU & memory profile under extreme load'
    ],
    benchmarks: {
      startupMs: 4,
      idleMemoryMb: 14,
      rpsThroughput: 198000,
      p99LatencyMs: 0.6
    },
    sampleCode: {
      filename: 'main.rs',
      language: 'rust',
      code: `use axum::{routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Serialize)]
struct TelemetryPayload {
    node_id: &'static str,
    throughput_rps: u64,
    status: &'static str,
}

async fn get_telemetry() -> Json<TelemetryPayload> {
    Json(TelemetryPayload {
        node_id: "tokio-axum-01",
        throughput_rps: 198_000,
        status: "nominal",
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/telemetry", get(get_telemetry));
    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("🦀 Tokio/Axum listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}`
    }
  },
  {
    id: 'elixir-beam-phoenix',
    category: 'Elixir & BEAM',
    title: 'BEAM / OTP + Phoenix Framework 1.8',
    runtime: 'Erlang VM (BEAM Actor Runtime)',
    primaryUse: [
      'Massive concurrent WebSocket connections',
      'Fault-tolerant distributed clustering',
      'Realtime collaborative applications & live presence',
      'Self-healing system supervision trees'
    ],
    strengths: [
      'Preemptive concurrency scheduler (no single process blocks the node)',
      'Isolated process heaps with per-process garbage collection',
      'Supervision trees provide automatic fault recovery ("let it crash")',
      'Built-in Phoenix PubSub across multiple clustered nodes without Redis'
    ],
    benchmarks: {
      startupMs: 240,
      idleMemoryMb: 68,
      rpsThroughput: 85000,
      p99LatencyMs: 2.1
    },
    sampleCode: {
      filename: 'telemetry_channel.ex',
      language: 'elixir',
      code: `defmodule MissionControlWeb.TelemetryChannel do
  use MissionControlWeb, :channel

  def join("telemetry:cluster", _params, socket) do
    # Periodic broadcast every 1000ms
    :timer.send_interval(1000, :broadcast_metrics)
    {:ok, socket}
  end

  def handle_info(:broadcast_metrics, socket) do
    metrics = %{
      node: Node.self(),
      processes: :erlang.system_info(:process_count),
      memory_mb: div(:erlang.memory(:total), 1_048_576)
    }
    broadcast!(socket, "metrics:tick", metrics)
    {:noreply, socket}
  end
end`
    }
  },
  {
    id: 'graalvm-micronaut',
    category: 'Java & GraalVM',
    title: 'Micronaut 5 + GraalVM Native Image',
    runtime: 'SubstrateVM AOT Native Binary',
    primaryUse: [
      'Enterprise cloud-native microservices',
      'Serverless function runtimes with instant start',
      'Kubernetes zero-scale pods',
      'High-throughput business transactions'
    ],
    strengths: [
      'Compiles JVM bytecode to standalone native machine code',
      'Startup drops from 3.5s to <25ms',
      'Compile-time dependency injection (zero runtime reflection)',
      'Drastically reduced container memory footprint'
    ],
    benchmarks: {
      startupMs: 22,
      idleMemoryMb: 38,
      rpsThroughput: 92000,
      p99LatencyMs: 1.8
    },
    sampleCode: {
      filename: 'TelemetryController.java',
      language: 'java',
      code: `package com.platform.telemetry;

import io.micronaut.http.annotation.*;
import io.micronaut.core.annotation.Introspected;

@Controller("/api/graalvm")
public class TelemetryController {

    @Get("/health")
    public HealthPayload health() {
        return new HealthPayload("graal-native-01", 38, "healthy");
    }

    @Introspected
    public record HealthPayload(String nodeId, long memoryMb, String status) {}
}`
    }
  },
  {
    id: 'python-fastapi-pyo3',
    category: 'Python & AI',
    title: 'FastAPI + Pydantic + PyO3/Rust',
    runtime: 'CPython 3.12 + Native Rust Extensions',
    primaryUse: [
      'AI & Machine Learning inference endpoints',
      'Mathematical modeling with Rust SIMD acceleration',
      'Microservices requiring Pydantic schema validation',
      'Data engineering orchestrations'
    ],
    strengths: [
      'High developer velocity with type-annotated Python',
      'Compute-heavy bottlenecks compiled in Rust via PyO3',
      'Automatic OpenAPI / Swagger documentation',
      'Asynchronous ASGI request loop with Uvicorn'
    ],
    benchmarks: {
      startupMs: 180,
      idleMemoryMb: 52,
      rpsThroughput: 42000,
      p99LatencyMs: 3.4
    },
    sampleCode: {
      filename: 'main.py',
      language: 'python',
      code: `from fastapi import FastAPI
from pydantic import BaseModel
# import rust_accelerator # PyO3 compiled extension

app = FastAPI(title="AI Telemetry Service")

class TelemetryRecord(BaseModel):
    model_name: str
    tokens_per_sec: float
    gpu_utilization: float

@app.get("/metrics", response_model=TelemetryRecord)
async def get_metrics():
    # Rust native call: rust_accelerator.compute_metrics()
    return TelemetryRecord(
        model_name="Embedding-V3",
        tokens_per_sec=1420.5,
        gpu_utilization=78.2
    )`
    }
  },
  {
    id: 'go-gin-infra',
    category: 'Go Infrastructure',
    title: 'Go + Gin / Echo',
    runtime: 'Go Runtime (Goroutines + M:N Scheduler)',
    primaryUse: [
      'Cloud orchestration & container management',
      'Network proxies and routing coordinators',
      'High-concurrency infrastructure services',
      'Low-overhead CLI and background workers'
    ],
    strengths: [
      'Lightweight goroutines (~2KB initial stack)',
      'Fast compilation to static standalone binaries',
      'Straightforward error handling and low cognitive load',
      'Predictable GC latency (<1ms pause times)'
    ],
    benchmarks: {
      startupMs: 18,
      idleMemoryMb: 24,
      rpsThroughput: 115000,
      p99LatencyMs: 1.1
    },
    sampleCode: {
      filename: 'main.go',
      language: 'go',
      code: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	r.Use(gin.Recovery())

	r.GET("/api/coordinator/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service": "go-infra-coord",
			"status":  "healthy",
			"active_goroutines": 142,
		})
	})

	r.Run(":8080")
}`
    }
  },
  {
    id: 'rust-wgpu-graphics',
    category: 'Graphics & GPU',
    title: 'wgpu + WebGPU / Vulkan',
    runtime: 'Rust Native Graphics Abstraction',
    primaryUse: [
      'Hardware-accelerated compute shaders',
      'Cross-platform 2D & 3D graphical viewports',
      'WebGPU standard targeting Metal, Vulkan, and DirectX 12',
      'Data visualization and spatial processing'
    ],
    strengths: [
      'Single API compiles down to Vulkan, Metal, DX12, or WebGPU',
      'Safe GPU memory management without pointer bugs',
      'Direct compute pipeline dispatching for SIMD operations',
      'Zero-driver-overhead execution'
    ],
    benchmarks: {
      startupMs: 8,
      idleMemoryMb: 32,
      rpsThroughput: 240, // FPS
      p99LatencyMs: 4.1
    },
    sampleCode: {
      filename: 'pipeline.rs',
      language: 'rust',
      code: `use wgpu::*;

pub async fn init_gpu_pipeline() -> (Device, Queue) {
    let instance = Instance::default();
    let adapter = instance.request_adapter(&RequestAdapterOptions {
        power_preference: PowerPreference::HighPerformance,
        compatible_surface: None,
        force_fallback_adapter: false,
    }).await.expect("Failed to locate GPU adapter");

    let (device, queue) = adapter.request_device(&DeviceDescriptor::default(), None).await.unwrap();
    (device, queue)
}`
    }
  },
  {
    id: 'wasm-wasmtime-wasi',
    category: 'WebAssembly & Interop',
    title: 'WebAssembly + WASI + Wasmtime',
    runtime: 'Wasmtime Component Model Runtime',
    primaryUse: [
      'Isolated sandbox plugin execution',
      'Cross-platform micro-functions',
      'Multi-tenant edge computing security',
      'Safe third-party extension sandboxes'
    ],
    strengths: [
      'Deterministic sandbox boundaries with zero host leakage',
      'WASI preview 2 component model enables cross-language linkage',
      'Near-native execution speed with Cranelift JIT compiler',
      'Microsecond cold start instantiation'
    ],
    benchmarks: {
      startupMs: 2,
      idleMemoryMb: 8,
      rpsThroughput: 165000,
      p99LatencyMs: 0.8
    },
    sampleCode: {
      filename: 'host.rs',
      language: 'rust',
      code: `use wasmtime::*;

fn main() -> Result<()> {
    let engine = Engine::default();
    let module = Module::from_file(&engine, "telemetry_filter.wasm")?;
    let mut store = Store::new(&engine, ());
    let instance = Instance::new(&mut store, &module, &[])?;
    let run = instance.get_typed_func::<i32, i32>(&mut store, "filter_event")?;
    let result = run.call(&mut store, 42)?;
    println!("Wasm executed with output: {}", result);
    Ok(())
}`
    }
  }
];

export const STACK_COMBINATIONS: StackCombination[] = [
  {
    id: 'combo-native-ts',
    title: 'Native UI with TypeScript (Platform 2026 Core)',
    subtitle: 'Lynx 4 (ReactLynx) + Elysia + Bun + Shared Contracts',
    tags: ['Cross-Platform', 'TypeScript', 'High-Throughput', 'Zero-WebView'],
    layers: [
      { layerName: 'Native Presentation', tech: 'Lynx 4 + ReactLynx', role: 'Dual-thread native rendering at 120 FPS on Android, iOS & Desktop' },
      { layerName: 'Shared Contracts', tech: 'TypeScript (@platform/shared)', role: 'Single source of truth for DTOs, schemas and event interfaces' },
      { layerName: 'High-Throughput API', tech: 'Elysia + Bun', role: 'Sub-millisecond REST & WebSocket gateway powered by JavaScriptCore' }
    ],
    description: 'The primary architecture highlighted in the Platform 2026 specification. Eliminates WebViews and heavy bridge serialization by pairing ReactLynx native primitives with an Elysia API engine on Bun.',
    whyItExcels: 'Provides native app smoothness with pure TypeScript ergonomics across frontend and backend. Zero duplicate model maintenance.'
  },
  {
    id: 'combo-rust-core',
    title: 'Extreme Low-Latency Ingestion Pipeline',
    subtitle: 'Tokio + Axum + Tower + Shared Protobuf',
    tags: ['Zero-Cost', 'Memory Safety', 'High-Concurrency', 'Rust'],
    layers: [
      { layerName: 'Edge Gateway', tech: 'Axum / Tower', role: 'Stateless HTTP/2 and gRPC termination' },
      { layerName: 'Async Task Engine', tech: 'Tokio Runtime', role: 'Work-stealing thread pool handling millions of concurrent events' },
      { layerName: 'Persistence Storage', tech: 'PostgreSQL + Tokio-Postgres', role: 'ACID transactional durability' }
    ],
    description: 'Designed for mission-critical workloads where memory safety and predictable execution latency are non-negotiable.',
    whyItExcels: 'Zero garbage collection pauses, constant memory profile under sudden 10x traffic spikes.'
  },
  {
    id: 'combo-elixir-realtime',
    title: 'Distributed Realtime & Fault-Tolerant Cluster',
    subtitle: 'BEAM/OTP + Phoenix LiveView + Phoenix Channels',
    tags: ['Realtime', 'Actor Model', 'Self-Healing', 'WebSockets'],
    layers: [
      { layerName: 'Client Connection', tech: 'Phoenix Channels', role: 'Persistent bidirectional WebSocket streams' },
      { layerName: 'Distribution Mesh', tech: 'Phoenix PubSub (PG2/Distributed Erlang)', role: 'Cross-cluster message broadcast with zero external broker' },
      { layerName: 'Fault Tolerance', tech: 'OTP Supervision Trees', role: 'Isolated process crash containment with instant automated restart' }
    ],
    description: 'Leverages the legendary Erlang BEAM runtime for million-connection WebSocket streaming and distributed state synchronization.',
    whyItExcels: 'A failure in one telemetry stream or user socket cannot crash adjacent connections or the host process.'
  },
  {
    id: 'combo-cloud-native-java',
    title: 'Cloud-Native Enterprise JVM',
    subtitle: 'Micronaut 5 + GraalVM Native Image + PostgreSQL',
    tags: ['Enterprise', 'AOT Compilation', 'Zero-Reflection', 'Java'],
    layers: [
      { layerName: 'API Endpoint', tech: 'Micronaut 5 Controllers', role: 'Compile-time AOT dependency injection' },
      { layerName: 'Binary Runtime', tech: 'GraalVM SubstrateVM', role: 'AOT compiled native executable without JIT overhead' },
      { layerName: 'Data Layer', tech: 'Micronaut Data JDBC', role: 'Compile-time SQL generation without runtime reflection' }
    ],
    description: 'Brings enterprise Java patterns to modern Kubernetes and serverless scale-to-zero environments.',
    whyItExcels: 'Boot in 20ms with 38MB memory usage while preserving full Java enterprise capabilities.'
  }
];
