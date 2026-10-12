import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Building things.",
  description: "Catalogue de formations en innovation et IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
