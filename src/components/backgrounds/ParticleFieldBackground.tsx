"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 100;
const BOUNDS_Y = 5;
const BOUNDS_X = 6;

function ParticleScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const { invalidate } = useThree();
  const lastFrame = useRef(0);

  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS_X * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS_Y * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      spd[i] = 0.005 + Math.random() * 0.01; // rise speed
      off[i] = Math.random() * Math.PI * 2; // sine offset for horizontal sway
    }
    return { positions: pos, speeds: spd, offsets: off };
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() * 1000;
    if (elapsed - lastFrame.current < 42) return; // ~24fps cap
    lastFrame.current = elapsed;

    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      // Rise upward
      positions[ix + 1] += speeds[i];
      // Gentle horizontal sway
      positions[ix] += Math.sin(t * 0.5 + offsets[i]) * 0.002;

      // Respawn at bottom when past top
      if (positions[ix + 1] > BOUNDS_Y) {
        positions[ix + 1] = -BOUNDS_Y;
        positions[ix] = (Math.random() - 0.5) * BOUNDS_X * 2;
      }
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }

    invalidate();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#10B981"
        size={2}
        sizeAttenuation={false}
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleFieldBackground() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ParticleScene />
    </Canvas>
  );
}
