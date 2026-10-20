import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        pathname: "/images/8aeezn2c/development/**",
        protocol: "https",
      },
    ],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
