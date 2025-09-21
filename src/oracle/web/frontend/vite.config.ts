import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: [
      {
        find: "@magicolala/neo-chess-board/core",
        replacement: resolve(
          rootDir,
          "node_modules/neo-chess-board-ts-library/src/core",
        ),
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(rootDir, "main.ts"),
      name: "OracleBoard",
      fileName: () => "oracle-board.js",
      formats: ["es"],
    },
    outDir: resolve(rootDir, "../static"),
    emptyOutDir: false,
    assetsDir: ".",
    rollupOptions: {
      output: {
        chunkFileNames: "[name].js",
        entryFileNames: "oracle-board.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "oracle-board.css";
          }
          return "[name][extname]";
        },
      },
    },
  },
});
