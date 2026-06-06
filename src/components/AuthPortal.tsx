/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, RefreshCw, Key, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";
import AnoAI from "@/components/ui/animated-shader-background";

interface AuthPortalProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  accentColor: string;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onBack, onLoginSuccess, accentColor }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Minimal form validation
    if (!username.trim()) {
      setErrorMsg("Please specify your Portal Terminal ID.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Security access key is required.");
      return;
    }

    setLoading(true);

    // Beautiful simulated high-speed synchronization state
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1800);
  };

  return (
    <motion.div
      id="auth-portal-container"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto relative z-10 flex flex-col justify-center items-center py-10 px-4"
    >
      {/* Animated Three.js Shader Backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-100">
        <AnoAI />
      </div>

      {/* Decorative Blur Backgrounds */}
      <div 
        className="absolute -top-12 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute -bottom-12 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-5 pointer-events-none" />

      {/* Main card */}
      <div className="w-full bg-slate-950/30 border border-slate-800/60 backdrop-blur-2xl px-6 py-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Neon accent top border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
          style={{ backgroundColor: accentColor }}
        />

        {/* Back navigation button */}
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-350 transition-colors mb-6 cursor-pointer group disabled:opacity-50"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Terminal Hub
        </button>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 shadow-sm">
            <Lock className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <h2 className="font-sans font-semibold text-xl text-slate-100 tracking-tight uppercase">
            Authentication Gate
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1 uppercase">
            ESTABLISH NODE LINK SESSION
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email/Username field */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
              Terminal ID or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="e.g. pilot@orbit.space"
                className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-600 text-sm focus:outline-none transition-all duration-300"
                onFocus={(e) => {
                  e.target.style.borderColor = accentColor;
                  e.target.style.boxShadow = `0 0 12px ${accentColor}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(30, 41, 59, 1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
              Security Access Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-600 text-sm focus:outline-none transition-all duration-300"
                onFocus={(e) => {
                  e.target.style.borderColor = accentColor;
                  e.target.style.boxShadow = `0 0 12px ${accentColor}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(30, 41, 59, 1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Validation Feedback with AnimatePresence */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[11px] text-rose-400 font-mono mt-2"
              >
                * {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-indigo-650 text-white font-sans font-semibold text-sm rounded-xl cursor-pointer hover:bg-indigo-600 shadow-lg shadow-indigo-600/10 transition-all duration-300 active:scale-98 disabled:opacity-50 mt-2 relative overflow-hidden"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                SYNCHRONIZING GRAVITY CHAINS...
              </>
            ) : (
              <>
                ESTABLISH PORTAL ACCREDITATION
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Direct access helper details */}
        <div className="mt-6 pt-5 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            ENC END-TO-END
          </span>
          <span>DUMMY ENTRY OK</span>
        </div>
      </div>
    </motion.div>
  );
};
