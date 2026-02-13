"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ORB_COUNT = 4;

const orbColors = [
  new THREE.Color("#10B981"), // green
  new THREE.Color("#3B82F6"), // blue
  new THREE.Color("#10B981"), // green (second)
  new THREE.Color("#F97316"), // orange
];

const orbSizes = [2.5, 2.0, 1.8, 1.5];

// Custom shader for soft radial gradient spheres
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Orb({
  color,
  size,
  speedX,
  speedY,
  offsetX,
  offsetY,
  rangeX,
  rangeY,
}: {
  color: THREE.Color;
  size: number;
  speedX: number;
  speedY: number;
  offsetX: number;
  offsetY: number;
  rangeX: number;
  rangeY: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: color },
          uOpacity: { value: 0.07 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.x = Math.sin(t * speedX + offsetX) * rangeX;
    meshRef.current.position.y = Math.cos(t * speedY + offsetY) * rangeY;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}

function AuroraScene() {
  const { invalidate } = useThree();
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() * 1000;
    if (elapsed - lastFrame.current < 50) return; // ~20fps cap
    lastFrame.current = elapsed;
    invalidate();
  });

  const orbs = useMemo(
    () =>
      Array.from({ length: ORB_COUNT }, (_, i) => ({
        color: orbColors[i],
        size: orbSizes[i],
        speedX: 0.08 + i * 0.03,
        speedY: 0.06 + i * 0.025,
        offsetX: (i * Math.PI) / 2,
        offsetY: (i * Math.PI) / 3,
        rangeX: 2.5 + i * 0.5,
        rangeY: 1.5 + i * 0.3,
      })),
    []
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
    </>
  );
}

export function AuroraOrbsBackground() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <AuroraScene />
    </Canvas>
  );
}
