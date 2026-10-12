import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URLS = {
  prod: "https://cookie-manager.blutic.club/cookie-manager/api/v1",
  preprod: "https://preprod-cookie-manager.blutic.club/cookie-manager/api/v1",
};

export default defineConfig(({ mode }) => {
  if (!API_URLS[mode]) {
    throw new Error(`Unknown build mode "${mode}". Use --mode prod | preprod`);
  }
  return {
  plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __API_BASE_URL__: JSON.stringify(API_URLS[mode]),
  },
  build: {
    // dist/prod/banner-sdk.js and dist/preprod/banner-sdk.js; legacy dist/banner-sdk.js is left alone
    outDir: `dist/${mode}`,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/main.jsx"),
      name: "CookieBannerSDK",
      formats: ["umd"],
      fileName: () => `banner-sdk.js`,
      cssFileName: "index",
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
};
});
