import {
  Assets,
  extensions,
  ExtensionType,
  Resolver,
  resolveTextureUrl,
  ResolveURLParser,
  UnresolvedAsset,
} from "pixi.js";

import manifest from "./manifest.json";

export const resolveJsonUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value: string): boolean =>
    Resolver.RETINA_PREFIX.test(value) && value.endsWith(".json"),
  parse: resolveTextureUrl.parse,
} as ResolveURLParser;

extensions.add(resolveJsonUrl);

export async function initAssets() {
  await Assets.init({ manifest, basePath: "assets" });
  await Assets.loadBundle(["default"]);
  const allBundles = manifest.bundles.map((item) => item.name);
  Assets.backgroundLoadBundle(allBundles);
}

export function isBundleLoaded(bundle: string) {
  const bundleManifest = manifest.bundles.find((b) => b.name === bundle);

  if (!bundleManifest) return false;

  return (bundleManifest.assets as UnresolvedAsset[]).every((asset) =>
    Assets.cache.has(asset.alias as string)
  );
}

export function areBundlesLoaded(bundleNames: string[]) {
  return bundleNames.every(isBundleLoaded);
}
