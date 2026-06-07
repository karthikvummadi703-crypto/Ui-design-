/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Compass, Sparkles, Terminal, ArrowRight } from "lucide-react";
import AnoAI from "@/components/ui/animated-shader-background";

interface IntroScreenProps {
  onEnterPortal: () => void;
  accentColor: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnterPortal, accentColor }) => {
  return (
    <motion.div
      id="intro-screen-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full max-w-4xl flex flex-col items-center justify-between min-h-[85vh] md:min-h-[80vh] py-12 px-6 relative z-10 mx-auto"
    >
      {/* Animated Three.js Shader Backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-100">
        <AnoAI />
      </div>

      {/* Top ambient brand indicator */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-sm"
      >
        <Compass className="w-4 h-4 text-indigo-400 rotate-45" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
          CIVICPULSE AI :: LOCAL CITIZEN SERVICES CODES ACTIVE
        </span>
      </motion.div>

      {/* Main hero segment */}
      <div className="flex flex-col items-center text-center my-auto max-w-2xl relative">
        {/* Glow behind title */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: accentColor }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-6 shadow-md relative"
        >
          <Sparkles className="w-7 h-7 text-indigo-405 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-100 tracking-tight leading-tight uppercase font-medium"
        >
          CivicPulse AI <br />
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r transition-all duration-1000"
            style={{ 
              backgroundImage: `linear-gradient(to right, #818cf8, ${accentColor}, #c084fc)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Digital Governance Hub
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed mt-6 max-w-lg font-sans font-normal"
        >
          Empowering citizens to understand issues, engage with governance, and take meaningful civic action through AI. Track civic health ratios, verify proposals, and shape dynamic resolutions.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10"
        >
          <button
            id="begin-alignment-button"
            onClick={onEnterPortal}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-650 text-white font-sans font-medium text-sm rounded-full cursor-pointer hover:bg-indigo-600 shadow-lg shadow-indigo-600/10 transition-all duration-300 md:hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            <Terminal className="w-4 h-4 text-white" />
            ENTER CITIZEN PORTAL
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Understated bottom system indicators */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-6 mt-6 text-[10px] sm:text-xs font-mono text-slate-500 gap-4"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GOVERNMENT SECURE HANDSHAKE LINK
          </span>
          <span className="text-slate-800">|</span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SECURE PUBLIC PORTAL GATEWAY</span>
          <span className="px-2 py-0.5 rounded bg-slate-900/80 text-indigo-300 border border-slate-800">
            FIPS 140-3
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
