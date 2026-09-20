export const CATS = ["education", "health", "agriculture", "water", "infrastructure", "environment", "other"];

export const CAT_LABEL = {
  education: "Education",
  health: "Health",
  agriculture: "Agriculture",
  water: "Water Supply",
  infrastructure: "Infrastructure",
  environment: "Environment",
  other: "Other",
};

export const CAT_VAR = {
  education: "--c-edu",
  health: "--c-health",
  agriculture: "--c-agri",
  water: "--c-water",
  infrastructure: "--c-infra",
  environment: "--c-env",
  other: "--c-other",
};

import {
  GraduationCap,
  FirstAid,
  Plant,
  Drop,
  Bridge,
  Tree,
  MapPin,
} from "@phosphor-icons/react";

export const CAT_ICONS = {
  education: GraduationCap,
  health: FirstAid,
  agriculture: Plant,
  water: Drop,
  infrastructure: Bridge,
  environment: Tree,
  other: MapPin,
};

export const STATUS_FLOW = ["submitted", "routed", "in_review", "proposal_submitted", "in_progress", "resolved"];

export const STATUS_LBL = {
  submitted: "Submitted",
  routed: "Routed to University",
  in_review: "Under Review",
  proposal_submitted: "Proposal In",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// The 24 Jharkhand districts live in lib/districts.js so the client pickers and
// the server-side submission validator can never drift apart.
export { DISTRICTS } from "@/lib/districts";

export const fmtINR = (n) => "₹" + (n || 0).toLocaleString("en-IN");

export const initials = (m) =>
  m
    ? m
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "SE";
