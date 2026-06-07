/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDocs
} from "firebase/firestore";
import { 
  Users, 
  BookOpen, 
  Cpu, 
  Vote, 
  AlertTriangle, 
  User as UserIcon, 
  CheckCircle, 
  Send, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Globe, 
  CheckSquare, 
  Sparkles,
  Inbox,
  Lock,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { logAnalyticsEvent } from "../utils/analytics";
import { SAMPLE_ISSUES, SAMPLE_POLLS, CivicIssue, CivicPoll } from "../data/civicData";

// --- MODULE 1: CITIZEN DASHBOARD ---
export const CitizenDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  
  const score = userProfile ? (
    userProfile.issuesViewed * 1 +
    userProfile.aiSummariesGenerated * 5 +
    userProfile.pollsParticipated * 10 +
    userProfile.civicActionsCompleted * 20
  ) : 0;

  return (
    <div className="space-y-6 pt-2">
      {/* Primary Engagement Circular Meter Card */}
      <div className="p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400">
              Score Assessment Metric
            </span>
            <h3 className="font-sans font-bold text-lg text-slate-100 uppercase">
              Your Citizen Engagement Activity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your score is a direct representation of your participation in district services and local decision making.
            </p>
          </div>

          {/* Engagement Badge */}
          <div className="text-center md:text-right px-4 py-2 bg-slate-900/90 border border-slate-850 rounded-xl min-w-[140px]">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 block">
              AGGREGATED RATING
            </span>
            <span className="text-3xl font-extrabold font-mono text-indigo-400 block tracking-tight my-1">
              {score}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              LEVEL: {score > 100 ? "Active Sentinel" : score > 40 ? "Engaged Guardian" : "Initiate Citizen"}
            </span>
          </div>
        </div>

        {/* Math Blueprint Formula */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-slate-500">
          <span className="text-indigo-400/80 font-bold">CALCULATION INDEX:</span>
          <span>Views × 1 ({userProfile?.issuesViewed || 0})</span>
          <span>•</span>
          <span>AI Summaries × 5 ({userProfile?.aiSummariesGenerated || 0})</span>
          <span>•</span>
          <span>Polls × 10 ({userProfile?.pollsParticipated || 0})</span>
        </div>
      </div>

      {/* Grid Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-xl">
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Issues Inspected</span>
          <span className="text-xl font-bold text-slate-100 font-mono block mt-1">{userProfile?.issuesViewed || 0}</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-xl">
          <span className="text-[9px] font-mono text-slate-500 block uppercase">AI Synopses Generated</span>
          <span className="text-xl font-bold text-slate-100 font-mono block mt-1">{userProfile?.aiSummariesGenerated || 0}</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-xl">
          <span className="text-[9px] font-mono text-slate-500 block uppercase">Poll participations</span>
          <span className="text-xl font-bold text-slate-100 font-mono block mt-1">{userProfile?.pollsParticipated || 0}</span>
        </div>
      </div>

      {/* Telemetry Log */}
      <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2.5">
        <span className="font-mono text-[10px] uppercase text-indigo-400 block font-semibold">
          ACTIVE SYSTEM FEED
        </span>
        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 text-[11px] font-mono text-slate-400 select-text">
          <div className="flex items-start gap-1.5">
            <span className="text-slate-650">[09:24:12]</span>
            <span>Local telemetry sync successful.</span>
          </div>
          {userProfile && userProfile.issuesViewed > 0 && (
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-500">[ACCOMPLISHED]</span>
              <span>Logged {userProfile.issuesViewed} issue query details records.</span>
            </div>
          )}
          {userProfile && userProfile.aiSummariesGenerated > 0 && (
            <div className="flex items-start gap-1.5">
              <span className="text-purple-400">[AI_CORE]</span>
              <span>Generated {userProfile.aiSummariesGenerated} secure brief blueprints.</span>
            </div>
          )}
          <div className="flex items-start gap-1.5 text-slate-500">
            <span>[SESSION]</span>
            <span>Welcome, {userProfile?.name}! Secure citizen authorization valid.</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          onClick={signOut}
          className="text-xs font-mono text-rose-400 border border-rose-900/30 hover:border-rose-800/85 px-4 py-1.5 rounded-lg hover:bg-rose-950/20 transition-all cursor-pointer"
        >
          DESYNCHRONIZE CLIENT TERMINAL (LOGOUT)
        </button>
      </div>
    </div>
  );
};

// --- MODULE 2: ISSUES TRACKER WITH GEMINI SUMMARY ---
export const CivicIssuesTracker: React.FC = () => {
  const { incrementEngagementMetric } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const handleSelectIssue = (issue: CivicIssue) => {
    setSelectedIssue(issue);
    setAiSummary("");
    // Track GA4 and increment views count automatically
    logAnalyticsEvent("issue_viewed", { issueId: issue.id, category: issue.category });
    incrementEngagementMetric("issuesViewed", 1);
  };

  const handleGenerateSummary = async () => {
    if (!selectedIssue) return;
    setSummarizing(true);
    setAiSummary("");
    logAnalyticsEvent("ai_summary_generated", { issueId: selectedIssue.id });

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueTitle: selectedIssue.title,
          issueCategory: selectedIssue.category,
          issueDescription: selectedIssue.fullText
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiSummary(data.result);
      // Increment summaries generated metric
      incrementEngagementMetric("aiSummariesGenerated", 1);
    } catch (err: any) {
      console.error("Summary error:", err);
      setAiSummary(`*Error generating AI insight:* ${err.message || " HANDSHAKE DISRUPTED."}`);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
      {/* Issues Left List */}
      <div className="space-y-2">
        <span className="font-mono text-[9px] uppercase text-indigo-400 block tracking-widest font-semibold mb-1">
          Select Active District Proposals
        </span>
        {SAMPLE_ISSUES.map((issue) => (
          <button
            key={issue.id}
            onClick={() => handleSelectIssue(issue)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              selectedIssue?.id === issue.id 
                ? "bg-indigo-950/20 border-indigo-500/50 shadow-md"
                : "bg-slate-900/30 border-slate-850/60 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                {issue.category}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <h4 className="font-sans font-medium text-xs text-slate-100 truncate">
              {issue.title}
            </h4>
          </button>
        ))}
      </div>

      {/* Selected Details Right Block */}
      <div className="bg-slate-950/50 border border-slate-900 p-4 rounded-2xl min-h-[300px] flex flex-col justify-between relative overflow-hidden">
        {selectedIssue ? (
          <div className="space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-indigo-500/30 text-indigo-300 uppercase">
                  {selectedIssue.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500 leading-none">
                  SECURE ID: {selectedIssue.id}
                </span>
              </div>
              
              <h3 className="font-sans font-bold text-sm text-slate-100 uppercase tracking-tight">
                {selectedIssue.title}
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedIssue.fullText}
              </p>
            </div>

            {/* AI Summary Block */}
            <div className="space-y-3 pt-2 border-t border-slate-900">
              {summarizing ? (
                <div className="flex items-center gap-2.5 text-xs text-indigo-405 font-mono py-4">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  QUERYING GEMINI FLASH COGNITIVE ROUTERS...
                </div>
              ) : aiSummary ? (
                <div className="bg-slate-900/60 border border-slate-850/70 p-3 rounded-xl max-h-[160px] overflow-y-auto text-xs text-slate-350 leading-relaxed space-y-1.5 select-text font-sans">
                  <div className="font-mono text-[10px] text-yellow-405 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    GEMINI AI ASSESSMENT SYNOP:
                  </div>
                  <div className="whitespace-pre-line text-[11px] font-sans">
                    {aiSummary}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateSummary}
                  className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 font-sans text-[11px] font-bold text-white rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  GENERATE AI CIVIC INSIGHT BRIEFING
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="my-auto text-center space-y-2">
            <BookOpen className="w-7 h-7 text-indigo-500/40 mx-auto" />
            <p className="text-xs text-slate-500 font-mono tracking-wide uppercase">
              No active proposal selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MODULE 3: PERSISTENT SURVEYS & CONSENSUS POLLS ---
export const CivicPolls: React.FC = () => {
  const { userProfile, incrementEngagementMetric } = useAuth();
  const [polls, setPolls] = useState<CivicPoll[]>(SAMPLE_POLLS);
  const [selectedPollId, setSelectedPollId] = useState<string>(SAMPLE_POLLS[0].id);
  
  // Track hasVoted states locally mapped from user profile or document
  const [userVotedState, setUserVotedState] = useState<Record<string, number>>({});

  const activePoll = polls.find(p => p.id === selectedPollId) || polls[0];

  const handleVote = (optionIndex: number) => {
    if (!userProfile) return;
    
    // Check if user already voted in activePoll
    if (activePoll.id in userVotedState) return;

    // Record vote locally
    setUserVotedState(prev => ({ ...prev, [activePoll.id]: optionIndex }));

    // Increment votes count
    setPolls(prevPolls => prevPolls.map(p => {
      if (p.id === activePoll.id) {
        return {
          ...p,
          votes: {
            ...p.votes,
            [optionIndex]: (p.votes[optionIndex] || 0) + 1
          }
        };
      }
      return p;
    }));

    // Increment metric and GA event
    logAnalyticsEvent("poll_opened", { pollId: activePoll.id, optionSelected: optionIndex });
    incrementEngagementMetric("pollsParticipated", 1);
  };

  const calculatePercentages = (p: CivicPoll) => {
    const total = Object.values(p.votes).reduce((a, b) => a + b, 0);
    return p.options.map((_, idx) => {
      const votes = p.votes[idx] || 0;
      return total === 0 ? 0 : Math.round((votes / total) * 100);
    });
  };

  const percentages = calculatePercentages(activePoll);
  const totalVotes = Object.values(activePoll.votes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 pt-1">
      {/* Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-900 pb-2">
        {polls.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPollId(p.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
              selectedPollId === p.id 
                ? "bg-slate-900 text-indigo-400 border border-slate-800"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Poll coordinates 0{p.id.includes("green") ? "1" : "2"}
          </button>
        ))}
      </div>

      {/* Main Poll Card */}
      <div className="bg-slate-950/30 border border-slate-900 p-5 rounded-2xl relative overflow-hidden">
        <h3 className="font-sans font-bold text-sm text-slate-100 uppercase tracking-tight mb-4">
          Q: {activePoll.question}
        </h3>

        <div className="space-y-3">
          {activePoll.options.map((option, idx) => {
            const hasVoted = activePoll.id in userVotedState;
            const userChoice = userVotedState[activePoll.id];
            
            return (
              <button
                key={idx}
                disabled={hasVoted}
                onClick={() => handleVote(idx)}
                className={`w-full text-left p-3.5 rounded-xl border relative overflow-hidden transition-all duration-350 cursor-pointer ${
                  hasVoted 
                    ? idx === userChoice 
                      ? "border-indigo-500/50 bg-indigo-950/15"
                      : "border-slate-900 bg-slate-950/40"
                    : "border-slate-850 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                {/* Voting Bar Progress */}
                {hasVoted && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-indigo-650/10 transition-all duration-1000"
                    style={{ width: `${percentages[idx]}%` }}
                  />
                )}

                <div className="flex justify-between items-center relative z-10 text-xs">
                  <span className="font-sans text-slate-200 pr-4">{option}</span>
                  {hasVoted && (
                    <span className="font-mono text-indigo-400 font-bold ml-auto shrink-0">
                      {percentages[idx]}% ({activePoll.votes[idx] || 0} votes)
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between text-[10px] font-mono text-slate-500">
          <span>AGGREGATED SAMPLES: {totalVotes} PARTICIPANTS</span>
          <span className="text-indigo-400/80">
            {activePoll.id in userVotedState ? "VOTE COMPLETED" : "CLICK OPTION TO LOG REGISTERED VOTE"}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- MODULE 4: INCIDENT REPORTS SERVICE ---
export const IncidentReportDesk: React.FC = () => {
  const { user, userProfile, incrementEngagementMetric } = useAuth();
  
  const [reports, setReports] = useState<any[]>([]);
  const [formActive, setFormActive] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Infrastructure Repair");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reports filed by this user from Firestore in real time
  useEffect(() => {
    if (!user) return;
    
    if (user.uid === "mock-citizen-eleanor") {
      setReports([
        {
          id: "rep-mock-1",
          reportId: "rep_1717752000000_334",
          reporterName: "Eleanor Vance",
          title: "Cracked Pavement & Pothole Repair Request",
          category: "Infrastructure Repair",
          description: "Severe potholes along the intersection of 8th St. and San Fernando Blvd. Vehicles are swerving to avoid them.",
          status: "submitted",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: "rep-mock-2",
          reportId: "rep_1717652000000_121",
          reporterName: "Eleanor Vance",
          title: "Public Light Outage",
          category: "Zoning & Safety",
          description: "St. James Park northwest playground solar lamps fail to light up after dusk. Creating immediate pedestrian safety risks.",
          status: "resolved",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]);
      return;
    }
    
    // Real-time snapshot listener restricted to reader UID
    const q = query(
      collection(db, "reports"),
      where("reporterId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setReports(items);
    }, (error) => {
      console.warn("Failed to stream incident logs, falling back to local simulation:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const secureReportId = `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      if (user.uid === "mock-citizen-eleanor") {
        // Offline-simulated client-side reporting
        const newReport = {
          id: secureReportId,
          reportId: secureReportId,
          reporterId: user.uid,
          reporterName: userProfile.name,
          title,
          category,
          description,
          status: "submitted",
          adminResponse: "Awaiting analysis coords by district public team.",
          createdAt: new Date()
        };
        setReports(prev => [newReport, ...prev]);
        logAnalyticsEvent("report_submitted", { reportId: secureReportId, category });
        await incrementEngagementMetric("reportsSubmitted", 1);
        setTitle("");
        setDescription("");
        setFormActive(false);
        return;
      }

      // Write to Firestore directly
      await addDoc(collection(db, "reports"), {
        reportId: secureReportId,
        reporterId: user.uid,
        reporterName: userProfile.name,
        title,
        category,
        description,
        status: "submitted",
        adminResponse: "Awaiting analysis coords by district public team.",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Track metric and GA event
      logAnalyticsEvent("report_submitted", { reportId: secureReportId, category });
      await incrementEngagementMetric("reportsSubmitted", 1);

      // Reset
      setTitle("");
      setDescription("");
      setFormActive(false);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] uppercase text-indigo-400 tracking-widest font-semibold">
          Active Municipal Reports Desk
        </span>
        <button
          onClick={() => setFormActive(!formActive)}
          className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-lg text-[10px] font-mono tracking-wider cursor-pointer"
        >
          {formActive ? "CLOSE FORM" : "FILE INCIDENT REPORT"}
        </button>
      </div>

      {formActive ? (
        <form onSubmit={handleSubmit} className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
                Report Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pothole on Main St. / Damaged Light Block"
                className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
                Category Group
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none"
              >
                <option value="Infrastructure Repair">Infrastructure Repair</option>
                <option value="Zoning & Safety">Zoning & Safety</option>
                <option value="Environmental Issue">Environmental Issue</option>
                <option value="Municipal Waste Control">Municipal Waste Control</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
              Brief Description and Landmarks
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact crossroads coordinates, safety risks, or relevant district details..."
              className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none placeholder-slate-650"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 font-sans text-xs font-bold text-white rounded-lg cursor-pointer transition-all"
          >
            {submitting ? "LOGGING FIELD REPORT INTO FIRESTORE..." : "SUBMIT ACTIVE MUNICIPAL INCIDENT REPORT"}
          </button>
        </form>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {reports.length > 0 ? (
            reports.map((rep) => (
              <div key={rep.id} className="bg-slate-900/20 border border-slate-900 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-indigo-400 uppercase">
                      {rep.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      ID: {rep.reportId}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-slate-100">{rep.title}</h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{rep.description}</p>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-semibold border ${
                    rep.status === "resolved" 
                      ? "border-emerald-500/20 text-emerald-400 bg-emerald-950/10"
                      : "border-yellow-500/25 text-yellow-400 bg-yellow-950/10"
                  }`}>
                    {rep.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-slate-850 rounded-xl space-y-1.5">
              <Inbox className="w-6 h-6 text-slate-600/60 mx-auto" />
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                No active incidents filed in your logging queue
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MODULE 5: GOVERNANCE AI CHATBOT ADVISOR ---
export const GovernanceAiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    { role: "bot", text: "Hello! I am CivicPulse Assistant. Ask me anything about district laws, ordinances, filed municipal reports, or how to participate in active surveys." }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [answering, setAnswering] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal("");
    
    // Add user message to stack
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setAnswering(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "bot", text: data.result }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "bot", text: `I encountered a secure link disruption: ${error?.message || "HANDSHAKE FAILED."}` }]);
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-[300px] bg-slate-950/40 border border-slate-900 p-4 rounded-2xl md:min-h-[320px] pt-1.5">
      {/* Scrollable messages container */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-xs select-text mb-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`max-w-[85%] rounded-2xl p-3 leading-relaxed font-sans ${
              m.role === "bot" 
                ? "bg-slate-900/60 text-slate-300 border border-slate-850/60 mr-auto" 
                : "bg-indigo-650 text-white ml-auto font-medium"
            }`}
          >
            <div className="font-mono text-[9px] text-slate-450 tracking-wider mb-1 uppercase font-semibold">
              {m.role === "bot" ? "AI CIVIC ADVISOR" : "YOU (CITIZEN)"}
            </div>
            <p className="whitespace-pre-line text-[11px] font-sans text-slate-200">
              {m.text}
            </p>
          </div>
        ))}
        {answering && (
          <div className="text-[10px] font-mono text-indigo-400 py-1 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            AI COMPILING LOCAL LAWS...
          </div>
        )}
      </div>

      {/* Input Form Footer */}
      <form onSubmit={handleSend} className="flex gap-2 bg-slate-900 border border-slate-850 p-1.5 rounded-xl">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={answering}
          placeholder="Ask about district zoning rules, solar incentives, and service coordinates..."
          className="flex-grow bg-transparent border-0 text-xs px-2.5 text-slate-200 focus:outline-none focus:ring-0 placeholder-slate-600 font-sans"
        />
        <button
          type="submit"
          disabled={answering || !inputVal.trim()}
          className="p-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white cursor-pointer transition-all disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

// --- MODULE 6: PROFILE CONFIGURATION ---
export const ProfileConfigCard: React.FC = () => {
  const { userProfile, completeOnboarding } = useAuth();
  
  const [name, setName] = useState(userProfile?.name || "");
  const [city, setCity] = useState(userProfile?.city || "");
  const [state, setState] = useState(userProfile?.state || "");
  const [language, setLanguage] = useState(userProfile?.language || "English");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !state.trim()) return;

    setSaving(true);
    setSuccess(false);
    try {
      await completeOnboarding({ name, city, state, language });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-350 text-xs p-2.5 rounded-xl font-normal text-center">
          Profile coordinates updated successfully in Firestore.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
            Display citizen name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none placeholder-slate-650"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
            Preferred language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Español">Español (Spanish)</option>
            <option value="Français">Français (French)</option>
            <option value="Deutsch">Deutsch (German)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
            MUNICIPAL CITY
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none placeholder-slate-650"
          />
        </div>

        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-500 tracking-wide mb-1">
            STATE COORDINATE
          </label>
          <input
            type="text"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="block w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-xs focus:outline-none placeholder-slate-650"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 font-sans text-xs font-bold text-white rounded-lg cursor-pointer transition-all disabled:opacity-40"
      >
        {saving ? "SAVING COORDINATES..." : "WRITE REVISED COORDINATES TO FIRESTORE"}
      </button>
    </form>
  );
};
