"use client";
import { useState } from "react";
import { List, SignOut, X, Bell, Globe } from "@phosphor-icons/react";
import { CAT_LABEL } from "./constants";
import { Button } from "./button";
import { GovBrandLockup } from "./GovEmblem";
import { useI18n, SUPPORTED_LANGUAGES } from "@/lib/i18n";

const NAV_MAP = {
  dash: "navDashboard",
  submit: "navReport",
  track: "navTrack",
  map: "navMap",
  rnd: "navRndLab",
  proposals: "navProposals",
  escrow: "navEscrow",
  admin_hud: "navAdminHud",
  audit: "navAuditTrail",
};

const TITLE_MAP = {
  "File a Civic Grievance": "fileGrievanceTitle",
  "My Grievance Tracking": "trackTitle",
  "Jharkhand Live Problem Map": "mapTitle",
};

const SUB_MAP = {
  "Direct civic grievance reporting with Groq AI automated triage and university-CSR matching": "welcomeSub",
  "AI-assisted intake with geo-tagging and automatic multi-stakeholder routing": "fileGrievanceSub",
  "Live SLA countdown and milestone tracking under Jharkhand JRTPS Act 2011": "trackSub",
  "24-District spatial cluster map with GPS-verified community distress signals": "mapSub",
};

function sanitizeSvg(raw) {
  if (typeof raw !== "string") return "";
  if (/<(?!path|polyline|circle|rect|line|polygon|g|\/)\w+/i.test(raw) || /on\w+=/i.test(raw)) {
    return "";
  }
  return raw;
}

export function Shell({
  user,
  roleName,
  expertise,
  active,
  navItems,
  onNav,
  onExit,
  title,
  sub,
  children,
}) {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t, cat } = useI18n();

  const changeLanguage = (code) => {
    setLang(code);
  };

  return (
    <div className="flex h-[100dvh] bg-paper font-body overflow-hidden relative text-ink">
      {/* Mobile Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-ink/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[264px] bg-green-2 text-white border-r border-green flex flex-col transition-transform duration-300 md:relative md:translate-x-0 overflow-hidden shrink-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-2 p-4 border-b border-white/10 shrink-0 min-w-0 overflow-hidden">
          <GovBrandLockup variant="dual" theme="dark" size="sm" href="/portal" compact />
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white rounded" 
            onClick={() => setOpen(false)}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-white/10 shrink-0">
          <div className="font-bold text-[13.5px] truncate">
            {user?.name || t("officialUser", "Official User")}
          </div>
          <div className="flex flex-col gap-1.5 mt-1.5">
            <span className="inline-flex w-max px-2 py-0.5 rounded-md bg-white/10 text-saffron text-[10px] uppercase tracking-widest font-bold font-mono">
              {roleName === "Citizen Portal"
                ? t("citizenPortal", roleName)
                : roleName === "University Portal"
                ? t("universityPortal", roleName)
                : roleName === "Industry Portal"
                ? t("industryPortal", roleName)
                : roleName === "Admin Portal" || roleName === "Government"
                ? t("adminPortal", roleName)
                : roleName}
            </span>
            {expertise && expertise.length > 0 && (
              <span className="text-[11px] text-white/60 leading-snug truncate" title={expertise.map((e) => cat(e) || e).join(" · ")}>
                {expertise.map((e) => cat(e) || e).join(" · ")}
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar" aria-label="Portal Navigation">
          {navItems.map(([id, label, icon, count]) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href="#"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive 
                    ? "bg-white text-green-2 shadow-sm font-bold" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  onNav(id);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? "2.2" : "1.8"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon) }}
                  className={`w-[18px] h-[18px] shrink-0 ${isActive ? "opacity-100" : "opacity-75"}`}
                />
                <span className="flex-1 truncate">{t(NAV_MAP[id] || label, label)}</span>
                {count !== undefined && count !== null && (
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 min-w-[20px] rounded-full text-[10px] font-bold ${
                    isActive ? "bg-green-tint text-green-2" : "bg-white/10 text-white/70"
                  }`}>
                    {count}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 text-[13px]"
            onClick={onExit}
          >
            <SignOut size={18} weight="bold" className="mr-1.5" /> {t("signOut", "Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-paper relative min-w-0" id="main-content">
        {/* Topbar */}
        <div className="shrink-0 min-h-[68px] bg-surface border-b border-line grid grid-cols-[auto_minmax(0,1fr)_auto] items-center px-4 md:px-7 gap-3 md:gap-4 sticky top-0 z-30">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-ink-2 hover:text-ink rounded-lg hover:bg-surface transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            <List size={22} weight="bold" />
          </button>

          <div className="flex flex-col justify-center min-w-0">
            <h1 className="font-display font-bold text-[16px] md:text-[19px] text-ink leading-tight truncate">
              {typeof title === "string" && title.startsWith("Welcome")
                ? `${t("welcome", "Welcome")}${user?.name ? `, ${user.name}` : ""}`
                : TITLE_MAP[title]
                ? t(TITLE_MAP[title], title)
                : title}
            </h1>
            {sub && (
              <div className="text-[11.5px] text-ink-3 truncate hidden sm:block">
                {SUB_MAP[sub] ? t(SUB_MAP[sub], sub) : sub}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {/* Multilingual Selector */}
            <div className="flex items-center gap-1 bg-surface-2 border border-line rounded px-1 py-0.5" role="group" aria-label="Portal Language">
              <Globe size={14} className="text-ink-3 ml-0.5 shrink-0 hidden sm:inline" />
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  title={item.name}
                  className={`px-1.5 py-0.5 text-[10px] md:text-[11px] font-semibold rounded transition-colors ${
                    lang === item.code
                      ? "bg-green text-white"
                      : "text-ink-2 hover:bg-surface"
                  }`}
                  onClick={() => changeLanguage(item.code)}
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.nativeName}</span>
                </button>
              ))}
            </div>

            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Notifications">
              <Bell size={19} />
            </Button>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-soft bg-green-tint text-green text-[9px] md:text-[10px] font-mono tracking-widest uppercase font-bold whitespace-nowrap">
              <i className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green animate-pulse" /> Live
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-7 lg:p-8 scroll-smooth custom-scrollbar">
          {children}
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-flow-col auto-cols-fr border-t border-line bg-surface px-1 pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Portal mobile navigation">
          {navItems.slice(0, 4).map(([id, label, icon, count]) => {
            const isActive = active === id;
            return (
              <button key={id} type="button" className={`relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold ${isActive ? "text-green" : "text-ink-3"}`} onClick={() => onNav(id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon }} className="h-5 w-5 shrink-0" />
                <span className="max-w-full truncate">{label.replace(/Citizen |Statewide |Corporate |Civic |My /g, "")}</span>
                {count !== undefined && count !== null && count > 0 && <span className="absolute right-3 top-1 min-w-4 rounded-full bg-red px-1 text-[9px] text-white">{count}</span>}
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
