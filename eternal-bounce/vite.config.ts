import { defineConfig, ResolvedConfig, type Plugin } from "vite";
import { AssetPack } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";

function assetpackPlugin(): Plugin {
  const apConfig = {
    entry: "./raw-assets",
    output: "./public/assets",
    pipes: [
      ...pixiPipes({
        manifest: {
          output: "./src/manifest.json",
        },
      }),
    ],
  };

  let mode: ResolvedConfig["command"];
  let ap: AssetPack | undefined;

  return {
    name: "vite-plugin-assetpack",
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
      if (!resolvedConfig.publicDir) return;
      if (apConfig.output) return;
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), "");
      apConfig.output = `.${publicDir}/assets/`;
    },
    buildStart: async () => {
      if (mode === "serve") {
        if (ap) return;
        ap = new AssetPack(apConfig);
        void ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  plugins: [assetpackPlugin()],
});
