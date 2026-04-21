import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["**/dist/**", "**/storybook-static/**"],
    singleQuote: true,
  },
  lint: {
    ignorePatterns: ["**/dist/**", "**/storybook-static/**"],
  },
  staged: {
    "*.{js,ts,cjs,mjs,jsx,tsx,json,jsonc,yaml,yml,md}": "vp check --fix",
  },
});
