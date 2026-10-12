import path from "node:path";
import type { NextConfig } from "next";

// Rebuild content with Velite on change during dev (initial builds run in npm scripts).
const isDev = process.argv.includes("dev");
if (!process.env.VELITE_STARTED && isDev) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((velite) => velite.build({ watch: true, clean: false }));
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
