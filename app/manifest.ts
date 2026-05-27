import type { MetadataRoute } from "next";

// Web App Manifest. When the user opens HERD in a mobile browser,
// the browser reads this file and offers "Add to Home Screen". Once
// installed, the icon launches the site full-screen with no URL bar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HERD — UK pet, equine & rural directory",
    short_name: "HERD",
    description:
      "Helpers, Equine & Rural Directory. Find trusted local pet sitters, dog walkers, farriers, livery yards, farm hands and more across the UK. Rated by real Google reviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    orientation: "portrait",
    categories: ["lifestyle", "shopping", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
