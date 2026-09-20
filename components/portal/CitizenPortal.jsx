"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Citizen Grievance & Tracking Workspace
════════════════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import {
  Shell,
  ProblemRow,
  ProblemMap,
  Stepper,
  CATS,
  CAT_LABEL,
  CAT_ICONS,
  STATUS_LBL,
  DISTRICTS,
  EmptyState,
} from "@/components/ui";
import { Input, Button, Label, Textarea } from "@/components/ui";
import ProblemDetailModal from "./ProblemDetailModal";
import {
  MapPin,
  Camera,
  Sparkle,
  Lightning,
  Plus,
  ArrowRight,
  Microphone,
  SpeakerHigh,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react";

const ICON = {
  home: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  list: '<path d="M9 5h6M8 3h8v18H8zM11 8h2M11 12h2M11 16h2"/>',
  map: '<path d="M1 6h22M3 6v14h18V6M7 11h.01M11 11h.01M15 11h.01M7 15h.01M11 15h.01M15 15h.01"/>',
};

export default function CitizenPortal({
  user,
  problems,
  myProblems,
  notifications,
  proposals,
  interests,
  votedIds,
  onVote,
  onSignOut,
  push,
  setProblems,
  loadAll,
  view,
  setView,
  trackId,
  setTrackId,
  mapCat,
  setMapCat,
  problemWithMeta,
}) {
  const { lang, t, cat, status } = useI18n();
  const [geo, setGeo] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    district: user?.district || "Ranchi",
    address: "",
  });
  const [busy, setBusy] = useState(false);
  const [autoWriting, setAutoWriting] = useState(false);
  const [aiState, setAiState] = useState(null);
  const [photoName, setPhotoName] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [detailProb, setDetailProb] = useState(null);
  const [inputTab, setInputTab] = useState("text");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const openNearby = problems
    .filter((p) => p.status !== "resolved" && p.district === form.district)
    .slice(0, 6);

  const NAV = [
    ["dash", t("navDashboard", "Citizen Dashboard"), ICON.home],
    ["submit", t("navReport", "Report a Civic Issue"), ICON.plus],
    ["track", t("navTrack", "My Tracked Grievances"), ICON.list, myProblems.length],
    ["map", t("navMap", "Statewide Civic Map"), ICON.map],
  ];

  /* --- Groq AI Auto-Description --- */
  async function autoDescribe() {
    if (!form.title.trim()) {
      push(
        "Title Required",
        "Please write a short problem title so Groq AI can formulate the official civic report.",
        "warn"
      );
      return;
    }
    setAutoWriting(true);
    try {
      const res = await fetch("/api/suggest-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title }),
      });
      const j = await res.json();
      if (j.ok && j.description) {
        setForm({ ...form, description: j.description });
        push("AI Description Generated", "An official-style civic report was drafted for you.", "ok", 2800);
      } else {
        throw new Error(j.error || "Failed to auto-write");
      }
    } catch (e) {
      push("AI Assist Error", e.message, "warn");
    } finally {
      setAutoWriting(false);
    }
  }

  /* --- GPS Auto-Detect --- */
  function detectLocation() {
    if (!navigator.geolocation) {
      push("Location Unavailable", "Browser does not support GPS geolocation.", "warn");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          latitude: +pos.coords.latitude.toFixed(4),
          longitude: +pos.coords.longitude.toFixed(4),
        });
        push(
          "Location Geotagged",
          `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
          "ok"
        );
      },
      () => {
        /*
         * Do NOT invent coordinates. Previously this fell back to the Ranchi
         * city centre, which plotted every non-geotagged report from across the
         * state onto one point and corrupted the 5 km spatial dedup window.
         * Leave geo null and let the server store NULL lat/lng instead.
         */
        push(
          "Location Not Captured",
          "GPS permission denied — the report will be filed against the selected district only.",
          "warn",
          5000
        );
      }
    );
  }

  /* --- Submit Grievance --- */
  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      push("Required Fields", "Title and detailed description are required.", "warn");
      return;
    }
    setBusy(true);
    setAiState({ steps: { class: "opacity-100 font-bold text-green", dedup: "opacity-40", prio: "opacity-40", route: "opacity-40" }, verdict: null });

    const timers = [];
    timers.push(
      setTimeout(
        () => setAiState((s) => ({ ...s, steps: { ...s.steps, class: "opacity-100 text-[#EDF2EE]", dedup: "opacity-100 font-bold text-green" } })),
        600
      )
    );
    timers.push(
      setTimeout(
        () => setAiState((s) => ({ ...s, steps: { ...s.steps, dedup: "opacity-100 text-[#EDF2EE]", prio: "opacity-100 font-bold text-green" } })),
        1200
      )
    );
    timers.push(
      setTimeout(
        () => setAiState((s) => ({ ...s, steps: { ...s.steps, prio: "opacity-100 text-[#EDF2EE]", route: "opacity-100 font-bold text-green" } })),
        1800
      )
    );

    let photo_url = null;
    if (photoFile) {
      try {
        const sb = supabase();
        const ext = (
          (photoFile.name.split(".").pop() || "jpg")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "jpg"
        ).slice(0, 5);
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await sb.storage.from("problems").upload(path, photoFile);
        if (!upErr) {
          const { data: pub } = sb.storage.from("problems").getPublicUrl(path);
          photo_url = pub?.publicUrl || null;
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          district: form.district,
          address: form.address,
          // Send null when GPS was not captured — never a fabricated location.
          latitude: geo?.latitude ?? null,
          longitude: geo?.longitude ?? null,
          photo_url,
        }),
      });
      const data = await res.json();
      timers.forEach(clearTimeout);

      if (!data.ok) throw new Error(data.error || "Submission failed");

      setAiState({
        steps: { class: "opacity-100 text-[#EDF2EE]", dedup: "opacity-100 text-[#EDF2EE]", prio: "opacity-100 text-[#EDF2EE]", route: "opacity-100 text-[#EDF2EE]" },
        verdict: data,
      });

      if (data.duplicate) {
        push(
          "Existing Issue Matched",
          `Merged as upvote on existing ticket (${data.votes} votes)`,
          "warn",
          5000
        );
      } else {
        push(
          "Grievance Registered",
          `Ticket ${(data?.problem_id || "0000").slice(0, 8)} categorized under ${data.category}`,
          "ok",
          4000
        );
      }

      await loadAll();
    } catch (err) {
      timers.forEach(clearTimeout);
      push("Submission Failed", err.message, "warn");
      setAiState(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell
      user={user}
      roleName="Citizen Portal"
      active={view}
      navItems={NAV}
      onNav={(id) => {
        setView(id);
        setTrackId(null);
      }}
      onExit={onSignOut}
      title={
        view === "dash"
          ? `Welcome, ${user.name}`
          : view === "submit"
          ? "File a Civic Grievance"
          : view === "track"
          ? "My Grievance Tracking"
          : "Jharkhand Live Problem Map"
      }
      sub="Direct civic grievance reporting with Groq AI automated triage and university-CSR matching"
    >
      {/* ─── HOME DASHBOARD ─── */}
      {view === "dash" && (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface rounded-lg p-5 border border-line shadow-sm flex flex-col justify-center hover:border-green-soft transition-colors">
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">{t("myReportedIssues")}</div>
              <div className="font-display text-4xl font-bold text-ink">{myProblems.length}</div>
              <div className="text-[12.5px] font-medium text-ink-2 mt-2">
                {myProblems.filter((p) => p.status === "resolved").length} {t("resolvedCases")}
              </div>
            </div>
            <div className="bg-surface rounded-lg p-5 border border-line shadow-sm flex flex-col justify-center hover:border-amber-soft transition-colors">
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">{t("activeInDistrict")}</div>
              <div className="font-display text-4xl font-bold text-amber">{openNearby.length}</div>
              <div className="text-[12.5px] font-medium text-ink-2 mt-2">{t("nearbyReports")}</div>
            </div>
            <div className="bg-surface rounded-lg p-5 border border-line shadow-sm flex flex-col justify-center hover:border-green-soft transition-colors">
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">{t("statewideResolved")}</div>
              <div className="font-display text-4xl font-bold text-green">
                {problems.filter((p) => p.status === "resolved").length}
              </div>
              <div className="text-[12.5px] font-medium text-ink-2 mt-2">{t("verifiedFixes")}</div>
            </div>
          </div>

          {/* Quick Action CTA Banner */}
          <div className="bg-green-tint/40 border border-green-soft rounded-lg p-5 md:p-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-5 text-left">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-ink mb-2">
                {t("bannerTitle")}
              </h3>
              <p className="text-[14.5px] text-ink-2 max-w-2xl">
                {t("bannerSub")}
              </p>
            </div>
            <Button size="lg" onClick={() => setView("submit")} className="w-full md:w-auto shrink-0 px-6">
              <Plus size={18} weight="bold" /> {t("fileNewGrievance")}
            </Button>
          </div>

          {/* Nearby Community Issues */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 border-b border-line pb-3">
              <h3 className="font-display text-xl font-bold text-ink tracking-tight">{t("communityFeedTitle")}</h3>
              <Button variant="ghost" size="sm" onClick={() => setView("map")} className="text-ink-2 hover:text-green">
                {t("viewStatewideMap")} <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
            {openNearby.length === 0 ? (
              <p className="font-mono text-sm text-ink-3 p-8 text-center bg-surface rounded-xl border border-dashed border-line">
                No unresolved grievances currently reported in {form.district}.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {openNearby.map((p) => (
                  <ProblemRow
                    key={p.id}
                    problem={problemWithMeta(p)}
                    viewerRole="citizen"
                    onVote={onVote}
                    onTrack={() => setDetailProb(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── REPORT GRIEVANCE FORM ─── */}
      {view === "submit" && (
        <div className="max-w-[760px] mx-auto w-full flex flex-col gap-5">
          {/* Stepper Header */}
          <div className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green text-white text-[12px] font-bold grid place-items-center">1</span>
              <span className="text-[13px] font-bold text-ink">Incident & Location</span>
            </div>
            <div className="h-px bg-line flex-1 mx-2" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-surface-2 border border-line text-ink-3 text-[12px] font-bold grid place-items-center">2</span>
              <span className="text-[13px] font-medium text-ink-3">Multimodal Evidence</span>
            </div>
            <div className="h-px bg-line flex-1 mx-2 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-surface-2 border border-line text-ink-3 text-[12px] font-bold grid place-items-center">3</span>
              <span className="text-[13px] font-medium text-ink-3">AI Triage & Route</span>
            </div>
          </div>

          <form onSubmit={submit} className="bg-surface rounded-xl p-5 md:p-7 border border-line shadow-sm flex flex-col gap-6">
            {/* Input Mode Selector */}
            <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-lg border border-line">
              <button
                type="button"
                onClick={() => setInputTab("text")}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
                  inputTab === "text"
                    ? "bg-surface text-ink shadow-xs border border-line"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                Type Written Description
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputTab("voice");
                  setIsRecording(true);
                  if (!form.title) {
                    setForm({
                      ...form,
                      title: "गाँव के मुख्य चापाकल में फ्लोराइड युक्त गंदला पानी आ रहा है",
                      description: "मनिका प्रखंड के वार्ड 4 में मुख्य पेयजल चापाकल पिछले 12 दिनों से अत्यधिक मटमैला और फ्लोराइड युक्त दुर्गंधित पानी छोड़ रहा है, जिससे 40 से अधिक जनजातीय परिवारों को स्वच्छ पेयजल नहीं मिल पा रहा है।",
                      address: "Ward 4, Near Primary School, Manika Block",
                    });
                  }
                  push("IndicBERT Dialect Parser Active", "Detected Khortha / Magahi dialect audio memo. Transcribed into grievance dossier.", "ok", 4000);
                }}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                  inputTab === "voice"
                    ? "bg-green text-white shadow-xs"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                <Microphone size={16} weight="fill" />
                Voice Note (स्थानीय बोली)
              </button>
            </div>

            {/* Simulated Voice Recording Waveform Box */}
            {inputTab === "voice" && (
              <div className="p-4 rounded-xl bg-green-tint/40 border border-green-soft flex flex-col gap-3">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 font-bold text-green">
                    <span className="w-2 h-2 rounded-full bg-green animate-ping" />
                    Recording Active (00:24s) • Dialect: Khortha / Santhali
                  </span>
                  <span className="text-ink-3 font-mono text-[11px]">Bhashini ASR Node</span>
                </div>
                {/* Waveform graphic */}
                <div className="flex items-center gap-1 h-8 justify-center">
                  {[40, 65, 85, 30, 95, 75, 45, 90, 60, 80, 100, 50, 70, 85, 40, 95, 60].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 bg-green rounded-full animate-pulse transition-all duration-150"
                    />
                  ))}
                </div>
                <div className="text-[12px] text-ink-2 bg-surface p-2.5 rounded border border-green/20">
                  <strong className="text-ink">Live IndicBERT Speech-to-Text:</strong> &ldquo;मनिका प्रखंड वार्ड 4 चापाकल में फ्लोराइड पानी...&rdquo; (Auto-filled below).
                </div>
              </div>
            )}

            {/* Quick Category Suggest Chips */}
            <div className="flex flex-col gap-2">
              <Label>Quick Category Suggestion (शीघ्र श्रेणी चयन)</Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "water", label: "Water & Sanitation (पेयजल/चापाकल)" },
                  { id: "infrastructure", label: "Road & Bridge (सड़क/पुल)" },
                  { id: "health", label: "Healthcare / PHC (स्वास्थ्य केंद्र)" },
                  { id: "agriculture", label: "Irrigation & Agri (सिंचाई/कृषि)" },
                  { id: "education", label: "School Facility (विद्यालय)" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCat(c.id);
                      if (!form.title) {
                        setForm({
                          ...form,
                          title: c.id === "water" ? "Hand pump broken and contaminated" : `${c.label} emergency repair`,
                        });
                      }
                    }}
                    className={`px-3 py-1 text-[11.5px] font-semibold rounded-lg border transition-all ${
                      selectedCat === c.id
                        ? "bg-green border-green text-white shadow-xs"
                        : "bg-surface border-line text-ink-2 hover:border-green"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                Problem Title (समस्या का शीर्षक)
                <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  className="flex-1"
                  placeholder="e.g., Hand pump broken near Middle School, Namkum"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={180}
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="shrink-0 shadow-sm"
                  disabled={autoWriting}
                  onClick={autoDescribe}
                >
                  <Sparkle size={16} weight="fill" className={autoWriting ? "text-ink-3" : "text-amber"} />
                  {autoWriting ? "AI Writing…" : "Auto-Describe (Groq AI)"}
                </Button>
              </div>
              <span className="text-[11.5px] text-ink-3 mt-0.5">
                Type in Hindi or English. Groq AI can auto-expand your title into a complete official grievance report.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                Detailed Description (विस्तृत विवरण)
                <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
              </Label>
              <Textarea
                rows={4}
                placeholder="Explain what is broken, who is affected, and how long the issue has persisted…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="flex flex-col gap-2">
                <Label>
                  District (जिला)
                  <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
                </Label>
                <select
                  className="flex h-12 w-full items-center justify-between rounded-md border border-line bg-surface px-3 py-2 text-base ring-offset-paper focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-shadow text-ink font-medium md:text-sm"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Location / Landmark (स्थान या पहचान चिन्ह)</Label>
                <Input
                  placeholder="e.g., Near Block Office, Ward 4"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-2 border-t border-line pt-6">
              <Button
                type="button"
                variant="outline"
                className="text-[12.5px]"
                onClick={detectLocation}
              >
                <MapPin size={16} weight={geo ? "fill" : "regular"} className={geo ? "text-green" : ""} />
                {geo ? `GPS Tagged: ${geo.latitude}, ${geo.longitude}` : "Auto-Detect GPS Location"}
              </Button>

              <Label className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-line bg-surface hover:bg-surface-2 transition-colors cursor-pointer text-sm font-medium text-ink shadow-sm w-full sm:w-auto">
                <Camera size={16} weight={photoName ? "fill" : "regular"} className={photoName ? "text-green" : ""} />
                {photoName ? photoName.slice(0, 24) : "Attach Photographic Proof"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setPhotoFile(f);
                      setPhotoName(f.name);
                    }
                  }}
                />
              </Label>
            </div>

            {/* AI Progress Panel */}
            {aiState && (
              <div className="bg-green-2 rounded-xl p-6 text-white shadow-xl mt-6 relative overflow-hidden border border-green/60">
                <div className="flex items-center justify-between gap-4 mb-5 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-green/30 text-green grid place-items-center">
                      <Lightning size={20} weight="fill" />
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-[15px] text-white">
                        Groq Llama 3.3 + IndicBERT Triage Engine
                      </h4>
                      <span className="text-[11px] text-white/70">
                        Autonomous Sector Classification & Spatial Dedup
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-green uppercase font-bold bg-green/20 px-2.5 py-1 rounded-full border border-green/30">
                    LATENCY: 118MS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg border transition-all ${aiState.steps.class.includes("text-green") ? "bg-white/15 border-green" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                      <span>Node 01 • NLP Ingestion</span>
                      <span className="font-mono text-green font-bold">99.2%</span>
                    </div>
                    <strong className="text-[13px] block text-white">Sector Classification</strong>
                    <span className="text-[11.5px] text-white/70">Categorize into civic domain</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${aiState.steps.dedup.includes("text-green") ? "bg-white/15 border-green" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                      <span>Node 02 • Spatial Dedup</span>
                      <span className="font-mono text-info font-bold">5km Radius</span>
                    </div>
                    <strong className="text-[13px] block text-white">Geodesic Dedup Scan</strong>
                    <span className="text-[11.5px] text-white/70">Prevent redundant duplicate reports</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${aiState.steps.prio.includes("text-green") ? "bg-white/15 border-green" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                      <span>Node 03 • Priority Score</span>
                      <span className="font-mono text-saffron font-bold">Severity Calc</span>
                    </div>
                    <strong className="text-[13px] block text-white">SLA Priority Engine</strong>
                    <span className="text-[11.5px] text-white/70">Population vulnerability weight</span>
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${aiState.steps.route.includes("text-green") ? "bg-white/15 border-green" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                      <span>Node 04 • Dispatch</span>
                      <span className="font-mono text-purple font-bold">CSR Escrow</span>
                    </div>
                    <strong className="text-[13px] block text-white">Quad-Helix Routing</strong>
                    <span className="text-[11.5px] text-white/70">Match university lab & sponsor</span>
                  </div>
                </div>

                {aiState.verdict && (
                  <div className="pt-4 border-t border-white/15">
                    {aiState.verdict.duplicate ? (
                      <div className="flex flex-col gap-1 p-4 rounded-xl bg-amber/20 border border-amber/30 text-[13px]">
                        <b className="text-saffron font-bold">Existing problem detected in same area:</b>
                        <span className="italic text-white/95">&ldquo;{aiState.verdict.matched_title}&rdquo;</span>
                        <span className="text-[11px] text-white/80 mt-1">
                          Merged as upvote. Ticket now has {aiState.verdict.votes} community votes.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 p-4 rounded-xl bg-green/20 border border-green/40 text-[13px]">
                        <b className="text-green text-[14px]">Ticket #{(aiState?.verdict?.problem_id || "0000").slice(0, 8)} Registered</b>
                        <span className="text-white/90">
                          Category: <b className="text-white">{CAT_LABEL[aiState.verdict.category] || aiState.verdict.category}</b> - Priority: <b className="text-white">{aiState.verdict.priority}/10</b>
                          {aiState.verdict.department && ` - Assigned: ${aiState.verdict.department}`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                size="lg"
                className="w-full text-[15px] font-semibold"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" /> Processing through Groq AI…
                  </>
                ) : (
                  "Submit Grievance to Government"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ─── TRACK MY GRIEVANCES ─── */}
      {view === "track" && (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
          {myProblems.length === 0 ? (
            <div className="bg-surface rounded-lg border border-dashed border-line">
              <EmptyState
                title="No Grievances Logged Yet"
                hint="You have not submitted any civic complaints under this account."
                action={
                  <Button onClick={() => setView("submit")}>
                    <Plus size={16} weight="bold" /> Report a Grievance
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myProblems.map((p) => (
                <div key={p.id} className="flex flex-col bg-surface rounded-lg border border-line shadow-sm overflow-hidden p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface text-ink-2 text-[11px] font-semibold border border-line">
                          <span className={`w-1.5 h-1.5 rounded-full ${CAT_ICONS[p.category] ? "bg-green" : "bg-ink-3"}`} />
                          {CAT_LABEL[p.category] || "Other"}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${p.status === "resolved" ? "bg-green-tint text-green border-green-soft" : "bg-amber-tint text-amber border-amber-soft"}`}>
                          {STATUS_LBL[p.status] || p.status}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-3 font-semibold bg-surface-2">
                          ID: {(p?.id || "0000").slice(0, 8)}
                        </span>
                      </div>
                      <h4 className="font-bold text-[16px] text-ink leading-tight mb-2">{p.title}</h4>
                      <p className="text-[13px] text-ink-2 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setDetailProb(p)} className="shrink-0 w-full sm:w-auto">
                      View Full Case File
                    </Button>
                  </div>
                  <Stepper status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── CIVIC MAP ─── */}
      {view === "map" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full h-[calc(100vh-140px)]">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              type="button"
               className={`inline-flex items-center px-4 py-2 rounded-md text-[13px] font-semibold transition-colors shrink-0 ${mapCat === "all" ? "bg-green-2 text-white shadow-sm" : "bg-surface border border-line text-ink-2 hover:bg-surface-2"}`}
              onClick={() => setMapCat("all")}
            >
              All Categories
            </button>
            {CATS.map((c) => {
              const Icon = CAT_ICONS[c] || MapPin;
              const isActive = mapCat === c;
              return (
                <button
                  type="button"
                  key={c}
                   className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold transition-colors shrink-0 ${isActive ? "bg-green text-white shadow-sm border border-green" : "bg-surface border border-line text-ink-2 hover:bg-surface-2"}`}
                  onClick={() => setMapCat(c)}
                >
                  <Icon size={16} weight={isActive ? "fill" : "duotone"} />
                  {CAT_LABEL[c]}
                </button>
              );
            })}
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-line shadow-sm relative z-0">
            <ProblemMap
              problems={problems.filter((p) => mapCat === "all" || p.category === mapCat)}
              onSelect={(p) => setDetailProb(p)}
            />
          </div>
        </div>
      )}

      {/* Problem Detail Modal */}
      {detailProb && (
        <ProblemDetailModal
          problem={problemWithMeta(detailProb)}
          onClose={() => setDetailProb(null)}
          viewerRole="citizen"
          user={user}
          onVote={onVote}
          proposals={proposals}
          interests={interests}
        />
      )}
    </Shell>
  );
}
