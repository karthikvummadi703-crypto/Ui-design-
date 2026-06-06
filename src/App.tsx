/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  Compass, 
  Sliders, 
  ChevronRight,
  ChevronLeft,
  Atom,
  Magnet,
  Orbit,
  Gauge,
  CircleDot,
  LogOut
} from "lucide-react";
import OrbitImages from "./components/OrbitImages";
import Antigravity from "./components/Antigravity";
import { IntroScreen } from "./components/IntroScreen";
import { AuthPortal } from "./components/AuthPortal";
import SoftAurora from "./components/ui/SoftAurora";

// Interactive Cosmic Phases designed to align with the single-focus orbital representation
interface SpacePhase {
  id: number;
  title: string;
  codename: string;
  description: string;
  accentColor: string;
  unresolvedIcon: string; 
  imageUrl: string;
}

const CELESTIAL_PHASES: SpacePhase[] = [
  {
    id: 1,
    title: "Cosmic Foundation",
    codename: "PHASE_ZERO_G",
    description: "Setting the baseline spatial coordinates and initializing zero-gravity attraction vectors across the multi-user viewport.",
    accentColor: "#6366F1", // Indigo
    unresolvedIcon: "Atom",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    title: "Magnetic Capture",
    codename: "PHASE_MAG_LOCK",
    description: "Aligning localized fields to lock nodes in a persistent state-controlled ellipse ready for subsequent high-frequency integration.",
    accentColor: "#F43F5E", // Rose
    unresolvedIcon: "Magnet",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    title: "Particle Realignment",
    codename: "PHASE_RE_FLUX",
    description: "Re-configuring flux channels to modulate particle pulse intervals, ensuring responsive transitions across asynchronous ticks.",
    accentColor: "#10B981", // Emerald
    unresolvedIcon: "Sliders",
    imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834643031?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    title: "Quantum Cohesion",
    codename: "PHASE_QUANTUM",
    description: "Binding discrete structural components into an uninterrupted gravitational orbital string, eliminating frame stutter.",
    accentColor: "#3B82F6", // Blue
    unresolvedIcon: "Orbit",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 5,
    title: "Hyper-Drive Injection",
    codename: "PHASE_HYPER",
    description: "Triggering final speed calibrations to inject high-density metadata directly into the hosted Cloud Run container framework.",
    accentColor: "#F59E0B", // Amber
    unresolvedIcon: "Gauge",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 6,
    title: "Singularity Core",
    codename: "PHASE_SINGULAR",
    description: "Opening infinite coordinate loops where the trajectory, gravity wave speed, and visual center content merge in perfect harmony.",
    accentColor: "#8B5CF6", // Purple
    unresolvedIcon: "CircleDot",
    imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=200&q=80"
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"intro" | "auth" | "home">("home");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Carousel Phase Index Selection (Single visible option focus!)
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  
  // Real-time calculated orbital Cartesian coordinates tracked from OrbitImages
  const [orbitTrackCoords, setOrbitTrackCoords] = useState<{ x: number; y: number } | null>(null);

  // Unified ticker: ticks every 1 second to update calendar time, and shifts the celestial phase index every 5 seconds
  useEffect(() => {
    let elapsedSeconds = 0;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      elapsedSeconds += 1;
      if (elapsedSeconds >= 5) {
        setActivePhaseIndex((prev) => (prev + 1) % CELESTIAL_PHASES.length);
        elapsedSeconds = 0;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activePhase = useMemo(() => CELESTIAL_PHASES[activePhaseIndex], [activePhaseIndex]);

  const handleNextPhase = () => {
    setActivePhaseIndex((prev) => (prev + 1) % CELESTIAL_PHASES.length);
  };

  const handlePrevPhase = () => {
    setActivePhaseIndex((prev) => (prev - 1 + CELESTIAL_PHASES.length) % CELESTIAL_PHASES.length);
  };

  // Convert digital clock
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Get current visual icon
  const renderPhaseIcon = (iconName: string, color: string) => {
    const props = { className: "w-5 h-5", style: { color } };
    switch (iconName) {
      case "Atom": return <Atom {...props} />;
      case "Magnet": return <Magnet {...props} />;
      case "Sliders": return <Sliders {...props} />;
      case "Orbit": return <Orbit {...props} />;
      case "Gauge": return <Gauge {...props} />;
      default: return <CircleDot {...props} />;
    }
  };

  return (
    <div 
      id="app-root" 
      className="min-h-screen w-full bg-gradient-to-b from-[#010822] via-[#010410] to-[#000207] text-slate-100 flex flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden font-sans select-none"
    >
      {/* Immersive Studio Spotlight Flares (Matching reference background image!) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top central bright blue spotlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-blue-500/15 rounded-full blur-[130px]" />
        {/* Bottom backdrop reflection highlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[190px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Interactive Antigravity Magnetic Particles Background (Continuous Experience!) */}
      <Antigravity
        count={350}
        magnetRadius={15}
        ringRadius={8.5}
        waveSpeed={0.35}
        waveAmplitude={1.5}
        particleSize={1.8}
        lerpSpeed={0.07}
        color={activePhase.accentColor}
        autoAnimate={currentScreen !== "home" || !orbitTrackCoords}
        particleVariance={1.1}
        rotationSpeed={0.06}
        depthFactor={0.4}
        pulseSpeed={2.0}
        particleShape="capsule"
        fieldStrength={11}
        externalTarget={currentScreen === "home" ? orbitTrackCoords : null}
        activePhaseIndex={activePhaseIndex}
      />

      {/* Grid line backdrop for structure */}
      <div 
        id="bg-grid-lines"
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_75%,transparent_100%)] opacity-20 pointer-events-none z-0" 
      />

      {/* Dynamic Client-Reactive SoftAurora Wave (Placed at the middle of the preview) */}
      <div 
        id="app-soft-aurora-middle" 
        className="absolute top-1/2 left-0 w-full h-[45%] -translate-y-1/2 pointer-events-none z-0 opacity-80 mix-blend-screen overflow-hidden"
      >
        <SoftAurora
          speed={0.4}
          scale={1.5}
          brightness={1.8}
          color1="#00f2ff"
          color2={activePhase.accentColor}
          noiseFrequency={4}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.1}
          octaveDecay={0.1}
          layerOffset={0.0}
          colorSpeed={0.8}
          enableMouseInteraction={true}
          mouseInfluence={0.2}
        />
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === "intro" && (
          <IntroScreen 
            key="intro-screen" 
            onEnterPortal={() => setCurrentScreen("auth")} 
            accentColor={activePhase.accentColor} 
          />
        )}

        {currentScreen === "auth" && (
          <AuthPortal 
            key="auth-portal" 
            onBack={() => setCurrentScreen("intro")} 
            onLoginSuccess={() => setCurrentScreen("home")} 
            accentColor={activePhase.accentColor} 
          />
        )}

        {currentScreen === "home" && (
          <motion.div
            key="home-screen"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center justify-between flex-grow"
          >
            {/* Header Area */}
            <header 
              id="app-header"
              className="w-full max-w-6xl flex items-center justify-between z-10 py-3 border-b border-slate-800/40 backdrop-blur-sm bg-slate-950/20 px-4 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl relative group overflow-hidden shadow-sm">
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{ backgroundColor: activePhase.accentColor }} 
                  />
                  <Compass className="w-5 h-5 text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div>
                  <span className="font-display font-medium text-xs sm:text-sm tracking-widest uppercase text-slate-200 block">
                    Celestial Orbit Space
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    PREVIEW LANDING ENVIRONMENT
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Dynamic Clock Widget */}
                <div 
                  id="clock-widget"
                  className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 px-4 py-1.5 rounded-full shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activePhase.accentColor }} />
                  <span className="font-mono text-xs text-indigo-400 font-medium tracking-widest">
                    {formatTime(currentTime)}
                  </span>
                </div>

                {/* Sign out button hidden for custom intro sequence preparation */}
              </div>
            </header>

            {/* Main Interactive Stage */}
            <main 
              id="main-interactive-stage"
              className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center py-4 z-10 gap-6"
            >
              {/* Full Viewport Orbit Stage (Aligned with background 3D coordinates!) */}
              <div 
                id="orbit-full-stage"
                className="w-full aspect-[2/1] md:aspect-[2.3/1] min-h-[460px] md:min-h-[500px] flex items-center justify-center relative bg-transparent rounded-3xl"
              >
                <OrbitImages
                  images={CELESTIAL_PHASES.map(p => p.imageUrl)}
                  shape="ellipse"
                  baseWidth={1200}
                  radiusX={540} // Expansive horizontal radius so options span across the landing screen
                  radiusY={190} // Vertical radius matching the visual field
                  rotation={-6}
                  itemSize={340} // Maximized giant option capsules that occupy the landing screen with pristine fidelity
                  responsive={true}
                  showPath={true}
                  pathColor="rgba(255, 255, 255, 0.05)"
                  pathWidth={1.5}
                  paused={false}
                  className="w-full h-full"
                  onTrackPosition={(pos) => setOrbitTrackCoords(pos)}
                  activeIndex={activePhaseIndex}
                  onActiveItemChange={setActivePhaseIndex}
                  centerContent={
                    <div className="flex flex-col items-center text-center p-6 rounded-full max-w-[260px] bg-slate-950/40 backdrop-blur-2xl border border-slate-800/40 shadow-lg relative overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundColor: activePhase.accentColor }} 
                      />
                      
                      <motion.div
                        key={activePhase.id}
                        initial={{ scale: 0.8, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-2 shadow-sm"
                      >
                        {renderPhaseIcon(activePhase.unresolvedIcon, activePhase.accentColor)}
                      </motion.div>

                      <span className="font-display font-semibold text-[10px] uppercase tracking-widest text-slate-400">
                        Orbit Target
                      </span>
                      
                      <motion.p
                        key={`label-${activePhase.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-indigo-300 font-mono mt-1 px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-lg truncate whitespace-nowrap overflow-hidden max-w-[190px]"
                      >
                        {activePhase.codename}
                      </motion.p>
                    </div>
                  }
                />

                {/* Floating drag instruction tip */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800/80 px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono text-indigo-200/90 shadow-lg flex items-center gap-2 backdrop-blur-md">
                  <Compass className="w-4 h-4 animate-spin text-indigo-400" style={{ animationDuration: '6s' }} />
                  SLIDE TO TRANSLATE ACTIVE ICON
                </div>
              </div>

              {/* Unified Control Console Overlay */}
              <div 
                id="system-controls-pane"
                className="w-full max-w-2xl mt-2 mx-auto"
              >
                {/* Main Selected Phase Display Card (Human Readable, Elegant) */}
                <motion.div
                  id="selected-phase-card"
                  key={activePhase.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full bg-slate-950/20 border border-slate-850/60 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-2xl"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 pointer-events-none"
                    style={{ backgroundColor: activePhase.accentColor }}
                  />
                  
                  <div>
                    {/* Phase Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-opacity-35 font-semibold"
                        style={{ borderColor: activePhase.accentColor, color: activePhase.accentColor }}
                      >
                        Roadmap Milestone 0{activePhase.id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                        ROADMAP OUTLINE
                      </span>
                    </div>

                    {/* Display Header */}
                    <h2 className="font-display font-medium text-2xl text-slate-100 tracking-tight mb-2">
                      {activePhase.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {activePhase.description}
                    </p>
                  </div>

                  {/* Single Option Cycler Controller */}
                  <div className="flex items-center justify-between bg-slate-950/90 border border-slate-900/80 p-2.5 rounded-2xl shadow-inner">
                    <button
                      id="prev-phase-button"
                      onClick={handlePrevPhase}
                      className="p-2.5 hover:bg-slate-900 active:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-100 transition-colors border border-transparent hover:border-slate-800 cursor-pointer"
                      title="Select Previous Phase"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">
                        Iterating Roadmap
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-medium">
                        {activePhaseIndex + 1} of {CELESTIAL_PHASES.length} Options
                      </span>
                    </div>

                    <button
                      id="next-phase-button"
                      onClick={handleNextPhase}
                      className="p-2.5 hover:bg-slate-900 active:bg-slate-950 rounded-xl text-slate-400 hover:text-slate-100 transition-colors border border-transparent hover:border-slate-800 cursor-pointer"
                      title="Select Next Phase"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </main>

            {/* Footer system info segment */}
            <footer 
              id="app-footer"
              className="w-full max-w-6xl flex items-center justify-between text-slate-500 font-mono text-[10px] sm:text-xs border-t border-slate-900 pt-4 z-10 mt-4 px-4 py-2.5"
            >
              <span>
                © {currentTime.getFullYear()} Celestial Orbit Space. All Right Reserved.
              </span>
              <span>
                LANDING PAGE PREVIEW
              </span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
