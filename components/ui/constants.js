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

export const DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
  "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
  "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
  "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
];

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
