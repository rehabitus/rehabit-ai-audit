"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 18;
const CONNECTION_DISTANCE = 2.8;
const DRIFT_SPEED = 0.15;

function NetworkScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { invalidate } = useThree();
  const lastFrame = useRef(0);

  // Generate initial positions
  const { positions } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const vel = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      vel[i * 3] = (Math.random() - 0.5) * DRIFT_SPEED;
      vel[i * 3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED;
      vel[i * 3 + 2] = 0;
    }
    return { positions: pos, velocities: vel };
  }, []);

  // Line geometry buffer (max possible connections)
  const linePositions = useMemo(
    () => new Float32Array(NODE_COUNT * NODE_COUNT * 6),
    []
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() * 1000;
    if (elapsed - lastFrame.current < 33) return; // ~30fps cap
    lastFrame.current = elapsed;

    const t = clock.getElapsedTime();

    // Update node positions with gentle drift
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      positions[ix] += Math.sin(t * 0.3 + i * 1.7) * 0.003;
      positions[ix + 1] += Math.cos(t * 0.25 + i * 2.3) * 0.003;

      // Soft boundary wrap
      if (positions[ix] > 5) positions[ix] = -5;
      if (positions[ix] < -5) positions[ix] = 5;
      if (positions[ix + 1] > 4) positions[ix + 1] = -4;
      if (positions[ix + 1] < -4) positions[ix + 1] = 4;
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.array = positions;
      attr.needsUpdate = true;
    }

    // Build connection lines
    let lineIdx = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          linePositions[lineIdx++] = positions[i * 3];
          linePositions[lineIdx++] = positions[i * 3 + 1];
          linePositions[lineIdx++] = positions[i * 3 + 2];
          linePositions[lineIdx++] = positions[j * 3];
          linePositions[lineIdx++] = positions[j * 3 + 1];
          linePositions[lineIdx++] = positions[j * 3 + 2];
        }
      }
    }

    if (linesRef.current) {
      const lineAttr = linesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      lineAttr.array = linePositions;
      lineAttr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, lineIdx / 3);
    }

    invalidate();
  });

  return (
    <>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={NODE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#10B981"
          size={3}
          sizeAttenuation={false}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export function NetworkNodesBackground() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <NetworkScene />
    </Canvas>
  );
}
