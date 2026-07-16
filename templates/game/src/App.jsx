import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function App() {
  return (
    <div className="h-screen bg-slate-950 text-white">
      <div className="absolute top-4 left-4 text-sm font-semibold">
        VengaiCode Game Template — WebGL scene powered by React Three Fiber
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Sphere args={[1.25, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial color="#38bdf8" attach="material" distort={0.3} speed={2} />
        </Sphere>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
