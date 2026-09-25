import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@truehand/engine", "@truehand/catalog"],
  serverExternalPackages: ["@napi-rs/canvas"],
  // harfbuzzjs has a Node-only branch that imports "module"; browsers never take it.
  turbopack: {
    resolveAlias: {
      module: { browser: "./src/lib/empty-module.ts" },
    },
  },
  webpack(config, { isServer }) {
    if (!isServer) config.resolve.fallback = { ...config.resolve.fallback, module: false };
    return config;
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/hands/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
