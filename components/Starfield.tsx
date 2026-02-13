
import React, { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const Starfield = () => {
  const [positions, colors] = useMemo(() => {
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    const colorPalette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#ffe9c4'), // Yellowish
      new THREE.Color('#d4e1ff'), // Bluish
      new THREE.Color('#ffcfcf'), // Reddish
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 80 + Math.random() * 120;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  return (
    <Points positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
};
