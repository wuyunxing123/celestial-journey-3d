
import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Earth } from './components/Earth';
import { Moon } from './components/Moon';
import { Starfield } from './components/Starfield';
import { getCosmicFact } from './services/geminiService';
import { SimulationState } from './types';

const App: React.FC = () => {
  const [simState, setSimState] = useState<SimulationState>({
    rotationSpeed: 1,
    orbitSpeed: 1,
    showOrbits: true,
    isPaused: false,
  });

  const [cosmicFact, setCosmicFact] = useState<string>("Click a button to learn about our celestial neighbors.");
  const [isLoadingFact, setIsLoadingFact] = useState(false);

  const fetchFact = useCallback(async (topic: string) => {
    setIsLoadingFact(true);
    const fact = await getCosmicFact(topic);
    setCosmicFact(fact);
    setIsLoadingFact(false);
  }, []);

  const handleTogglePause = () => {
    setSimState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const actualRotationSpeed = simState.isPaused ? 0 : simState.rotationSpeed;
  const actualOrbitSpeed = simState.isPaused ? 0 : simState.orbitSpeed;

  return (
    <div className="relative w-full h-full bg-black text-white font-sans overflow-hidden">
      {/* 3D Scene */}
      <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            minDistance={4} 
            maxDistance={28} 
            autoRotate={false}
          />
          
          {/* Very faint ambient light for deep shadows */}
          <ambientLight intensity={0.1} />
          
          {/* Intense Directional "Sun" Light for high contrast */}
          <directionalLight 
            position={[20, 10, 20]} 
            intensity={3.5} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            shadow-bias={-0.0001}
          />

          {/* Fill Light for subtle detail on the dark side */}
          <pointLight position={[-15, -5, -15]} intensity={0.4} color="#112244" />
          
          <Earth rotationSpeed={actualRotationSpeed} />
          <Moon orbitSpeed={actualOrbitSpeed} distance={8} />
          <Starfield />
          
          <fog attach="fog" args={['#000', 30, 150]} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        {/* Header */}
        <div className="pointer-events-auto flex items-start justify-between">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Celestial Journey 3D
            </h1>
            <p className="text-xs text-white/60 mt-1 uppercase tracking-widest">Earth & Moon Simulation</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => fetchFact("Earth")}
              className="bg-blue-600/80 hover:bg-blue-500 pointer-events-auto px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-blue-400/30 shadow-lg"
            >
              Earth Fact
            </button>
            <button 
              onClick={() => fetchFact("The Moon")}
              className="bg-indigo-600/80 hover:bg-indigo-500 pointer-events-auto px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-indigo-400/30 shadow-lg"
            >
              Moon Fact
            </button>
          </div>
        </div>

        {/* Fact Display */}
        <div className="flex justify-center mb-4">
          <div className="bg-black/70 backdrop-blur-lg p-6 rounded-2xl border border-white/10 max-w-xl text-center pointer-events-auto shadow-2xl transition-all min-h-[100px] flex items-center justify-center">
            {isLoadingFact ? (
              <div className="flex items-center gap-3 justify-center text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                <span>Consulting Gemini...</span>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-white/90">
                {cosmicFact}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="pointer-events-auto flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/20 w-64 shadow-2xl">
            <h3 className="text-sm font-semibold mb-4 text-white/80">Simulation Controls</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Rotation Speed</span>
                  <span className="text-blue-400 font-mono">{simState.rotationSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  value={simState.rotationSpeed} 
                  onChange={(e) => setSimState(s => ({ ...s, rotationSpeed: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Orbit Speed</span>
                  <span className="text-indigo-400 font-mono">{simState.orbitSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  value={simState.orbitSpeed} 
                  onChange={(e) => setSimState(s => ({ ...s, orbitSpeed: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <button 
                onClick={handleTogglePause}
                className={`w-full py-2 rounded-lg font-bold transition-all shadow-lg ${simState.isPaused ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
              >
                {simState.isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          <div className="text-right text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2">
            Interactive WebGL Experience <br />
            Powered by React Three Fiber
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
