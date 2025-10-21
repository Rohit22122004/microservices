import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface FloatingProductProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

const FloatingProduct: React.FC<FloatingProductProps> = ({ 
  position, 
  color, 
  scale = 1 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
    }
  });

  const { scale: animatedScale } = useSpring({
    scale: scale,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={animatedScale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </animated.mesh>
  );
};

export default FloatingProduct;
