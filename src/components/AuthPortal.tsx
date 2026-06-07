/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, RefreshCw, Key, ChevronLeft, ArrowRight, ShieldCheck, Mail, Sparkles } from "lucide-react";
import AnoAI from "@/components/ui/animated-shader-background";
import { useAuth } from "../context/AuthContext";
import { logAnalyticsEvent } from "../utils/analytics";

interface AuthPortalProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  accentColor: string;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onBack, onLoginSuccess, accentColor }) => {
  const { logInWithEmail, signUpWithEmail, logInWithGoogle, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    // Validation
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please specify a valid email address.");
      return;
    }

    if (mode !== "forgot" && !password.trim()) {
      setErrorMsg("Security access password is required.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setErrorMsg("Please specify your citizen name.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await logInWithEmail(email, password);
        logAnalyticsEvent("login_success", { method: "email" });
        onLoginSuccess();
      } else if (mode === "signup") {
        await signUpWithEmail(email, password, name);
        logAnalyticsEvent("signup_success", { method: "email" });
        setInfoMsg("A verification email has been dispatched. Please verify and log in.");
        setMode("login");
      } else {
        await resetPassword(email);
        setInfoMsg("Check your mailbox for password reset coordinates.");
        setMode("login");
      }
    } catch (error: any) {
      console.error("Auth submit error:", error);
      setErrorMsg(error?.message || "Authentication attempt rejected by governance servers.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await logInWithGoogle();
      logAnalyticsEvent("google_signin");
      logAnalyticsEvent("login_success", { method: "google" });
      onLoginSuccess();
    } catch (error: any) {
      console.error("Google signin reject:", error);
      setErrorMsg(error?.message || "Google federation portal handshake failed.");
    } finally {
      setLoading(false);
    }
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
      <div className="w-full bg-slate-950/35 border border-slate-800/80 backdrop-blur-2xl px-6 py-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Neon accent top border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
          style={{ backgroundColor: accentColor }}
        />

        {/* Back navigation button */}
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 cursor-pointer group disabled:opacity-50"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Terminal Hub
        </button>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 shadow-sm">
            <Lock className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <h2 className="font-sans font-bold text-xl text-slate-100 tracking-tight uppercase">
            {mode === "login" ? "Citizen Portal Gate" : mode === "signup" ? "Citizen Onboarding" : "Credentials Recover"}
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-1 uppercase">
            {mode === "login" ? "Welcome back to CivicPulse AI" : mode === "signup" ? "Join District Public Sphere" : "Send reset link coordinates"}
          </p>
        </div>

        {/* Info Feedback message */}
        {infoMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-350 text-xs p-3 rounded-xl mb-4 font-normal text-center">
            {infoMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Public Citizen Name (Only in Register mode) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-450 tracking-widest mb-1.5 ml-1">
                Citizen Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Eleanor Vance"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-650 text-sm focus:outline-none transition-all duration-300"
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
          )}

          {/* Email field */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-450 tracking-widest mb-1.5 ml-1 font-semibold">
              Email Address Coordinates
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="citizen@district.gov"
                className="block w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-650 text-sm focus:outline-none transition-all duration-300"
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
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="block text-[10px] font-mono uppercase text-slate-450 tracking-widest">
                  Security Access Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 text-right cursor-pointer"
                  >
                    Coordinates lost?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-650 text-sm focus:outline-none transition-all duration-300"
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
          )}

          {/* Validation Feedback with AnimatePresence */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[11px] text-rose-450 font-mono mt-2 p-2 bg-rose-950/15 border border-rose-900/20 rounded-xl"
              >
                * {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-indigo-650 text-white font-sans font-bold text-sm rounded-xl cursor-pointer hover:bg-indigo-600 shadow-lg shadow-indigo-600/15 transition-all duration-300 active:scale-98 disabled:opacity-50 mt-2 relative overflow-hidden"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                AUTHORIZING SECURE CREDENTIALS...
              </>
            ) : (
              <>
                {mode === "login" ? "LINK PROFILE SESSION" : mode === "signup" ? "INITIALIZE DISTRICT SIGNUP" : "GENERATE PASS RECOVERY"}
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div className="mt-4 text-center">
          {mode === "login" ? (
            <span className="text-xs text-slate-400">
              New citizen in this district?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-indigo-400 hover:text-indigo-350 cursor-pointer font-semibold underline underline-offset-2"
              >
                Register Credentials
              </button>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-indigo-400 hover:text-indigo-350 cursor-pointer font-semibold underline underline-offset-2"
              >
                Sign In Gate
              </button>
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-900"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0b132e] px-3 font-mono text-slate-500">
              Or Federation Portal
            </span>
          </div>
        </div>

        {/* Google sign-in delegation */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-850 hover:text-white rounded-xl text-xs font-mono tracking-widest transition-all duration-300 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-yellow-405" />
          FEDERATE VIA GOOGLE IDENTITY
        </button>

        {/* Direct access helper details */}
        <div className="mt-6 pt-5 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            ENC END-TO-END
          </span>
          <span className="text-indigo-400/80">
            TLS 1.3 CLIENT TUNNEL
          </span>
        </div>
      </div>
    </motion.div>
  );
};
