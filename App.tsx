
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Earth } from './components/Earth';
import { Moon } from './components/Moon';
import { Starfield } from './components/Starfield';
import { MeteorField } from './components/MeteorField';

const App: React.FC = () => {
  // Constant speeds for a clean, non-UI controlled look
  const rotationSpeed = 1;
  const orbitSpeed = 1;

  return (
    <div className="w-full h-full bg-black overflow-hidden">
      {/* 3D Scene */}
      <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            minDistance={4} 
            maxDistance={35} 
            autoRotate={false}
          />
          
          {/* Lighting for High Contrast */}
          <ambientLight intensity={0.08} />
          
          {/* Main "Sun" Light */}
          <directionalLight 
            position={[30, 15, 30]} 
            intensity={4} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            shadow-bias={-0.0001}
          />

          {/* Deep Space Fill Light */}
          <pointLight position={[-20, -10, -20]} intensity={0.5} color="#001133" />
          
          <Earth rotationSpeed={rotationSpeed} />
          <Moon orbitSpeed={orbitSpeed} distance={9} />
          <Starfield />
          <MeteorField />
          
          <fog attach="fog" args={['#000', 30, 200]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
