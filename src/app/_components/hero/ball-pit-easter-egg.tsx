"use client";

import { useEffect, useRef } from "react";

const SPRITE_ASPECT = 578 / 432;
const RENDER_HEIGHT = 80;
const RENDER_WIDTH = Math.round(RENDER_HEIGHT * SPRITE_ASPECT);
// Physics body is smaller than the sprite (transparent padding in the image)
const BODY_HEIGHT = 38;
const BODY_WIDTH = 48;
const SPAWN_INTERVAL_MS = 120;
const MAX_BODIES = 120;
const WALL = 8;

interface Props {
  height: number;
}

export default function BallPitEasterEgg({ height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.offsetWidth;
    const h = height || container.offsetHeight;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let spawnInterval: ReturnType<typeof setInterval>;

    async function setup() {
      const img = new Image();
      img.src = "/unicorn-pixel.png";
      await img.decode();

      const Matter = await import("matter-js");
      const { Engine, Runner, World, Bodies, Composite, Body } = Matter;

      const engine = Engine.create();
      const runner = Runner.create();

      const floor = Bodies.rectangle(w / 2, h + WALL / 2, w + 200, WALL, {
        isStatic: true,
      });
      const leftWall = Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 3, {
        isStatic: true,
      });
      const rightWall = Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 3, {
        isStatic: true,
      });

      World.add(engine.world, [floor, leftWall, rightWall]);
      Runner.run(runner, engine);

      spawnInterval = setInterval(() => {
        const dynamicBodies = Composite.allBodies(engine.world).filter(
          (b) => !b.isStatic,
        );
        if (dynamicBodies.length >= MAX_BODIES) return;
        const x = Math.random() * (w - BODY_WIDTH) + BODY_WIDTH / 2;
        const body = Bodies.rectangle(
          x,
          -BODY_HEIGHT / 2,
          BODY_WIDTH,
          BODY_HEIGHT,
          {
            restitution: 0.25,
            friction: 0.5,
            frictionAir: 0.01,
            label: "unicorn",
          },
        );
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
        World.add(engine.world, body);
      }, SPAWN_INTERVAL_MS);

      function render() {
        if (ctx == null) return;
        ctx.clearRect(0, 0, w, h);
        for (const body of Composite.allBodies(engine.world)) {
          if (body.isStatic) continue;
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.drawImage(
            img,
            -RENDER_WIDTH / 2,
            -RENDER_HEIGHT / 2,
            RENDER_WIDTH,
            RENDER_HEIGHT,
          );
          ctx.restore();
        }
        rafId = requestAnimationFrame(render);
      }

      rafId = requestAnimationFrame(render);

      return () => {
        clearInterval(spawnInterval);
        cancelAnimationFrame(rafId);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    }

    let teardown: (() => void) | undefined;
    let cancelled = false;

    setup()
      .then((fn) => {
        if (cancelled) {
          fn?.();
        } else {
          teardown = fn;
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden border-b border-gray-200 bg-gray-50"
      style={{ height: height || "auto" }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
