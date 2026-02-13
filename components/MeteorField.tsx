
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MeteorProps {
  index: number;
}

const Meteor: React.FC<MeteorProps> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Line>(null!);
  
  // Randomize initial properties
  const meteorData = useMemo(() => {
    const colorPalette = ['#ffffff', '#aaddff', '#ffddee', '#ffff99'];
    return {
      speed: 0.8 + Math.random() * 1.5, // Faster meteors
      spawnRadius: 50 + Math.random() * 30,
      reset: () => {
        // Random point on a large sphere
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 60 + Math.random() * 20;
        return new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
      },
      direction: new THREE.Vector3(),
      // More frequent spawning: lower base delay and tighter indexing
      nextSpawn: Date.now() + Math.random() * 3000 + (index * 400),
      active: false,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      trailLength: 8 + Math.random() * 12
    };
  }, [index]);

  const trailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    const now = Date.now();

    if (!meteorData.active && now > meteorData.nextSpawn) {
      meteorData.active = true;
      const startPos = meteorData.reset();
      meshRef.current.position.copy(startPos);
      
      // Aim generally towards the center but with high variance
      const target = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      meteorData.direction.subVectors(target, startPos).normalize();
    }

    if (meteorData.active && trailRef.current) {
      const move = meteorData.direction.clone().multiplyScalar(meteorData.speed);
      const prevPos = meshRef.current.position.clone();
      meshRef.current.position.add(move);

      // Update Trail positions
      const attribute = trailRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      if (attribute) {
        const positions = attribute.array as Float32Array;
        // Head of trail
        positions[0] = meshRef.current.position.x;
        positions[1] = meshRef.current.position.y;
        positions[2] = meshRef.current.position.z;
        // Tail of trail
        positions[3] = meshRef.current.position.x - meteorData.direction.x * meteorData.trailLength;
        positions[4] = meshRef.current.position.y - meteorData.direction.y * meteorData.trailLength;
        positions[5] = meshRef.current.position.z - meteorData.direction.z * meteorData.trailLength;
        attribute.needsUpdate = true;
      }

      // Check boundaries to reset (if it goes too far or past the camera view)
      if (meshRef.current.position.length() > 100 || meshRef.current.position.length() < 5) {
        meteorData.active = false;
        // Faster respawn for "many" meteors effect
        meteorData.nextSpawn = now + Math.random() * 4000;
        meshRef.current.position.set(2000, 2000, 2000); // Out of view
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[2000, 2000, 2000]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={meteorData.color} />
      </mesh>
      <line ref={trailRef} geometry={trailGeometry}>
        <lineBasicMaterial 
          attach="material" 
          color={meteorData.color} 
          transparent 
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
};

export const MeteorField: React.FC = () => {
  // Increased count to 30 for a dense meteor shower
  const meteorCount = 30;
  const meteors = useMemo(() => Array.from({ length: meteorCount }), [meteorCount]);

  return (
    <group>
      {meteors.map((_, i) => (
        <Meteor key={i} index={i} />
      ))}
    </group>
  );
};
