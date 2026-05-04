import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MapPinned, Plane, Sparkles } from "lucide-react";

const particles = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  size: 6 + (index % 4) * 6,
  left: `${(index * 13) % 100}%`,
  top: `${(index * 19) % 100}%`,
  delay: index * 0.2
}));

export function FloatingScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".float-orb", {
        y: -30,
        x: 18,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6
      });

      gsap.to(".travel-icon", {
        y: -18,
        rotate: 6,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.4
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="float-orb absolute left-[6%] top-16 h-48 w-48 rounded-full bg-fuchsia-500/18 blur-3xl" />
      <div className="float-orb absolute right-[8%] top-24 h-64 w-64 rounded-full bg-sky-400/18 blur-3xl" />
      <div className="float-orb absolute bottom-16 left-[20%] h-56 w-56 rounded-full bg-indigo-500/18 blur-3xl" />

      <Plane className="travel-icon absolute left-[12%] top-[18%] h-10 w-10 text-white/40" />
      <MapPinned className="travel-icon absolute right-[14%] top-[28%] h-10 w-10 text-fuchsia-200/50" />
      <Sparkles className="travel-icon absolute bottom-[18%] right-[24%] h-10 w-10 text-sky-200/50" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-white/30 shadow-[0_0_24px_rgba(255,255,255,0.25)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animation: `float 9s ease-in-out ${particle.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
}
