"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CAT_LABEL, Input, Button, Label } from "@/components/ui";
import {
  User,
  GraduationCap,
  Briefcase,
  Bank,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle,
  WarningCircle,
  Fingerprint,
} from "@phosphor-icons/react";

const ROLES = [
  { id: "citizen", icon: User, label: "Citizen", hi: "नागरिक", hint: "Report & track civic problems" },
  { id: "university", icon: GraduationCap, label: "University", hi: "विश्वविद्यालय", hint: "Solve domain-routed issues" },
  { id: "industry", icon: Briefcase, label: "Industry / CSR", hi: "उद्योग सीएसआर", hint: "Fund & mentor project proposals" },
  { id: "admin", icon: Bank, label: "Government", hi: "प्रशासन", hint: "Statewide analytics & audit" },
];

const CATS = Object.keys(CAT_LABEL).filter((c) => c !== "other");

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState(params.get("role") || "citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [domains, setDomains] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [setupHint, setSetupHint] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setSetupHint(!d.ok))
      .catch(() => setSetupHint(true));
  }, []);

  const toggleDomain = (d) =>
    setDomains((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const sb = supabase();
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your full name / institution name.");
        if (role === "university" && domains.length === 0)
          throw new Error("Please select at least one department domain of expertise.");
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (data?.user) {
          await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              auth_id: data.user.id,
              name,
              email,
              role,
              institution_name: role === "citizen" ? null : institution || name,
              domain_expertise: role === "university" ? domains : [],
              focus_areas: role === "industry" ? domains : [],
            }),
          });
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/portal");
    } catch (e2) {
      const msg = String(e2?.message || e2);
      if (msg.includes("Failed to fetch") || msg.includes("fetch")) {
        setErr(
          "Supabase environment keys pending. Fill NEXT_PUBLIC_SUPABASE_URL in .env or use the 1-tap demo logins below."
        );
      } else {
        setErr(msg || "Authentication failed. Please verify credentials.");
      }
      setBusy(false);
    }
  }

  async function demoLoginAs(r) {
    setErr(null);
    setBusy(true);
    try {
      const resp = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: r }),
      });
      const j = await resp.json();
      if (!j.ok) throw new Error(j.error || "Demo login failed");
      const sb = supabase();
      const { error } = await sb.auth.signInWithPassword({ email: j.email, password: j.password });
      if (error) throw error;
      router.push("/portal");
    } catch (e2) {
      const msg = String(e2?.message || e2);
      setErr(
        msg.includes("fetch")
          ? "Supabase database not connected yet. Check .env configuration or run schema.sql."
          : msg
      );
      setBusy(false);
    }
  }

  return (
    <div id="main-content" className="min-h-dvh grid grid-cols-1 lg:grid-cols-[minmax(340px,0.8fr)_minmax(480px,1.2fr)] bg-paper text-ink font-body">
      {/* Left Pillar: Government Identity & Trust Shield */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-green-2 text-white p-10 xl:p-14">
        
        <div className="flex flex-col gap-6 relative z-10">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-wide">
            <span className="w-9 h-9 rounded-md bg-saffron text-green-2 grid place-items-center font-deva text-base shrink-0">सहयोग</span>
            <span className="text-xl">
              <b>SAHYOG</b> <span className="text-sm text-white/60 font-normal">झारखण्ड सरकार</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs text-white/90 w-max bg-white/5 px-3 py-1 rounded-md border border-white/10 mt-4">
            <span className="bg-green text-white px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">SIH26043</span> Government of Jharkhand
          </div>

          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight mt-2 text-balance">Every societal challenge, matched to the right minds.</h2>

          <Image
            src="/illustrations/secure-access.png"
            alt=""
            aria-hidden="true"
            width={1024}
            height={1024}
            priority
            className="w-[210px] xl:w-[250px] h-auto self-center float-soft -my-2"
          />
          <p className="text-white/70 max-w-md text-sm leading-relaxed">
            Citizens report grievances. Groq AI triages and routes in real-time.
            State universities build solutions. Industry CSR provides funding.
            State administrative officers oversee transparent outcomes.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <div className="flex items-center gap-3 text-[13px] text-white/85">
              <ShieldCheck size={20} weight="fill" className="text-green shrink-0" />
              <span>GIGW 3.0 & DPDPA 2023 Compliant Citizen Data Shield</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-white/85">
              <Fingerprint size={20} weight="fill" className="text-amber shrink-0" />
              <span>DigiLocker & Aadhaar e-KYC Integration Ready</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-white/85">
              <CheckCircle size={20} weight="fill" className="text-green shrink-0" />
              <span>Immutable Audit Trail on State Cloud Infrastructure</span>
            </div>
          </div>
        </div>

        <div className="flex gap-8 flex-wrap relative z-10 mt-10">
          <div>
            <b className="block font-display text-2xl font-bold">4</b>
            <span className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">Unified Roles</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-bold">7</b>
            <span className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">Civic Sectors</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-bold">24</b>
            <span className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">Districts</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-bold">₹0</b>
            <span className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">Tech Cost</span>
          </div>
        </div>
      </div>

      {/* Right Column: High-Performance Auth Card */}
      <div className="flex items-start lg:items-center justify-center p-4 sm:p-7 lg:p-9 overflow-y-auto bg-surface lg:bg-paper">
        <div className="w-full max-w-[500px] bg-surface rounded-lg p-2 sm:p-7 lg:p-8 lg:shadow-sm lg:border lg:border-line">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-4 md:hidden">
              <span className="w-8 h-8 rounded-md bg-green-2 text-white grid place-items-center font-deva text-sm">सहयोग</span>
              <span className="font-bold">SAHYOG Portal</span>
            </div>
            <h1 className="font-display text-2xl font-bold">
              {mode === "signin" ? "Sign in to SAHYOG" : "Create Official Account"}
            </h1>
            <p className="text-sm text-ink-2 mt-1">
              Secure citizen and institutional access to the Jharkhand Civic Innovation Grid.
            </p>
          </div>

          {setupHint && (
            <div className="flex gap-3 items-start p-4 rounded-xl bg-amber-tint border border-amber/20 text-[13px] text-[#6E5514] mb-6">
              <Info size={20} weight="duotone" className="shrink-0 mt-0.5" />
              <div>
                <strong>Setup note:</strong> Supabase keys are not configured in .env. 
                Use the <strong>1-Tap Demo Logins</strong> below to explore all 4 roles instantly!
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-surface-2 rounded-lg border border-line mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              className={`py-2 text-[13px] font-semibold rounded-md transition-all duration-200 ${mode === "signin" ? "bg-surface text-ink shadow-sm ring-1 ring-black/5" : "text-ink-3 hover:text-ink"}`}
              onClick={() => setMode("signin")}
            >
              Sign In (लॉग इन)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`py-2 text-[13px] font-semibold rounded-md transition-all duration-200 ${mode === "signup" ? "bg-surface text-ink shadow-sm ring-1 ring-black/5" : "text-ink-3 hover:text-ink"}`}
              onClick={() => setMode("signup")}
            >
              Register (नया खाता)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Select Your Portal Role</Label>
                  <div className="grid grid-cols-2 gap-2.5 mt-1">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <button
                          type="button"
                          key={r.id}
                           className={`flex min-w-0 items-center gap-2.5 p-3 rounded-md border transition-all duration-200 text-left relative group ${isSelected ? "border-green bg-green-tint/50" : "border-line bg-surface hover:border-green-soft"}`}
                          onClick={() => setRole(r.id)}
                        >
                          <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 transition-colors ${isSelected ? "bg-green text-white" : "bg-green/10 text-green group-hover:bg-green/15"}`}>
                            <Icon size={20} weight={isSelected ? "fill" : "duotone"} />
                          </div>
                          <div className="flex flex-col">
                            <strong className="text-[13px] text-ink leading-snug">{r.label}</strong>
                            <span className="text-[10.5px] text-ink-3">{r.hi}</span>
                          </div>
                          {isSelected && <span className="absolute top-1.5 right-2 text-[11px] font-bold text-green">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <Label>
                    {role === "citizen" ? "Full Name (पूरा नाम)" : "Institution / Organization Name"}
                    <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "citizen" ? "e.g. Ananya Soren" : "e.g. BIT Mesra / Tata Steel CSR"}
                    required
                  />
                </div>

                {(role === "university" || role === "industry") && (
                  <div className="flex flex-col gap-2 mt-1">
                    <Label>
                      {role === "university" ? "Department Domains of Expertise" : "CSR Focus Sectors"}
                      <span className="font-normal text-[10px] text-ink-3 ml-2">· select one or more</span>
                    </Label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {CATS.map((c) => (
                         <button
                         type="button"
                         key={c}
                         className={`px-3 py-1.5 text-[11.5px] font-semibold border rounded-lg transition-all ${domains.includes(c) ? "bg-green border-green text-white shadow-sm" : "border-line bg-surface text-ink-2 hover:border-green"}`}
                         onClick={() => toggleDomain(c)}
                       >
                         {CAT_LABEL[c]}
                       </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col gap-2 mt-1">
              <Label>
                Official Email Address
                <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@jharkhand.gov.in / user@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <Label>
                Password
                <span className="font-normal text-[10px] text-ink-3 ml-2">· min 6 characters</span>
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {err && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700 mt-2">
                <WarningCircle size={18} weight="fill" className="shrink-0 text-red-600" />
                <div>{err}</div>
              </div>
            )}

            <Button type="submit" variant="default" size="lg" className="w-full mt-4" disabled={busy}>
              {busy ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" /> Authenticating…
                </>
              ) : mode === "signin" ? (
                <>
                  Sign In to Dashboard <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Create Account & Enter <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* 1-Tap Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-line">
            <div className="relative text-center mb-5">
              <span className="bg-surface px-3 font-mono text-[10px] text-ink-3 tracking-widest font-semibold uppercase relative z-10">EXPLORE ALL 4 ROLES · 1-TAP DEMO</span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-line -z-10" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <Button
                    key={r.id}
                    type="button"
                    variant="outline"
                    className="justify-start px-4 h-11"
                    disabled={busy}
                    onClick={() => demoLoginAs(r.id)}
                  >
                    <Icon size={16} weight="bold" className="shrink-0 text-ink-2" />
                    <span>{r.label}</span>
                  </Button>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-3 text-center mt-3">
              Demo accounts pre-seeded with test grievances across 24 Jharkhand districts.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3 hover:text-green transition-colors font-medium">
              <ArrowLeft size={14} /> Return to Home Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh grid place-items-center font-mono text-ink-3 bg-surface">
          Loading SAHYOG Authentication…
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
