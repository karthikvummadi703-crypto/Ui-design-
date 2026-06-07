/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { User, MapPin, Globe, Compass, ArrowRight, RefreshCw } from "lucide-react";
import AnoAI from "@/components/ui/animated-shader-background";
import { useAuth } from "../context/AuthContext";

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || "");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) return setErrorMsg("Your legal citizen name is required.");
    if (!city.trim()) return setErrorMsg("District city field is mandatory.");
    if (!state.trim()) return setErrorMsg("State coordinate is mandatory.");

    setLoading(true);
    try {
      await completeOnboarding({ name, city, state, language });
    } catch (error: any) {
      setErrorMsg(error?.message || "Governance handshake failed updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      id="onboarding-screen-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-lg mx-auto relative z-10 py-12 px-4 flex flex-col justify-center min-h-[80vh]"
    >
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-100">
        <AnoAI />
      </div>

      <div className="w-full bg-slate-950/40 border border-slate-800/80 backdrop-blur-2xl px-6 py-8 rounded-3xl shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-rose-500" />

        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 shadow-md">
            <Compass className="w-5 h-5 text-indigo-400 rotate-45" />
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-slate-100 tracking-tight uppercase">
            Citizen Registration
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-1.5 uppercase leading-relaxed">
            Configure decentralized district coordinates to establish your public profile
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-350 text-xs p-3 rounded-xl mb-6">
            * {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Label Name */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
              Legal Citizen Name
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
                placeholder="Eleanor Vance"
                className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* District Coordinates (City & State) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
                District City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Jose"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
                State Coordinate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Compass className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="California"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1.5 ml-1">
              Interface Language Coordinates
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-500" />
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none cursor-pointer appearance-none"
              >
                <option value="English" className="bg-[#0c1020]">English</option>
                <option value="Español" className="bg-[#0c1020]">Español (Spanish)</option>
                <option value="Français" className="bg-[#0c1020]">Français (French)</option>
                <option value="Deutsch" className="bg-[#0c1020]">Deutsch (German)</option>
                <option value="Mandarin" className="bg-[#0c1020]">普通话 (Mandarin)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-650 hover:bg-indigo-600 font-sans text-sm font-bold text-white rounded-full mt-4 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                DETERMINING SYSTEM SYNC...
              </>
            ) : (
              <>
                ESTABLISH CITIZEN PROFILE
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};
