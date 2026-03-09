import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    plugins: [solidPlugin(), tsconfigPaths(), tailwindcss()],
    server: {
        port: 3000,
    },
    esbuild: {
        tsconfigRaw: {
            compilerOptions: {
                experimentalDecorators: true,
            },
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            tsconfigRaw: {
                compilerOptions: {
                    experimentalDecorators: true,
                },
            },
        },
        include: ["@cnbn/engine"],
    },
    build: {
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@gately": path.resolve(__dirname, "src"),
            "engine-components": path.resolve(
                __dirname,
                "src/shared/infrastructure/ui-engine/components",
            ),
            "engine-model": path.resolve(__dirname, "src/shared/infrastructure/ui-engine/model"),
        },
        dedupe: ["solid-js"],
    },
    worker: {
        format: "es",
    },
});
