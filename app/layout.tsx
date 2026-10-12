import type { Metadata } from "next";
import { inter, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Building things. — Formations",
    template: "%s · Building things.",
  },
  description: "Catalogue de formations en innovation et IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
