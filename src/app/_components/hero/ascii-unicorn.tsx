'use client';

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AsciiRenderer, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  scale: number;
  position: [number, number, number];
}

function UnicornModel({ scale, position }: ModelProps) {
  const { scene } = useGLTF("/models/unicorn.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow auto-rotation
      groupRef.current.rotation.y += 0.005;
      // Subtle breathing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={scale} rotation={[0, 0, 0]} />
    </group>
  );
}

export default function AsciiUnicorn() {
  return (
    <Canvas
      camera={{
        position: [0, 1, 5],
        fov: 50,
      }}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <UnicornModel scale={10} position={[0, -1.6, 0]} />
        <Environment preset="studio" />
      </Suspense>

      <AsciiRenderer
        resolution={0.15}
        characters=" .:-=+*#%@"
        fgColor="black"
        bgColor="transparent"
        invert={false}
      />
    </Canvas>
  );
}

// Preload the model
useGLTF.preload("/models/unicorn.glb");
