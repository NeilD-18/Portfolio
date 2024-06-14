import { Suspense, useEffect, useState } from 'react'; 
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader'; 


const Earth = ({isMobile}) => {
  const earth = useGLTF('planet/scene.gltf');
  
  return (
    <primitive object={earth.scene} scale={isMobile ? 1.75: 2.5} position-y={isMobile? -0.7 : -0.4} rotation-y={2} />
  );
}

const EarthCanvas = () => { 
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() =>{
    const mediaQuery = window.matchMedia(
    '(max-width: 500px)')

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange); 

    return  () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }
  }, [])
  
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
        <Earth isMobile={isMobile} /> 
        
      </Suspense>
    </Canvas>
  );
}

export default EarthCanvas;
