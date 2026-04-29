import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

const MARS_RADIUS_KM = 3389.0;
const AU_IN_KM = 149597870.7;
const SCALE_FACTOR = AU_IN_KM / MARS_RADIUS_KM;

function Mars() {
  const colorMap = useLoader(THREE.TextureLoader, '/mars_texture.jpg')

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  )
}

function Satellites() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/trajectories.json')
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((json) => {
        console.log("Data successfully loaded:", json);
        setData(json);
      })
      .catch((error) => console.error('Error loading trajectory data:', error));
  }, []);

  return (
    <>
      {Object.entries(data).map(([name, coords]) => {
        // Convert from AU to Three.js units
        const x = coords.x * SCALE_FACTOR;
        const y = coords.y * SCALE_FACTOR;
        const z = coords.z * SCALE_FACTOR;

        console.log(`${name} positioned at: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`);

        return (
          <mesh key={name} position={[x, y, z]}>
            {/* Increased radius from 0.02 to 0.08 for better visibility */}
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00ff00" />
            <Html distanceFactor={6}>
              <div style={{ 
                color: '#00ff00', 
                fontSize: '14px', 
                fontFamily: 'sans-serif', 
                transform: 'translate3d(15px, -15px, 0)',
                pointerEvents: 'none',
                fontWeight: 'bold',
                textShadow: '0px 0px 4px #000000'
              }}>
                {name}
              </div>
            </Html>
          </mesh>
        );
      })}
    </>
  );
}

export default function App() {
  const controlsRef = useRef()

  const handleRecenter = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000000', position: 'relative' }}>
      
      <button 
        onClick={handleRecenter}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          padding: '8px 16px',
          backgroundColor: '#222222',
          color: '#ffffff',
          border: '1px solid #444444',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'sans-serif',
          fontSize: '14px'
        }}
      >
        Recenter View
      </button>

      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={2} />

        <OrbitControls 
          ref={controlsRef} 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true} 
        />

        <Suspense fallback={null}>
          <Mars />
          <Satellites />
        </Suspense>
        
      </Canvas>
    </div>
  )
}