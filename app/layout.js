import "./globals.css";
import { Libre_Baskerville, IBM_Plex_Sans, IBM_Plex_Mono, Tiro_Devanagari_Hindi } from "next/font/google";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-display",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-body",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-mono",
  display: "swap",
});
const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--f-deva",
  display: "swap",
});

export const metadata = {
  title: "SAHYOG — Societal Innovation Collaboration Portal · SIH26043",
  description:
    "Crowdsource societal challenges and route them to the universities best equipped to solve them, with industry funding. SIH26043, Government of Jharkhand.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport = {
  themeColor: "#0B211C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libre.variable} ${plexSans.variable} ${plexMono.variable} ${tiroDeva.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <GlobalErrorBoundary>
          {children}
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
