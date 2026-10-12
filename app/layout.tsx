import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
    // suppressHydrationWarning: next-themes sets data-theme before hydration.
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
