import type { MetadataRoute } from "next";

// Web App Manifest. When the user opens PetSit in a mobile browser,
// the browser reads this file and offers "Add to Home Screen". Once
// installed, the icon launches the site full-screen with no URL bar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PetSit — UK pet, equine & rural directory",
    short_name: "PetSit",
    description:
      "Find trusted local pet sitters, dog walkers, farriers, livery yards, farm hands and more across the UK. Rated by real Google reviews.",
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
        // Maskable icons let Android crop into circles, squircles, etc.
        // without clipping the brand mark.
        purpose: "maskable",
      },
    ],
  };
}
