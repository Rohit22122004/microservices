import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import FloatingProduct from './FloatingProduct';

const HeroScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#d946ef" />

        {/* Floating Products */}
        <Suspense fallback={null}>
          <FloatingProduct position={[-3, 2, 0]} color="#3b82f6" scale={0.8} />
          <FloatingProduct position={[3, -1, -2]} color="#d946ef" scale={1.2} />
          <FloatingProduct position={[0, 1, -3]} color="#10b981" scale={0.6} />
          <FloatingProduct position={[-2, -2, 1]} color="#f59e0b" scale={0.9} />
          <FloatingProduct position={[4, 2, 1]} color="#ef4444" scale={0.7} />
        </Suspense>

        {/* Environment */}
        <Environment preset="city" />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
