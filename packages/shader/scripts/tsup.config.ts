import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./transpile2ts.ts"],
  publicDir: false,
  clean: true,
  minify: true,
  format: ["cjs"],
});
