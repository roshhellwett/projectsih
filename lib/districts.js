/*
 * The 24 districts of Jharkhand.
 *
 * Single source of truth shared by the client (district pickers, the coverage
 * explorer) and the server (submission validation). Previously duplicated
 * verbatim in `components/ui/constants.js` and `app/api/submit/route.js`, which
 * meant a district added in one place was silently rejected by the other.
 *
 * Dependency-free on purpose so it is safe to import from both bundles.
 */
export const DISTRICTS = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahibganj",
  "Seraikela-Kharsawan",
  "Simdega",
  "West Singhbhum",
];

export const DISTRICT_SET = new Set(DISTRICTS);
