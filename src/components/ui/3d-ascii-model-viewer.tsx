import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  AsciiRenderer,
  useGLTF,
  Environment,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ModelProps {
  scale: number;
  rotation: [number, number, number];
  modelUrl: string;
  position: [number, number, number];
}

function Model({
  scale,
  rotation,
  modelUrl,
  position,
}: ModelProps) {
  const { scene } = useGLTF(modelUrl);

  return (
    <primitive
      object={scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  );
}

const models = [
  {
    name: "Logo",
    url: "https://danielcodepen.s3.us-east-1.amazonaws.com/figma.fbx.glb",
    baseScale: 0.8,
    position: [0, -0.2, 0] as [number, number, number],
  },
  {
    name: "Computer",
    url: "https://danielcodepen.s3.us-east-1.amazonaws.com/apple_macintosh.glb",
    baseScale: 0.05,
    position: [0, -0.3, 0] as [number, number, number],
  },
  {
    name: "Plant",
    url: "https://danielcodepen.s3.us-east-1.amazonaws.com/pothos_house_plant.glb",
    baseScale: 5,
    position: [0, -0.75, 0] as [number, number, number],
  },
  {
    name: "Shiba",
    url: "https://danielcodepen.s3.us-east-1.amazonaws.com/shiba.glb",
    baseScale: 1,
    position: [0, 0, 0] as [number, number, number],
  },
  {
    name: "Crystal",
    url: "https://danielcodepen.s3.us-east-1.amazonaws.com/crystal_stone_rock.glb",
    baseScale: 2,
    position: [0, 0, 0] as [number, number, number],
  },
];

export default function App() {
  const [selectedModel, setSelectedModel] = useState(
    models[0].url,
  );
  const [userScale, setUserScale] = useState(1);
  const [creditsOpen, setCreditsOpen] = useState(false);

  const [asciiSettings, setAsciiSettings] = useState({
    resolution: 0.22,
    characters: " .:-=+*#%@",
    fgColor: "#ffffff",
    bgColor: "#007BE5",
    invert: false,
  });

  const resetSettings = () => {
    setAsciiSettings({
      resolution: 0.22,
      characters: " .:-=+*#%@",
      fgColor: "#ffffff",
      bgColor: "#007BE5",
      invert: false,
    });
    setUserScale(1);
  };

  const handleModelChange = (newModelUrl: string) => {
    // Clear GLTF cache for the previous model to prevent loading issues
    if (selectedModel && selectedModel !== newModelUrl) {
      useGLTF.clear(selectedModel);
    }
    setSelectedModel(newModelUrl);
  };

  // Get the current model's base scale
  const currentModel = models.find(
    (model) => model.url === selectedModel,
  );
  const finalScale = (currentModel?.baseScale || 1) * userScale;

  return (
    <div className="w-full h-screen relative">
      {/* Custom CSS for white slider */}
      <style>{`
        .slider-white [data-orientation="horizontal"] {
          background: rgba(255, 255, 255, 0.2);
          height: 6px !important;
        }
        .slider-white [data-orientation="horizontal"] [role="slider"] {
          background: white !important;
          border: 2px solid white !important;
          border-color: white !important;
          width: 18px !important;
          height: 18px !important;
        }
        .slider-white [data-orientation="horizontal"] .bg-primary {
          background: white !important;
        }
        .slider-white [data-orientation="horizontal"] [data-orientation="horizontal"] {
          background: rgba(255, 255, 255, 0.2);
          height: 6px !important;
        }
        .slider-white .slider-thumb {
          background: white !important;
          border: 2px solid white !important;
          width: 18px !important;
          height: 18px !important;
        }
        .slider-white [data-radix-collection-item] {
          background: white !important;
          border: 2px solid white !important;
          width: 18px !important;
          height: 18px !important;
        }
      `}</style>

      {/* 3D Canvas - Full Screen */}
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 50,
        }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setSize(
            gl.domElement.clientWidth,
            gl.domElement.clientHeight,
          );
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model
            key={selectedModel} // Force re-mount when model changes
            scale={finalScale}
            rotation={[0, 0, 0]}
            modelUrl={selectedModel}
            position={currentModel?.position || [0, 0, 0]}
          />
          <Environment preset="studio" />
        </Suspense>

        {/* AsciiRenderer with explicit key to force re-render when settings change */}
        <Suspense fallback={null}>
          <AsciiRenderer
            key={`${asciiSettings.resolution}-${asciiSettings.characters}-${asciiSettings.fgColor}-${asciiSettings.bgColor}-${asciiSettings.invert}`}
            resolution={asciiSettings.resolution}
            characters={asciiSettings.characters}
            fgColor={asciiSettings.fgColor}
            bgColor={asciiSettings.bgColor}
            invert={asciiSettings.invert}
          />
        </Suspense>

        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={2}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>

      {/* Left Panel - Model Selection */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col space-y-8">
          {models.map((model) => (
            <button
              key={model.url}
              onClick={() => handleModelChange(model.url)}
              className={`text-left font-mono text-[15px] transition-opacity hover:opacity-80 ${
                selectedModel === model.url
                  ? "text-white opacity-100"
                  : "text-white/60"
              }`}
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Controls - Vertically Centered */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-4 space-y-8 min-w-[200px]">
        {/* Presets */}
        <div>
          <Label
            className="text-white text-[15px] mb-3 block font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Presets
          </Label>
          <div className="space-y-2">
            {[
              { name: ".:-=+*#%@", chars: " .:-=+*#%@" },
              { name: ".-+*#", chars: " .-+*#" },
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                className="w-full justify-start text-[15px] font-mono bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() =>
                  setAsciiSettings((prev) => ({
                    ...prev,
                    characters: preset.chars,
                  }))
                }
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div>
          <Label
            className="text-white text-[15px] mb-3 block font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Resolution
          </Label>
          <Slider
            value={[asciiSettings.resolution]}
            onValueChange={([value]) =>
              setAsciiSettings((prev) => ({
                ...prev,
                resolution: value,
              }))
            }
            min={0.05}
            max={0.5}
            step={0.01}
            className="w-full slider-white"
          />
          <div
            className="text-white/60 text-[15px] mt-1 font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {asciiSettings.resolution.toFixed(3)}
          </div>
        </div>

        {/* Scale Control */}
        <div>
          <Label
            className="text-white text-[15px] mb-3 block font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Scale
          </Label>
          <Slider
            value={[userScale]}
            onValueChange={([value]) => setUserScale(value)}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full slider-white"
          />
          <div
            className="text-white/60 text-[15px] mt-1 font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {userScale.toFixed(2)}
          </div>
        </div>

        {/* Invert Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="invert"
            checked={asciiSettings.invert}
            onCheckedChange={(checked) =>
              setAsciiSettings((prev) => ({
                ...prev,
                invert: checked as boolean,
              }))
            }
            className="border-white/30"
          />
          <Label
            htmlFor="invert"
            className="text-white text-[15px] font-mono"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Invert colors
          </Label>
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetSettings}
          variant="outline"
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 text-[15px] font-mono"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          Reset
        </Button>

        {/* Credits as underlined text - closer to Reset */}
        <div className="-mt-4">
          <Dialog open={creditsOpen} onOpenChange={setCreditsOpen}>
            <DialogTrigger asChild>
              <button
                className="text-white/60 hover:text-white text-[15px] font-mono underline transition-colors"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                Credits
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle 
                  className="text-[15px] font-mono text-black"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  Credits
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div 
                  className="text-[15px] font-mono text-black leading-relaxed"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  <div>Shiba model by zixisun02</div>
                  <div>Figma logo by vijay verma</div>
                  <div>Computer model by tzeshi</div>
                  <div>Crystal model by GenEugene</div>
                  <div>Pothos (House Plant) by stevencmutter</div>
                </div>
                <div 
                  className="text-[15px] font-mono text-black mt-6"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  Creative Commons License
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}