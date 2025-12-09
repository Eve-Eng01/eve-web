/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

// Google Maps API types
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: unknown;
      };
    };
  }
}

export {};
