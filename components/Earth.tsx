
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const EARTH_TEXTURE = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_NORMAL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg';
const EARTH_SPECULAR = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg';
const EARTH_CLOUDS = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png';

export const Earth: React.FC<{ rotationSpeed: number }> = ({ rotationSpeed }) => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_SPECULAR,
    EARTH_CLOUDS
  ]);

  useFrame((state, delta) => {
    const speed = delta * 0.1 * rotationSpeed;
    earthRef.current.rotation.y += speed;
    cloudsRef.current.rotation.y += speed * 1.2;
  });

  return (
    <group>
      {/* Primary Earth Body */}
      <mesh ref={earthRef} receiveShadow castShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(1.2, 1.2)}
          specularMap={specularMap}
          specular={new THREE.Color('#4444ff')} // Bluish specular for oceans
          shininess={25}
          emissive={new THREE.Color('#000011')} // Subtle deep blue for dark areas
        />
      </mesh>
      
      {/* Cloud Layer - Slightly more opaque for visibility */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.03, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Glow - Fresnel-like effect using multiple layers */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.06, 64, 64]} />
        <meshBasicMaterial
          color="#3388ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner Glow to separate from background */}
      <mesh>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshBasicMaterial
          color="#1144aa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
