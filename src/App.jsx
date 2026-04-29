import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'

const SCALE_FACTOR = 149597870.7 / 3389.0;

function Mars() {
  const colorMap = useLoader(THREE.TextureLoader, '/mars_texture.jpg')
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  )
}

function OrbitPath({ trajectory, isHovered, onHover, visible }) {
  const { metadata, points } = trajectory;
  if (!visible) return null;

  // Constants for real-time synchronization
  const SECONDS_IN_DAY = 86400; 

  const curve = useMemo(() => {
    const vPoints = points.map(p => new THREE.Vector3(
      p[0] * SCALE_FACTOR, 
      p[1] * SCALE_FACTOR, 
      p[2] * SCALE_FACTOR
    ));
    // Closed loop ensures the final point connects smoothly to the start
    return new THREE.CatmullRomCurve3(vPoints, true);
  }, [points]);

  const satelliteRef = useRef();

  useFrame((state) => {
    // Real-time calculation: 1 second of real time = 1 second of orbital time
    // If you wish to see movement more clearly, you can multiply 
    // state.clock.getElapsedTime() by a factor (e.g., * 10 for 10x speed).
    const t = (state.clock.getElapsedTime() / SECONDS_IN_DAY) % 1;
    
    const position = curve.getPointAt(t);
    if (satelliteRef.current) {
      satelliteRef.current.position.copy(position);
    }
  });

  // Increased segment count (500) for high-fidelity orbital curves
  const pathPoints = useMemo(() => curve.getPoints(500), [curve]);

  return (
    <group 
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(metadata.name);
      }} 
      onPointerOut={() => onHover(null)}
    >
      <Line 
        points={pathPoints} 
        color={isHovered ? "#00ff00" : "#ffffff"} 
        lineWidth={isHovered ? 1.0 : 0.2}
        transparent
        opacity={isHovered ? 0.8 : 0.15}
      />
      <mesh ref={satelliteRef}>
        {/* Reduced size and increased smoothness for satellite indicators */}
        <sphereGeometry args={[0.015, 32, 32]} />
        <meshBasicMaterial color={isHovered ? "#00ff00" : "#ffffff"} />
      </mesh>
    </group>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState('All');
  const controlsRef = useRef();

  useEffect(() => {
    fetch('/trajectories.json').then(res => res.json()).then(setData);
  }, []);

  const filteredData = data.filter(d => filter === 'All' || d.metadata.country === filter || d.metadata.type === filter);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex' }}>
      
      {/* Sidebar UI */}
      <div style={{ width: '300px', background: '#111', color: '#eee', padding: '20px', fontFamily: 'monospace', borderRight: '1px solid #333', zIndex: 100, overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>MARS TRACKER</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '10px', color: '#666' }}>FILTER BY ORIGIN</label>
          <select onChange={(e) => setFilter(e.target.value)} style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', marginTop: '5px', padding: '5px' }}>
            <option value="All">All Entities</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UAE">UAE</option>
            <option value="China">China</option>
            <option value="ESA">ESA</option>
            <option value="Natural">Natural Moons</option>
          </select>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredData.map(d => (
            <li 
              key={d.metadata.name}
              onMouseEnter={() => setHovered(d.metadata.name)}
              onMouseLeave={() => setHovered(null)}
              style={{ 
                padding: '8px', 
                fontSize: '12px', 
                cursor: 'pointer',
                background: hovered === d.metadata.name ? '#222' : 'transparent',
                color: hovered === d.metadata.name ? '#00ff00' : '#ccc',
                borderLeft: hovered === d.metadata.name ? '2px solid #00ff00' : 'none'
              }}
            >
              {d.metadata.name.toUpperCase()}
              <div style={{ fontSize: '9px', color: '#555' }}>{d.metadata.country} | {d.metadata.type}</div>
            </li>
          ))}
        </ul>
        
        <button onClick={() => controlsRef.current.reset()} style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>RECENTER</button>
      </div>

      {/* 3D Canvas */}
      <div style={{ flexGrow: 1 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Suspense fallback={null}>
            <Mars />
            {data.map((trajectory) => (
              <OrbitPath 
                key={trajectory.metadata.name} 
                trajectory={trajectory} 
                isHovered={hovered === trajectory.metadata.name}
                onHover={setHovered}
                visible={filter === 'All' || trajectory.metadata.country === filter || trajectory.metadata.type === filter}
              />
            ))}
          </Suspense>
          <OrbitControls ref={controlsRef} enablePan={false} />
        </Canvas>
      </div>
    </div>
  )
}