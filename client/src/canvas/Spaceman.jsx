import { Suspense, useEffect, useState } from 'react'; 
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

import CanvasLoader from '../utils/Loader';


const SpaceMan = ({isMobile}) => { 
    const spaceman = useGLTF('space_man/scene.gltf')

    return (
        <primitive 
        object={spaceman.scene} 
        scale={isMobile ? 0.5: 0.75} 
        position={[0, isMobile ? -2.5 : -3, 0]} // Lower model
        rotation-y={11} />
      );
}

const SpaceManCanvas = () => { 
  
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
          <SpaceMan isMobile={isMobile} /> 
          
        </Suspense>
      </Canvas>
    );
  }
  
  export default SpaceManCanvas;