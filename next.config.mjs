import { env } from "./src/env/server.mjs";
import { withSuperjson } from "next-superjson";

/**
 * Provide autocompletion for config.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default withSuperjson()(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: true,
    experimental: {
      newNextLinkBehavior: true, // next/link no longer requires adding <a> as a child. Will be default in Next.js 13.
    },
  }),
);
