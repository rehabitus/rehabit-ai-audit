"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const NetworkNodesBackground = dynamic(
  () => import("./NetworkNodesBackground").then((m) => m.NetworkNodesBackground),
  { ssr: false }
);

const ParticleFieldBackground = dynamic(
  () => import("./ParticleFieldBackground").then((m) => m.ParticleFieldBackground),
  { ssr: false }
);

const AuroraOrbsBackground = dynamic(
  () => import("./AuroraOrbsBackground").then((m) => m.AuroraOrbsBackground),
  { ssr: false }
);

type SceneType = "network" | "particles" | "aurora";

interface WebGLBackgroundProps {
  scene: SceneType;
  /** Optional CSS gradient fallback for mobile / no-WebGL */
  fallback?: React.ReactNode;
}

const scenes: Record<SceneType, React.ComponentType> = {
  network: NetworkNodesBackground,
  particles: ParticleFieldBackground,
  aurora: AuroraOrbsBackground,
};

const fallbackClasses: Record<SceneType, string> = {
  network: "webgl-fallback-network",
  particles: "webgl-fallback-particles",
  aurora: "webgl-fallback-aurora",
};

export function WebGLBackground({ scene, fallback }: WebGLBackgroundProps) {
  const isMobile = useIsMobile();
  const isWebGL = useWebGLSupported();

  const cssFallback = fallback ? (
    <>{fallback}</>
  ) : (
    <div className={fallbackClasses[scene]} aria-hidden="true" />
  );

  if (isMobile || !isWebGL) {
    return cssFallback;
  }

  const Scene = scenes[scene];

  return (
    <ErrorBoundary fallback={cssFallback}>
      <div
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <Scene />
      </div>
    </ErrorBoundary>
  );
}
