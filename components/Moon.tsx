
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const MOON_TEXTURE = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg';

interface MoonProps {
  orbitSpeed: number;
  distance: number;
}

export const Moon: React.FC<MoonProps> = ({ orbitSpeed, distance }) => {
  const pivotRef = useRef<THREE.Group>(null!);
  const moonRef = useRef<THREE.Mesh>(null!);
  const [moonMap] = useLoader(THREE.TextureLoader, [MOON_TEXTURE]);

  useFrame((state, delta) => {
    pivotRef.current.rotation.y += delta * 0.15 * orbitSpeed;
    moonRef.current.rotation.y += delta * 0.05 * orbitSpeed;
  });

  return (
    <group ref={pivotRef}>
      <mesh ref={moonRef} position={[distance, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.54, 32, 32]} />
        <meshStandardMaterial 
          map={moonMap} 
          bumpMap={moonMap}
          bumpScale={0.1}
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Orbit Visualization - Subtle but visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.015, distance + 0.015, 128]} />
        <meshBasicMaterial color="#44aaff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
