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
  LogOut,
  Mail,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import OrbitImages from "./components/OrbitImages";
import Antigravity from "./components/Antigravity";
import { IntroScreen } from "./components/IntroScreen";
import { AuthPortal } from "./components/AuthPortal";
import SoftAurora from "./components/ui/SoftAurora";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { useAuth } from "./context/AuthContext";
import { logAnalyticsEvent } from "./utils/analytics";

// Importing the real premium civic interactive components
import { 
  CitizenDashboard, 
  CivicIssuesTracker, 
  CivicPolls, 
  GovernanceAiAssistant, 
  ProfileConfigCard 
} from "./components/CivicModules";

interface SpacePhase {
  id: number;
  title: string;
  codename: string;
  description: string;
  accentColor: string;
  unresolvedIcon: string; 
  imageUrl: string;
}

// Rewriting CELESTIAL_PHASES to represent real active Civic Domains
const CELESTIAL_PHASES: SpacePhase[] = [
  {
    id: 1,
    title: "Citizen Dashboard",
    codename: "PORTAL_DASHBOARD",
    description: "Analyse real-time public service metrics, calculate your Citizen Engagement ratings, and list active logs.",
    accentColor: "#6366F1", // Indigo
    unresolvedIcon: "Gauge",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    title: "Civic Issues Tracker",
    codename: "PORTAL_ISSUES",
    description: "Explore active municipal concerns, environmental projects, and district proposals verified with Gemini AI summaries.",
    accentColor: "#F43F5E", // Rose
    unresolvedIcon: "Atom",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    title: "Consensus Polls",
    codename: "PORTAL_POLLS",
    description: "Participate in real-time district consensus voting regarding resource scheduling, transit, and environmental grants.",
    accentColor: "#10B981", // Emerald
    unresolvedIcon: "Sliders",
    imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834643031?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    title: "Governance AI Assistant",
    codename: "PORTAL_AI_BOT",
    description: "Obtain immediate AI explanation coordinates on district ordinances, administrative duties, and civil rules.",
    accentColor: "#F59E0B", // Amber
    unresolvedIcon: "Orbit",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 5,
    title: "Profile Configurations",
    codename: "PORTAL_PROFILE",
    description: "Audit or re-structure your municipal address registration, interface language coordinates, and check metrics.",
    accentColor: "#8B5CF6", // Purple
    unresolvedIcon: "CircleDot",
    imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=200&q=80"
  }
];

export default function App() {
  const { user, loading, isOnboarded, needsEmailVerification, signOut, sendVerification } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<"intro" | "auth" | "home">("home");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Carousel index tracker
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [orbitTrackCoords, setOrbitTrackCoords] = useState<{ x: number; y: number } | null>(null);

  // Verification helper state
  const [verifyingRefresh, setVerifyingRefresh] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  // System continuous clock ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update starting views to keep preview focused on main dashboard/website presentation
  useEffect(() => {
    if (!loading) {
      setCurrentScreen("home");
      logAnalyticsEvent("dashboard_view");
    }
  }, [loading]);

  const activePhase = useMemo(() => CELESTIAL_PHASES[activePhaseIndex], [activePhaseIndex]);

  const handleNextPhase = () => {
    setActivePhaseIndex((prev) => (prev + 1) % CELESTIAL_PHASES.length);
  };

  const handlePrevPhase = () => {
    setActivePhaseIndex((prev) => (prev - 1 + CELESTIAL_PHASES.length) % CELESTIAL_PHASES.length);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

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

  // Dedicated custom dynamic workspace tab render engine
  const renderActiveWorkspace = () => {
    switch (activePhaseIndex) {
      case 0: return <CitizenDashboard />;
      case 1: return <CivicIssuesTracker />;
      case 2: return <CivicPolls />;
      case 3: return <GovernanceAiAssistant />;
      case 4: return <ProfileConfigCard />;
      default: return <CitizenDashboard />;
    }
  };

  const handleResendLink = async () => {
    setResendingVerification(true);
    setResendStatus("");
    try {
      await sendVerification();
      setResendStatus("Coordinates dispatched! Verify and refresh this page.");
    } catch (err: any) {
      setResendStatus(`Failed: ${err.message || " HANDSHAKE TIMEOUT."}`);
    } finally {
      setResendingVerification(false);
    }
  };

  const handleRefreshVerificationCheck = () => {
    setVerifyingRefresh(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Render high-contrast Quantum Loader during first context establishment
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#010410] text-slate-100 flex flex-col items-center justify-center p-6 relative select-none font-sans">
        <div id="quantum-loader-glow" className="absolute w-64 h-64 bg-indigo-505/10 rounded-full blur-[100px]" />
        <div className="space-y-4 text-center z-10">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-300 block">
              CivicPulse AI
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              SYNCHRONIZING CITIZEN SECURITY COORDINATES...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Enforce secure verification reminder screen
  if (user && needsEmailVerification) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#010822] via-[#010410] to-[#000207] text-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans relative">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-md bg-slate-950/40 border border-slate-800/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl relative z-10 text-center space-y-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />

          <div className="mx-auto w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-sans font-bold text-xl uppercase tracking-tight text-slate-100">
              Email Verification Required
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed font-sans px-2">
              A secure activation coordinates dispatch has been sent to <span className="text-indigo-300 font-medium font-mono border-b border-indigo-900/30">{user.email}</span>. Click the link to proceed.
            </p>
          </div>

          {resendStatus && (
            <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl">
              {resendStatus}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleRefreshVerificationCheck}
              disabled={verifyingRefresh}
              className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-600 font-sans text-xs font-bold tracking-widest text-white rounded-full cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {verifyingRefresh ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  REASSESSING DATABASE INDEX...
                </>
              ) : (
                "SECURED VERIFICATION COMPLETED"
              )}
            </button>

            <button
              onClick={handleResendLink}
              disabled={resendingVerification}
              className="w-full py-2 bg-slate-900/80 border border-slate-800 hover:text-white rounded-xl text-[10px] font-mono tracking-widest text-slate-300 transition-all cursor-pointer"
            >
              {resendingVerification ? "TRANSMITTING LINK..." : "RE-TRANSMIT VERIFICATION CODES"}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-900">
            <button
              onClick={signOut}
              className="text-[10px] font-mono text-rose-400 hover:text-rose-350 tracking-wider flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              DESYNCHRONIZE GATE SESSION (LOGOUT)
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            STANDALONE ENCRYPTED GATEWAY
          </div>
        </div>
      </div>
    );
  }

  // Enforce first login profiling onboarding
  if (user && !isOnboarded) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#010822] via-[#010410] to-[#000207] text-slate-100 flex flex-col items-center justify-center relative select-none font-sans">
        <OnboardingScreen />
      </div>
    );
  }

  return (
    <div 
      id="app-root" 
      className="min-h-screen w-full bg-gradient-to-b from-[#010822] via-[#010410] to-[#000207] text-slate-100 flex flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden font-sans select-none"
    >
      {/* Immersive Studio Spotlight Flares */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top central bright blue spotlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-blue-500/15 rounded-full blur-[130px]" />
        {/* Bottom backdrop reflection highlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[190px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Interactive Antigravity Magnetic Particles Background */}
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

      {/* Dynamic Client-Reactive SoftAurora Wave */}
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
            onEnterPortal={() => setCurrentScreen(user ? "home" : "auth")} 
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
            className="w-full flex-grow flex items-center justify-center relative z-10"
          >
            {/* Full Viewport Orbit Stage */}
            <div 
              id="orbit-full-stage"
              className="w-full max-w-6xl aspect-[2/1] md:aspect-[2.3/1] min-h-[460px] md:min-h-[500px] flex items-center justify-center relative bg-transparent rounded-3xl"
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
                      ACTIVE SPHERE
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
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-800/70 px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono text-indigo-200/90 shadow-lg flex items-center gap-2 backdrop-blur-md">
                <Compass className="w-4 h-4 animate-spin text-indigo-400" style={{ animationDuration: '6s' }} />
                SLIDE TO ROTATE TO ANOTHER CIVIC SPHERE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
