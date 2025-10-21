import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Product3DProps {
  color?: string;
  scale?: number;
}

const Product3DModel: React.FC<Product3DProps> = ({ color = '#3b82f6', scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.scale.setScalar(scale + (hovered ? 0.1 : 0));
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

interface Product3DViewerProps {
  productColor?: string;
  className?: string;
}

const Product3DViewer: React.FC<Product3DViewerProps> = ({ 
  productColor = '#3b82f6', 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      <Canvas
        shadows
        onCreated={() => setIsLoading(false)}
        className="rounded-lg"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#d946ef" />

        {/* 3D Model */}
        <Product3DModel color={productColor} />

        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={10}
          minDistance={3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Controls UI */}
      <div className="absolute bottom-4 left-4 right-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        >
          <p className="text-sm text-gray-600 text-center">
            Drag to rotate • Scroll to zoom
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Product3DViewer;
