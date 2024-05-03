import { Suspense, useEffect, useState } from 'react'; 
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader'; 

const Earth = () => {
  const earth = useGLTF('./planet/scene.gltf');

  return (
    <primitive object={earth.scene} scale={2.0} position-y={-0.5} rotation-y={2} />
  );
}

const EarthCanvas = () => { 
  return (
    <Canvas
      shadows
      frameloop='demand'
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.5, 
        far: 200,
        position: [-4,3,8]
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate={true}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth /> 
        
      </Suspense>
    </Canvas>
  );
}

export default EarthCanvas;
